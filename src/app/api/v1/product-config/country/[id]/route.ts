// src/app/api/product-config/country/[id]/route.ts

import { ProductCountryController } from '@/lib/modules/product-config/country/productCountry.controller';
import { NextRequest } from 'next/server';

// GET    /api/product-config/country/:id  → একটা country
// PATCH  /api/product-config/country/:id  → update
// DELETE /api/product-config/country/:id  → delete
export const GET = (req: NextRequest, ctx: { params: Promise<{ id: string }> }) =>
  ProductCountryController.getCountryById(req, ctx);

export const PATCH = (req: NextRequest, ctx: { params: Promise<{ id: string }> }) =>
  ProductCountryController.updateCountry(req, ctx);

export const DELETE = (req: NextRequest, ctx: { params: Promise<{ id: string }> }) =>
  ProductCountryController.deleteCountry(req, ctx);