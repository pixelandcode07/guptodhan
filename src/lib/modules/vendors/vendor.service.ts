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

// NEW: Get single vendor by ID
const getVendorByIdFromDB = async (vendorId: string) => {
  const vendor = await Vendor.findById(vendorId)
    .populate('user', 'name email phoneNumber isActive');

  if (!vendor) {
    throw new Error('Vendor not found');
  }

  return vendor;
};

// NEW: Update a vendor's details
const updateVendorInDB = async (vendorId: string, data: Partial<IVendor>) => {
  const vendor = await Vendor.findByIdAndUpdate(vendorId, data, { new: true })
    .populate('user', 'name email phoneNumber isActive');

  if (!vendor) throw new Error('Vendor not found');
  return vendor;
};



// --- Update a vendor's status (Approved/Rejected) ---
// D:\...\guptodhan\src\lib\modules\vendors\vendor.service.ts

const updateVendorStatusInDB = async (
  vendorId: string, 
  status: 'approved' | 'rejected' | 'pending'
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      vendorId, 
      { status }, 
      { new: true, session }
    );
    
    if (!vendor) {
      throw new Error('Vendor not found');
    }

    // 👇 --- এখানে নতুন লজিক --- 👇
    
    // ইউজারকে কী কী আপডেট করতে হবে তা এখানে ঠিক করুন
    let userUpdates: { isActive: boolean; role: string } = {
      isActive: false, // ডিফল্ট
      role: 'user'     // ডিফল্ট
    };

    if (status === 'approved') {
      userUpdates.isActive = true;
      userUpdates.role = 'vendor'; // ইউজারকে 'vendor' রোলে প্রমোট করা হলো
    } 
    else if (status === 'rejected') {
      userUpdates.isActive = false; // অ্যাকাউন্ট ইন-অ্যাক্টিভ থাকবে
      userUpdates.role = 'user';    // ইউজার হিসেবেই থাকবে (ডিলিটও করা যেতে পারে)
    }
    else if (status === 'pending') {
      userUpdates.isActive = false; // অ্যাকাউন্ট ইন-অ্যাক্টিভ থাকবে
      userUpdates.role = 'user';
    }

    // User মডেলে role এবং isActive স্ট্যাটাস আপডেট করুন
    await User.findByIdAndUpdate(vendor.user, userUpdates, { session });
    // 👆 --- নতুন লজিক শেষ --- 👆

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
  getVendorByIdFromDB,
  updateVendorInDB,
  updateVendorStatusInDB,
  deleteVendorFromDB,
};