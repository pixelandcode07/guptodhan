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

type AddressData = {
  fullName: string;
  phone: string;
  landmark?: string;
  province: string;
  city: string;
  zone: string;
  address: string;
  addressType: 'Home' | 'Office';
  postcode: string;
};

type AddAddressFormProps = {
  initialData?: Partial<AddressData>;
  onCancel: () => void;
  onSave: (data: AddressData) => void;
};

export default function AddAddressForm({
  initialData,
  onCancel,
  onSave,
}: AddAddressFormProps) {
  const [addressType, setAddressType] = useState<'Home' | 'Office'>(
    initialData?.addressType || 'Home'
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: AddressData = {
      fullName: (formData.get('fullName') ?? '') as string,
      phone: (formData.get('phone') ?? '') as string,
      landmark: (formData.get('landmark') ?? '') as string,
      province: (formData.get('province') ?? '') as string,
      city: (formData.get('city') ?? '') as string,
      zone: (formData.get('zone') ?? '') as string,
      address: (formData.get('address') ?? '') as string,
      addressType,
      postcode: `${formData.get('province') ?? ''} - ${
        formData.get('city') ?? ''
      } - ${formData.get('zone') ?? ''} - ${formData.get('address') ?? ''}`,
    };
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white space-y-6">
      <h2 className="text-xl font-semibold">
        {initialData ? 'Edit Address' : 'Add New Address'}
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <Input
              name="fullName"
              defaultValue={initialData?.fullName || ''}
              placeholder="Enter full name"
              className="w-full rounded-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <Input
              name="phone"
              defaultValue={initialData?.phone || ''}
              placeholder="eg 01624966120"
              className="w-full rounded-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Landmark (Optional)
            </label>
            <Input
              name="landmark"
              defaultValue={initialData?.landmark || ''}
              placeholder="eg dokkhin khan"
              className="w-full rounded-none"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Province / Region
            </label>
            <Select name="province" defaultValue={initialData?.province}>
              <SelectTrigger className="w-full rounded-none">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dhaka">Dhaka</SelectItem>
                <SelectItem value="chittagong">Chittagong</SelectItem>
                <SelectItem value="rajshahi">Rajshahi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <Select name="city" defaultValue={initialData?.city}>
              <SelectTrigger className="w-full rounded-none">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dhaka-north">Dhaka North</SelectItem>
                <SelectItem value="dhaka-south">Dhaka South</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Zone</label>
            <Select name="zone" defaultValue={initialData?.zone}>
              <SelectTrigger className="w-full rounded-none">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uttara">Uttara</SelectItem>
                <SelectItem value="mirpur">Mirpur</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <Textarea
              name="address"
              defaultValue={initialData?.address || ''}
              placeholder="eg dokkhin khan"
              className="w-full rounded-none"
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant={addressType === 'Home' ? 'default' : 'outline'}
              className="flex-1 rounded-none"
              onClick={() => setAddressType('Home')}>
              Home
            </Button>
            <Button
              type="button"
              variant={addressType === 'Office' ? 'default' : 'outline'}
              className="flex-1 rounded-none"
              onClick={() => setAddressType('Office')}>
              Office
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          className="rounded-none border border-blue-600 text-blue-600"
          onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-none">
          Save
        </Button>
      </div>
    </form>
  );
}
