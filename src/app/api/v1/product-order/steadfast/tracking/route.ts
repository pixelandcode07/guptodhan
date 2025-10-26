import { NextRequest, NextResponse } from 'next/server';
import { SteadfastService } from '@/lib/services/SteadfastService';
import dbConnect from '@/lib/db';
import { OrderModel } from '@/lib/modules/product-order/order/order.model';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const trackingId = searchParams.get('trackingId');
    const orderId = searchParams.get('orderId');

    if (!trackingId && !orderId) {
      return NextResponse.json(
        { success: false, message: 'Tracking ID or Order ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    let order;
    if (orderId) {
      order = await OrderModel.findOne({ orderId });
    } else if (trackingId) {
      order = await OrderModel.findOne({ trackingId });
    }

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    if (!order.trackingId) {
      return NextResponse.json(
        { success: false, message: 'No tracking information available for this order' },
        { status: 404 }
      );
    }

    // Get tracking information from Steadfast using tracking code
    const trackingInfo = await SteadfastService.trackByTrackingCode(order.trackingId);

    return NextResponse.json({
      success: true,
      message: 'Tracking information retrieved successfully',
      data: {
        orderId: order.orderId,
        parcelId: order.parcelId,
        trackingId: order.trackingId,
        orderStatus: order.orderStatus,
        trackingInfo: {
          status: trackingInfo.status,
          deliveryStatus: trackingInfo.delivery_status,
          trackingCode: order.trackingId,
        },
        orderDetails: {
          customerName: order.shippingName,
          customerPhone: order.shippingPhone,
          deliveryAddress: order.shippingStreetAddress,
          city: order.shippingCity,
          district: order.shippingDistrict,
          totalAmount: order.totalAmount,
          orderDate: order.orderDate,
          deliveryDate: order.deliveryDate,
        },
      },
    });

  } catch (error: unknown) {
    console.error('❌ Tracking error:', error);

    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve tracking information',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed. Use GET to retrieve tracking information.' },
    { status: 405 }
  );
}
