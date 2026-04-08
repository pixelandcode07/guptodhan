import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.guptodhan.com';

// ─── Products: API থেকে fetch ────────────────────────────────────────────────
async function getAllActiveProducts() {
  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/public/product?limit=50000&fields=slug,updatedAt`,
      {
        next: { revalidate: 3600 },
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!res.ok) {
      console.error('Sitemap: product API failed, status:', res.status);
      return [];
    }

    const json = await res.json();
    const products = json?.data?.products || json?.data || [];
    return Array.isArray(products) ? products : [];
  } catch (error) {
    console.error('Sitemap: product fetch failed', error);
    return [];
  }
}

// ─── Categories: API থেকে fetch ──────────────────────────────────────────────
async function getAllActiveCategories() {
  try {
    const catRes = await fetch(
      `${BASE_URL}/api/v1/ecommerce-category/ecomCategory/mainCategory`,
      {
        next: { revalidate: 3600 },
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!catRes.ok) {
      console.error('Sitemap: category API failed, status:', catRes.status);
      return [];
    }

    const json = await catRes.json();
    const categories = json?.data || [];
    return Array.isArray(categories) ? categories : [];
  } catch (error) {
    console.error('Sitemap: category fetch failed', error);
    return [];
  }
}

// ─── Slug Sanitize Helper ─────────────────────────────────────────────────────
function sanitizeSlug(slug: string): string {
  return slug
    .replace(/&/g, '%26')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')
    .replace(/"/g, '%22')
    .replace(/'/g, '%27')
    .replace(/\s+/g, '-')
    .trim();
}

// ─── Main Sitemap Export ──────────────────────────────────────────────────────
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/buy-sell`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/donation`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/return-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms-conditions`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/shipping-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Category pages
  const categories = await getAllActiveCategories();
  const categoryPages: MetadataRoute.Sitemap = categories
    .filter((cat: any) => cat?.slug && typeof cat.slug === 'string')
    .map((cat: any) => ({
      url: `${BASE_URL}/category/${sanitizeSlug(cat.slug)}`,
      lastModified:
        cat.updatedAt && !isNaN(new Date(cat.updatedAt).getTime())
          ? new Date(cat.updatedAt)
          : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  // Product pages
  const products = await getAllActiveProducts();
  const productPages: MetadataRoute.Sitemap = products
    .filter((p: any) => p?.slug && typeof p.slug === 'string')
    .map((p: any) => ({
      url: `${BASE_URL}/product/${sanitizeSlug(p.slug)}`,
      lastModified:
        p.updatedAt && !isNaN(new Date(p.updatedAt).getTime())
          ? new Date(p.updatedAt)
          : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  console.log(
    `Sitemap generated: ${staticPages.length} static + ${categoryPages.length} categories + ${productPages.length} products`
  );

  return [...staticPages, ...categoryPages, ...productPages];
}