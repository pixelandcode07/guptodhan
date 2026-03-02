import { OrderModel } from '@/lib/modules/product-order/order/order.model';
import { StoreModel } from '@/lib/modules/vendor-store/vendorStore.model';
import dbConnect from '@/lib/db';

export async function POST() {
  await dbConnect();

  const deliveredOrders = await OrderModel.find({ 
    orderStatus: 'Delivered' 
  }).lean() as any[];

  const storeEarnings: Record<string, number> = {};

  for (const order of deliveredOrders) {
    const storeId = order.storeId?.toString();
    if (!storeId) continue;

    const store = await StoreModel.findById(storeId).lean() as any;
    const commission = store?.commission || 0;
    const earning = order.totalAmount * (1 - commission / 100);
    storeEarnings[storeId] = (storeEarnings[storeId] || 0) + earning;
  }

  for (const [storeId, totalEarning] of Object.entries(storeEarnings)) {
    await StoreModel.findByIdAndUpdate(storeId, {
      $set: {
        totalEarned: totalEarning,
        availableBalance: totalEarning,
      }
    });
  }

  return Response.json({ 
    success: true, 
    message: `${Object.keys(storeEarnings).length} stores updated`,
    data: storeEarnings
  });
}
