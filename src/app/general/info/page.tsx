'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

const GeneralInfoForm: React.FC = () => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const img = document.getElementById(
        e.target.name + '_preview'
      ) as HTMLImageElement;
      if (img) img.src = URL.createObjectURL(file);
    }
  };

  return (
    <form className="space-y-6 ">
      {/* Header & Actions */}
      <div className="flex flex-wrap items-center justify-between">
        <SectionTitle text="General Information Form" />
        <div className="flex flex-wrap gap-2">
          <Button variant="destructive">Cencle</Button>

          <Button>done</Button>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto">
        {/* Logo Uploads */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {logoFiles.map(item => (
            <div key={item.name} className="mb-4">
              <label className="block text-sm font-medium mb-1">
                {item.label}
              </label>
              <div
                onClick={() => document.getElementById(item.name)?.click()}
                className="border border-gray-300 rounded p-2 cursor-pointer hover:bg-gray-100 flex flex-col items-center justify-center min-h-[120px]">
                <input
                  type="file"
                  id={item.name}
                  name={item.name}
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {item.preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    id={item.name + '_preview'}
                    src={item.preview}
                    alt={item.label}
                    className="h-32 object-contain"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">
                    Click anywhere to select file
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Company Details */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <label
              htmlFor="company_name"
              className="w-full sm:w-1/4 font-medium">
              Company Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="company_name"
              name="company_name"
              placeholder="Enter Company Name"
              defaultValue="Guptodhan Bangladesh"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <label htmlFor="contact" className="w-full sm:w-1/4 font-medium">
              Phone No. <span className="text-red-500">*</span>
            </label>
            <Input
              id="contact"
              name="contact"
              placeholder="01*********"
              defaultValue="01816500600"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <label htmlFor="email" className="w-full sm:w-1/4 font-medium">
              Company Emails <span className="text-red-500">*</span>
            </label>
            <Input
              id="email"
              name="email"
              placeholder="Write Email Here"
              defaultValue="guptodhan24@gmail.com"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4">
            <label
              htmlFor="short_description"
              className="w-full sm:w-1/4 font-medium">
              Short Description
            </label>
            <Input
              id="short_description"
              name="short_description"
              // rows={3}
              // textarea
              defaultValue="Guptodhan Bangladesh is online version of Guptodhan situated at Dhaka since 2024"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4">
            <label htmlFor="address" className="w-full sm:w-1/4 font-medium">
              Company Address
            </label>
            <Input
              id="address"
              name="address"
              // rows={3}
              // textarea
              defaultValue="Shariatpur Sadar, Dhaka, Bangladesh"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4">
            <label
              htmlFor="google_map_link"
              className="w-full sm:w-1/4 font-medium">
              Google Map Link
            </label>
            <Input
              id="google_map_link"
              name="google_map_link"
              // rows={2}
              // textarea
            />
          </div>

          {/* Trade License, TIN, BIN */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <label
              htmlFor="trade_license_no"
              className="w-full sm:w-1/4 font-medium">
              Trade License No
            </label>
            <Input
              id="trade_license_no"
              name="trade_license_no"
              defaultValue="01288"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <label htmlFor="tin_no" className="w-full sm:w-1/4 font-medium">
              TIN No
            </label>
            <Input id="tin_no" name="tin_no" defaultValue="673266555252" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <label htmlFor="bin_no" className="w-full sm:w-1/4 font-medium">
              BIN No
            </label>
            <Input id="bin_no" name="bin_no" defaultValue="" />
          </div>

          {/* Footer Text */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4">
            <label
              htmlFor="footer_copyright_text"
              className="w-full sm:w-1/4 font-medium">
              Footer Copyright Text
            </label>
            <Input
              id="footer_copyright_text"
              name="footer_copyright_text"
              // rows={2}
              // textarea
              defaultValue="Copyright © 2024 GuptoDhan. All Rights Reserved."
            />
          </div>

          {/* Banner Uploads */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bannerFiles.map(item => (
              <div key={item.name} className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  {item.label}
                </label>
                <div
                  onClick={() => document.getElementById(item.name)?.click()}
                  className="border border-gray-300 rounded p-2 cursor-pointer hover:bg-gray-100 flex flex-col items-center justify-center min-h-[120px]">
                  <input
                    type="file"
                    id={item.name}
                    name={item.name}
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  {item.preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      id={item.name + '_preview'}
                      src={item.preview}
                      alt={item.label}
                      className="h-32 object-contain"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">
                      Click anywhere to select file
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <div className="bg-white shadow rounded p-4">
              <SectionTitle text=" Checkout Page Configuration" />

              <div className="flex text-sm flex-wrap gap-4">
                <label className="flex items-center cursor-pointer bg-gray-100 px-3 py-2 rounded hover:bg-gray-200">
                  <span className="mr-2">Guest Checkout</span>
                  <input
                    type="checkbox"
                    id="guest_checkout"
                    defaultChecked
                    className="w-3 h-3 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center cursor-pointer bg-gray-100 px-3 py-2 rounded hover:bg-gray-200">
                  <span className="mr-2">Store Pickup</span>
                  <input
                    type="checkbox"
                    id="store_pickup"
                    defaultChecked
                    className="w-3 h-3 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-center gap-2">
          <Button
            // text="Cancel"
            // icon={<CircleX className="w-4 h-4" />}
            // size="sm"
            variant="destructive">
            Cencle
          </Button>
          <Button
          // text="Update"
          // icon={<CircleX className="w-4 h-4" />}
          // size="sm"
          >
            Update
          </Button>
        </div>
      </div>
    </form>
  );
};

export default GeneralInfoForm;
