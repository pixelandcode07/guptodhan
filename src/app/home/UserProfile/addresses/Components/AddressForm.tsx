'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type AddressFormProps = {
  initialData?: any;
  onCancel: () => void;
  onSave: (data: any) => void;
};

// Helper function to safely parse incoming initialData
const getParsedInitialData = (data: any) => {
  if (!data) return {};
  try {
    const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    if (Array.isArray(parsedData) && parsedData.length > 0) return parsedData[0];
    if (typeof parsedData === 'object' && parsedData !== null) return parsedData;
  } catch (error) {
    console.error("Failed to parse initialData:", error);
  }
  return {};
};

export default function AddAddressForm({
  initialData,
  onCancel,
  onSave,
}: AddressFormProps) {
  
  const parsedData = getParsedInitialData(initialData);

  const [formData, setFormData] = useState({
    fullName: parsedData.fullName || '',
    phone: parsedData.phone || '',
    landmark: parsedData.landmark || '',
    province: parsedData.province || '',
    city: parsedData.city || '',
    zone: parsedData.zone || '',
    address: parsedData.address || '',
    addressType: parsedData.addressType || 'Home',
  });

  // State to hold dynamic API locations (Division -> District mapping)
  const [apiLocations, setApiLocations] = useState<Record<string, string[]>>({});

  // Fetch Delivery Charges to build dynamic Province and City lists strictly from API
  useEffect(() => {
    const fetchApiLocations = async () => {
      try {
        const res = await fetch('/api/v1/delivery-charge', {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
        });
        const data = await res.json();
        
        if (data?.data && Array.isArray(data.data)) {
          const locs: Record<string, string[]> = {};
          
          data.data.forEach((item: any) => {
            const division = item.divisionName;
            const district = item.districtName;
            
            if (!locs[division]) {
              locs[division] = [];
            }
            if (!locs[division].includes(district)) {
              locs[division].push(district);
            }
          });
          
          Object.keys(locs).forEach(key => locs[key].sort());
          setApiLocations(locs);
        }
      } catch (err) {
        console.error("Failed to fetch locations from delivery-charge API", err);
      }
    };
    
    fetchApiLocations();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === 'province') {
        newData.city = '';
      }
      return newData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address || !formData.province || !formData.city || !formData.zone) {
      alert('Please fill all required fields.');
      return;
    }
    onSave(formData);
  };

  const regions = Object.keys(apiLocations).sort();
  const cities = formData.province && apiLocations[formData.province] 
    ? apiLocations[formData.province] 
    : [];

  return (
    <form onSubmit={handleSubmit} className="bg-white space-y-6 border p-6 rounded-md shadow-sm">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-semibold">
          {initialData ? 'Edit Address' : 'Add New Address'}
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Side */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Full Name *</label>
            <Input name="fullName" value={formData.fullName} onChange={handleInputChange} required className="rounded-none mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Phone Number *</label>
            <Input name="phone" value={formData.phone} onChange={handleInputChange} required className="rounded-none mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Landmark (Optional)</label>
            <Input name="landmark" value={formData.landmark} onChange={handleInputChange} className="rounded-none mt-1" />
          </div>
        </div>

        {/* Right Side */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Region *</label>
              <Select value={formData.province} onValueChange={(val) => handleSelectChange('province', val)}>
                <SelectTrigger className="rounded-none mt-1"><SelectValue placeholder="Select Region" /></SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">City *</label>
              <Select disabled={!formData.province} value={formData.city} onValueChange={(val) => handleSelectChange('city', val)}>
                <SelectTrigger className="rounded-none mt-1"><SelectValue placeholder="Select City" /></SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Zone / Area *</label>
            {/* Changed from Select to Input since the API does not provide Zone data */}
            <Input 
              name="zone" 
              value={formData.zone} 
              onChange={handleInputChange} 
              required 
              className="rounded-none mt-1" 
              placeholder="Enter Zone or Area (e.g., Mirpur)" 
            />
          </div>

          <div>
            <label className="text-sm font-medium">Detailed Address *</label>
            <Textarea name="address" value={formData.address} onChange={handleInputChange} required className="rounded-none mt-1" placeholder="House, Road, Block..." />
          </div>

          <div className="flex gap-4 pt-2">
            <Button type="button" 
              variant={formData.addressType === 'Home' ? 'default' : 'outline'} 
              className={`flex-1 rounded-none ${formData.addressType === 'Home' ? 'bg-blue-600' : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, addressType: 'Home' }))}>
              HOME
            </Button>
            <Button type="button" 
              variant={formData.addressType === 'Office' ? 'default' : 'outline'} 
              className={`flex-1 rounded-none ${formData.addressType === 'Office' ? 'bg-blue-600' : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, addressType: 'Office' }))}>
              OFFICE
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} className="rounded-none px-6">CANCEL</Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 rounded-none px-6">SAVE ADDRESS</Button>
      </div>
    </form>
  );
}