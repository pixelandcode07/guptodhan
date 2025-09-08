/* eslint-disable @next/next/no-img-element */
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import SectionTitle from '@/components/ui/SectionTitle';

export default function OpenGraphForm() {
  const handleOgSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log('Open Graph Form Data:', data);
    alert('Open Graph Info Updated!');
  };

  return (
    <Card>
      <SectionTitle text="Meta Open Graph for HomePage" />
      <CardContent className="space-y-4">
        <form onSubmit={handleOgSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meta_og_title">Meta OG Title</Label>
            <Input
              type="text"
              id="meta_og_title"
              name="meta_og_title"
              defaultValue="GuptoDhan - Online Ecommerce Shopping"
              placeholder="Enter Meta OG Title Here"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta_og_description">Meta OG Description</Label>
            <Textarea
              id="meta_og_description"
              name="meta_og_description"
              rows={5}
              defaultValue="Guptodhan.com is a trusted online marketplace connecting buyers and sellers. Explore a diverse range of high-quality products, enjoy secure transactions, and find unbeatable deals—all in one place."
              placeholder="Write Meta OG Description Here"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta_og_image">Meta OG Image</Label>
            <Input
              type="file"
              id="meta_og_image"
              name="meta_og_image"
              accept="image/*"
              className="cursor-pointer"
            />
            <div className="mt-2">
              <img
                src="https://app-area.guptodhan.com/company_logo/ZjEXa1736918101.png"
                alt="Current OG"
                className="h-32 rounded border object-cover"
              />
            </div>
          </div>

          <div className="flex justify-center space-x-4 pt-4">
            <Button variant="destructive" asChild>
              <a href="https://app-area.guptodhan.com/home">Cancel</a>
            </Button>
            <Button type="submit">Update Info</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
