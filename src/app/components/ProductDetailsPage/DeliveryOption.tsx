'use client';

import Image from 'next/image';
import { MapPin, Info, Truck, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const deliveryData = {
  deliveryArea: 'All over the Bangladesh.',
  location: 'Dhaka Dhaka City North',
  deliveryTime: '1-7 working days',
  shippingCharge: 70,
  freeShipping: 10000,
  cashOnDelivery: true,
  seller: {
    name: 'BD FASHION HOUSE',
    verified: true,
    logo: '/images/seller-logo.png', // dummy logo image path
  },
  stats: {
    shipOnTime: '100%',
    chatResponse: '90%',
    shopRating: '99.8%',
  },
};

export default function DeliveryOption() {
  return (
    <div className="border rounded-lg p-4  bg-white shadow-sm space-y-4">
      {/* Delivery Area */}
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <MapPin className="w-5 h-5 text-blue-600 mt-1" />
          <p className="text-sm">
            <span className="font-medium">Available Delivery Area:</span>{' '}
            {deliveryData.deliveryArea}
          </p>
        </div>

        <div className="flex items-start gap-2">
          <Home className="w-5 h-5 text-blue-600 mt-1" />
          <p className="text-sm flex-1">
            {deliveryData.location}{' '}
            <span className="text-blue-600 cursor-pointer underline ml-1">
              Change
            </span>
          </p>
        </div>

        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-600 mt-1" />
          <div className="text-sm">
            <p>
              <span className="font-medium">Delivery Time:</span>{' '}
              {deliveryData.deliveryTime}
            </p>
            <p>
              <span className="font-medium">Shipping Charge:</span> ৳{' '}
              {deliveryData.shippingCharge}
            </p>
            <p>
              Free Shipping Over Order Amount: ৳ {deliveryData.freeShipping}
            </p>
          </div>
        </div>

        {deliveryData.cashOnDelivery && (
          <div className="flex items-start gap-2">
            <Truck className="w-5 h-5 text-blue-600 mt-1" />
            <p className="text-sm">Cash on Delivery Available</p>
          </div>
        )}
      </div>

      {/* Seller Info */}
      <div className="border-t pt-4">
        <div className="flex items-center gap-2">
          <Image
            src={deliveryData.seller.logo}
            alt={deliveryData.seller.name}
            width={40}
            height={40}
            className="rounded-full max-w-[40px] max-h-[40px] border"
          />
          <p className="text-sm font-medium flex items-center gap-1">
            {deliveryData.seller.name}
            {deliveryData.seller.verified && (
              <span className="text-blue-600">✔️</span>
            )}
          </p>
        </div>

        <Button
          variant="outline"
          className="w-full mt-3 border-blue-600 text-blue-600">
          View Shop
        </Button>
      </div>

      {/* Seller Stats */}
      <div className="grid grid-cols-3 text-center border-t pt-3 text-sm">
        <div>
          <p className="font-medium text-2xl">
            {deliveryData.stats.shipOnTime}
          </p>
          <p className="text-gray-500 text-xs">Ship on Time</p>
        </div>
        <div>
          <p className="font-medium text-2xl">
            {deliveryData.stats.chatResponse}
          </p>
          <p className="text-gray-500 text-xs">Chat Response</p>
        </div>
        <div>
          <p className="font-medium text-2xl">
            {deliveryData.stats.shopRating}
          </p>
          <p className="text-gray-500 text-xs">Shop Rating</p>
        </div>
      </div>
    </div>
  );
}
