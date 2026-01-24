// src/lib/modules/vendor-store/vendorStore.service.ts
// ✅ OPTIMIZED: Proper type casting, lean, and lean optimization

import { IStore } from "./vendorStore.interface";
import { StoreModel } from "./vendorStore.model";
import { Types } from "mongoose";
import { ClassifiedAd } from "../classifieds/ad.model";
import { OrderModel } from "../product-order/order/order.model";
import { VendorProductModel } from "../product/vendorProduct.model";

// ================================================================
// ✅ CREATE STORE
// ================================================================

const createStoreInDB = async (payload: Partial<IStore>): Promise<IStore> => {
  try {
    const result = (await StoreModel.create(payload)) as unknown as IStore;
    return result;
  } catch (error: any) {
    console.error('Error creating store:', error);
    throw new Error(error.message || 'Failed to create store');
  }
};

// ================================================================
// ✅ GET ALL STORES (WITH LEAN)
// ================================================================

const getAllStoresFromDB = async (): Promise<IStore[]> => {
  try {
    // ✅ Using lean() for performance + type casting
    const result = (await StoreModel.find()
      .sort({ storeName: 1 })
      .lean()) as unknown as IStore[];

    return result;
  } catch (error: any) {
    console.error('Error fetching stores:', error);
    throw new Error(error.message || 'Failed to fetch stores');
  }
};

// ================================================================
// ✅ GET STORE BY ID (WITH LEAN)
// ================================================================

const getStoreByIdFromDB = async (id: string): Promise<IStore | null> => {
  try {
    // ✅ Using lean() for performance + type casting
    const result = (await StoreModel.findById(id)
      .lean()) as unknown as IStore | null;

    if (!result) {
      throw new Error("Store not found.");
    }

    return result;
  } catch (error: any) {
    console.error('Error fetching store by id:', error);
    throw new Error(error.message || 'Failed to fetch store');
  }
};

// ================================================================
// ✅ GET STORE BY VENDOR ID (WITH LEAN)
// ================================================================

const getStoreByVendorIdFromDB = async (vendorId: string): Promise<IStore | null> => {
  try {
    // ✅ Using lean() for performance + type casting
    // ✅ Using compound index: { vendorId, createdAt }
    const result = (await StoreModel.findOne({
      vendorId: new Types.ObjectId(vendorId),
    })
      .lean()) as unknown as IStore | null;

    if (!result) {
      throw new Error("Store not found for this vendor.");
    }

    return result;
  } catch (error: any) {
    console.error('Error fetching store by vendor id:', error);
    throw new Error(error.message || 'Failed to fetch store');
  }
};

// ================================================================
// ✅ GET ALL STORES BY VENDOR ID (WITH LEAN)
// ================================================================

const getStoresByVendorIdFromDB = async (vendorId: string): Promise<IStore[]> => {
  try {
    // ✅ Using lean() for performance + type casting
    // ✅ Using compound index: { vendorId, status, createdAt }
    const result = (await StoreModel.find({
      vendorId: new Types.ObjectId(vendorId),
    })
      .sort({ createdAt: -1 })
      .lean()) as unknown as IStore[];

    return result;
  } catch (error: any) {
    console.error('Error fetching stores by vendor id:', error);
    throw new Error(error.message || 'Failed to fetch stores');
  }
};

// ================================================================
// ✅ GET ACTIVE STORES (WITH LEAN)
// ================================================================

const getActiveStoresFromDB = async (): Promise<IStore[]> => {
  try {
    // ✅ Using lean() for performance + type casting
    // ✅ Using compound index: { status, storeName }
    const result = (await StoreModel.find({ status: 'active' })
      .sort({ storeName: 1 })
      .lean()) as unknown as IStore[];

    return result;
  } catch (error: any) {
    console.error('Error fetching active stores:', error);
    throw new Error(error.message || 'Failed to fetch active stores');
  }
};

// ================================================================
// ✅ UPDATE STORE
// ================================================================

const updateStoreInDB = async (id: string, payload: Partial<IStore>): Promise<IStore | null> => {
  try {
    // ✅ Using lean() for performance + type casting
    const result = (await StoreModel.findByIdAndUpdate(id, payload, { 
      new: true,
      runValidators: true 
    })
      .lean()) as unknown as IStore | null;

    if (!result) {
      throw new Error("Store not found to update.");
    }

    return result;
  } catch (error: any) {
    console.error('Error updating store:', error);
    throw new Error(error.message || 'Failed to update store');
  }
};

