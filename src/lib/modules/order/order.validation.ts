import { z } from 'zod';

const orderItemSchema = z.object({
  productId: z.string({ required_error: 'Product ID is required.' }),
  quantity: z.number({ required_error: 'Quantity is required.' }).int().positive(),
});

export const createOrderSchema = z.object({
  shippingAddress: z.string({ required_error: 'Shipping address is required.' }),
  contactPhone: z.string({ required_error: 'Contact phone is required.' }),
  paymentMethod: z.enum(['cod', 'online'], { required_error: 'Payment method is required.' }),
  items: z.array(orderItemSchema).min(1, 'Order must contain at least one item.'),
});