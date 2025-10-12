import { IPromoCode } from './promoCode.interface';
import { PromoCodeModel } from './promoCode.model';
import { Types } from 'mongoose';

// Create promo code
const createPromoCodeInDB = async (payload: Partial<IPromoCode>) => {
  const result = await PromoCodeModel.create(payload);
  return result;
};

// Get all active promo codes (optional: sorted by start date)
const getAllPromoCodesFromDB = async () => {
  const result = await PromoCodeModel.find().sort({ startDate: 1 });
  return result;
};

// Get promo code by code string
const getPromoCodeByCodeFromDB = async (id: string) => {
  const result = await PromoCodeModel.findOne({ _id: id });
  return result;
};

// Update promo code
const updatePromoCodeInDB = async (id: string, payload: Partial<IPromoCode>) => {
  const result = await PromoCodeModel.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error("Promo code not found to update.");
  }
  return result;
};

// Delete promo code
const deletePromoCodeFromDB = async (id: string) => {
  const result = await PromoCodeModel.findByIdAndDelete(id);
  if (!result) {
    throw new Error("Promo code not found to delete.");
  }
  return null;
};

export const PromoCodeServices = {
  createPromoCodeInDB,
  getAllPromoCodesFromDB,
  getPromoCodeByCodeFromDB,
  updatePromoCodeInDB,
  deletePromoCodeFromDB,
};
