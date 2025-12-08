import { Document } from "mongoose";

export interface IServiceCategory extends Document {
  name: string;
  description: string;
  slug: string;
  icon_url: string;

  createdAt: Date;
  updatedAt: Date;
}
