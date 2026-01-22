import { Schema, model, models } from 'mongoose';
import { IOrder } from './order.interface';

const orderSchema = new Schema<IOrder>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true, // ✅ Auto index
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    storeId: {
      type: Schema.Types.ObjectId,
      ref: 'StoreModel',
    },
    deliveryMethodId: {
      type: String,
    },
    paymentMethod: {
      type: String,
    },
    transactionId: {
      type: String,
      sparse: true, // ✅ Auto sparse index
    },
    shippingName: {
      type: String,
      required: true,
    },
    shippingPhone: {
      type: String,
      required: true,
    },
    shippingEmail: {
      type: String,
      required: true,
    },
    shippingStreetAddress: {
      type: String,
      required: true,
    },
    shippingCity: {
      type: String,
      required: true,
    },
    shippingDistrict: {
      type: String,
      required: true,
    },
    shippingPostalCode: {
      type: String,
      required: true,
    },
    shippingCountry: {
      type: String,
      required: true,
      default: 'Bangladesh',
    },
    addressDetails: {
      type: String,
    },
    deliveryCharge: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded', 'Cancelled'],
      default: 'Pending',
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned', 'Return Request'],
      default: 'Pending',
    },
    returnReason: {
      type: String,
    },
    orderForm: {
      type: String,
      enum: ['Website', 'App'],
      default: 'Website',
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    deliveryDate: {
      type: Date,
    },
    orderDetails: [
      {
        type: Schema.Types.ObjectId,
        ref: 'OrderDetails',
      },
    ],
    parcelId: {
      type: String,
    },
    trackingId: {
      type: String,
    },
    couponId: {
      type: Schema.Types.ObjectId,
      ref: 'PromoCode',
    },
  },
  {
    timestamps: true,
  }
);

// ================================================================
// 🎯 INDEXES - Professional Strategy (NO DUPLICATES)
// ================================================================

// ✅ Single Field Indexes
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ storeId: 1 });
orderSchema.index({ orderDate: -1 });
orderSchema.index({ createdAt: -1 });

// ✅ Compound Indexes (ESR rule: Equality, Sort, Range)

// Most common: Get user's orders sorted by date
orderSchema.index({ 
  userId: 1,           // Equality (user)
  orderStatus: 1,      // Equality (filter by status)
  createdAt: -1        // Sort (recent first)
});

// Query: Get orders by payment status and date
orderSchema.index({ 
  paymentStatus: 1,    // Equality
  orderDate: -1        // Sort
});

// Query: Get store orders
orderSchema.index({ 
  storeId: 1,          // Equality
  orderStatus: 1,      // Equality
  createdAt: -1        // Sort
});

// Query: Sales report (date range queries)
orderSchema.index({ 
  orderDate: -1,       // Range queries
  orderStatus: 1,      // Filter
  paymentStatus: 1     // Filter
});

// Query: Returned orders
orderSchema.index({ 
  userId: 1,           // Equality
  orderStatus: 1,      // Equality ('Returned', 'Return Request')
  updatedAt: -1        // Sort
});

// ================================================================
// 🎯 PERFORMANCE NOTES
// ================================================================
/*
Indexes Created:
1. orderId (unique) - Auto
2. transactionId (sparse) - Auto
3. paymentStatus - Single
4. orderStatus - Single
5. storeId - Single
6. orderDate - Single (desc)
7. createdAt - Single (desc)
8. { userId, orderStatus, createdAt } - Compound (user orders)
9. { paymentStatus, orderDate } - Compound (payment tracking)
10. { storeId, orderStatus, createdAt } - Compound (store orders)
11. { orderDate, orderStatus, paymentStatus } - Compound (reports)
12. { userId, orderStatus, updatedAt } - Compound (returns)

Total: 12 indexes (no duplicates)

Note: userId index removed from single indexes because it's 
already covered in compound indexes as the first field.
*/

export const OrderModel = models.Order || model<IOrder>('Order', orderSchema);