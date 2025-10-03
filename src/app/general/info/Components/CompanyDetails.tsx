'use client';
import React from 'react';
import { Input } from '@/components/ui/input';

type CompanyDetailsProps = {
  formData: {
    company_name: string;
    contact: string;
    email: string;
    short_description: string;
    address: string;
    google_map_link: string;
    trade_license_no: string;
    tin_no: string;
    bin_no: string;
    footer_copyright_text: string;
  };
  handleInputChange: (name: string, value: string) => void;
};

export default function CompanyDetails({
  formData,
  handleInputChange,
}: CompanyDetailsProps) {
  return (
    <div className="space-y-4">
      {/* Company Name */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <label className="w-full sm:w-1/4 font-medium">
          Company Name <span className="text-red-500">*</span>
        </label>
        <Input
          className="flex-1"
          value={formData.company_name}
          onChange={e => handleInputChange('company_name', e.target.value)}
        />
      </div>

      {/* Phone No */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <label className="w-full sm:w-1/4 font-medium">
          Phone No. <span className="text-red-500">*</span>
        </label>
        <Input
          className="flex-1"
          value={formData.contact}
          onChange={e => handleInputChange('contact', e.target.value)}
        />
      </div>

      {/* Company Emails */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <label className="w-full sm:w-1/4 font-medium">
          Company Emails <span className="text-red-500">*</span>
        </label>
        <Input
          className="flex-1"
          value={formData.email}
          onChange={e => handleInputChange('email', e.target.value)}
        />
      </div>

      {/* Short Description */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <label className="w-full sm:w-1/4 font-medium">Short Description</label>
        <Input
          className="flex-1"
          value={formData.short_description}
          onChange={e => handleInputChange('short_description', e.target.value)}
        />
      </div>

      {/* Company Address */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <label className="w-full sm:w-1/4 font-medium">Company Address</label>
        <Input
          className="flex-1"
          value={formData.address}
          onChange={e => handleInputChange('address', e.target.value)}
        />
      </div>

      {/* Google Map Link */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <label className="w-full sm:w-1/4 font-medium">Google Map Link</label>
        <Input
          className="flex-1"
          value={formData.google_map_link}
          onChange={e => handleInputChange('google_map_link', e.target.value)}
        />
      </div>

      {/* Trade License */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <label className="w-full sm:w-1/4 font-medium">Trade License No</label>
        <Input
          className="flex-1"
          value={formData.trade_license_no}
          onChange={e => handleInputChange('trade_license_no', e.target.value)}
        />
      </div>

      {/* TIN No */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <label className="w-full sm:w-1/4 font-medium">TIN No</label>
        <Input
          className="flex-1"
          value={formData.tin_no}
          onChange={e => handleInputChange('tin_no', e.target.value)}
        />
      </div>

      {/* BIN No */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <label className="w-full sm:w-1/4 font-medium">BIN No</label>
        <Input
          className="flex-1"
          value={formData.bin_no}
          onChange={e => handleInputChange('bin_no', e.target.value)}
        />
      </div>

      {/* Footer Copyright */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <label className="w-full sm:w-1/4 font-medium">
          Footer Copyright Text
        </label>
        <Input
          className="flex-1"
          value={formData.footer_copyright_text}
          onChange={e =>
            handleInputChange('footer_copyright_text', e.target.value)
          }
        />
      </div>
    </div>
  );
}
