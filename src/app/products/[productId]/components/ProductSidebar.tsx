'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MapPin, Info, Store, BadgeCheck, Banknote } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { fadeInUp } from './constants';
import { Product } from './types';
import { getStoreDetails } from './utils';

interface ProductSidebarProps {
  product: Product;
}

export default function ProductSidebar({ product }: ProductSidebarProps) {
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
    <div className="lg:col-span-3 space-y-3 sm:space-y-4">
      {/* Delivery Info */}
      <motion.div variants={fadeInUp} className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase mb-3 sm:mb-4 tracking-wider">Delivery Options</h3>
        <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
          <MapPin className="text-[#0099cc] shrink-0 mt-0.5" size={18} className="sm:w-5 sm:h-5" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-0">
              <span className="text-xs sm:text-sm text-gray-700 leading-tight break-words">{locationText}</span>
              <button 
                onClick={toggleLocation} 
                className="text-[#0099cc] text-[10px] sm:text-xs font-bold hover:underline sm:ml-2 self-start sm:self-auto"
              >
                CHANGE
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 my-2 sm:my-3"></div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
            <Store size={16} className="sm:w-[18px] sm:h-[18px] text-gray-400" /> <span className="hidden sm:inline">Standard Delivery</span><span className="sm:hidden">Delivery</span>
          </div>
          <span className="font-bold text-xs sm:text-sm">Tk {deliveryCharge}</span>
        </div>
        <p className="text-[10px] sm:text-xs text-gray-400 ml-6 sm:ml-7 mb-2 sm:mb-3">{deliveryTime}</p>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 ml-1">
          <div className="p-0.5 border rounded-sm border-gray-300">
            <Banknote size={12} className="sm:w-3.5 sm:h-3.5 text-gray-500"/>
          </div>
          <span className="hidden sm:inline">Cash on Delivery Available</span>
          <span className="sm:hidden">COD Available</span>
        </div>
      </motion.div>

      {/* Service Info */}
      <motion.div variants={fadeInUp} className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase mb-3 sm:mb-4 tracking-wider">Services</h3>
        <div className="flex items-start gap-2 sm:gap-3">
          <Info className="text-[#0099cc] shrink-0 mt-0.5" size={18} className="sm:w-5 sm:h-5" />
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-800">7 Days Returns</p>
            <p className="text-[10px] sm:text-xs text-gray-400 mb-2">Change of mind not applicable</p>
            <p className="text-xs sm:text-sm font-medium text-gray-800">Warranty</p>
            <p className="text-[10px] sm:text-xs text-gray-500">{product.warrantyPolicy ? 'See Description' : 'Not Available'}</p>
          </div>
        </div>
      </motion.div>

      {/* Sold By (With Blue Badge) */}
      <motion.div variants={fadeInUp} className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase mb-3 sm:mb-4 tracking-wider">Sold By</h3>
        
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          {storeDetails?._id ? (
            <Link href={`/home/visit-store/${storeDetails._id}`} className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 border border-gray-200 rounded-md flex items-center justify-center overflow-hidden relative hover:border-[#0099cc] transition-colors cursor-pointer shrink-0">
              {storeDetails?.storeLogo ? (
                <Image src={storeDetails.storeLogo} alt="Store" fill className="object-cover" sizes="(max-width: 640px) 40px, 48px"/>
              ) : (
                <Store className="text-gray-300 w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </Link>
          ) : (
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 border border-gray-200 rounded-md flex items-center justify-center overflow-hidden relative shrink-0">
              <Store className="text-gray-300 w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          )}
          <div className="flex-1 overflow-hidden min-w-0">
            {storeDetails?._id ? (
              <Link href={`/home/visit-store/${storeDetails._id}`} className="block hover:text-[#0099cc] transition-colors">
                <div className="flex items-center gap-1">
                  <h4 className="font-bold text-xs sm:text-sm text-gray-800 truncate hover:text-[#0099cc] transition-colors" title={storeDetails?.storeName}>
                    {storeDetails?.storeName || 'Unknown Store'}
                  </h4>
                  <BadgeCheck size={14} className="sm:w-4 sm:h-4 text-[#0099cc] fill-blue-50 shrink-0" />
                </div>
                <p className="text-[10px] sm:text-xs text-gray-500">Verified Seller</p>
              </Link>
            ) : (
              <>
                <div className="flex items-center gap-1">
                  <h4 className="font-bold text-xs sm:text-sm text-gray-800 truncate" title={storeDetails?.storeName}>
                    {storeDetails?.storeName || 'Unknown Store'}
                  </h4>
                  <BadgeCheck size={14} className="sm:w-4 sm:h-4 text-[#0099cc] fill-blue-50 shrink-0" />
                </div>
                <p className="text-[10px] sm:text-xs text-gray-500">Verified Seller</p>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-between border-t border-gray-100 pt-2 sm:pt-3 text-center">
          <div className="w-1/3 border-r border-gray-100">
            <p className="text-[9px] sm:text-[10px] text-gray-400">Rating</p>
            <p className="text-base sm:text-lg font-bold text-gray-700">92%</p>
          </div>
          <div className="w-1/3 border-r border-gray-100">
            <p className="text-[9px] sm:text-[10px] text-gray-400">Ship Time</p>
            <p className="text-base sm:text-lg font-bold text-gray-700">98%</p>
          </div>
          <div className="w-1/3">
            <p className="text-[9px] sm:text-[10px] text-gray-400">Response</p>
            <p className="text-base sm:text-lg font-bold text-gray-700">95%</p>
          </div>
        </div>

        <div className="mt-3 sm:mt-4">
          {storeDetails?._id ? (
            <Link href={`/home/visit-store/${storeDetails._id}`} className="block w-full">
              <Button variant="outline" className="w-full h-9 sm:h-10 border-[#0099cc] text-[#0099cc] hover:bg-blue-50 text-[10px] sm:text-xs uppercase font-bold">
                Visit Store
              </Button>
            </Link>
          ) : (
            <Button disabled variant="outline" className="w-full h-9 sm:h-10 text-[10px] sm:text-xs uppercase">Visit Store</Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

