import { IPageSeo } from './page-seo.interface';
import { PageSeo } from './page-seo.model';
import { deleteFromCloudinary } from '@/lib/utils/cloudinary';

const createPageSeoInDB = async (payload: Partial<IPageSeo>) => {
  return await PageSeo.create(payload);
};

const getAllPagesSeoFromDB = async () => {
  return await PageSeo.find({}).sort({ pageTitle: 1 });
};

const getPublicPageByTitleFromDB = async (title: string) => {
  return await PageSeo.findOne({ pageTitle: title });
};

const updatePageSeoInDB = async (id: string, payload: Partial<IPageSeo>) => {
  // If a new feature image is uploaded, delete the old one
  if (payload.featureImage) {
    const existingPage = await PageSeo.findById(id);
    if (existingPage?.featureImage) {
      await deleteFromCloudinary(existingPage.featureImage);
    }
  }
  return await PageSeo.findByIdAndUpdate(id, payload, { new: true });
};

const deletePageSeoFromDB = async (id: string) => {
  const page = await PageSeo.findById(id);
  if (!page) throw new Error("Page not found.");
  
  // Delete the feature image from Cloudinary before deleting the document
  if (page.featureImage) {
    await deleteFromCloudinary(page.featureImage);
  }
  return await PageSeo.findByIdAndDelete(id);
};

export const PageSeoServices = {
  createPageSeoInDB,
  getAllPagesSeoFromDB,
  getPublicPageByTitleFromDB,
  updatePageSeoInDB,
  deletePageSeoFromDB,
};