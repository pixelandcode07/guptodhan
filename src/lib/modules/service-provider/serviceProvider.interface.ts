import { Types } from 'mongoose';

export type TServiceProvider = {
  user: Types.ObjectId; 
  bio?: string;
  skills: string[]; 
  ratingAvg: number;
};