// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\service-provider\serviceProvider.interface.ts
import { Types } from 'mongoose';

export type TServiceProvider = {
  user: Types.ObjectId; // মূল User মডেলের রেফারেন্স
  bio?: string;
  skills: string[]; // স্কিলগুলো একটি অ্যারে হিসেবে রাখা হলো
  ratingAvg: number;
};