import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createUserValidationSchema, updateUserValidationSchema } from './systemUser.validation';
import { UserServices } from './systemUser.service';
import dbConnect from '@/lib/db';

// Create a new user
const createUser = async (req: NextRequest) => {
    await dbConnect();
    const body = await req.json();
    const validatedData = createUserValidationSchema.parse(body);

    const result = await UserServices.createUserInDB(validatedData);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'User created successfully!',
        data: result,
    });
};

// Get all users
const getAllUsers = async () => {
    await dbConnect();
    const result = await UserServices.getAllUsersFromDB();

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Users retrieved successfully!',
        data: result,
    });
};

// Get user by ID
const getUserById = async (_req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    const result = await UserServices.getUserByIdFromDB(id);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'User retrieved successfully!',
        data: result,
    });
};

// Update user
const updateUser = async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    const body = await req.json();
    const validatedData = updateUserValidationSchema.parse(body);

    const result = await UserServices.updateUserInDB(id, validatedData);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'User updated successfully!',
        data: result,
    });
};

// Delete user
const deleteUser = async (_req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    await UserServices.deleteUserFromDB(id);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'User deleted successfully!',
        data: null,
    });
};

export const UserController = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};
