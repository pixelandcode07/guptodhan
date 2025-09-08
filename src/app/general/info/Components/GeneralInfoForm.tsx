'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import SectionTitle from '@/components/ui/SectionTitle';

interface FileItem {
  label: string;
  name: string;
  preview?: string;
}

const logoFiles: FileItem[] = [
  {
    label: 'Primary Logo (Light)',
    name: 'logo',
    preview: 'https://app-area.guptodhan.com/company_logo/Y9Rnj1736918088.png',
  },
  {
    label: 'Secondary Logo (Dark)',
    name: 'logo_dark',
    preview: 'https://app-area.guptodhan.com/company_logo/dy7dI1736918088.png',
  },
  {
    label: 'Favicon',
    name: 'fav_icon',
    preview: 'https://app-area.guptodhan.com/company_logo/O7NCy1736918088.png',
  },
];

const bannerFiles: FileItem[] = [
  {
    label: 'Payment Banner',
    name: 'payment_banner',
    preview: 'https://app-area.guptodhan.com/company_logo/cRxqA1720483781.png',
  },
  {
    label: 'User Cover Photo',
    name: 'user_cover_photo',
    preview: 'https://app-area.guptodhan.com/company_logo/itjXj1741589131.jpg',
  },
];

export default function GeneralInfoForm() {
  const [previews, setPreviews] = useState<Record<string, string>>({});

  const form = useForm({
    defaultValues: {
      company_name: 'Guptodhan Bangladesh',
      contact: '01816500600',
      email: 'guptodhan24@gmail.com',
      short_description:
        'Guptodhan Bangladesh is online version of Guptodhan situated at Dhaka since 2024',
      address: 'Shariatpur Sadar, Dhaka, Bangladesh',
      google_map_link: '',
      trade_license_no: '01288',
      tin_no: '673266555252',
      bin_no: '',
      footer_copyright_text: 'Copyright © 2024 GuptoDhan. All Rights Reserved.',
      guest_checkout: true,
      store_pickup: true,
    },
  });

  const handleFileChange = (name: string, file: File | undefined) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviews(prev => ({ ...prev, [name]: url }));
      form.setValue(name as any, file);
    }
  };

  const onSubmit = (values: any) => {
    console.log('Form Data:', values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Header */}
        <div className="flex pt-6 pr-6 flex-wrap items-center justify-between">
          <SectionTitle text="General Information Form" />
          <div className="flex flex-wrap gap-2">
            <Button variant="destructive" type="button">
              Cancel
            </Button>
            <Button type="submit">Update</Button>
          </div>
        </div>

        <div className=" p-6 space-y-6">
          {/* Logo Uploads */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {logoFiles.map(item => (
              <FormField
                key={item.name}
                control={form.control}
                name={item.name as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{item.label}</FormLabel>
                    <FormControl>
                      <div
                        onClick={() =>
                          document.getElementById(item.name)?.click()
                        }
                        className="border border-gray-300 rounded p-2 cursor-pointer hover:bg-gray-100 flex flex-col items-center justify-center min-h-[120px]">
                        <input
                          type="file"
                          id={item.name}
                          accept="image/*"
                          className="hidden"
                          onChange={e =>
                            handleFileChange(item.name, e.target.files?.[0])
                          }
                        />
                        <img
                          src={previews[item.name] || item.preview || ''}
                          alt={item.label}
                          className="h-32 object-contain"
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
          </div>

          {/* Company Details */}
          {[
            { label: 'Company Name', name: 'company_name', required: true },
            { label: 'Phone No.', name: 'contact', required: true },
            { label: 'Company Emails', name: 'email', required: true },
            { label: 'Short Description', name: 'short_description' },
            { label: 'Company Address', name: 'address' },
            { label: 'Google Map Link', name: 'google_map_link' },
            { label: 'Trade License No', name: 'trade_license_no' },
            { label: 'TIN No', name: 'tin_no' },
            { label: 'BIN No', name: 'bin_no' },
            { label: 'Footer Copyright Text', name: 'footer_copyright_text' },
          ].map(item => (
            <FormField
              key={item.name}
              control={form.control}
              name={item.name as any}
              render={({ field }) => (
                <FormItem className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                  <FormLabel className="w-full sm:w-1/4 font-medium">
                    {item.label}{' '}
                    {item.required && <span className="text-red-500">*</span>}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          {/* Banner Uploads */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bannerFiles.map(item => (
              <FormField
                key={item.name}
                control={form.control}
                name={item.name as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{item.label}</FormLabel>
                    <FormControl>
                      <div
                        onClick={() =>
                          document.getElementById(item.name)?.click()
                        }
                        className="border border-gray-300 rounded p-2 cursor-pointer hover:bg-gray-100 flex flex-col items-center justify-center min-h-[120px]">
                        <input
                          type="file"
                          id={item.name}
                          accept="image/*"
                          className="hidden"
                          onChange={e =>
                            handleFileChange(item.name, e.target.files?.[0])
                          }
                        />
                        <img
                          src={previews[item.name] || item.preview || ''}
                          alt={item.label}
                          className="h-32 object-contain"
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
          </div>

          {/* Checkout Config */}
          <div className="bg-white shadow rounded p-4">
            <SectionTitle text="Checkout Page Configuration" />
            <div className="flex flex-wrap gap-6 text-sm mt-2">
              <FormField
                control={form.control}
                name="guest_checkout"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Guest Checkout</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="store_pickup"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Store Pickup</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-center gap-2">
            <Button variant="destructive" type="button">
              Cancel
            </Button>
            <Button type="submit">Update</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
