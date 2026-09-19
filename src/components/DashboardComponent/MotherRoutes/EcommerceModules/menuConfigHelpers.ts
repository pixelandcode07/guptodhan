import { MenuConfig, ChildItem } from './types';

interface Counts {
  productCount: string;
  reviewCount: string;
  lowStockCount: string;
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

export const buildDynamicMenuConfig = (
  baseConfig: MenuConfig,
  counts: Counts
): MenuConfig => {
  return {
    ...baseConfig,
    'Manage Products': {
      ...baseConfig['Manage Products'],
      items: baseConfig['Manage Products'].items.map((item: ChildItem) => {
        if (item.url === '/general/view/all/product') {
          return {
            ...item,
            title: `All Products`,
            count: counts.productCount,
          };
        }
        if (item.url === '/general/view/product/reviews') {
          return {
            ...item,
            title: `Products's Review`,
            count: counts.reviewCount,
          };
        }
        if (item.url === '/general/view/low-stock') {
          return {
            ...item,
            title: `Low Stock Products`,
            count: counts.lowStockCount,
          };
        }
        if (item.url === '/general/view/product/question/answer') {
          return {
            ...item,
            title: `Product Ques/Ans`,
            count: counts.qaCount,
          };
        }
        return item;
      }),
    },
    'Manage Orders': {
      ...baseConfig['Manage Orders'],
      items: baseConfig['Manage Orders'].items.map((item: ChildItem) => {
        if (item.url === '/general/view/orders') {
          return {
            ...item,
            title: `All Orders`,
            count: counts.orderCount,
          };
        }
        if (item.url === '/general/view/orders/pending') {
          return {
            ...item,
            title: `Pending Orders`,
            count: counts.pendingCount,
          };
        }
        if (item.url === '/general/view/orders/approved') {
          return {
            ...item,
            title: `Approved Orders`,
            count: counts.approvedCount,
          };
        }
        if (item.url === '/general/view/orders/ready-to-ship') {
          return {
            ...item,
            title: `Ready to Ship`,
            count: counts.readyToShipCount,
          };
        }
        if (item.url === '/general/view/orders/in-transit') {
          return {
            ...item,
            title: `InTransit Orders`,
            count: counts.inTransitCount,
          };
        }
        if (item.url === '/general/view/orders/delivered') {
          return {
            ...item,
            title: `Delivered Orders`,
            count: counts.deliveredCount,
          };
        }
        if (item.url === '/general/view/orders/cancelled') {
          return {
            ...item,
            title: `Cancelled Orders`,
            count: counts.cancelledCount,
          };
        }
        if (item.url === '/general/view/orders/return-request') {
          return {
            ...item,
            title: `Return Request`,
            count: counts.returnRequestCount,
          };
        }
        return item;
      }),
    },
  };
};

