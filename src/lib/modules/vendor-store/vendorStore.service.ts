import { IStore } from "./vendorStore.interface";
import { StoreModel } from "./vendorStore.model";
import { Types } from "mongoose";
import { ClassifiedAd } from "../classifieds/ad.model";
import { OrderModel } from "../product-order/order/order.model";
import { VendorProductModel } from "../product/vendorProduct.model";

// Create store
const createStoreInDB = async (payload: Partial<IStore>) => {
  const result = await StoreModel.create(payload);
  return result;
};

// Get all active stores (sorted by storeName)
const getAllStoresFromDB = async () => {
  const result = await StoreModel.find().sort({ storeName: 1 });
  return result;
};

// Get store by ID
const getStoreByIdFromDB = async (id: string) => {
  const result = await StoreModel.findById(id);
  if (!result) {
    throw new Error("Store not found.");
  }
  return result;
};

// Get store by vendorId
const getStoreByVendorIdFromDB = async (vendorId: string) => {
  const result = await StoreModel.findOne({
    vendorId: new Types.ObjectId(vendorId),
  });

  if (!result) {
    throw new Error("Store not found for this vendor.");
  }

  return result;
};

// Update store
const updateStoreInDB = async (id: string, payload: Partial<IStore>) => {
  const result = await StoreModel.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error("Store not found to update.");
  }
  return result;
};

// Delete store (only if no ads/products exist under it)
const deleteStoreFromDB = async (id: string) => {
  const existingAd = await ClassifiedAd.findOne({
    store: new Types.ObjectId(id),
  });
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
};

// vendor dashboard api
const vendorDashboard = async (id: string) => {
  const store = await StoreModel.findById(id);

  const today = new Date(new Date().setHours(0, 0, 0, 0));
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

  const todaysOrders = await OrderModel.find({
    storeId: store._id,
    createdAt: { $gte: today, $lt: tomorrow },
  }).sort({ createdAt: -1 });

  const totalOrders = await OrderModel.countDocuments({ storeId: store._id });
  const totalProducts = await VendorProductModel.countDocuments({
    vendorStoreId: store._id,
  });

  const deliveredCancelledOrders = await OrderModel.find({
    storeId: store._id,
    orderStatus: { $in: ["Delivered", "Cancelled"] },
  }).sort({ createdAt: -1 });

  const allOrders = await OrderModel.find({ storeId: store._id }).sort({
    createdAt: -1,
  });

  const bestSellingProducts = await VendorProductModel.find({
    vendorStoreId: store._id,
  })
    .sort({ sellCount: -1 })
    .limit(20);

  const totalSell = await OrderModel.aggregate([
    { $match: { storeId: store._id, orderStatus: "Delivered" } },
    {
      $group: {
        _id: null,
        total: { $sum: "$totalAmount" },
      },
    },
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
};

export const StoreServices = {
  createStoreInDB,
  getAllStoresFromDB,
  getStoreByIdFromDB,
  getStoreByVendorIdFromDB,
  updateStoreInDB,
  deleteStoreFromDB,

  vendorDashboard,
};
