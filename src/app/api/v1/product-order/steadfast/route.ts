import { NextRequest, NextResponse } from 'next/server';
import { SteadfastService, SteadfastOrderData } from '@/lib/services/SteadfastService'; 
import dbConnect from '@/lib/db';
import { OrderModel } from '@/lib/modules/product-order/order/order.model';
import { sendSMS } from '@/lib/utils/smsPortal';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { orderId } = await req.json();

        if (!orderId) {
            return NextResponse.json({ success: false, message: 'Order ID is required' }, { status: 400 });
        }

        const order = await OrderModel.findById(orderId);
        if (!order) {
            return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
        }

        // এড্রেস ক্লিনআপ (ডুপ্লিকেট সিটি/ডিস্ট্রিক্ট রিমুভ করা)
        const cleanAddress = Array.from(new Set([
            order.shippingStreetAddress,
            order.shippingCity,
            order.shippingDistrict,
            order.shippingCountry || 'Bangladesh'
        ].filter(Boolean))).join(', ');

        const steadfastOrderData: SteadfastOrderData = {
            invoice: order.orderId, 
            recipient_name: order.shippingName,
            recipient_phone: order.shippingPhone,
            recipient_address: cleanAddress,
            cod_amount: order.totalAmount,
            note: `Guptodhan Order - ${order.orderId}`,
            item_description: `Items: ${order.orderDetails?.length || 1}`,
            total_lot: order.orderDetails?.length || 1,
            delivery_type: 0,
        };

        const steadfastResponse = await SteadfastService.createOrder(steadfastOrderData);

        if (steadfastResponse.status === 200 && steadfastResponse.consignment) {
            const trackingCode = steadfastResponse.consignment.tracking_code;

            // ✅ ১. ডাটাবেজে ট্র্যাকিং তথ্য সেভ করা
            const updatedOrder = await OrderModel.findByIdAndUpdate(
                orderId,
                {
                    parcelId: steadfastResponse.consignment.consignment_id.toString(),
                    trackingId: trackingCode,
                    orderStatus: 'Shipped',
                    updatedAt: new Date(),
                },
                { new: true }
            );

            // ✅ ২. কাস্টমারকে অটোমেটিক SMS পাঠানো (Best Practice)
            const smsMessage = `Dear ${order.shippingName}, your order ${order.orderId} has been shipped! Tracking Code: ${trackingCode}. Track here: https://steadfast.com.bd/t/${trackingCode}. Thank you for shopping with Guptodhan!`;
            
            // ব্যাকগ্রাউন্ডে SMS পাঠানো হচ্ছে (এপিআই রেসপন্স যেন স্লো না হয়)
            sendSMS(order.shippingPhone, smsMessage).catch(err => console.error("❌ Auto SMS Error:", err));

            return NextResponse.json({
                success: true,
                message: 'Shipment created and SMS notification sent!',
                data: updatedOrder,
            });
        } else {
            return NextResponse.json({
                success: false,
                message: steadfastResponse.message || 'Courier provider error',
            }, { status: 500 });
        }

    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
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