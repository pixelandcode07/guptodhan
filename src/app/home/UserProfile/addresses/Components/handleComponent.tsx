'use client';

import { useState } from 'react';
import AddAddressForm from './AddressForm';
import SavedAddress from './SaveAddress';

export default function HandleAddressesComponent() {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      fullName: 'Tareq Mahmud',
      addressType: 'HOME',
      address: 'C block, Main road',
      postcode: 'Dhaka - Dhaka - South - Banasree',
      phone: '1758260451',
      isDefault: true,
    },
    {
      id: 2,
      fullName: 'Tareq Mahmud',
      addressType: 'HOME',
      address: 'Main road, Pubali Bank',
      postcode: 'Dhaka - Dhaka - North - Banasree Block C',
      phone: '1758260451',
    },
    {
      id: 3,
      fullName: 'Tareq Mahmud',
      addressType: 'HOME',
      address: 'Chandra',
      postcode: 'Chattogram - Chandpur - Faridganj - Faridganj Chandra',
      phone: '1758260451',
    },
  ]);

  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Add new address
  const handleAddNew = () => {
    setIsAdding(true);
    setEditingAddress(null);
  };

  // Edit existing address
  const handleEditAddress = (address: any) => {
    setEditingAddress(address);
    setIsAdding(false);
  };

  // Close form
  const handleCloseForm = () => {
    setIsAdding(false);
    setEditingAddress(null);
  };

  // Save address (add or edit)
  const handleSaveAddress = (data: any) => {
    if (editingAddress) {
      // Update existing
      setAddresses(prev =>
        prev.map(addr =>
          addr.id === editingAddress.id ? { ...addr, ...data } : addr
        )
      );
    } else {
      // Add new
      const newAddress = { ...data, id: Date.now() };
      setAddresses(prev => [...prev, newAddress]);
    }
    handleCloseForm();
  };

  return (
    <div className="bg-white rounded-md p-6 pt-0">
      {isAdding || editingAddress ? (
        <AddAddressForm
          initialData={editingAddress}
          onCancel={handleCloseForm}
          onSave={handleSaveAddress}
        />
      ) : (
        <SavedAddress
          addresses={addresses}
          onAddNew={handleAddNew}
          onEdit={handleEditAddress}
        />
      )}
    </div>
  );
}
