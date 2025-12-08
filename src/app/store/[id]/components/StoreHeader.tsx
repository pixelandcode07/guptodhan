'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Mail, Store } from 'lucide-react';
import { StoreData } from './types';

interface StoreHeaderProps {
  storeData: StoreData;
}

export default function StoreHeader({ storeData }: StoreHeaderProps) {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Banner */}
      <div className="relative w-full aspect-[16/6] sm:aspect-[16/5] md:aspect-[16/4] bg-gradient-to-r from-blue-500 to-blue-600">
        {storeData.storeBanner ? (
          <Image
            src={storeData.storeBanner}
            alt={`${storeData.storeName} banner`}
            fill
            className="object-contain sm:object-cover"
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1200px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Store className="w-12 h-12 sm:w-16 sm:h-16 text-white opacity-50" />
          </div>
        )}
      </div>

      {/* Store Info */}
      <div className="p-3 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          {/* Logo */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-white rounded-lg border-2 sm:border-4 border-white shadow-lg -mt-8 sm:-mt-12 md:-mt-16 shrink-0">
            {storeData.storeLogo ? (
              <Image
                src={storeData.storeLogo}
                alt={storeData.storeName}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 128px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                <Store className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-400" />
              </div>
            )}
          </div>

          {/* Store Details */}
          <div className="flex-1 mt-2 sm:mt-0 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 wrap-break-word">
                {storeData.storeName}
              </h1>
              <Badge 
                variant={storeData.status === 'active' ? 'default' : 'secondary'}
                className={`${storeData.status === 'active' ? 'bg-green-100 text-green-800' : ''} text-xs sm:text-sm w-fit`}
              >
                {storeData.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            
            {storeData.vendorShortDescription && (
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-none">
                {storeData.vendorShortDescription}
              </p>
            )}

            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
              {storeData.storeAddress && (
                <div className="flex items-start sm:items-center gap-2">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-[#0099cc] mt-0.5 sm:mt-0 shrink-0" />
                  <span className="wrap-break-word">{storeData.storeAddress}</span>
                </div>
              )}
              {storeData.storePhone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-[#0099cc] shrink-0" />
                  <a href={`tel:${storeData.storePhone}`} className="hover:text-[#0099cc] break-all">
                    {storeData.storePhone}
                  </a>
                </div>
              )}
              {storeData.storeEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-[#0099cc] shrink-0" />
                  <a href={`mailto:${storeData.storeEmail}`} className="hover:text-[#0099cc] break-all text-xs sm:text-sm">
                    {storeData.storeEmail}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

