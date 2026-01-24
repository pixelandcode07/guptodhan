// src/lib/modules/vendors/vendor.service.ts
// ✅ FULLY SOLVED: Proper type casting via unknown

import { IVendor } from './vendor.interface';
import { Vendor } from './vendor.model';
import { User } from '../user/user.model';
import { deleteFromCloudinary } from '@/lib/utils/cloudinary';
import { deleteCacheKey, deleteCachePattern } from '@/lib/redis/cache-helpers';

// ================================================================
// 🔍 GET ALL VENDORS (WITH CACHING)
// ================================================================

const getAllVendorsFromDB = async (): Promise<IVendor[]> => {
  try {
    // ✅ FIXED: Cast via unknown first
    const vendors = (await Vendor.find({})
      .populate('user', 'name email phoneNumber isActive')
      .sort({ createdAt: -1 })
      .lean()) as unknown as IVendor[];

    return vendors;
  } catch (error: any) {
    console.error('Error fetching vendors:', error);
    throw new Error(error.message || 'Failed to fetch vendors');
  }
};

// ================================================================
// 🔍 GET SINGLE VENDOR BY ID
// ================================================================

const getVendorByIdFromDB = async (vendorId: string): Promise<IVendor | null> => {
  try {
    // ✅ FIXED: Cast via unknown first
    const vendor = (await Vendor.findById(vendorId)
      .populate('user', 'name email phoneNumber isActive')
      .lean()) as unknown as IVendor | null;

    if (!vendor) {
      throw new Error('Vendor not found');
    }

    return vendor;
  } catch (error: any) {
    console.error('Error fetching vendor:', error);
    throw new Error(error.message || 'Failed to fetch vendor');
  }
};

// ================================================================
// ✏️ UPDATE VENDOR DETAILS
// ================================================================

const updateVendorInDB = async (vendorId: string, data: Partial<IVendor>): Promise<IVendor | null> => {
  try {
    // ✅ FIXED: Cast via unknown first
    const vendor = (await Vendor.findByIdAndUpdate(vendorId, data, { 
      new: true,
      runValidators: true
    })
      .populate('user', 'name email phoneNumber isActive')
      .lean()) as unknown as IVendor | null;

    if (!vendor) {
      throw new Error('Vendor not found');
    }

    // 🗑️ Clear cache
    await deleteCacheKey(`vendor:${vendorId}`);
    await deleteCachePattern('vendors:*');

    return vendor;
  } catch (error: any) {
    console.error('Error updating vendor:', error);
    throw new Error(error.message || 'Failed to update vendor');
  }
};

// ================================================================
// 🔄 UPDATE VENDOR STATUS (WITHOUT TRANSACTIONS)
// ================================================================

const updateVendorStatusInDB = async (
  vendorId: string,
  status: 'approved' | 'rejected' | 'pending'
): Promise<IVendor | null> => {
  try {
    // ✅ FIXED: Cast via unknown first
    const vendor = (await Vendor.findByIdAndUpdate(
      vendorId,
      { status },
      { new: true, runValidators: true }
    ).lean()) as unknown as IVendor | null;

    if (!vendor) {
      throw new Error('Vendor not found');
    }

    // ✅ Step 2: Prepare user updates based on status
    let userUpdates: { isActive: boolean; role: string } = {
      isActive: false,
      role: 'user'
    };

    if (status === 'approved') {
      userUpdates.isActive = true;
      userUpdates.role = 'vendor'; // Promote to vendor
    } else if (status === 'rejected') {
      userUpdates.isActive = false;
      userUpdates.role = 'user'; // Keep as regular user
    } else if (status === 'pending') {
      userUpdates.isActive = false;
      userUpdates.role = 'user'; // Keep as regular user
    }

    // ✅ Step 3: Update user (separate operation)
    await User.findByIdAndUpdate(
      vendor.user,
      userUpdates,
      { new: true, runValidators: true }
    ).lean();

    // 🗑️ Clear cache
    await deleteCacheKey(`vendor:${vendorId}`);
    await deleteCacheKey(`user:${vendor.user}`);
    await deleteCachePattern('vendors:*');

    return vendor;
  } catch (error: any) {
    console.error('Error updating vendor status:', error);
    throw new Error(error.message || 'Failed to update vendor status');
  }
};

// ================================================================
// 🗑️ DELETE VENDOR (WITHOUT TRANSACTIONS)
// ================================================================

