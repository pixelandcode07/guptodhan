/* eslint-disable @next/next/no-img-element */
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import SectionTitle from '@/components/ui/SectionTitle';
import TagInput from './TagInput';

export default function SeoOptimizationForm() {
  const handleSeoSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log('SEO Optimization Form Data:', data);
    alert('SEO Info Updated!');
  };

  return (
    <Card>
      <SectionTitle text="Search Engine Optimization for HomePage" />
      <CardContent className="space-y-4">
        <form onSubmit={handleSeoSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meta_title">Meta Title</Label>
            <Input
              type="text"
              id="meta_title"
              name="meta_title"
              defaultValue="Guptodhan - Online Ecommerce Shopping"
              placeholder="Enter Meta Title Here"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta_keywords">
              Meta Keywords <small>(press Enter to add)</small>
            </Label>
            <TagInput
              name="meta_keywords"
              initialTags={[
                'ecommerce',
                'online shopping',
                'buy online',
                'shop online',
                'guptodhan.com',
                'guptodhan',
                'গুপ্তধন',
                'শরীয়তপুর',
                'গুপ্তধন শরীয়তপুর',
                'Guptodhan',
                'ই-কমার্স বাংলাদেশ',
                'অনলাইন শপিং',
                'পণ্য কেনা-বেচা',
                'ডোনেশন প্ল্যাটফর্ম',
                'ডিজিটাল মার্কেটপ্লেস',
                'E-commerce Bangladesh',
                'Online Shopping',
                'Buy and',
              ]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta_description">Meta Description</Label>
            <Textarea
              id="meta_description"
              name="meta_description"
              rows={5}
              defaultValue="Guptodhan.com is a trusted online marketplace connecting buyers and sellers. Explore a diverse range of high-quality products, enjoy secure transactions, and find unbeatable deals—all in one place."
              placeholder="Write Meta Description Here"
            />
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
