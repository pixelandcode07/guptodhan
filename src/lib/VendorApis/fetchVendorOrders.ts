import axios from 'axios';

export const fetchVendorOrders = async (vendorId: string, token?: string) => {
  // VPS এ সরাসরি ডোমেইন ব্যবহার করা নিরাপদ
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://guptodhandigital.com';

  try {
    const response = await axios.get(
      `${baseUrl}/api/v1/vendor-store/vendorOrder/${vendorId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch orders');
    }

    return response.data.data;
  } catch (error: any) {
    console.error('API Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to load vendor orders');
  }
};