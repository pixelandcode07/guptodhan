// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\custom-code\customCode.service.ts

import { ICustomCode } from './customCode.interface';
import { CustomCode } from './customCode.model';

// Upsert logic: jodi kono custom code document na thake, tobe notun toiri korbe,
// ar thakle, purono-take update korbe
const createOrUpdateCodeInDB = async (payload: Partial<ICustomCode>) => {
  return await CustomCode.findOneAndUpdate({}, payload, { new: true, upsert: true });
};

const getPublicCodeFromDB = async () => {
  return await CustomCode.findOne();
};

export const CustomCodeServices = {
  createOrUpdateCodeInDB,
  getPublicCodeFromDB,
};