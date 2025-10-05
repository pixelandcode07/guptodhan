import { ITestimonial } from './testimonial.interface';
import { TestimonialModel } from './testimonial.model';
import { Types } from 'mongoose';

// Create testimonial
const createTestimonialInDB = async (payload: Partial<ITestimonial>) => {
  const result = await TestimonialModel.create(payload);
  return result;
};

// Get all active testimonials (optional: sorted by date descending)
const getAllTestimonialsFromDB = async () => {
  const result = await TestimonialModel.find({ status: 'active' }).sort({ date: -1 });
  return result;
};

// Get testimonials by product
const getTestimonialsByProductFromDB = async (productId: string) => {
  const result = await TestimonialModel.find({
    productID: new Types.ObjectId(productId),
    status: 'active',
  }).sort({ date: -1 });
  return result;
};

// Update testimonial
const updateTestimonialInDB = async (id: string, payload: Partial<ITestimonial>) => {
  const result = await TestimonialModel.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Testimonial not found to update.');
  }
  return result;
};

// Delete testimonial
const deleteTestimonialFromDB = async (id: string) => {
  const result = await TestimonialModel.findByIdAndDelete(id);
  if (!result) {
    throw new Error('Testimonial not found to delete.');
  }
  return null;
};

const getPublicTestimonialsFromDB = async () => {
  // শুধুমাত্র 'approved' স্ট্যাটাসের testimonial গুলো দেখানো হচ্ছে
  return await TestimonialModel.find({ status: 'approved' }).sort({ date: -1 });
};

export const TestimonialServices = {
  createTestimonialInDB,
  getAllTestimonialsFromDB,
  getTestimonialsByProductFromDB,
  updateTestimonialInDB,
  deleteTestimonialFromDB,
  getPublicTestimonialsFromDB,
};
