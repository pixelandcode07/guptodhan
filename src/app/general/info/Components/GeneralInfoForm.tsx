'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import SectionTitle from '@/components/ui/SectionTitle';
import LogoUpload from './LogoUpload';
import CompanyDetails from './CompanyDetails';
import FileUpload from '@/components/ReusableComponents/FileUpload';

export default function GeneralInfoForm({ data = {} }) {
  // console.log('Props Data', data);
  const [formData, setFormData] = useState({
    company_name: data.companyName || '',
    contact: data.phoneNumber || '',
    email: data.companyEmail || '',
    short_description: data.shortDescription || '',
    address: data.companyAddress || '',
    google_map_link: data.googleMapLink || '',
    trade_license_no: data.tradeLicenseNo || '',
    tin_no: data.tinNo || '',
    bin_no: data.binNo || '',
    footer_copyright_text: data.footerCopyrightText || '',
    guest_checkout: data.guestCheckout ?? false,
    store_pickup: data.storePickup ?? false,
  });

  const [previews, setPreviews] = useState({
    logo: data.primaryLogoLight || '',
    logo_dark: data.secondaryLogoDark || '',
    fav_icon: data.favicon || '',
    payment_banner: data.payment_banner || '',
    user_cover_photo: data.user_cover_photo || '',
  });

  const handleInputChange = (name: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = () => {
    console.log('Form Data:', formData);
    console.log('Submit');
  };
  const handleFileChange = (name: string, url: string) => {
    setFormData(prev => ({ ...prev, [name]: url }));
    setPreviews(prev => ({ ...prev, [name]: url }));
  };

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center pr-6">
        <SectionTitle text="General Information Form" />
        <div className="flex gap-2 flex-wrap">
          <Button variant="destructive" type="button">
            Cancel
          </Button>
          <Button type="submit">Update</Button>
        </div>
      </div>

      {/* Logo Upload Section  */}
      <LogoUpload previews={previews} handleUploadedUrl={handleFileChange} />

      {/* Company Details */}
      <CompanyDetails
        formData={formData}
        handleInputChange={handleInputChange}
      />

      {/* Banner Uploads */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <div className="w-full h-48  rounded overflow-hidden">
          <FileUpload
            label="Payment Banner"
            name="payment_banner"
            preview={previews.payment_banner}
            onUploadComplete={handleFileChange}
          />
        </div>
        <div className="w-full h-48   rounded overflow-hidden">
          <FileUpload
            label="User Cover Photo"
            name="user_cover_photo"
            preview={previews.user_cover_photo}
            onUploadComplete={handleFileChange}
          />
        </div>
      </div>

      {/* Checkout Config */}
      <div className="bg-white shadow rounded p-4 mt-6">
        <SectionTitle text="Checkout Page Configuration" />
        <div className="flex flex-wrap gap-6 text-sm mt-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formData.guest_checkout}
              onCheckedChange={checked =>
                handleInputChange('guest_checkout', checked)
              }
            />
            <label>Guest Checkout</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formData.store_pickup}
              onCheckedChange={checked =>
                handleInputChange('store_pickup', checked)
              }
            />
            <label>Store Pickup</label>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-center gap-2 mt-6">
        <Button variant="destructive" type="button">
          Cancel
        </Button>
        <Button type="submit">Update</Button>
      </div>
    </form>
  );
}
