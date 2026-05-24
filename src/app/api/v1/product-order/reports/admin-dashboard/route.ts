// src/app/api/v1/product-order/reports/admin-dashboard/route.ts

import { OrderController } from '@/lib/modules/product-order/order/order.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

/**
 * GET /api/v1/product-order/reports/admin-dashboard
 *
 * Query Parameters (all optional):
 *   startDate     — ISO date string  e.g. "2024-01-01"
 *   endDate       — ISO date string  e.g. "2024-12-31"
 *   orderStatus   — "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled"
 *   paymentStatus — "Pending" | "Paid" | "Failed"
 *   paymentMethod — "COD" | "card"
 *
 * Response:
 * {
 *   success: true,
 *   data: {
 *     summary: {
 *       totalRevenue, totalAdminProfit, totalDeliveryRevenue,
 *       totalProductRevenue, totalOrders, deliveredOrders,
 *       pendingOrders, processingOrders, shippedOrders,
 *       cancelledOrders, returnedOrders, paidOrders, unpaidOrders,
 *       uniqueCustomersCount, uniqueVendorsCount
 *     },
 *     vendorBreakdown: [
 *       { storeId, storeName, storeEmail, storeLogo, commissionRate,
 *         totalOrders, deliveredOrders, cancelledOrders,
 *         totalRevenue, totalProductRevenue, totalDeliveryCharge,
 *         adminEarned, vendorNet }
 *     ],
 *     customerBreakdown: [
 *       { userId, customerName, customerPhone,
 *         totalOrders, deliveredOrders, cancelledOrders,
 *         totalSpent, totalProducts, uniqueProducts,
 *         lastOrderDate, firstOrderDate, cities }
 *     ]
 *   }
 * }
 *
 * Access: admin only
 */
export const GET = catchAsync(
  checkRole(['admin'])(OrderController.getAdminDashboardReport)
);