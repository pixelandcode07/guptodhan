import { z } from 'zod';

// Create Order validation
export const createOrderValidationSchema = z.object({
  orderId: z.string().min(1, { message: 'Order ID is required.' }),
  userId: z.string().min(1, { message: 'User ID is required.' }),
  storeId: z.string().min(1, { message: 'Store ID is required.' }),
  deliveryMethodId: z.string().min(1, { message: 'Delivery Method ID is required.' }),
  paymentMethodId: z.string().min(1, { message: 'Payment Method ID is required.' }),

  shippingName: z.string().min(1, { message: 'Shipping name is required.' }),
  shippingPhone: z.string().min(1, { message: 'Shipping phone is required.' }),
  shippingEmail: z.string().email({ message: 'Invalid email format.' }).optional(),
  shippingStreetAddress: z.string().min(1, { message: 'Street address is required.' }),
  shippingCity: z.string().min(1, { message: 'City is required.' }),
  shippingDistrict: z.string().min(1, { message: 'District is required.' }),
  shippingPostalCode: z.string().min(1, { message: 'Postal code is required.' }),
  shippingCountry: z.string().min(1, { message: 'Country is required.' }),
  addressDetails: z.string().min(1, { message: 'Address details are required.' }),

  deliveryCharge: z.number().min(0, { message: 'Delivery charge must be 0 or greater.' }),
  totalAmount: z.number().min(0, { message: 'Total amount must be 0 or greater.' }),

  paymentStatus: z.enum(['Pending', 'Paid', 'Failed', 'Refunded']),
  orderStatus: z.enum(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']),
  orderForm: z.enum(['Website', 'App']),
  orderDate: z.date({ required_error: 'Order date is required.' }),
  deliveryDate: z.date({ required_error: 'Delivery date is required.' }),

  parcelId: z.string().optional(),
  trackingId: z.string().optional(),
  couponId: z.string().optional(),

  orderDetails: z.array(z.string()).min(1, { message: 'At least one order detail is required.' }),
});

// Update Order validation
export const updateOrderValidationSchema = z.object({
  orderId: z.string().optional(),
  userId: z.string().optional(),
  storeId: z.string().optional(),
  deliveryMethodId: z.string().optional(),
  paymentMethodId: z.string().optional(),

  shippingName: z.string().optional(),
  shippingPhone: z.string().optional(),
  shippingEmail: z.string().email().optional(),
  shippingStreetAddress: z.string().optional(),
  shippingCity: z.string().optional(),
  shippingDistrict: z.string().optional(),
  shippingPostalCode: z.string().optional(),
  shippingCountry: z.string().optional(),
  addressDetails: z.string().optional(),

  deliveryCharge: z.number().optional(),
  totalAmount: z.number().optional(),

  paymentStatus: z.enum(['Pending', 'Paid', 'Failed', 'Refunded']).optional(),
  orderStatus: z.enum(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']).optional(),
  orderForm: z.enum(['Website', 'App']).optional(),
  orderDate: z.date().optional(),
  deliveryDate: z.date().optional(),

  parcelId: z.string().optional(),
  trackingId: z.string().optional(),
  couponId: z.string().optional(),

  orderDetails: z.array(z.string()).optional(),
});