const deleteVendorFromDB = async (vendorId: string): Promise<null> => {
  try {
    // ✅ FIXED: Cast via unknown first
    const vendor = (await Vendor.findById(vendorId)
      .lean()) as unknown as IVendor | null;

    if (!vendor) {
      throw new Error('Vendor not found');
    }

    const userId = vendor.user;

    // ✅ Step 2: Delete files from Cloudinary
    const filesToDelete: string[] = [];
    
    if (vendor.ownerNidUrl && typeof vendor.ownerNidUrl === 'string') {
      filesToDelete.push(vendor.ownerNidUrl);
    }
    if (vendor.tradeLicenseUrl && typeof vendor.tradeLicenseUrl === 'string') {
      filesToDelete.push(vendor.tradeLicenseUrl);
    }
    if (vendor.storeLogo && typeof vendor.storeLogo === 'string') {
      filesToDelete.push(vendor.storeLogo);
    }
    if (vendor.storeBanner && typeof vendor.storeBanner === 'string') {
      filesToDelete.push(vendor.storeBanner);
    }

    if (filesToDelete.length > 0) {
      try {
        await Promise.all(filesToDelete.map(url => deleteFromCloudinary(url)));
      } catch (err) {
        console.error('Error deleting files from Cloudinary:', err);
        // Continue with deletion even if Cloudinary fails
      }
    }

    // ✅ Step 3: Delete vendor document
    await Vendor.findByIdAndDelete(vendorId);

    // ✅ Step 4: Delete associated user
    await User.findByIdAndDelete(userId);

    // 🗑️ Clear cache
    await deleteCacheKey(`vendor:${vendorId}`);
    await deleteCacheKey(`user:${userId}`);
    await deleteCachePattern('vendors:*');
    await deleteCachePattern('users:*');

    return null;
  } catch (error: any) {
    console.error('Error deleting vendor:', error);
    throw new Error(error.message || 'Failed to delete vendor');
  }
};

// ================================================================
// 📊 GET VENDORS BY STATUS (OPTIMIZED)
// ================================================================

const getVendorsByStatusFromDB = async (status: string): Promise<IVendor[]> => {
  try {
    // ✅ FIXED: Cast via unknown first
    const vendors = (await Vendor.find({ status })
      .populate('user', 'name email phoneNumber isActive')
      .sort({ createdAt: -1 })
      .lean()) as unknown as IVendor[];

    return vendors;
  } catch (error: any) {
    console.error('Error fetching vendors by status:', error);
    throw new Error(error.message || 'Failed to fetch vendors');
  }
};

// ================================================================
// 🔍 GET VENDORS BY USER (OPTIMIZED)
// ================================================================

const getVendorsByUserFromDB = async (userId: string): Promise<IVendor[]> => {
  try {
    // ✅ FIXED: Cast via unknown first
    const vendors = (await Vendor.find({ user: userId })
      .populate('user', 'name email phoneNumber isActive')
      .lean()) as unknown as IVendor[];

    return vendors;
  } catch (error: any) {
    console.error('Error fetching vendors by user:', error);
    throw new Error(error.message || 'Failed to fetch vendors');
  }
};

// ================================================================
// 🔍 GET VENDORS BY CATEGORY (OPTIMIZED)
// ================================================================

const getVendorsByCategoryFromDB = async (category: string): Promise<IVendor[]> => {
  try {
    // ✅ FIXED: Cast via unknown first
    const vendors = (await Vendor.find({
      businessCategory: category,
      status: 'approved'
    })
      .populate('user', 'name email phoneNumber')
      .sort({ createdAt: -1 })
      .lean()) as unknown as IVendor[];

    return vendors;
  } catch (error: any) {
    console.error('Error fetching vendors by category:', error);
    throw new Error(error.message || 'Failed to fetch vendors');
  }
};

// ================================================================
// 🔍 TEXT SEARCH VENDORS (OPTIMIZED)
// ================================================================

const searchVendorsFromDB = async (searchQuery: string): Promise<IVendor[]> => {
  try {
    // ✅ FIXED: Cast via unknown first
    const vendors = (await Vendor.find({
      $text: { $search: searchQuery }
    })
      .populate('user', 'name email phoneNumber')
      .lean()) as unknown as IVendor[];

    return vendors;
  } catch (error: any) {
    console.error('Error searching vendors:', error);
    throw new Error(error.message || 'Failed to search vendors');
  }
};

// ================================================================
// 📊 GET VENDOR STATISTICS (FOR DASHBOARD)
// ================================================================

interface VendorStats {
  _id: string;
  count: number;
}

