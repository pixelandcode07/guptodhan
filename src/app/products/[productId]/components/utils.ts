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

export const getBrandName = (product: Product): string => {
  if (typeof product.brand === 'object' && product.brand !== null) {
    return product.brand.name || 'No Brand';
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

export const formatPrice = (price: number) => 
  new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', minimumFractionDigits: 0 }).format(price);

export const calculateDiscountPercent = (productPrice: number, discountPrice?: number): number => {
  if (!discountPrice) return 0;
  return Math.round(((productPrice - discountPrice) / productPrice) * 100);
};

