import { z } from 'zod';

// Create OrderDetails validation
export const createOrderDetailsValidationSchema = z.object({
  orderDetailsId: z.string().min(1, { message: 'Order Details ID is required.' }),
  orderId: z.string().min(1, { message: 'Order ID is required.' }),
  productId: z.string().min(1, { message: 'Product ID is required.' }),
  vendorId: z.string().min(1, { message: 'Vendor ID is required.' }),

  quantity: z.number().min(1, { message: 'Quantity must be at least 1.' }),
  unitPrice: z.number().min(0, { message: 'Unit price must be 0 or greater.' }),
  discountPrice: z.number().min(0).optional(),
  totalPrice: z.number().min(0, { message: 'Total price must be 0 or greater.' }),
});

// Update OrderDetails validation
export const updateOrderDetailsValidationSchema = z.object({
  orderDetailsId: z.string().optional(),
  orderId: z.string().optional(),
  productId: z.string().optional(),
  vendorId: z.string().optional(),

  quantity: z.number().optional(),
  unitPrice: z.number().optional(),
  discountPrice: z.number().optional(),
  totalPrice: z.number().optional(),
});
