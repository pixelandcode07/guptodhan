'use client';

import { MapPin, User, Edit2, CheckCircle2, Phone, Building2 } from 'lucide-react';
import { AddressJSON, formatAddressLine } from './addressHelpers';

interface ShippingAddressCardProps {
  name: string;
  phone: string;
  email?: string;
  address: AddressJSON;
  onEdit: () => void;
}

export default function ShippingAddressCard({
  name,
  phone,
  address,
  onEdit,
}: ShippingAddressCardProps) {
  const addressLine = formatAddressLine(address);
  const hasAddress = !!addressLine;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
          <h2 className="text-sm font-semibold text-gray-800">Shipping & Billing</h2>
        </div>
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 text-xs font-bold text-[#0097E9] hover:text-[#00005E] tracking-wide transition-colors px-2 py-1 rounded hover:bg-blue-50"
        >
          <Edit2 className="w-3 h-3" />
          EDIT
        </button>
      </div>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div className="px-5 py-4 space-y-3">

        {/* Name + Phone row */}
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

        {/* Address row */}
        {hasAddress ? (
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="flex items-start gap-2 flex-wrap">
              <span className="inline-flex items-center bg-[#00005E] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wide flex-shrink-0">
                HOME
              </span>
              <span className="text-sm text-gray-600 leading-relaxed">{addressLine}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-orange-500">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span>No address saved — click EDIT to add your address</span>
          </div>
        )}

        {/* District / Upazila chips */}
        {(address.district || address.upazila) && (
          <div className="flex items-center gap-2 flex-wrap pt-0.5">
            {address.district && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                <Building2 className="w-3 h-3" />
                {address.district}
              </span>
            )}
            {address.upazila && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                {address.upazila}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Footer hint ──────────────────────────────────────────── */}
      <div className="mx-5 mb-4 border border-dashed border-[#0097E9]/40 rounded-lg px-4 py-2.5 flex items-center justify-between bg-blue-50/40">
        <span className="text-xs text-[#0097E9]">Need to ship to a different address?</span>
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