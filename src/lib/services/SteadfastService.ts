// src/lib/services/SteadfastService.ts
import axios from 'axios';

export interface SteadfastOrderData {
    invoice: string;
    recipient_name: string;
    recipient_phone: string;
    alternative_phone?: string;
    recipient_email?: string;
    recipient_address: string;
    cod_amount: number;
    note?: string;
    item_description?: string;
    total_lot?: number;
    delivery_type?: number;
}

export interface SteadfastResponse {
    status: number;
    message: string;
    errors?: Record<string, string[]>;
    consignment?: {
        consignment_id: number;
        invoice: string;
        tracking_code: string;
        recipient_name: string;
        recipient_phone: string;
        recipient_address: string;
        cod_amount: number;
        status: string;
        note?: string;
        created_at: string;
        updated_at: string;
    };
}

export interface SteadfastTrackingResponse {
    status: number;
    delivery_status: string;
}

export class SteadfastService { // <-- Named export remains
    private static readonly BASE_URL = 'https://portal.packzy.com/api/v1';
    private static readonly API_KEY = process.env.STEADFAST_API_KEY;
    private static readonly SECRET_KEY = process.env.STEADFAST_SECRET_KEY;

    static async createOrder(orderData: SteadfastOrderData): Promise<SteadfastResponse> {
        try {
            if (!this.API_KEY || !this.SECRET_KEY) {
                throw new Error('Steadfast API credentials not configured');
            }

            const payload = {
                invoice: orderData.invoice,
                recipient_name: orderData.recipient_name,
                recipient_phone: orderData.recipient_phone,
                alternative_phone: orderData.alternative_phone,
                recipient_email: orderData.recipient_email,
                recipient_address: orderData.recipient_address,
                cod_amount: orderData.cod_amount,
                note: orderData.note,
                item_description: orderData.item_description,
                total_lot: orderData.total_lot,
                delivery_type: orderData.delivery_type || 0,
            };

            console.log('🚀 Creating Steadfast order:', payload);

            const response = await axios.post(`${this.BASE_URL}/create_order`, payload, {
                headers: {
                    'Api-Key': this.API_KEY,
                    'Secret-Key': this.SECRET_KEY,
                    'Content-Type': 'application/json',
                },
                timeout: 30000,
            });

            console.log('✅ Steadfast API response:', response.data);

            return response.data;

        } catch (error: unknown) {
            // ✅ FIX: Surface the REAL error from Steadfast instead of a generic 500.
            // Steadfast returns 4xx/422 with a `message` and sometimes an `errors`
            // object describing exactly which field failed validation
            // (e.g. recipient_phone format, recipient_address too short, etc).
            if (axios.isAxiosError(error)) {
                console.error('❌ Steadfast API error status:', error.response?.status);
                console.error('❌ Steadfast API error data:', JSON.stringify(error.response?.data, null, 2));

                const data = error.response?.data;

                return {
                    status: error.response?.status || 500,
                    message:
                        data?.message ||
                        (data?.errors ? JSON.stringify(data.errors) : 'Failed to create Steadfast order'),
                    errors: data?.errors,
                };
            }

            console.error('❌ Steadfast API unknown error:', error);

            return {
                status: 500,
                message: error instanceof Error ? error.message : 'Failed to create Steadfast order',
            };
        }
    }

    static async trackByTrackingCode(trackingCode: string): Promise<SteadfastTrackingResponse> {
        try {
            if (!this.API_KEY || !this.SECRET_KEY) {
                throw new Error('Steadfast API credentials not configured');
            }

            const response = await axios.get(`${this.BASE_URL}/status_by_trackingcode/${trackingCode}`, {
                headers: {
                    'Api-Key': this.API_KEY,
                    'Secret-Key': this.SECRET_KEY,
                    'Content-Type': 'application/json',
                },
                timeout: 10000,
            });

            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error('❌ Steadfast tracking error status:', error.response?.status);
                console.error('❌ Steadfast tracking error data:', JSON.stringify(error.response?.data, null, 2));
            } else {
                console.error('❌ Steadfast tracking error:', error);
            }
            return {
                status: 500,
                delivery_status: 'unknown',
            };
        }
    }
}