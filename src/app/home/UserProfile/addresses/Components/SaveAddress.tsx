'use client';

import { Button } from '@/components/ui/button';

type Address = {
  id: number;
  fullName: string;
  addressType: 'HOME' | 'OFFICE';
  address: string;
  postcode: string;
  phone: string;
  isDefault?: boolean;
};

interface SavedAddressProps {
  addresses: Address[];
  onAddNew: () => void;
  onEdit: (address: Address) => void;
}

export default function SavedAddress({
  addresses,
  onAddNew,
  onEdit,
}: SavedAddressProps) {
  return (
    <div className="bg-white">
      <h2 className="text-xl font-semibold mb-4">Saved Address</h2>

      <div className="w-full">
        <div className="grid grid-cols-5 bg-gray-100 text-sm font-medium p-3">
          <div>Full Name</div>
          <div>Address</div>
          <div>Postcode</div>
          <div>Phone Number</div>
          <div></div>
        </div>

        {addresses.map(addr => (
          <div
            key={addr.id}
            className="grid grid-cols-5 items-center text-sm border-t p-3">
            <div>{addr.fullName}</div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-600 text-white text-xs px-2 py-0.5">
                {addr.addressType}
              </span>
              <span>{addr.address}</span>
            </div>
            <div>{addr.postcode}</div>
            <div>{addr.phone}</div>
            <div className="flex flex-col items-end gap-1">
              {addr.isDefault && (
                <>
                  <span className="text-xs text-gray-500">
                    Default Shipping Address
                  </span>
                  <span className="text-xs text-gray-500">
                    Default Billing Address
                  </span>
                </>
              )}
              <button
                onClick={() => onEdit(addr)}
                className="text-blue-600 text-sm font-medium hover:underline">
                EDIT
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <Button
          className="bg-blue-600 hover:bg-blue-700 rounded-none"
          onClick={onAddNew}>
          + ADD NEW ADDRESS
        </Button>
      </div>
    </div>
  );
}
