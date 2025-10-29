import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  try {
    // Check if environment variables are set
    const hasApiKey = !!process.env.STEADFAST_API_KEY;
    const hasSecretKey = !!process.env.STEADFAST_SECRET_KEY;

    console.log('🔍 Environment variables check:');
    console.log('STEADFAST_API_KEY:', hasApiKey ? 'Set' : 'Not set');
    console.log('STEADFAST_SECRET_KEY:', hasSecretKey ? 'Set' : 'Not set');

    if (!hasApiKey || !hasSecretKey) {
      return NextResponse.json({
        success: false,
        message: 'Missing environment variables',
        details: {
          STEADFAST_API_KEY: hasApiKey ? 'Set' : 'Missing',
          STEADFAST_SECRET_KEY: hasSecretKey ? 'Set' : 'Missing',
        },
      });
    }

    // Test Steadfast API connection with a simple request
    const testPayload = {
      api_key: process.env.STEADFAST_API_KEY,
      secret_key: process.env.STEADFAST_SECRET_KEY,
    };

    console.log('🧪 Testing Steadfast API connection...');

    // Try to make a test request (this might be a different endpoint for testing)
    const response = await axios.post('https://api.steadfast.com/test-connection', testPayload, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout for test
    });

    return NextResponse.json({
      success: true,
      message: 'Steadfast API connection successful',
      data: response.data,
    });

  } catch (error: any) {
    console.error('❌ Steadfast API test error:', error);

    // Return detailed error information
    return NextResponse.json({
      success: false,
      message: 'Steadfast API test failed',
      error: {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
      },
    });
  }
}

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { error: 'Use GET method to test Steadfast API connection' },
    { status: 405 }
  );
}
