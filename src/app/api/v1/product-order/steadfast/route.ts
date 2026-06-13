import { NextRequest, NextResponse } from 'next/server';
import { SteadfastService, SteadfastOrderData } from '@/lib/services/SteadfastService'; 
import dbConnect from '@/lib/db';
import { OrderModel } from '@/lib/modules/product-order/order/order.model';
import { sendSMS } from '@/lib/utils/smsPortal';
import { Types } from 'mongoose';

// ✅ FIX: Steadfast expects an 11-digit BD phone number (e.g. 01641801705).
// Our DB stores numbers with a "+88" prefix (e.g. +8801641801705),
// which Steadfast's recipient_phone validation rejects -> 4xx/422 -> we were
// swallowing that and returning a generic 500.
const normalizeBdPhone = (phone: string): string => {
    if (!phone) return phone;
    // strip everything except digits
    let digits = phone.replace(/\D/g, '');

    // Remove leading country code variations: 880, 88, or a leading 0 + 88
    if (digits.startsWith('880') && digits.length === 13) {
        digits = digits.slice(2); // 8801... -> 01...
    } else if (digits.startsWith('88') && digits.length === 12) {
        digits = digits.slice(2); // 881... edge case -> 1... (rare)
    }

    // Ensure it starts with 0 and is 11 digits (01XXXXXXXXX)
    if (!digits.startsWith('0') && digits.length === 10) {
        digits = `0${digits}`;
    }

    return digits;
};

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        const { orderId } = body; // ফ্রন্টএন্ড থেকে পাঠানো ID

        if (!orderId) {
            return NextResponse.json({ success: false, message: 'Order ID is missing' }, { status: 400 });
        }

        // ১. অর্ডার খোঁজা (ObjectId অথবা String ID দুইটাই চেক করবে)
        let order;
        if (Types.ObjectId.isValid(orderId)) {
            order = await OrderModel.findById(orderId);
        } else {
            order = await OrderModel.findOne({ orderId: orderId });
        }

        if (!order) {
            return NextResponse.json({ success: false, message: 'Order not found in DB' }, { status: 404 });
        }

        // ২. ডাটা ভ্যালিডেশন (কোনো ফিল্ড খালি থাকলে Steadfast 500 দিবে না)
        if (!order.shippingPhone || !order.shippingName) {
            return NextResponse.json({ success: false, message: 'Customer phone or name is missing in order record' }, { status: 400 });
        }

        // ৩. এড্রেস ক্লিনআপ (ডুপ্লিকেট রিমুভ করা)
        const rawAddress = [
            order.shippingStreetAddress,
            order.shippingCity,
            order.shippingDistrict
        ].filter(Boolean);
        const cleanAddress = Array.from(new Set(rawAddress)).join(', ') || 'Address not provided';

        // ✅ FIX: ফোন নাম্বার নরমালাইজ করা (+88 প্রিফিক্স রিমুভ -> 01XXXXXXXXX)
        const normalizedPhone = normalizeBdPhone(order.shippingPhone);

        if (!/^01\d{9}$/.test(normalizedPhone)) {
            return NextResponse.json({
                success: false,
                message: `Invalid recipient phone number: "${order.shippingPhone}" (normalized: "${normalizedPhone}"). Steadfast requires an 11-digit BD number starting with 01.`,
            }, { status: 400 });
        }

        // ৪. Steadfast API ডাটা
        const steadfastData: SteadfastOrderData = {
            invoice: order.orderId || `INV-${Date.now()}`, 
            recipient_name: order.shippingName,
            recipient_phone: normalizedPhone,
            recipient_address: cleanAddress,
            cod_amount: order.totalAmount || 0,
            note: `Order: ${order.orderId}`,
            item_description: `Order Items`,
            delivery_type: 0, // Home Delivery
        };

        // ৫. এপিআই কল
        const response = await SteadfastService.createOrder(steadfastData);

        if (response.status === 200 && response.consignment) {
            const trackCode = response.consignment.tracking_code;
            const parcelId = response.consignment.consignment_id.toString();

            // ✅ ডাটাবেজ আপডেট
            await OrderModel.findByIdAndUpdate(order._id, {
                parcelId: parcelId,
                trackingId: trackCode,
                deliveryMethodId: 'steadfast', // ✅ FIX: ensure delivery method also gets set to steadfast
                orderStatus: 'Shipped',
                updatedAt: new Date(),
            });

            // ✅ Guptodhan এর নিজস্ব ট্র্যাকিং লিঙ্কসহ SMS পাঠানো
            const smsMessage = `Dear ${order.shippingName}, your order ${order.orderId} is shipped! Tracking Code: ${trackCode}. Track here: https://www.guptodhan.com/track-order. Thank you!`;
            
            sendSMS(order.shippingPhone, smsMessage).catch(e => console.error("SMS Sync Error:", e));

            return NextResponse.json({
                success: true,
                message: 'Shipment Created Successfully!',
                data: { parcelId, trackingId: trackCode }
            });
        } else {
            // ✅ FIX: real Steadfast error message (and field-level errors) forwarded to client
            console.error('❌ Steadfast createOrder failed:', response);
            return NextResponse.json({
                success: false,
                message: response.message || 'Courier error',
                errors: response.errors,
            }, { status: 422 });
        }

    } catch (error: any) {
        console.error('❌ Final Route Error:', error.message);
        return NextResponse.json({ success: false, message: 'Internal Server Error', error: error.message }, { status: 500 });
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