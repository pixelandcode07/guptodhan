'use client';

import { Button } from '@/components/ui/button';
import { AddressData } from './handleComponent'; 

interface SavedAddressProps {
  addresses: AddressData[];
  onAddNew: () => void;
  onEdit: (address: AddressData) => void;
  onDelete: (id: number) => void;
}

export default function SavedAddress({
  addresses,
  onAddNew,
  onEdit,
  onDelete,
}: SavedAddressProps) {
  return (
    <div className="bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Saved Addresses ({addresses.length})</h2>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 text-gray-500 border border-dashed mb-6 rounded-md">
          <p>No addresses saved yet.</p>
        </div>
      ) : (
        <div className="w-full mb-6 border rounded-md overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-5 bg-gray-100 text-sm font-medium p-3 border-b">
            <div>Type & Name</div>
            <div className="col-span-2">Address Details</div>
            <div>Phone</div>
            <div className="text-right">Action</div>
          </div>

          {/* Table Body */}
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="grid grid-cols-1 md:grid-cols-5 items-start md:items-center text-sm border-b last:border-0 p-4 md:p-3 gap-2 md:gap-0 relative hover:bg-gray-50 transition"
            >
              {/* Column 1: Name & Type */}
              <div className="flex flex-col gap-1">
                <span className="font-semibold">{addr.fullName}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded w-fit uppercase font-medium ${
                  addr.addressType === 'Home' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {addr.addressType}
                </span>
              </div>
              
              {/* Column 2: Address */}
              <div className="col-span-2 text-gray-600 flex flex-col">
                <span className="font-medium text-black">{addr.address}</span>
                <span className="text-xs">
                  {addr.zone}, {addr.city} - {addr.province}
                </span>
                {addr.landmark && <span className="text-xs italic text-gray-400">Landmark: {addr.landmark}</span>}
              </div>

              {/* Column 3: Phone */}
              <div className="text-gray-600 font-mono">{addr.phone}</div>

              {/* Column 4: Actions */}
              <div className="flex md:justify-end gap-3 mt-2 md:mt-0">
                <button
                  onClick={() => onEdit(addr)}
                  className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
                >
                  EDIT
                </button>
                
                <button
                  onClick={() => onDelete(addr.id)}
                  className="text-red-500 text-sm font-medium hover:underline flex items-center gap-1"
                >
                  DELETE
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end mt-4">
        <Button
          className="bg-blue-600 hover:bg-blue-700 rounded-none px-6"
          onClick={onAddNew}
        >
          + ADD NEW ADDRESS
        </Button>
      </div>
    </div>
  );
}