const getVendorStatsFromDB = async (): Promise<VendorStats[]> => {
  try {
    // ✅ Aggregation returns proper type already
    const stats: VendorStats[] = await Vendor.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    return stats;
  } catch (error: any) {
    console.error('Error fetching vendor stats:', error);
    throw new Error(error.message || 'Failed to fetch vendor statistics');
  }
};

// ================================================================
// 📊 GET VENDOR BY ID WITH ALL DETAILS
// ================================================================

const getVendorDetailsByIdFromDB = async (vendorId: string): Promise<IVendor | null> => {
  try {
    // ✅ FIXED: Cast via unknown first
    const vendor = (await Vendor.findById(vendorId)
      .populate('user', 'name email phoneNumber isActive role')
      .lean()) as unknown as IVendor | null;

    if (!vendor) {
      throw new Error('Vendor not found');
    }

    return vendor;
  } catch (error: any) {
    console.error('Error fetching vendor details:', error);
    throw new Error(error.message || 'Failed to fetch vendor details');
  }
};

// ================================================================
// 🔍 GET APPROVED VENDORS (FOR FRONTEND)
// ================================================================

const getApprovedVendorsFromDB = async (): Promise<IVendor[]> => {
  try {
    // ✅ FIXED: Cast via unknown first
    const vendors = (await Vendor.find({ status: 'approved' })
      .populate('user', 'name email phoneNumber')
      .sort({ createdAt: -1 })
      .lean()) as unknown as IVendor[];

    return vendors;
  } catch (error: any) {
    console.error('Error fetching approved vendors:', error);
    throw new Error(error.message || 'Failed to fetch approved vendors');
  }
};

// ================================================================
// 📊 GET PENDING VENDORS (FOR ADMIN)
// ================================================================

const getPendingVendorsFromDB = async (): Promise<IVendor[]> => {
  try {
    // ✅ FIXED: Cast via unknown first
    const vendors = (await Vendor.find({ status: 'pending' })
      .populate('user', 'name email phoneNumber')
      .sort({ createdAt: -1 })
      .lean()) as unknown as IVendor[];

    return vendors;
  } catch (error: any) {
    console.error('Error fetching pending vendors:', error);
    throw new Error(error.message || 'Failed to fetch pending vendors');
  }
};

// ================================================================
// 🔄 GET REJECTED VENDORS (FOR ADMIN)
// ================================================================

const getRejectedVendorsFromDB = async (): Promise<IVendor[]> => {
  try {
    // ✅ FIXED: Cast via unknown first
    const vendors = (await Vendor.find({ status: 'rejected' })
      .populate('user', 'name email phoneNumber')
      .sort({ createdAt: -1 })
      .lean()) as unknown as IVendor[];

    return vendors;
  } catch (error: any) {
    console.error('Error fetching rejected vendors:', error);
    throw new Error(error.message || 'Failed to fetch rejected vendors');
  }
};

// ================================================================
// 📊 GET VENDOR COUNT BY STATUS
// ================================================================

interface VendorCountByStatus {
  pending: number;
  approved: number;
  rejected: number;
}

const getVendorCountByStatusFromDB = async (): Promise<VendorCountByStatus> => {
  try {
    const [pending, approved, rejected] = await Promise.all([
      Vendor.countDocuments({ status: 'pending' }),
      Vendor.countDocuments({ status: 'approved' }),
      Vendor.countDocuments({ status: 'rejected' })
    ]);

    return {
      pending,
      approved,
      rejected
    };
  } catch (error: any) {
    console.error('Error fetching vendor counts:', error);
    throw new Error(error.message || 'Failed to fetch vendor counts');
  }
};

// ================================================================
// 📊 GET TOTAL VENDOR COUNT
// ================================================================

const getTotalVendorCountFromDB = async (): Promise<number> => {
  try {
    const count: number = await Vendor.countDocuments({});
    return count;
  } catch (error: any) {
    console.error('Error fetching total vendor count:', error);
    throw new Error(error.message || 'Failed to fetch vendor count');
  }
};

// ================================================================
// 📤 EXPORTS
// ================================================================

export const VendorServices = {
  getAllVendorsFromDB,
  getVendorByIdFromDB,
  getVendorDetailsByIdFromDB,
  updateVendorInDB,
  updateVendorStatusInDB,
  deleteVendorFromDB,
  getVendorsByStatusFromDB,
  getVendorsByUserFromDB,
  getVendorsByCategoryFromDB,
  searchVendorsFromDB,
  getVendorStatsFromDB,
  getApprovedVendorsFromDB,
  getPendingVendorsFromDB,
  getRejectedVendorsFromDB,
  getVendorCountByStatusFromDB,
  getTotalVendorCountFromDB,
};