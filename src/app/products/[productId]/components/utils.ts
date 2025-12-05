import { EntityRef, Product } from './types';

export const getEntityId = (value: EntityRef): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') return value._id || value.id || '';
  return '';
};

export const getCategoryName = (product: Product): string => {
  if (typeof product.category === 'object' && product.category !== null) {
    return product.category.name || 'Category';
  }
  return 'Category';
};

export const getBrandName = (product: Product, brands?: Array<{ _id: string; name: string }>): string => {
  // If brand is an object with name property
  if (typeof product.brand === 'object' && product.brand !== null && product.brand.name) {
    return product.brand.name;
  }
  
  // If brand is a string ID, try to find it in brands array
  if (typeof product.brand === 'string' && brands) {
    const brand = brands.find(b => b._id === product.brand || String(b._id) === String(product.brand));
    if (brand?.name) {
      return brand.name;
    }
  }
  
  // If brand is an object but name is missing, try to get it from brands array
  if (typeof product.brand === 'object' && product.brand !== null && brands) {
    const brandId = product.brand._id || product.brand.id;
    if (brandId) {
      const brand = brands.find(b => b._id === brandId || String(b._id) === String(brandId));
      if (brand?.name) {
        return brand.name;
      }
    }
  }
  
  return 'No Brand';
};

export const getStoreDetails = (product: Product) => {
  if (typeof product.vendorStoreId === 'object' && product.vendorStoreId !== null) {
    return {
      _id: product.vendorStoreId._id,
      storeName: product.vendorStoreId.storeName,
      storeLogo: product.vendorStoreId.storeLogo
    };
  }
  return null;
};

export const formatPrice = (price: number | null | undefined): string => {
  if (!price || isNaN(price) || price <= 0) {
    return 'BDT 0';
  }
  try {
    return new Intl.NumberFormat('en-BD', { 
      style: 'currency', 
      currency: 'BDT', 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  } catch (error) {
    return `BDT ${price.toLocaleString()}`;
  }
};

export const calculateDiscountPercent = (productPrice: number | null | undefined, discountPrice?: number | null): number => {
  if (!discountPrice || !productPrice || isNaN(productPrice) || isNaN(discountPrice) || productPrice <= 0 || discountPrice <= 0) {
    return 0;
  }
  if (discountPrice >= productPrice) return 0;
  const percent = ((productPrice - discountPrice) / productPrice) * 100;
  return Math.round(percent);
};

