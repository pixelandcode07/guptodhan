// src/app/api/product-config/country/route.ts

import { ProductCountryController } from '@/lib/modules/product-config/country/productCountry.controller';
import { NextRequest } from 'next/server';

// GET  /api/product-config/country          → সব country
// GET  /api/product-config/country?active=true → শুধু active (dropdown এর জন্য)
// POST /api/product-config/country          → নতুন country create
export const GET = (req: NextRequest) =>
  ProductCountryController.getAllCountries(req);

export const POST = (req: NextRequest) =>
  ProductCountryController.createCountry(req);