import axios from 'axios';
import { StoreInterface } from '@/types/StoreInterface';

export async function updateStore(id: string, data: StoreInterface, files?: {
  logo?: File;
  banner?: File;
}) {
  const formData = new FormData();

  formData.append('storeName', data.storeName || '');
  formData.append('storeAddress', data.storeAddress || '');
  formData.append('storePhone', data.storePhone || '');
  formData.append('storeEmail', data.storeEmail || '');
  formData.append('vendorShortDescription', data.vendorShortDescription || '');
  formData.append('fullDescription', data.fullDescription || '');
  formData.append('commission', String(data.commission ?? 0));
  formData.append('storeMetaTitle', data.storeMetaTitle || '');
  formData.append('storeMetaKeywords', JSON.stringify(data.storeMetaKeywords || []));
  Object.entries(data.storeSocialLinks || {}).forEach(([key, value]) => {
    if (value) {
      formData.append(`storeSocialLinks[${key}]`, value.trim());
    }
  });
  formData.append('status', data.status || 'active');
  if (files?.logo) {
    formData.append('logo', files.logo);
  }
  if (files?.banner) {
    formData.append('banner', files.banner);
  }

  const res = await axios.patch(`/api/v1/vendor-store/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  if (!res.data.success) {
    throw new Error(res.data.message || 'Failed to update store');
  }

  return res.data.data;
}