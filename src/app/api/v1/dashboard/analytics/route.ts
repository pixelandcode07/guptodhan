import { NextRequest, NextResponse } from 'next/server';
import { DashboardServices } from '@/lib/modules/dashboard/dashboard.service';
import dbConnect from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const data = await DashboardServices.getDashboardAnalyticsFromDB();

    return NextResponse.json(
      {
        success: true,
        message: 'Dashboard data retrieved successfully',
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Dashboard API Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch dashboard data',
      },
      { status: 500 }
    );
  }
}