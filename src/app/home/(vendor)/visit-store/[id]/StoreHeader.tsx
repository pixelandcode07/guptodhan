import Image from 'next/image';
import Link from 'next/link';
import { BadgeCheck, ChevronRight, MapPin, Phone, Mail, Users, Star } from 'lucide-react';
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
  followers?: number;
  positiveRating?: number;
  storeAddress?: string;
  phone?: string;
  email?: string;
  vendorShortDescription?: string;
};

// ✅ Facebook-style verified badge
function VerifiedBadge() {
  return (
    <BadgeCheck
      className="w-5 h-5 text-white fill-[#0097E9] shrink-0"
      aria-label="Verified Store"
    />
  );
}

// ✅ Small info pill
function InfoPill({
  icon: Icon,
  text,
}: {
  icon: React.ElementType;
  text: string;
}) {
  return (
    <div className="flex items-center gap-1.5 text-sm text-gray-500">
      <Icon className="w-3.5 h-3.5 text-[#0097E9] shrink-0" />
      <span className="truncate max-w-[200px] md:max-w-none">{text}</span>
    </div>
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

      {/* Store Info Card — sits below banner */}
      <div className="bg-white rounded-b-xl border border-t-0 border-gray-100 shadow-sm px-4 pb-5">

        {/* Logo + Name Row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">

          {/* Left: Logo + Name + Badge */}
          <div className="flex items-end gap-4">
            {/* Logo — overlaps banner */}
            <div className="relative w-24 h-24 rounded-full bg-white overflow-hidden border-4 border-white shadow-md flex-shrink-0 -mt-10">
              <Image
                src={store.storeLogo}
                alt={store.storeName}
                fill
                className="object-cover"
              />
            </div>

            {/* Name + badge + rating */}
            <div className="pb-1 pt-2">
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl font-bold text-[#00005E] leading-tight">
                  {store.storeName}
                </h1>
                <VerifiedBadge />
              </div>

              {/* Positive rating */}
              {(store.positiveRating ?? 0) > 0 && (
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm text-gray-500">
                    <span className="text-[#0097E9] font-semibold">
                      {store.positiveRating}%
                    </span>{' '}
                    Positive ratings
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Followers badge */}
          {(store.followers ?? 0) > 0 && (
            <div className="flex items-center gap-2 self-end pb-1 sm:pb-2">
              <div className="flex items-center gap-1.5 bg-[#0097E9]/8 text-[#0097E9] px-3 py-1.5 rounded-full text-sm font-medium border border-[#0097E9]/20">
                <Users className="w-3.5 h-3.5" />
                <span>{store.followers?.toLocaleString()} Followers</span>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 mt-4 mb-3" />

        {/* Info Pills Row */}
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {store.storeAddress && (
            <InfoPill icon={MapPin} text={store.storeAddress} />
          )}
          {store.phone && (
            <InfoPill icon={Phone} text={store.phone} />
          )}
          {store.email && (
            <InfoPill icon={Mail} text={store.email} />
          )}

          {/* Fallback if all fields empty */}
          {!store.storeAddress && !store.phone && !store.email && (
            <p className="text-sm text-gray-400 italic">
              No contact information available.
            </p>
          )}
        </div>

        {/* Short description — optional */}
        {store.vendorShortDescription && (
          <p className="mt-3 text-sm text-gray-500 leading-relaxed line-clamp-2">
            {store.vendorShortDescription}
          </p>
        )}
      </div>
    </>
  );
}