import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Check environment variables without exposing sensitive data
    const config = {
      STEADFAST_API_KEY: process.env.STEADFAST_API_KEY ? 'Set' : 'Not set',
      STEADFAST_SECRET_KEY: process.env.STEADFAST_SECRET_KEY ? 'Set' : 'Not set',
      STEADFAST_API_URL: 'https://api.steadfast.com/create-shipment',
      NODE_ENV: process.env.NODE_ENV,
    };

    console.log('🔧 Steadfast configuration check:', config);

    return NextResponse.json({
      success: true,
      message: 'Steadfast configuration retrieved',
      config,
    });

  } catch (error: any) {
    console.error('❌ Configuration check error:', error);

    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve configuration',
      error: error.message,
    });
  }
}
