// ✅ FIXED: src/lib/modules/donation-claim/donation-claim.controller.ts

import { NextRequest } from 'next/server'
import { StatusCodes } from 'http-status-codes'
import { sendResponse } from '@/lib/utils/sendResponse'
import dbConnect from '@/lib/db'
import { createDonationClaimSchema } from './donation-claim.validation'
import { DonationClaimServices } from './donation-claim.service'
import { DonationCampaignServices } from '../donation-campaign/donation-campaign.service'
import { ZodError } from 'zod'
import { verifyToken } from '@/lib/utils/jwt'
import { DonationCampaign } from '../donation-campaign/donation-campaign.model'

// POST: Create a new claim request
const createClaim = async (req: NextRequest) => {
  try {
    console.log('=== Starting createClaim ===')
    
    await dbConnect()
    console.log('✅ Database connected')

    // 🔐 Get token from header
    const authHeader = req.headers.get('authorization')
    console.log('Authorization header:', authHeader ? 'Present' : 'Missing')
    
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('❌ Invalid authorization header format')
      return sendResponse({
        success: false,
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'Invalid authorization header format',
        data: null,
      })
    }

    const token = authHeader.split(' ')[1]
    console.log('Token extracted:', token ? 'Yes' : 'No')

    // Verify token
    let decoded: any
    try {
      decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!)
      console.log('✅ Token verified, userId:', decoded.userId)
    } catch (tokenError) {
      console.log('❌ Token verification failed:', tokenError)
      return sendResponse({
        success: false,
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'Invalid or expired token',
        data: null,
      })
    }

    const currentUserId = decoded.userId
    console.log('Current user ID:', currentUserId)

    // Parse body
    let body: any
    try {
      body = await req.json()
      console.log('Request body:', body)
    } catch (parseError) {
      console.log('❌ JSON parse error:', parseError)
      return sendResponse({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Invalid JSON in request body',
        data: null,
      })
    }

    // Validate with Zod
    let validatedData: any
    try {
      validatedData = createDonationClaimSchema.parse(body)
      console.log('✅ Data validated:', validatedData)
    } catch (validationError) {
      console.log('❌ Validation error:', validationError)
      if (validationError instanceof ZodError) {
        const message = validationError.issues
          .map((err) => `${err.path.join('.')} : ${err.message}`)
          .join(', ')

        return sendResponse({
          success: false,
          statusCode: StatusCodes.BAD_REQUEST,
          message,
          data: validationError.issues,
        })
      }
      throw validationError
    }

    // Check campaign exists
    console.log('Looking for campaign:', validatedData.itemId)
    const campaign = await DonationCampaign.findById(validatedData.itemId)
    console.log('Campaign found:', campaign ? 'Yes' : 'No')

    if (!campaign) {
      console.log('❌ Campaign not found')
      return sendResponse({
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Donation item not found',
        data: null,
      })
    }

    // Check user is not creator
    const creatorId = campaign.creator.toString()
    console.log('Campaign creator:', creatorId)
    console.log('Current user:', currentUserId)
    console.log('Same user?', creatorId === currentUserId)

    if (creatorId === currentUserId) {
      console.log('❌ User trying to claim own donation')
      return sendResponse({
        success: false,
        statusCode: StatusCodes.FORBIDDEN,
        message: 'You cannot claim your own donation item',
        data: null,
      })
    }

    // Check campaign is active
    console.log('Campaign status:', campaign.status)
    if (campaign.status !== 'active') {
      console.log('❌ Campaign not active')
      return sendResponse({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'This campaign is no longer accepting claims',
        data: null,
      })
    }

    // Create claim payload
    const payload = {
      item: validatedData.itemId,
      name: validatedData.name,
      phone: validatedData.phone,
      email: validatedData.email,
      reason: validatedData.reason,
    }

    console.log('Creating claim with payload:', payload)
    
    // Create claim
    let result: any
    try {
      result = await DonationClaimServices.createClaimInDB(payload as any)
      console.log('✅ Claim created:', result._id)
    } catch (claimError) {
      console.log('❌ Error creating claim:', claimError)
      throw claimError
    }

    // Increment donor count
    console.log('Incrementing donor count for campaign:', validatedData.itemId)
    try {
      await DonationCampaignServices.incrementDonorCount(validatedData.itemId, 0)
      console.log('✅ Donor count incremented')
    } catch (incrementError) {
      console.log('⚠️ Warning: Error incrementing donor count:', incrementError)
      // Don't fail the request if increment fails
    }

    console.log('=== createClaim completed successfully ===')

    return sendResponse({
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Claim request submitted successfully!',
      data: result,
    })
  } catch (error) {
    console.error('=== FATAL ERROR in createClaim ===')
    console.error('Error:', error)
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error)
    console.error('Error message:', error instanceof Error ? error.message : String(error))
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack')

    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error instanceof Error ? error.message : 'Something went wrong',
      data: null,
    })
  }
}

// GET: All claims
const getClaims = async (_req: NextRequest) => {
  await dbConnect()

  try {
    const result = await DonationClaimServices.getAllClaimsFromDB()

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'All claims retrieved successfully!',
      data: result,
    })
  } catch (error) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: (error as Error).message,
      data: null,
    })
  }
}

// DELETE: Claim by ID
const deleteClaim = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect()

  try {
    const { id } = await params
    const result = await DonationClaimServices.deleteClaimFromDB(id)

    if (!result) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Claim not found',
        data: null,
      })
    }

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Claim deleted successfully!',
      data: result,
    })
  } catch (error) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: (error as Error).message,
      data: null,
    })
  }
}

// UPDATE STATUS: Update claim status
const updateClaimStatus = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect()
  try {
    const { id } = await params
    const body = await req.json()
    const { status } = body

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Invalid status. Allowed: pending, approved, rejected',
        data: null,
      })
    }

    const result = await DonationClaimServices.updateClaimStatusInDB(id, status)

    if (!result) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Claim not found',
        data: null,
      })
    }

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: `Claim request ${status} successfully!`,
      data: result,
    })
  } catch (error) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: (error as Error).message,
      data: null,
    })
  }
}

export const DonationClaimController = {
  createClaim,
  getClaims,
  deleteClaim,
  updateClaimStatus,
}