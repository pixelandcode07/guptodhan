import { IDeliveryCharge } from './deliveryCharge.interface';
import { DeliveryChargeModel } from './deliveryCharge.model';

// ✅ Bulk create (insert many delivery charges)
const createDeliveryChargeInDB = async (payload: IDeliveryCharge[]) => {
  if (!payload || payload.length === 0) {
    throw new Error('No delivery charge data provided for bulk upload.');
  }

  const result = await DeliveryChargeModel.insertMany(payload);
  return result;
};

// ✅ Get all delivery charges (optional filtering by division or district)
const getAllDeliveryChargesFromDB = async (filters: { divisionName?: string; districtName?: string }) => {
  const { divisionName, districtName } = filters;
  const query: any = {};

  if (divisionName) {
    query.divisionName = { $regex: divisionName, $options: 'i' }; // case-insensitive search
  }

  if (districtName) {
    query.districtName = { $regex: districtName, $options: 'i' };
  }

  return await DeliveryChargeModel.find(query).sort({ createdAt: -1 });
};

// ✅ Get delivery charges by division
const getDeliveryChargesByDivisionFromDB = async (divisionName: string) => {
  const result = await DeliveryChargeModel.find({ 
    divisionName: { $regex: `^${divisionName}$`, $options: 'i' } 
  }).sort({ createdAt: -1 });
  return result;
};

// ✅ Update a delivery charge by ID
const updateDeliveryChargeInDB = async (id: string, payload: Partial<IDeliveryCharge>) => {
  const result = await DeliveryChargeModel.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Delivery charge not found to update.');
  }
  return result;
};

// ✅ Delete a delivery charge by ID
const deleteDeliveryChargeFromDB = async (id: string) => {
  const result = await DeliveryChargeModel.findByIdAndDelete(id);
  if (!result) {
    throw new Error('Delivery charge not found to delete.');
  }
  return null;
};

export const DeliveryChargeServices = {
  createDeliveryChargeInDB,
  getAllDeliveryChargesFromDB,
  getDeliveryChargesByDivisionFromDB,
  updateDeliveryChargeInDB,
  deleteDeliveryChargeFromDB,
};
