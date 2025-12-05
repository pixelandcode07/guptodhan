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
    <div className="lg:col-span-3 space-y-4">
      {/* Delivery Info */}
      <motion.div variants={fadeInUp} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">Delivery Options</h3>
        <div className="flex items-start gap-3 mb-4">
          <MapPin className="text-[#0099cc] shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-700 leading-tight">{locationText}</span>
              <button 
                onClick={toggleLocation} 
                className="text-[#0099cc] text-xs font-bold hover:underline ml-2"
              >
                CHANGE
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 my-3"></div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Store size={18} className="text-gray-400" /> Standard Delivery
          </div>
          <span className="font-bold text-sm">Tk {deliveryCharge}</span>
        </div>
        <p className="text-xs text-gray-400 ml-7 mb-3">{deliveryTime}</p>
        <div className="flex items-center gap-2 text-sm text-gray-700 ml-1">
          <div className="p-0.5 border rounded-sm border-gray-300">
            <Banknote size={14} className="text-gray-500"/>
          </div>
          Cash on Delivery Available
        </div>
      </motion.div>

      {/* Service Info */}
      <motion.div variants={fadeInUp} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">Services</h3>
        <div className="flex items-start gap-3">
          <Info className="text-[#0099cc] shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-medium text-gray-800">7 Days Returns</p>
            <p className="text-xs text-gray-400 mb-2">Change of mind not applicable</p>
            <p className="text-sm font-medium text-gray-800">Warranty</p>
            <p className="text-xs text-gray-500">{product.warrantyPolicy ? 'See Description' : 'Not Available'}</p>
          </div>
        </div>
      </motion.div>

      {/* Sold By (With Blue Badge) */}
      <motion.div variants={fadeInUp} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">Sold By</h3>
        
        <div className="flex items-center gap-3 mb-4">
          {storeDetails?._id ? (
            <Link href={`/store/${storeDetails._id}`} className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-md flex items-center justify-center overflow-hidden relative hover:border-[#0099cc] transition-colors cursor-pointer">
              {storeDetails?.storeLogo ? (
                <Image src={storeDetails.storeLogo} alt="Store" fill className="object-cover"/>
              ) : (
                <Store className="text-gray-300" />
              )}
            </Link>
          ) : (
            <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-md flex items-center justify-center overflow-hidden relative">
              <Store className="text-gray-300" />
            </div>
          )}
          <div className="flex-1 overflow-hidden">
            {storeDetails?._id ? (
              <Link href={`/store/${storeDetails._id}`} className="block hover:text-[#0099cc] transition-colors">
                <div className="flex items-center gap-1">
                  <h4 className="font-bold text-gray-800 truncate hover:text-[#0099cc] transition-colors" title={storeDetails?.storeName}>
                    {storeDetails?.storeName || 'Unknown Store'}
                  </h4>
                  <BadgeCheck size={16} className="text-[#0099cc] fill-blue-50" />
                </div>
                <p className="text-xs text-gray-500">Verified Seller</p>
              </Link>
            ) : (
              <>
                <div className="flex items-center gap-1">
                  <h4 className="font-bold text-gray-800 truncate" title={storeDetails?.storeName}>
                    {storeDetails?.storeName || 'Unknown Store'}
                  </h4>
                  <BadgeCheck size={16} className="text-[#0099cc] fill-blue-50" />
                </div>
                <p className="text-xs text-gray-500">Verified Seller</p>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-between border-t border-gray-100 pt-3 text-center">
          <div className="w-1/3 border-r border-gray-100">
            <p className="text-[10px] text-gray-400">Rating</p>
            <p className="text-lg font-bold text-gray-700">92%</p>
          </div>
          <div className="w-1/3 border-r border-gray-100">
            <p className="text-[10px] text-gray-400">Ship Time</p>
            <p className="text-lg font-bold text-gray-700">98%</p>
          </div>
          <div className="w-1/3">
            <p className="text-[10px] text-gray-400">Response</p>
            <p className="text-lg font-bold text-gray-700">95%</p>
          </div>
        </div>

        <div className="mt-4">
          {storeDetails?._id ? (
            <Link href={`/store/${storeDetails._id}`} className="block w-full">
              <Button variant="outline" className="w-full border-[#0099cc] text-[#0099cc] hover:bg-blue-50 text-xs uppercase font-bold">
                Visit Store
              </Button>
            </Link>
          ) : (
            <Button disabled variant="outline" className="w-full text-xs uppercase">Visit Store</Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

