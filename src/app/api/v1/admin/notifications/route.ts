import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Notification } from '@/lib/modules/notification/notification.model';
import { verifyToken } from '@/lib/utils/jwt';

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    // এখানে চাইলে আপনি অ্যাডমিন টোকেন ভেরিফাই করতে পারেন
    const unreadNotifications = await Notification.find({ isRead: false }).sort({ createdAt: -1 }).limit(20);
    return NextResponse.json({ success: true, data: unreadNotifications });
  } catch (error) {
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
    return NextResponse.json({ success: false, message: 'Failed to update' });
  }
}