import { IEdition } from './edition.interface';
import { Edition } from './edition.model';
import { Types } from 'mongoose';

const createEditionInDB = async (payload: Partial<IEdition>) => {
  return await Edition.create(payload);
};

const getEditionsByModelFromDB = async (modelId: string) => {
  return await Edition.find({ productModel: new Types.ObjectId(modelId), status: 'active' }).sort({ name: 1 });
};

const updateEditionInDB = async (id: string, payload: Partial<IEdition>) => {
  return await Edition.findByIdAndUpdate(id, payload, { new: true });
};

const deleteEditionFromDB = async (id: string) => {
  return await Edition.findByIdAndDelete(id);
};

export const EditionServices = {
  createEditionInDB,
  getEditionsByModelFromDB,
  updateEditionInDB,
  deleteEditionFromDB,
};  