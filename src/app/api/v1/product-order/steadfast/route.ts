import { NextRequest, NextResponse } from 'next/server';
import { SteadfastService, SteadfastOrderData } from '@/lib/services/SteadfastService'; 
import dbConnect from '@/lib/db';
import { OrderModel } from '@/lib/modules/product-order/order/order.model';

export async function POST(req: NextRequest) {
    try {
        const { orderId } = await req.json();

        if (!orderId) {
            return NextResponse.json(
                { success: false, message: 'Order ID is required' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Fetch order details from database
        const order = await OrderModel.findOne({ orderId }).populate('userId');

        if (!order) {
            return NextResponse.json(
                { success: false, message: 'Order not found' },
                { status: 404 }
            );
        }

        // Prepare Steadfast order data according to official API documentation
        const steadfastOrderData: SteadfastOrderData = {
            invoice: order.orderId, // Must be unique
            recipient_name: order.shippingName,
            recipient_phone: order.shippingPhone,
            recipient_email: order.shippingEmail,
            recipient_address: `${order.shippingStreetAddress}, ${order.shippingCity}, ${order.shippingDistrict}`,
            cod_amount: order.totalAmount,
            note: `Order from Guptodhan - ${order.orderId}`,
            item_description: `Order ${order.orderId} - ${order.orderDetails?.length || 1} items`,
            total_lot: order.orderDetails?.length || 1,
            delivery_type: 0, // Home delivery
        };

        // Create Steadfast order
        // This line now correctly calls the static method on the imported class
        const steadfastResponse = await SteadfastService.createOrder(steadfastOrderData);

        if (steadfastResponse.status === 200 && steadfastResponse.consignment) {
            // Update order with Steadfast details
            await OrderModel.findOneAndUpdate(
                { orderId },
                {
                    parcelId: steadfastResponse.consignment.consignment_id.toString(),
                    trackingId: steadfastResponse.consignment.tracking_code,
                    orderStatus: 'Processing',
                    updatedAt: new Date(),
                }
            );

            return NextResponse.json({
                success: true,
                message: 'Steadfast order created successfully',
                data: {
                    consignmentId: steadfastResponse.consignment.consignment_id,
                    trackingCode: steadfastResponse.consignment.tracking_code,
                    status: steadfastResponse.consignment.status,
                },
            });
        } else {
            // Update order status to indicate Steadfast creation failed
            await OrderModel.findOneAndUpdate(
                { orderId },
                {
                    orderStatus: 'Cancelled',
                    updatedAt: new Date(),
                }
            );

            return NextResponse.json({
                success: false,
                message: steadfastResponse.message || 'Failed to create Steadfast order',
            }, { status: 500 });
        }

    } catch (error: unknown) {
        console.error('❌ Steadfast order creation error:', error);

        return NextResponse.json({
            success: false,
            message: 'Failed to create Steadfast order',
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}

// Handle unsupported methods
export async function GET() {
    return NextResponse.json(
        { error: 'Method not allowed. Use POST to create shipments.' },
        { status: 405 }
    );
}

export async function PUT() {
    return NextResponse.json(
        { error: 'Method not allowed. Use POST to create shipments.' },
        { status: 405 }
    );
}

export async function DELETE() {
    return NextResponse.json(
        { error: 'Method not allowed. Use POST to create shipments.' },
        { status: 405 }
    );
}