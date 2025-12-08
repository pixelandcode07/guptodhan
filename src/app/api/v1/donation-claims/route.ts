import { NextRequest } from 'next/server';
import { DonationClaimController } from '@/lib/modules/donation-claim/donation-claim.controller';

export async function POST(req: NextRequest) {
  return DonationClaimController.createClaim(req);
}

export async function GET(req: NextRequest) {
  return DonationClaimController.getClaims(req);
}