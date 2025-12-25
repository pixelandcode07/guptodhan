'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MapPin, Info, Store, BadgeCheck, Banknote, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { fadeInUp } from './constants';
import { Product } from './types';
import { getStoreDetails } from './utils';

export default function ProductSidebar({ product }: { product: Product }) {
  const [locationType, setLocationType] = useState<'dhaka' | 'outside'>('dhaka');
  const storeDetails = getStoreDetails(product);

  const deliveryCharge = locationType === 'dhaka' ? 70 : 130;
  const deliveryTime = locationType === 'dhaka' ? '1 - 4 day(s)' : '4 - 7 day(s)';
  const locationText = locationType === 'dhaka' 
    ? 'Dhaka, Dhaka North, Banani Road No. 12 - 19' 
    : 'Outside Dhaka, Sadar, Chattogram';

  const toggleLocation = () => {
    setLocationType(prev => prev === 'dhaka' ? 'outside' : 'dhaka');
    toast.success(`Location changed to ${locationType === 'dhaka' ? 'Outside Dhaka' : 'Inside Dhaka'}`);
  };

  return (
    <div className="lg:col-span-3 space-y-4">
      {/* 1. Delivery Options */}
      <motion.div variants={fadeInUp} className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">Delivery Options</h3>
          <button 
            onClick={toggleLocation} 
            className="text-[#0099cc] text-[10px] sm:text-xs font-bold hover:underline uppercase"
          >
            Change
          </button>
        </div>

        <div className="flex items-start gap-3 mb-4">
          <MapPin className="text-gray-400 shrink-0 mt-0.5" size={18} />
          <div className="flex-1 min-w-0">
            <span className="text-xs sm:text-sm text-gray-700 leading-tight block">
              {locationText}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-50 pt-3 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-600">
              <Truck size={18} className="text-gray-400" />
              <span>Standard Delivery</span>
            </div>
            <span className="font-bold text-xs sm:text-sm text-gray-900">Tk {deliveryCharge}</span>
          </div>
          <p className="text-[10px] sm:text-xs text-gray-400 ml-7">{deliveryTime}</p>
          
          <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-600">
            <Banknote size={18} className="text-gray-400" />
            <span>Cash on Delivery Available</span>
          </div>
        </div>
      </motion.div>

      {/* 2. Service Info */}
      <motion.div variants={fadeInUp} className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-100 space-y-4">
        <h3 className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">Services</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <RotateCcw className="text-[#0099cc] shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-800">7 Days Returns</p>
              <p className="text-[10px] sm:text-xs text-gray-400">Change of mind not applicable</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="text-[#0099cc] shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-800">Warranty</p>
              <p className="text-[10px] sm:text-xs text-gray-500">
                {product.warrantyPolicy ? 'Manufacturer Warranty' : 'Not Available'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. Sold By (Restored Design) */}
      <motion.div variants={fadeInUp} className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">Sold By</h3>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 border border-gray-200 rounded-md flex items-center justify-center overflow-hidden relative shrink-0">
            {storeDetails?.storeLogo ? (
              <Image 
                src={storeDetails.storeLogo} 
                alt="Store" 
                fill 
                className="object-cover" 
                sizes="48px"
              />
            ) : (
              <Store className="text-gray-300 w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <h4 className="font-bold text-xs sm:text-sm text-gray-800 truncate" title={storeDetails?.storeName}>
                {storeDetails?.storeName || 'Unknown Store'}
              </h4>
              <BadgeCheck size={16} className="text-[#0099cc] fill-blue-50 shrink-0" />
            </div>
            <p className="text-[10px] sm:text-xs text-gray-500">Verified Seller</p>
          </div>
        </div>

        {/* Stats Grid with Borders */}
        <div className="flex justify-between border-t border-gray-100 pt-3 text-center">
          <div className="w-1/3 border-r border-gray-100">
            <p className="text-[9px] sm:text-[10px] text-gray-400 mb-0.5">Rating</p>
            <p className="text-sm sm:text-base font-bold text-gray-700">92%</p>
          </div>
          <div className="w-1/3 border-r border-gray-100">
            <p className="text-[9px] sm:text-[10px] text-gray-400 mb-0.5">Ship Time</p>
            <p className="text-sm sm:text-base font-bold text-gray-700">98%</p>
          </div>
          <div className="w-1/3">
            <p className="text-[9px] sm:text-[10px] text-gray-400 mb-0.5">Response</p>
            <p className="text-sm sm:text-base font-bold text-gray-700">95%</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4">
          <Link href={`/home/visit-store/${storeDetails?._id}`} className="block w-full">
            <Button 
              variant="outline" 
              className="w-full h-9 sm:h-10 border-[#0099cc] text-[#0099cc] hover:bg-blue-50 hover:text-[#0099cc] text-[10px] sm:text-xs uppercase font-bold transition-colors"
              disabled={!storeDetails?._id}
            >
              Visit Store
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}