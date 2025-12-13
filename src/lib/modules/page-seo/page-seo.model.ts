import { Schema, model, models } from 'mongoose';
import { IPageSeo } from './page-seo.interface';

const pageSeoSchema = new Schema<IPageSeo>({
  pageTitle: { type: String, required: true, unique: true },
  pageContent: { type: String, required: true },
  featureImage: { type: String },
  metaTitle: { type: String, required: true },
  metaKeywords: [{ type: String }],
  metaDescription: { type: String, required: true },
  showInHeader: { type: Boolean, default: false },
  showInFooter: { type: Boolean, default: false },
}, { timestamps: true });

export const PageSeo = models.PageSeo || model<IPageSeo>('PageSeo', pageSeoSchema);