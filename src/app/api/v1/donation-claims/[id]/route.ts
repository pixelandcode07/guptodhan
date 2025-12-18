import { NextRequest } from 'next/server';
import { DonationClaimController } from '@/lib/modules/donation-claim/donation-claim.controller';

// DELETE Method
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  return DonationClaimController.deleteClaim(req, context); 
}

// ✅ NEW: PATCH Method (For Updating Status)
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  return DonationClaimController.updateClaimStatus(req, context); 
}