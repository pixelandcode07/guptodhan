'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import FileUpload from '@/components/ReusableComponents/FileUpload';
import SectionTitle from '@/components/ui/SectionTitle';

export default function TeamEntryForm() {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (name: string, url: string) => {
    setPreview(url);
  };

  return (
    <Card className="p-6 border mt-5">
      <SectionTitle text="Team Entry Form" />

      <CardContent>
        <form
          className="space-y-6"
          method="POST"
          action="https://app-area.guptodhan.com/save/team"
          encType="multipart/form-data">
          {/* Hidden token */}
          <input
            type="hidden"
            name="_token"
            value="b8UkN91D3WKzLc4pCvqnVVeU2RNhVducbSfBE8NO"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Image upload */}
            <div className="lg:col-span-4 w-full">
              <FileUpload
                label="User Cover Photo"
                name="user_cover_photo"
                preview={preview}
                onUploadComplete={handleFileChange}
              />
            </div>

            {/* Form fields */}
            <div className="lg:col-span-8 border-l pl-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Employee Name */}
                <div>
                  <Label htmlFor="employee_name">
                    Employee Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="employee_name"
                    name="employee_name"
                    placeholder="Enter Your Name Here"
                    required
                  />
                </div>

                {/* Designation */}
                <div>
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    type="text"
                    id="designation"
                    name="designation"
                    placeholder="Designation"
                  />
                </div>

                {/* Facebook */}
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    type="url"
                    id="facebook"
                    name="facebook"
                    placeholder="https://facebook.com/"
                  />
                </div>

                {/* Twitter */}
                <div>
                  <Label htmlFor="linkedin">Twitter</Label>
                  <Input
                    type="url"
                    id="linkedin"
                    name="linkedin"
                    placeholder="https://twitter.com/"
                  />
                </div>

                {/* Instagram */}
                <div>
                  <Label htmlFor="whatsapp">Instagram</Label>
                  <Input
                    type="url"
                    id="whatsapp"
                    name="whatsapp"
                    placeholder="https://instagram.com/"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-center pt-4">
            <Button type="submit" className="w-40">
              Save Team
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
