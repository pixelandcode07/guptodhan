import { MenuConfig, ChildItem } from './types';

interface Counts {
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
            title: `View All Products`,
            count: counts.productCount,
          };
        }
        if (item.url === '/general/view/product/reviews') {
          return {
            ...item,
            title: `Products's Review (${counts.reviewCount})`,
            count: counts.reviewCount,
          };
        }
        if (item.url === '/general/view/product/question/answer') {
          return {
            ...item,
            title: `Product Ques/Ans (${counts.qaCount})`,
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
            title: `All Orders (${counts.orderCount})`,
            count: counts.orderCount,
          };
        }
        if (item.url === '/general/view/orders/pending') {
          return {
            ...item,
            title: `Pending Orders (${counts.pendingCount})`,
            count: counts.pendingCount,
          };
        }
        if (item.url === '/general/view/orders/approved') {
          return {
            ...item,
            title: `Approved Orders (${counts.approvedCount})`,
            count: counts.approvedCount,
          };
        }
        if (item.url === '/general/view/orders/ready-to-ship') {
          return {
            ...item,
            title: `Ready to Ship (${counts.readyToShipCount})`,
            count: counts.readyToShipCount,
          };
        }
        if (item.url === '/general/view/orders/in-transit') {
          return {
            ...item,
            title: `InTransit Orders (${counts.inTransitCount})`,
            count: counts.inTransitCount,
          };
        }
        if (item.url === '/general/view/orders/delivered') {
          return {
            ...item,
            title: `Delivered Orders (${counts.deliveredCount})`,
            count: counts.deliveredCount,
          };
        }
        if (item.url === '/general/view/orders/cancelled') {
          return {
            ...item,
            title: `Cancelled Orders (${counts.cancelledCount})`,
            count: counts.cancelledCount,
          };
        }
        if (item.url === '/general/view/orders/return-request') {
          return {
            ...item,
            title: `Return Request (${counts.returnRequestCount})`,
            count: counts.returnRequestCount,
          };
        }
        return item;
      }),
    },
  };
};

