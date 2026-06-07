// src/lib/modules/product-config/services/productCountry.service.ts

import { IProductCountry } from "./productCountry.interface";
import { ProductCountryModel } from "./productCountry.model";


// ✅ CREATE
const createCountryInDB = async (payload: Partial<IProductCountry>) => {
  const existing = await ProductCountryModel.findOne({ name: payload.name });
  if (existing) {
    throw new Error(`Country "${payload.name}" already exists.`);
  }
  return await ProductCountryModel.create(payload);
};

// ✅ GET ALL (active only for product form dropdown)
const getAllCountriesFromDB = async (onlyActive = false) => {
  const filter = onlyActive ? { status: 'active' } : {};
  return await ProductCountryModel.find(filter).sort({ name: 1 }).lean();
};

// ✅ GET ONE BY ID
const getCountryByIdFromDB = async (id: string) => {
  return await ProductCountryModel.findById(id).lean();
};

// ✅ UPDATE
const updateCountryInDB = async (id: string, payload: Partial<IProductCountry>) => {
  return await ProductCountryModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

// ✅ DELETE
const deleteCountryFromDB = async (id: string) => {
  return await ProductCountryModel.findByIdAndDelete(id);
};

export const ProductCountryService = {
  createCountryInDB,
  getAllCountriesFromDB,
  getCountryByIdFromDB,
  updateCountryInDB,
  deleteCountryFromDB,
};