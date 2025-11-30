'use client';

import { useEffect, useState } from 'react';
import AddAddressForm from './AddressForm';
import SavedAddress from './SaveAddress';
import { toast } from 'sonner'; // Jodi toast thake, na thakle alert use koro

// Address Data Type Definition
export type AddressData = {
  id: number;
  fullName: string;
  phone: string;
  landmark?: string;
  province: string;
  city: string;
  zone: string;
  address: string; // Street address
  addressType: 'Home' | 'Office';
};

export default function HandleAddressesComponent() {
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [editingAddress, setEditingAddress] = useState<AddressData | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // User er name/phone dhore rakhar jonno (jates save korle hariye na jay)
  const [userProfile, setUserProfile] = useState<any>({}); 

  // 1. Data Fetching (Load Logic)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/v1/profile/me', { method: "GET" });
        const result = await res.json();

        if (result.success && result.data) {
          const user = result.data;
          setUserProfile(user);

          // Logic: Jodi address field ta JSON array hoy, tahole parse korbo
          if (user.address) {
            try {
              // Try to parse as JSON Array
              const parsedData = JSON.parse(user.address);
              if (Array.isArray(parsedData)) {
                setAddresses(parsedData);
              } else {
                 // Jodi JSON na hoy (Old data), tahole array te convert kore nibo
                 throw new Error("Not Array");
              }
            } catch (e) {
              // Backward compatibility for old plain text address
              setAddresses([{
                id: Date.now(),
                fullName: user.name || '',
                phone: user.phoneNumber || '',
                address: user.address, // Old string address
                city: 'N/A',
                province: 'N/A',
                zone: 'N/A',
                addressType: 'Home'
              }]);
            }
          } else {
            setAddresses([]);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleAddNew = () => {
    setIsAdding(true);
    setEditingAddress(null);
  };

  const handleEditAddress = (address: AddressData) => {
    setEditingAddress(address);
    setIsAdding(false);
  };

  const handleCloseForm = () => {
    setIsAdding(false);
    setEditingAddress(null);
  };

  // ==========================================
  // 🔥 UPDATE BACKEND FUNCTION
  // ==========================================
  const updateBackend = async (newAddressList: AddressData[]) => {
    try {
      const formData = new FormData();
      
      // 1. Array ke String a convert kora hocche
      const jsonString = newAddressList.length > 0 ? JSON.stringify(newAddressList) : '';
      
      formData.append('address', jsonString);
      
      // Name ar Phone jeno null na hoye jay, tai ager tai pathiye dicchi
      if(userProfile.name) formData.append('name', userProfile.name);
      if(userProfile.phoneNumber) formData.append('phoneNumber', userProfile.phoneNumber);

      const response = await fetch('/api/v1/profile/me', {
        method: 'PATCH',
        body: formData,
      });

      const result = await response.json();
      return result.success;

    } catch (error) {
      console.error("Backend update failed", error);
      return false;
    }
  };

  // 2. Save Address (Add / Edit)
  const handleSaveAddress = async (data: any) => {
    let updatedList = [...addresses];

    if (editingAddress) {
      // Edit Mode
      updatedList = updatedList.map(addr => 
        addr.id === editingAddress.id ? { ...data, id: editingAddress.id } : addr
      );
    } else {
      // Add Mode
      const newAddress = { ...data, id: Date.now() };
      updatedList.push(newAddress);
    }

    // Call Backend
    const success = await updateBackend(updatedList);

    if (success) {
      setAddresses(updatedList);
      handleCloseForm();
      alert('Address saved successfully!');
    } else {
      alert('Failed to save address. Please try again.');
    }
  };

  // 3. Delete Address
  const handleDeleteAddress = async (id: number) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    // Filter kore bad deya hocche
    const updatedList = addresses.filter(addr => addr.id !== id);

    // Call Backend
    const success = await updateBackend(updatedList);

    if (success) {
      setAddresses(updatedList);
      alert('Address deleted successfully!');
    } else {
      alert('Failed to delete address.');
    }
  };

  if (isLoading) return <div className="p-6 text-center">Loading addresses...</div>;

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
          onDelete={handleDeleteAddress}
        />
      )}
    </div>
  );
}