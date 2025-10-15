import { Document } from 'mongoose';

export interface IPageSeo extends Document {
  pageTitle: string;
  pageContent: string;
  featureImage?: string;
  metaTitle: string;
  metaKeywords: string[];
  metaDescription: string;
  showInHeader: boolean;
  showInFooter: boolean;
}