import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.guptodhan.com';

// ─── Products from DB ─────────────────────────────────────────────────────────
async function getAllActiveProducts() {
  try {
    await dbConnect();
    const { VendorProductServices } = await import('@/lib/modules/product/vendorProduct.service');
    const products = await VendorProductServices.getAllVendorProductsFromDB?.(50000) ?? [];
    return Array.isArray(products) ? products : (products as any)?.products ?? [];
  } catch {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/public/product?limit=50000&status=active`, {
        next: { revalidate: 3600 },
      });
      if (!res.ok) return [];
      const json = await res.json();
      const data = Array.isArray(json.data) ? json.data : json.data?.products ?? [];
      return data.filter((p: any) => p.status === 'active' && p.slug);
    } catch {
      return [];
    }
  }
}

// ─── Categories from DB ───────────────────────────────────────────────────────
async function getAllActiveCategories() {
  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/ecommerce-category/ecomCategory/mainCategory`,
      { next: { revalidate: 7200 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return (Array.isArray(json.data) ? json.data : []).filter((c: any) => c.slug);
  } catch {
    return [];
  }
}

// ─── Main Sitemap ─────────────────────────────────────────────────────────────
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Static pages ─────────────────────────────────────────────────
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

  // ── Categories ────────────────────────────────────────────────────
  const categories = await getAllActiveCategories();
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat: any) => ({
    url: `${BASE_URL}/category/${cat.slug}`,
    lastModified: cat.updatedAt ? new Date(cat.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // ── Products ──────────────────────────────────────────────────────
  const products = await getAllActiveProducts();
  const productPages: MetadataRoute.Sitemap = products
    .filter((p: any) => p.slug)
    .map((p: any) => ({
      // ✅ /product/ (singular) — actual route এর সাথে match
      url: `${BASE_URL}/product/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  return [...staticPages, ...categoryPages, ...productPages];
}