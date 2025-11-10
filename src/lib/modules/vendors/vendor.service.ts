import { IVendor } from './vendor.interface';
import { Vendor } from './vendor.model';
import { User } from '../user/user.model';
import mongoose from 'mongoose';
import { deleteFromCloudinary } from '@/lib/utils/cloudinary';

// --- Get all vendors for the admin panel ---
const getAllVendorsFromDB = async () => {
  // Populate the 'user' field to get the vendor's name, email, etc.
  return await Vendor.find({})
    .populate('user', 'name email phoneNumber isActive')
    .sort({ createdAt: -1 });
};

// --- Update a vendor's status (Approved/Rejected) ---
const updateVendorStatusInDB = async (
  vendorId: string, 
  status: 'approved' | 'rejected' | 'pending'
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Find the vendor document and update its status
    const vendor = await Vendor.findByIdAndUpdate(
      vendorId, 
      { status }, 
      { new: true, session }
    );
    
    if (!vendor) {
      throw new Error('Vendor not found');
    }

    // IMPORTANT: If the vendor is 'approved', also activate their User account.
    // If 'rejected' or 'pending', keep/make their User account 'inactive'.
    await User.findByIdAndUpdate(vendor.user, { 
      isActive: status === 'approved' 
    }, { session });

    await session.commitTransaction();
    return vendor;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};


const deleteVendorFromDB = async (vendorId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // ধাপ ১: ভেন্ডরকে খুঁজে বের করুন
    const vendor = await Vendor.findById(vendorId).session(session);
    if (!vendor) {
      throw new Error('Vendor not found.');
    }
    const userId = vendor.user;

    // ধাপ ২: Cloudinary থেকে ফাইল ডিলিট করুন (NID, Trade License, ইত্যাদি)
    const filesToDelete: string[] = [];
    if (vendor.ownerNidUrl) filesToDelete.push(vendor.ownerNidUrl);
    if (vendor.tradeLicenseUrl) filesToDelete.push(vendor.tradeLicenseUrl);
    if (vendor.storeLogo) filesToDelete.push(vendor.storeLogo);
    if (vendor.storeBanner) filesToDelete.push(vendor.storeBanner);
    
    if (filesToDelete.length > 0) {
      await Promise.all(filesToDelete.map(url => deleteFromCloudinary(url)));
    }

    // ধাপ ৩: Vendor ডকুমেন্ট ডিলিট করুন
    await Vendor.findByIdAndDelete(vendorId).session(session);

    // ধাপ ৪: ভেন্ডরের সাথে যুক্ত User অ্যাকাউন্টটিও ডিলিট করুন
    await User.findByIdAndDelete(userId).session(session);
    
    await session.commitTransaction();
    return null;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const VendorServices = {
  getAllVendorsFromDB,
  updateVendorStatusInDB,
  deleteVendorFromDB,
};