import { Schema, model, models } from 'mongoose';
import { IStorageType } from '../interfaces/storageType.interface';

const storageTypeSchema = new Schema<IStorageType>(
  {
    storageTypeId: { type: String, required: true, unique: true },
    ram: { type: String, required: true, trim: true },
    rom: { type: String, required: true, trim: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export const StorageType =
  models.StorageType || model<IStorageType>('StorageType', storageTypeSchema);
