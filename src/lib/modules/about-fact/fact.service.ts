// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\about-fact\fact.service.ts
import { IAboutFact } from './fact.interface';
import { AboutFact } from './fact.model';

const createFactInDB = async (payload: Partial<IAboutFact>) => {
  return await AboutFact.create(payload);
};
const getPublicFactsFromDB = async () => {
  return await AboutFact.find({ status: 'active' }).sort({ createdAt: 1 });
};
const updateFactInDB = async (id: string, payload: Partial<IAboutFact>) => {
  return await AboutFact.findByIdAndUpdate(id, payload, { new: true });
};
const deleteFactFromDB = async (id: string) => {
  return await AboutFact.findByIdAndDelete(id);
};

const getFactByIdFromDB = async (id: string) => {
  const result = await AboutFact.findById(id);
  if (!result) {
    throw new Error('Fact not found');
  }
  return result;
}

export const AboutFactServices = {
  createFactInDB,
  getPublicFactsFromDB,
  updateFactInDB,
  deleteFactFromDB,
  getFactByIdFromDB,
};