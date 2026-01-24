import { Document } from "mongoose";

export interface IServiceCategory extends Document {
  name: string;
  description: string;
  slug: string;
  icon_url: string;
  orderCount: number;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}
