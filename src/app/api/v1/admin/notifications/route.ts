import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Notification } from '@/lib/modules/adminNotification/notification/notification.model'; // ✅ পাথ ঠিক করা হয়েছে

// ✅ MAGIC FIX: Next.js যেন এই API টাকে ক্যাশ করে না রাখে, প্রতিবার যেন ফ্রেশ ডাটা দেয়
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const unreadNotifications = await Notification.find({ isRead: false })
      .sort({ createdAt: -1 })
      .limit(20);
      
    return NextResponse.json({ success: true, data: unreadNotifications });
  } catch (error) {
    console.error("Fetch Notification Error:", error);
    return NextResponse.json({ success: false, message: 'Failed to fetch notifications' });
  }
}

export async function PATCH(req: NextRequest) {
  await dbConnect();
  try {
    const { id } = await req.json();
    if (id === 'all') {
      await Notification.updateMany({ isRead: false }, { isRead: true });
    } else {
      await Notification.findByIdAndUpdate(id, { isRead: true });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update Notification Error:", error);
    return NextResponse.json({ success: false, message: 'Failed to update' });
  }
}