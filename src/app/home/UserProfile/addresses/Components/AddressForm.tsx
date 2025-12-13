'use client';

import { useState } from 'react';
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

export default function AddAddressForm({
  initialData,
  onCancel,
  onSave,
}: AddressFormProps) {
  
  // Local State
  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || '',
    phone: initialData?.phone || '',
    landmark: initialData?.landmark || '',
    province: initialData?.province || '',
    city: initialData?.city || '',
    zone: initialData?.zone || '',
    address: initialData?.address || '',
    addressType: initialData?.addressType || 'Home',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address) {
      alert('Please fill all required fields');
      return;
    }
    // Parent component a data pathano
    onSave(formData);
  };

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
              <label className="text-sm font-medium">Region</label>
              <Select value={formData.province} onValueChange={(val) => handleSelectChange('province', val)}>
                <SelectTrigger className="rounded-none mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dhaka">Dhaka</SelectItem>
                  <SelectItem value="Chittagong">Chittagong</SelectItem>
                  <SelectItem value="Rajshahi">Rajshahi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">City</label>
              <Select value={formData.city} onValueChange={(val) => handleSelectChange('city', val)}>
                <SelectTrigger className="rounded-none mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dhaka North">Dhaka North</SelectItem>
                  <SelectItem value="Dhaka South">Dhaka South</SelectItem>
                  <SelectItem value="Gazipur">Gazipur</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Zone / Area</label>
            <Select value={formData.zone} onValueChange={(val) => handleSelectChange('zone', val)}>
              <SelectTrigger className="rounded-none mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Uttara">Uttara</SelectItem>
                <SelectItem value="Mirpur">Mirpur</SelectItem>
                <SelectItem value="Banasree">Banasree</SelectItem>
              </SelectContent>
            </Select>
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