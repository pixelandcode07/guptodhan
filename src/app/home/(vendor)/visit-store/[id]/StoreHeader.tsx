import Image from 'next/image';
import Link from 'next/link';
import { BadgeCheck, ChevronRight } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

type Store = {
  storeLogo: string;
  storeBanner: string;
  storeName: string;
  followers: number;
  positiveRating: number;
};

// ✅ Blue verified badge — Facebook style (একদম পারফেক্ট সাইজ ও কালার)
function VerifiedBadge() {
  return (
    <BadgeCheck 
      className="w-5 h-5 text-white fill-[#0097E9] shrink-0" 
      aria-label="Verified Store" 
    />
  );
}

export default function StoreHeader({ store }: { store: Store }) {
  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-4">
        <Breadcrumb>
          <BreadcrumbList className="text-sm">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="hover:text-[#0097E9] transition-colors">
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="w-4 h-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/home/vendor-shops" className="hover:text-[#0097E9] transition-colors">
                  Vendor Stores
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="w-4 h-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-gray-700">
                {store.storeName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Banner */}
      <div className="relative w-full h-[220px] overflow-hidden rounded-xl bg-gray-200">
        <Image
          src={store.storeBanner}
          alt={store.storeName}
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Store Info — below banner */}
      <div className="relative flex items-end gap-4 px-4 -mt-10 pb-4 border-b border-gray-100">
        {/* Store Logo */}
        <div className="relative w-24 h-24 rounded-full bg-white overflow-hidden border-4 border-white shadow-md flex-shrink-0">
          <Image
            src={store.storeLogo}
            alt={store.storeName}
            fill
            className="object-cover"
          />
        </div>

        {/* Store Name & Meta */}
        <div className="pb-1">
          {/* Name + Badge */}
          <div className="flex items-center gap-1.5 mt-8">
            <h1 className="text-xl font-bold text-[#00005E] leading-tight">
              {store.storeName}
            </h1>
            {/* ✅ Verified Badge called here */}
            <VerifiedBadge />
          </div>

          {/* Rating */}
          {store.positiveRating > 0 && (
            <p className="text-sm text-muted-foreground mt-0.5">
              <span className="text-[#0097E9] font-semibold">
                {store.positiveRating}%
              </span>{' '}
              Positive seller ratings
            </p>
          )}
        </div>
      </div>
    </>
  );
}