import { z } from 'zod';

const createOrderZodSchema = z.object({
  userId: z.string({ required_error: 'User ID is required' }),
  storeId: z.string().optional(), // Can be optional initially if inferred from products
  deliveryMethodId: z.string().optional(),
  paymentMethod: z.string().optional(),
  
  shippingName: z.string().optional(),
  shippingPhone: z.string().optional(),
  shippingEmail: z.string().optional(),
  shippingStreetAddress: z.string().optional(),
  
  totalAmount: z.number().optional(),
  deliveryCharge: z.number().optional(),
  
  products: z.array(z.object({
    productId: z.string(),
    vendorId: z.string(),
    quantity: z.number().min(1),
    unitPrice: z.number(),
    discountPrice: z.number().optional(),
    size: z.string().optional(),
    color: z.string().optional(),
  })).min(1, 'At least one product is required'),
});

const updateOrderZodSchema = z.object({
  orderStatus: z.enum([
    'Pending', 
    'Processing', 
    'Shipped', 
    'Delivered', 
    'Cancelled', 
    'Returned', 
    'Return Request' // ✅ Added here
  ]).optional(),
  paymentStatus: z.enum(['Pending', 'Paid', 'Failed', 'Refunded', 'Cancelled']).optional(),
  returnReason: z.string().optional(), // ✅ Added here
});

// ✅ Validation for Return Request API
const returnRequestZodSchema = z.object({
  orderId: z.string({ required_error: 'Order ID is required' }),
  reason: z.string({ required_error: 'Return reason is required' }).min(5, 'Reason must be at least 5 characters long'),
});

export const OrderValidation = {
  createOrderZodSchema,
  updateOrderZodSchema,
  returnRequestZodSchema,
};