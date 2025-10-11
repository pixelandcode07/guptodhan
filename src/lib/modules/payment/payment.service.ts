import { Order } from '../order/order.model';
import { initPayment as initSslCommerzPayment } from '../sslcommerz/sslcommerz.service';

const initPaymentInDB = async (orderId: string) => {
  const order = await Order.findById(orderId).populate('user').populate('items.product');
  if (!order) throw new Error('Order not found.');
  if (order.paymentMethod !== 'online') throw new Error('This order is not for online payment.');
  if (order.paymentStatus === 'paid') throw new Error('This order has already been paid.');

  const transactionId = `ORDER_${order.orderNo}_${Date.now()}`;
  
  const sslPayload = {
    total_amount: order.totalAmount,
    tran_id: transactionId,
    cus_name: (order.user as any).name,
    cus_email: (order.user as any).email,
    cus_add1: order.shippingAddress,
    cus_phone: order.contactPhone,
    product_name: order.items.map((item: any) => item.product.name).join(', '),
  };

  const gatewayPageURL = await initSslCommerzPayment(sslPayload);

  // অর্ডারে ট্রানজেকশন আইডি আপডেট করা হচ্ছে
  order.transactionId = transactionId;
  await order.save();

  return gatewayPageURL;
};

export const PaymentServices = {
  initPaymentInDB,
};