'use client';

import React, { useState, FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios'; // Using axios for simplicity
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function PaymentTestPage() {
  const { data: session, status } = useSession();
  const token = (session as any)?.accessToken; // Get token from session

  const [orderId, setOrderId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);

  // Step 1: Create an order
  const handleCreateOrder = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return toast.error('You must be logged in to create an order.');
    setIsLoading(true);
    setApiResponse(null);

    const form = e.currentTarget;
    const payload = {
      shippingAddress: (form.elements.namedItem('shippingAddress') as HTMLInputElement).value,
      contactPhone: (form.elements.namedItem('contactPhone') as HTMLInputElement).value,
      paymentMethod: 'online', // Fixed for online payment
      items: [{
        productId: (form.elements.namedItem('productId') as HTMLInputElement).value,
        quantity: 1,
      }],
    };

    try {
      const res = await axios.post('/api/v1/orders', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApiResponse(res.data);
      setOrderId(res.data.data._id);
      toast.success("Order created successfully! Now proceed to payment.");
    } catch (error: any) {
      setApiResponse(error.response?.data || { message: error.message });
      toast.error(error.response?.data?.message || "Failed to create order.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Initiate the payment
  const handleInitPayment = async () => {
    if (!token) return toast.error('You must be logged in.');
    if (!orderId) return toast.error('Please create an order first.');
    setIsLoading(true);
    setApiResponse(null);

    try {
      const res = await axios.post('/api/v1/payment/init', { orderId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApiResponse(res.data);
      if (res.data.data.url) {
        // Redirect to SSLCommerz payment page
        window.location.href = res.data.data.url;
      }
    } catch (error: any) {
      setApiResponse(error.response?.data || { message: error.message });
      toast.error(error.response?.data?.message || "Failed to initiate payment.");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (status === 'loading') {
    return <div className="flex h-screen items-center justify-center">Loading session...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
            <h1 className="text-3xl font-bold">SSLCommerz Payment Test</h1>
            <p className="text-gray-500 mt-2">Follow the steps below to test the payment flow.</p>
        </div>

        {/* Step 1: Create Order */}
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Create an Online Order</CardTitle>
            <CardDescription>First, create an order with a valid Product ID.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div><Label htmlFor="productId">Product ID</Label><Input id="productId" name="productId" placeholder="Enter a valid product ID from your DB" required /></div>
              <div><Label htmlFor="shippingAddress">Shipping Address</Label><Input id="shippingAddress" name="shippingAddress" defaultValue="Dhaka, Bangladesh" required /></div>
              <div><Label htmlFor="contactPhone">Contact Phone</Label><Input id="contactPhone" name="contactPhone" defaultValue="01700000000" required /></div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="animate-spin mr-2" />}
                Create Order
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Step 2: Initiate Payment */}
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Initiate Payment</CardTitle>
            <CardDescription>Click below to proceed to payment with the created Order ID.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <div>
                  <Label htmlFor="orderId">Order ID (auto-filled)</Label>
                  <Input id="orderId" value={orderId} placeholder="Order ID will appear here after creation" readOnly />
              </div>
              <Button onClick={handleInitPayment} disabled={isLoading || !orderId} className="w-full">
                {isLoading && <Loader2 className="animate-spin mr-2" />}
                Proceed to Payment
              </Button>
          </CardContent>
        </Card>

        {/* API Response */}
        <Card>
          <CardHeader><CardTitle>API Response</CardTitle></CardHeader>
          <CardContent>
            <pre className="p-4 rounded-lg bg-gray-800 text-white text-sm whitespace-pre-wrap min-h-[150px]">
              {isLoading ? 'Loading...' : JSON.stringify(apiResponse, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}