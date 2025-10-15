'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import UploadImage from '@/components/ReusableComponents/UploadImage';
import CompanyDetails from './CompanyDetails';
import SectionTitle from '@/components/ui/SectionTitle';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useSession } from 'next-auth/react';

interface GeneralInfoFormProps {
  data: any;
}

export default function GeneralInfoForm({ data }: GeneralInfoFormProps) {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<any>({});
  const [previews, setPreviews] = useState<any>({});
  
  useEffect(() => {
    if (data) {
        setFormData({
            _id: data._id || '',
            companyName: data.companyName || '',
            phoneNumber: data.phoneNumber || '',
            companyEmail: data.companyEmail || '',
            shortDescription: data.shortDescription || '',
            companyAddress: data.companyAddress || '',
            companyMapLink: data.companyMapLink || '',
            tradeLicenseNo: data.tradeLicenseNo || '',
            tinNo: data.tinNo || '',
            binNo: data.binNo || '',
            footerCopyrightText: data.footerCopyrightText || '',
            guest_checkout: data.guest_checkout || false,
            store_pickup: data.store_pickup || false,
        });
        setPreviews({
            logo: data.primaryLogoLight || '',
            logo_dark: data.secondaryLogoDark || '',
            fav_icon: data.favicon || '',
            payment_banner: data.paymentBanner || '',
            user_cover_photo: data.userBanner || '',
        });
    }
  }, [data]);


  const handleInputChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (name: string, file: File | null) => {
    const map: Record<string, string> = {
      logo: 'primaryLogoLight',
      logo_dark: 'secondaryLogoDark',
      fav_icon: 'favicon',
      payment_banner: 'paymentBanner',
      user_cover_photo: 'userBanner',
    };
    handleInputChange(map[name], file);
    setPreviews((prev: any) => ({ ...prev, [name]: file ? URL.createObjectURL(file) : '' }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return toast.error("Authentication required.");
    setLoading(true);

    const dataToSend = new FormData();
    for (const [key, value] of Object.entries(formData)) {
      if (value !== undefined && value !== null) {
        dataToSend.append(key, value as any);
      }
    }
    
    try {
      // The POST route handles both create and update (upsert)
      await axios.post('/api/v1/settings', dataToSend, {
        headers: { 
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
        },
      });
      toast.success('Settings updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 p-6">
      <div className="flex flex-wrap justify-between items-center pr-6">
        <SectionTitle text="General Information Form" />
        <div className="flex gap-2 flex-wrap">
          <Button variant="destructive" type="button" disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update'
            )}
          </Button>
        </div>
      </div>

      {/* Logo Uploads */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <UploadImage
          name="logo"
          label="Primary Logo (Light)"
          preview={previews.logo}
          onChange={handleFileChange}
        />
        <UploadImage
          name="logo_dark"
          label="Secondary Logo (Dark)"
          preview={previews.logo_dark}
          onChange={handleFileChange}
        />
        <UploadImage
          name="fav_icon"
          label="Favicon"
          preview={previews.fav_icon}
          onChange={handleFileChange}
        />
      </div>

      {/* Company Details */}
      <CompanyDetails
        formData={{
          company_name: formData.companyName,
          contact: formData.phoneNumber,
          email: formData.companyEmail,
          short_description: formData.shortDescription,
          address: formData.companyAddress,
          companyMapLink: formData.companyMapLink,
          trade_license_no: formData.tradeLicenseNo,
          tin_no: formData.tinNo,
          bin_no: formData.binNo,
          footer_copyright_text: formData.footerCopyrightText,
        }}
        handleInputChange={(name, value) => {
          const map: Record<string, string> = {
            company_name: 'companyName',
            contact: 'phoneNumber',
            email: 'companyEmail',
            short_description: 'shortDescription',
            address: 'companyAddress',
            companyMapLink: 'companyMapLink',
            trade_license_no: 'tradeLicenseNo',
            tin_no: 'tinNo',
            bin_no: 'binNo',
            footer_copyright_text: 'footerCopyrightText',
          };
          handleInputChange(map[name], value);
        }}
      />

      {/* Banner Uploads */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <UploadImage
          name="payment_banner"
          label="Payment Banner"
          preview={previews.payment_banner}
          onChange={handleFileChange}
        />
        <UploadImage
          name="user_cover_photo"
          label="User Cover Photo"
          preview={previews.user_cover_photo}
          onChange={handleFileChange}
        />
      </div>

      {/* Checkout Config */}
      <div className="bg-white shadow rounded p-4 mt-6">
        <SectionTitle text="Checkout Page Configuration" />
        <div className="flex flex-wrap gap-6 text-sm mt-2">
          {[
            { label: 'Guest Checkout', key: 'guest_checkout' },
            { label: 'Store Pickup', key: 'store_pickup' },
          ].map(opt => (
            <div key={opt.key} className="flex items-center space-x-2">
              <Checkbox
                checked={!!formData[opt.key]}
                onCheckedChange={checked =>
                  handleInputChange(opt.key, !!checked)
                }
              />
              <label>{opt.label}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        <Button variant="destructive" type="button" disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            'Update'
          )}
        </Button>
      </div>
    </form>
  );
}
