'use client';

import { MapPin, User, Edit2, CheckCircle2, Phone } from 'lucide-react';

interface ShippingAddressCardProps {
  name: string;
  phone: string;
  email?: string;
  address: string;
  district?: string;
  upazila?: string;
  city?: string;
  postalCode?: string;
  onEdit: () => void;
}

export default function ShippingAddressCard({
  name,
  phone,
  email,
  address,
  district,
  upazila,
  city,
  postalCode,
  onEdit,
}: ShippingAddressCardProps) {
  // Build full address string (skip empty parts)
  const addressParts = [address, upazila, district, city, postalCode]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
          <h2 className="text-sm font-semibold text-gray-800">Shipping & Billing</h2>
        </div>
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 text-xs font-bold text-[#0097E9] hover:text-[#00005E] tracking-wide transition-colors"
        >
          <Edit2 className="w-3 h-3" />
          EDIT
        </button>
      </div>

      {/* Address Content */}
      <div className="px-5 py-4 space-y-3">
        {/* Name + Phone */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-sm font-semibold text-gray-800">{name || '—'}</span>
          </div>
          {phone && (
            <>
              <span className="text-gray-200 select-none">|</span>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-600">{phone}</span>
              </div>
            </>
          )}
        </div>

        {/* Address */}
        {addressParts ? (
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="flex items-start gap-2 flex-wrap">
              <span className="inline-flex items-center bg-[#00005E] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wide flex-shrink-0">
                HOME
              </span>
              <span className="text-sm text-gray-600 leading-relaxed">{addressParts}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-orange-500">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span>No address saved — please click EDIT to add your address</span>
          </div>
        )}
      </div>

      {/* Bottom hint — like Daraz collection point */}
      <div className="mx-5 mb-4 border border-dashed border-[#0097E9]/40 rounded-lg px-4 py-2.5 flex items-center justify-between bg-blue-50/40">
        <span className="text-xs text-[#0097E9]">
          Need to ship to a different address?
        </span>
        <button
          onClick={onEdit}
          className="text-xs font-semibold text-[#00005E] flex items-center gap-1 hover:underline"
        >
          Change &rsaquo;
        </button>
      </div>
    </div>
  );
}