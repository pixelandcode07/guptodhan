import { useSession } from 'next-auth/react';
import axios from 'axios';
import useSWR from 'swr';

interface EcommerceCounts {
  productCount: string;
  reviewCount: string;
  qaCount: string;
  orderCount: string;
  pendingCount: string;
  approvedCount: string;
  readyToShipCount: string;
  inTransitCount: string;
  deliveredCount: string;
  cancelledCount: string;
  returnRequestCount: string;
}

export const useEcommerceCounts = (): EcommerceCounts => {
  const { data: session } = useSession();
  const token = (session as { accessToken?: string; user?: { role?: string } })?.accessToken;
  const userRole = (session as { accessToken?: string; user?: { role?: string } })?.user?.role;

  const fetchCount = async (url: string) => {
    const res = await axios.get(url, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(userRole ? { 'x-user-role': userRole } : {}),
      },
    });
  //   const data = res.data?.data;
  //   if (Array.isArray(data)) return data.length;
  //   if (typeof res.data?.count === 'number') return res.data.count;
  //   return 0;
  // };

    if (res.data?.data?.pagination?.total !== undefined) {
      return res.data.data.pagination.total;
    }
    
  
    if (typeof res.data?.count === 'number') {
      return res.data.count;
    }

    const data = res.data?.data;
    if (Array.isArray(data)) return data.length;
    
 
    if (data?.products && Array.isArray(data.products)) return data.products.length;

    return 0;
  };

  const swrConfig = { revalidateOnFocus: false, dedupingInterval: 60000 } as const;

  const { data: productCountNum } = useSWR(
    token ? ['/api/v1/product', token, userRole] : null,
    () => fetchCount('/api/v1/product'),
    swrConfig
  );
  
  const { data: reviewCountNum } = useSWR(
    token ? ['/api/v1/product-review', token, userRole] : null,
    () => fetchCount('/api/v1/product-review'),
    swrConfig
  );
  
  const { data: qaCountNum } = useSWR(
    token ? ['/api/v1/product-qna', token, userRole] : null,
    () => fetchCount('/api/v1/product-qna'),
    swrConfig
  );
  
  const { data: orderCountNum } = useSWR(
    token ? ['/api/v1/product-order', token, userRole] : null,
    () => fetchCount('/api/v1/product-order'),
    swrConfig
  );

  const { data: pendingCountNum } = useSWR(
    token ? ['/api/v1/product-order', 'Pending', token, userRole] : null,
    () => fetchCount('/api/v1/product-order?status=Pending'),
    swrConfig
  );
  
  const { data: approvedCountNum } = useSWR(
    token ? ['/api/v1/product-order', 'Processing', 'approved', token, userRole] : null,
    () => fetchCount('/api/v1/product-order?status=Processing'),
    swrConfig
  );
  
  const { data: readyToShipCountNum } = useSWR(
    token ? ['/api/v1/product-order', 'Processing', 'ready-to-ship', token, userRole] : null,
    () => fetchCount('/api/v1/product-order?status=Processing'),
    swrConfig
  );
  
  const { data: inTransitCountNum } = useSWR(
    token ? ['/api/v1/product-order', 'Shipped', token, userRole] : null,
    () => fetchCount('/api/v1/product-order?status=Shipped'),
    swrConfig
  );
  
  const { data: deliveredCountNum } = useSWR(
    token ? ['/api/v1/product-order', 'Delivered', token, userRole] : null,
    () => fetchCount('/api/v1/product-order?status=Delivered'),
    swrConfig
  );
  
  const { data: cancelledCountNum } = useSWR(
    token ? ['/api/v1/product-order', 'Cancelled', token, userRole] : null,
    () => fetchCount('/api/v1/product-order?status=Cancelled'),
    swrConfig
  );

  const { data: returnRequestCountNum } = useSWR(
    token ? ['/api/v1/product-order', 'Return Request', token, userRole] : null,
    () =>
      fetchCount(
        `/api/v1/product-order?status=${encodeURIComponent('Return Request')}`
      ),
    swrConfig
  );

  return {
    productCount: String(productCountNum ?? 0),
    reviewCount: String(reviewCountNum ?? 0),
    qaCount: String(qaCountNum ?? 0),
    orderCount: String(orderCountNum ?? 0),
    pendingCount: String(pendingCountNum ?? 0),
    approvedCount: String(approvedCountNum ?? 0),
    readyToShipCount: String(readyToShipCountNum ?? 0),
    inTransitCount: String(inTransitCountNum ?? 0),
    deliveredCount: String(deliveredCountNum ?? 0),
    cancelledCount: String(cancelledCountNum ?? 0),
    returnRequestCount: String(returnRequestCountNum ?? 0),
  };
};

