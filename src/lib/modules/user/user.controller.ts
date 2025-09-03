
import { TUserInput } from './user.interface';
import { UserServices } from './user.service';
import { NextRequest } from 'next/server';


const createUser = async (userData: TUserInput) => {
  const user = await UserServices.createUserIntoDB(userData);
  return user;
};


const getAllUsers = async (_req: NextRequest) => {
  const users = await UserServices.getAllUsersFromDB();
  return users;
};

export const UserController = {
  createUser,
  getAllUsers,
};