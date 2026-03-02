import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.guptodhan.com';

// ─── Products — সরাসরি DB থেকে ───────────────────────────────────────────────
// ✅ API call করা হচ্ছে না
// কারণ: sitemap generate হওয়ার সময় API running নাও থাকতে পারে (build time / cold start)
async function getAllActiveProducts() {
  try {
    await dbConnect();
    // ✅ Mongoose Model সরাসরি — শুধু slug ও updatedAt নেওয়া হচ্ছে (fast)
    const { VendorProductModel } = await import('@/lib/modules/product/vendorProduct.model');
    const products = await VendorProductModel
      .find(
        { status: 'active', slug: { $exists: true, $ne: '' } },
        { slug: 1, updatedAt: 1, _id: 0 }
      )
      .lean()
      .limit(50000);
    return products;
  } catch (error) {
    console.error('Sitemap: product DB fetch failed', error);
    return [];
  }
}

// ─── Categories — সরাসরি DB থেকে ─────────────────────────────────────────────
async function getAllActiveCategories() {
  try {
    await dbConnect();
    const { CategoryModel } = await import('@/lib/modules/ecommerce-category/models/ecomCategory.model');
    const categories = await CategoryModel
      .find(
        { slug: { $exists: true, $ne: '' } },
        { slug: 1, updatedAt: 1, _id: 0 }
      )
      .lean()
      .limit(5000);
    return categories;
  } catch (error) {
    console.error('Sitemap: category DB fetch failed', error);
    return [];
  }
}

// ─── Main Sitemap ─────────────────────────────────────────────────────────────
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/services`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/buy-sell`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/donation`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/blogs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/about-us`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact-us`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/return-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms-conditions`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/shipping-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  const categories = await getAllActiveCategories();
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat: any) => ({
    url: `${BASE_URL}/category/${cat.slug}`,
    lastModified: cat.updatedAt ? new Date(cat.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const products = await getAllActiveProducts();
  const productPages: MetadataRoute.Sitemap = products
    .filter((p: any) => p.slug)
    .map((p: any) => ({
      url: `${BASE_URL}/product/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  return [...staticPages, ...categoryPages, ...productPages];
}