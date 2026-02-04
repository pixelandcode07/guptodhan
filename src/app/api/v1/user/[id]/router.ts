// ========================================
// 👨‍💼 Admin User Management Routes
// ========================================

import { NextRequest } from 'next/server';
import { UserController } from '@/lib/modules/user/user.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

// Get user by ID (Admin only)
export const GET = catchAsync(
  checkRole(['admin'])(
    async (req: NextRequest, context: { params: Promise<{ id: string }> }) => 
      await UserController.getUserById(req, context)
  )
);

// Update user by ID (Admin only)
export const PATCH = catchAsync(
  checkRole(['admin'])(
    async (req: NextRequest, context: { params: Promise<{ id: string }> }) => 
      await UserController.updateUserByAdmin(req, context)
  )
);

// Delete user by ID (Admin only)
export const DELETE = catchAsync(
  checkRole(['admin'])(
    async (req: NextRequest, context: { params: Promise<{ id: string }> }) => 
      await UserController.deleteUserByAdmin(req, context)
  )
);