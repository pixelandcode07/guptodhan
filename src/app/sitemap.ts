import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db';
import { VendorProductServices } from '@/lib/modules/product/vendorProduct.service';
import { CategoryServices } from '@/lib/modules/ecommerce-category/services/ecomCategory.service';

const baseUrl = 'https://www.guptodhandigital.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    await dbConnect();

    // Get all products
    const allProducts = await VendorProductServices.getAllVendorProductsFromDB();
    const productUrls: MetadataRoute.Sitemap = allProducts
      .filter((product: any) => product.status === 'active')
      .map((product: any) => ({
        url: `${baseUrl}/products/${product._id}`,
        lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));

    // Get all categories
    const allCategories = await CategoryServices.getAllCategoriesFromDB();
    const categoryUrls: MetadataRoute.Sitemap = (allCategories || [])
      .map((category: any) => ({
        url: `${baseUrl}/categories/${category._id}`,
        lastModified: category.updatedAt ? new Date(category.updatedAt) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));

    return [
      // Static Pages
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/products`,
        lastModified: new Date(),
        changeFrequency: 'always',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/about-us`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/contact-us`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/terms-and-conditions`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/privacy-policy`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.5,
      },

      // Dynamic URLs
      ...categoryUrls,
      ...productUrls,
    ];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return at least static pages
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/products`,
        lastModified: new Date(),
        changeFrequency: 'always',
        priority: 0.9,
      },
    ];
  }
}