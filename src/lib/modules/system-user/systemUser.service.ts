import { IUser } from './systemUser.interface';
import { UserModel } from './systemUser.model';
import { Types } from 'mongoose';

// Create user
const createUserInDB = async (payload: Partial<IUser>) => {
  const result = await UserModel.create(payload);
  return result;
};

// Get all active users
const getAllUsersFromDB = async () => {
  const result = await UserModel.find({ isActive: true }).sort({ name: 1 });
  return result;
};

// Get user by ID
const getUserByIdFromDB = async (userId: string) => {
  const result = await UserModel.findOne({ systemUserID: userId });
  if (!result) {
    throw new Error("User not found.");
  }
  return result;
};

// Update user
const updateUserInDB = async (id: string, payload: Partial<IUser>) => {
  const result = await UserModel.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error("User not found to update.");
  }
  return result;
};

// Delete user
const deleteUserFromDB = async (id: string) => {
  const result = await UserModel.findByIdAndDelete(id);
  if (!result) {
    throw new Error("User not found to delete.");
  }
  return null;
};

export const UserServices = {
  createUserInDB,
  getAllUsersFromDB,
  getUserByIdFromDB,
  updateUserInDB,
  deleteUserFromDB,
};
