import { Document } from 'mongoose';

export interface IStorageType extends Document {
  storageTypeId: string;
  ram: string;
  rom: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  orderCount: number;
}