// ================================================================
// ✅ DELETE STORE
// ================================================================

const deleteStoreFromDB = async (id: string): Promise<null> => {
  try {
    // ✅ Check for existing ads/products
    const existingAd = await ClassifiedAd.findOne({
      store: new Types.ObjectId(id),
    }).lean();

    if (existingAd) {
      throw new Error(
        "Cannot delete this store as it is linked to existing ads/products."
      );
    }

    const result = await StoreModel.findByIdAndDelete(id);

    if (!result) {
      throw new Error("Store not found to delete.");
    }

    return null;
  } catch (error: any) {
    console.error('Error deleting store:', error);
    throw new Error(error.message || 'Failed to delete store');
  }
};

// ================================================================
// ✅ VENDOR DASHBOARD (OPTIMIZED WITH LEAN)
// ================================================================

const vendorDashboard = async (vendorId: string): Promise<any> => {
  try {
    // ✅ Using lean() + type casting
    const store = (await StoreModel.findOne({ 
      vendorId: new Types.ObjectId(vendorId) 
    })
      .lean()) as unknown as IStore | null;

    if (!store) {
      throw new Error("Store not found for this vendor.");
    }

    // ✅ Get today's date range
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    // ✅ Parallel queries for performance
    const [
      todaysOrders,
      totalOrders,
      totalProducts,
      deliveredCancelledOrders,
      allOrders,
      bestSellingProducts,
      totalSell
    ] = await Promise.all([
      // Today's orders
      (async () => (await OrderModel.find({
        storeId: store._id,
        createdAt: { $gte: today, $lt: tomorrow },
      })
        .sort({ createdAt: -1 })
        .lean()) as unknown as any[])(),

      // Total orders count
      OrderModel.countDocuments({ storeId: store._id }),

      // Total products count
      VendorProductModel.countDocuments({ vendorStoreId: store._id }),

      // Delivered/Cancelled orders
      (async () => (await OrderModel.find({
        storeId: store._id,
        orderStatus: { $in: ["Delivered", "Cancelled"] },
      })
        .sort({ createdAt: -1 })
        .lean()) as unknown as any[])(),

      // All orders
      (async () => (await OrderModel.find({ storeId: store._id })
        .sort({ createdAt: -1 })
        .lean()) as unknown as any[])(),

      // Best selling products
      (async () => (await VendorProductModel.find({
        vendorStoreId: store._id,
      })
        .sort({ sellCount: -1 })
        .limit(20)
        .lean()) as unknown as any[])(),

      // Total sales amount
      OrderModel.aggregate([
        { $match: { storeId: store._id, orderStatus: "Delivered" } },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalAmount" },
          },
        },
      ])
    ]);

    return {
      stats: {
        todayOrdersCount: todaysOrders.length,
        totalOrders,
        totalProducts,
        totalSell: totalSell[0]?.total || 0,
      },
      orders: {
        todaysOrders,
        deliveredCancelledOrders,
        allOrders,
      },
      bestSellingProducts,
    };
  } catch (error: any) {
    console.error('Error getting vendor dashboard:', error);
    throw new Error(error.message || 'Failed to get vendor dashboard');
  }
};

// ================================================================
// ✅ GET STORE STATISTICS
// ================================================================

interface StoreStats {
  _id: string;
  count: number;
}

const getStoreStatsByStatusFromDB = async (): Promise<StoreStats[]> => {
  try {
    // ✅ Aggregation for statistics
    const stats: StoreStats[] = await StoreModel.aggregate([
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
    console.error('Error fetching store stats:', error);
    throw new Error(error.message || 'Failed to fetch store statistics');
  }
};

// ================================================================
// ✅ GET TOTAL STORE COUNT
// ================================================================

const getTotalStoreCountFromDB = async (): Promise<number> => {
  try {
    const count = await StoreModel.countDocuments({});
    return count;
  } catch (error: any) {
    console.error('Error fetching total store count:', error);
    throw new Error(error.message || 'Failed to fetch store count');
  }
};

// ================================================================
// 📤 EXPORTS
// ================================================================

export const StoreServices = {
  createStoreInDB,
  getAllStoresFromDB,
  getStoreByIdFromDB,
  getStoreByVendorIdFromDB,
  getStoresByVendorIdFromDB,
  getActiveStoresFromDB,
  updateStoreInDB,
  deleteStoreFromDB,
  vendorDashboard,
  getStoreStatsByStatusFromDB,
  getTotalStoreCountFromDB,
};