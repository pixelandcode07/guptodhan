import { NextRequest } from 'next/server';
import { DonationClaimController } from '@/lib/modules/donation-claim/donation-claim.controller';

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  return DonationClaimController.deleteClaim(req, context); 
}