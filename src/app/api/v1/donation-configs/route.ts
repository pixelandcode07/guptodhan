import { NextRequest, NextResponse } from 'next/server'
import { DonationConfigController } from '@/lib/modules/donation-config/donation-config.controller'
import { catchAsync } from '@/lib/middlewares/catchAsync'
import { checkRole } from '@/lib/middlewares/checkRole'

// POST — create donation config
export const POST = async (req: NextRequest) =>
  catchAsync(checkRole(['admin'])(DonationConfigController.setDonationConfig))(req)

// PATCH — update existing
export const PATCH = async (req: NextRequest) =>
  catchAsync(checkRole(['admin'])(DonationConfigController.updateDonationConfig))(req)

// DELETE — delete donation config
export const DELETE = async (req: NextRequest) =>
  catchAsync(checkRole(['admin'])(DonationConfigController.deleteDonationConfig))(req)
