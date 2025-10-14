import { IDeviceCondition } from '../interfaces/deviceCondition.interface';
import { DeviceConditionModel } from '../models/deviceCondition.model';

// Create device condition
const createDeviceConditionInDB = async (payload: Partial<IDeviceCondition>) => {
  const result = await DeviceConditionModel.create(payload);
  return result;
};

// Get all device conditions
const getAllDeviceConditionsFromDB = async () => {
  const result = await DeviceConditionModel.find({}).sort({ createdAt: -1 });
  return result;
};

// Update device condition
const updateDeviceConditionInDB = async (id: string, payload: Partial<IDeviceCondition>) => {
  const result = await DeviceConditionModel.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Device condition not found to update.');
  }
  return result;
};

// Delete device condition
const deleteDeviceConditionFromDB = async (id: string) => {
  const result = await DeviceConditionModel.findByIdAndDelete(id);
  if (!result) {
    throw new Error('Device condition not found to delete.');
  }
  return null;
};

export const DeviceConditionServices = {
  createDeviceConditionInDB,
  getAllDeviceConditionsFromDB,
  updateDeviceConditionInDB,
  deleteDeviceConditionFromDB,
};
