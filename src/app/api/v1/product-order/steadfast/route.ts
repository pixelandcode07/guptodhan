import { NextRequest, NextResponse } from 'next/server';
import { SteadfastService, SteadfastOrderData } from '@/lib/services/SteadfastService'; 
import dbConnect from '@/lib/db';
import { OrderModel } from '@/lib/modules/product-order/order/order.model';
import { sendSMS } from '@/lib/utils/smsPortal';

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

        // ১. ডাটাবেজ থেকে অর্ডারের তথ্য নিয়ে আসা
        const order = await OrderModel.findOne({ orderId }).populate('userId');

        if (!order) {
            return NextResponse.json(
                { success: false, message: 'Order not found' },
                { status: 404 }
            );
        }

        // ২. Steadfast API এর জন্য ডাটা প্রস্তুত করা
        const steadfastOrderData: SteadfastOrderData = {
            invoice: order.orderId, 
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

        // ৩. Steadfast এ শিপমেন্ট তৈরি করা
        const steadfastResponse = await SteadfastService.createOrder(steadfastOrderData);

        if (steadfastResponse.status === 200 && steadfastResponse.consignment) {
            const trackingCode = steadfastResponse.consignment.tracking_code;

            // ৪. ডাটাবেজ আপডেট করা (Parcel ID ও Tracking ID সহ)
            await OrderModel.findOneAndUpdate(
                { orderId },
                {
                    parcelId: steadfastResponse.consignment.consignment_id.toString(),
                    trackingId: trackingCode,
                    orderStatus: 'Shipped', // ✅ কনফার্ম হওয়ার পর স্ট্যাটাস 'Shipped' করা প্রফেশনাল
                    updatedAt: new Date(),
                }
            );

            // ============================================================
            // ✅ ৫. কাস্টমারকে আপনার ব্র্যান্ডের লিঙ্কসহ SMS পাঠানো
            // ============================================================
            const customTrackingUrl = `https://www.guptodhandigital.com/track-order`;
            const smsMessage = `Dear ${order.shippingName}, your order ${order.orderId} has been shipped! Tracking Code: ${trackingCode}. Track your parcel here: ${customTrackingUrl}. Thank you for shopping with Guptodhan!`;
            
            // ব্যাকগ্রাউন্ডে SMS পাঠানো (যাতে API রেসপন্স স্লো না হয়)
            sendSMS(order.shippingPhone, smsMessage).catch(err => {
                console.error("❌ Auto SMS Logic Error:", err);
            });

            return NextResponse.json({
                success: true,
                message: 'Steadfast order created and SMS notification sent!',
                data: {
                    consignmentId: steadfastResponse.consignment.consignment_id,
                    trackingCode: trackingCode,
                    status: steadfastResponse.consignment.status,
                },
            });

        } else {
            // ফেইল করলে অর্ডার স্ট্যাটাস ক্যানসেল না করে 'Processing' বা 'Pending' রাখা ভালো
            return NextResponse.json({
                success: false,
                message: steadfastResponse.message || 'Steadfast creation failed',
            }, { status: 500 });
        }

    } catch (error: unknown) {
        console.error('❌ Steadfast Route Error:', error);
        return NextResponse.json({
            success: false,
            message: 'Internal server error',
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