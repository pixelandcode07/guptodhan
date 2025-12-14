
// import { StoreInterface } from '@/types/StoreInterface';
// import axios from 'axios';

// export async function updateStore(
//   id: string,
//   data: StoreInterface,
// ) {
//   const res = await axios.patch(`/api/v1/vendor-store/${id}`, data);

//   if (!res.data.success) {
//     throw new Error(res.data.message || 'Failed to update store');
//   }

//   return res.data.data;
// }

// lib/MultiVendorApis/updateStore.ts
import axios from 'axios';
import { StoreInterface } from '@/types/StoreInterface';

export async function updateStore(id: string, data: StoreInterface, files?: {
  logo?: File;
  banner?: File;
}) {
  // Create FormData
  const formData = new FormData();

  // Append all text fields
  formData.append('storeName', data.storeName || '');
  formData.append('storeAddress', data.storeAddress || '');
  formData.append('storePhone', data.storePhone || '');
  formData.append('storeEmail', data.storeEmail || '');
  formData.append('vendorShortDescription', data.vendorShortDescription || '');
  formData.append('fullDescription', data.fullDescription || '');
  formData.append('commission', String(data.commission ?? 0));
  formData.append('storeMetaTitle', data.storeMetaTitle || '');
  
  // storeMetaKeywords → send as JSON string (your backend parses it)
  formData.append('storeMetaKeywords', JSON.stringify(data.storeMetaKeywords || []));
  
  // Optional meta description if you have it
  // if (data.storeMetaDescription) {
  //   formData.append('storeMetaDescription', data.storeMetaDescription);
  // }

  // Social links – backend expects storeSocialLinks[facebook], etc.
  Object.entries(data.storeSocialLinks || {}).forEach(([key, value]) => {
    if (value) {
      formData.append(`storeSocialLinks[${key}]`, value.trim());
    }
  });

  // Status
  formData.append('status', data.status || 'active');

  // Append files if provided
  if (files?.logo) {
    formData.append('logo', files.logo);
  }
  if (files?.banner) {
    formData.append('banner', files.banner);
  }

  const res = await axios.patch(`/api/v1/vendor-store/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Axios will set boundary automatically
    },
  });

  if (!res.data.success) {
    throw new Error(res.data.message || 'Failed to update store');
  }

  return res.data.data;
}