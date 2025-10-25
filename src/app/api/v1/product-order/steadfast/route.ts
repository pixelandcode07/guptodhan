import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const orderDetails = await req.json();

    // Validate required environment variables
    if (!process.env.STEADFAST_API_KEY) {
      return NextResponse.json(
        { error: 'STEADFAST_API_KEY environment variable is not set' },
        { status: 500 }
      );
    }

    if (!process.env.STEADFAST_SECRET_KEY) {
      return NextResponse.json(
        { error: 'STEADFAST_SECRET_KEY environment variable is not set' },
        { status: 500 }
      );
    }

    // Prepare Steadfast API payload
    const steadfastPayload = {
      api_key: process.env.STEADFAST_API_KEY,
      secret_key: process.env.STEADFAST_SECRET_KEY,
      ...orderDetails,
    };

    console.log('🚀 Creating Steadfast shipment with payload:', steadfastPayload);

    // Call Steadfast API
    const response = await axios.post('https://api.steadfast.com/create-shipment', steadfastPayload, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 second timeout
    });

    console.log('✅ Steadfast API response:', response.data);

    return NextResponse.json({
      success: true,
      message: 'Shipment created successfully',
      data: response.data,
    });

  } catch (error: any) {
    console.error('❌ Steadfast API error:', error);

    // Handle different types of errors
    if (error.response) {
      // Steadfast API returned an error response
      return NextResponse.json(
        {
          success: false,
          message: 'Steadfast API error',
          error: error.response.data,
          status: error.response.status,
        },
        { status: error.response.status }
      );
    } else if (error.request) {
      // Network error - no response received
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to connect to Steadfast API',
          error: 'Network error - no response received',
        },
        { status: 500 }
      );
    } else {
      // Other error
      return NextResponse.json(
        {
          success: false,
          message: 'Internal server error',
          error: error.message,
        },
        { status: 500 }
      );
    }
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
