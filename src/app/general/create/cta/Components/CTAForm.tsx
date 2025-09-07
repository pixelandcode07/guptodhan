'use client';
import RichTextEditor from '@/components/ReusableComponents/RichTextEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

export default function CTAForm() {
  // Static data only
  const preview =
    'https://app-area.guptodhan.com/uploads/about_us/yMCRq1741755424.jpg';

  const [title, setTitle] = useState('Guptodhan.com কী?');
  const [btnText, setBtnText] = useState('Visit Now');
  const [btnLink, setBtnLink] = useState('/guptodhan.com/');
  const [status, setStatus] = useState('1');
  const [content, setContent] = useState(`<h2>Guptodhan.com সম্পর্কে</h2>
<p>Guptodhan.com একটি আধুনিক ই-কমার্স ওয়েবসাইট, যা ক্রেতা ও বিক্রেতাদের জন্য একটি সহজ এবং নিরাপদ অনলাইন মার্কেটপ্লেস প্রদান করে। এটি অন্যান্য ই-কমার্স সাইটের মতোই কার্যকরী, তবে এর কিছু বিশেষ ফিচার রয়েছে যা একে আলাদা করে তোলে।</p>

<h3>Guptodhan.com কীভাবে ব্যবহার করবেন?</h3>

<h4>1. রেজিস্ট্রেশন:</h4>
<ul>
  <li><strong>বিক্রেতাদের জন্য:</strong> দোকানদাররা সহজেই Guptodhan.com-এ রেজিস্ট্রেশন করে তাদের পণ্য তালিকাভুক্ত করতে পারেন। এটি তাদের অনলাইন উপস্থিতি বাড়াতে এবং বৃহত্তর গ্রাহকগোষ্ঠীর কাছে পৌঁছাতে সহায়তা করে।</li>
  <li><strong>ক্রেতাদের জন্য:</strong> ক্রেতারা সাইটে রেজিস্ট্রেশন করে বিভিন্ন পণ্য ব্রাউজ করতে, অর্ডার করতে এবং তাদের অর্ডারের স্ট্যাটাস ট্র্যাক করতে পারেন।</li>
</ul>

<h4>2. বাই এন্ড সেল:</h4>
<p>যাদের নিজস্ব স্টোর নেই, তারাও এই মডিউলের মাধ্যমে সহজেই পণ্য কিনতে বা বিক্রি করতে পারেন। পুরাতন বা নতুন পণ্য কেনা-বেচার জন্য এটি একটি সহজ উপায়।</p>

<h4>3. ডোনেশন সুবিধা:</h4>
<p>ব্যবহারকারীরা তাদের অপ্রয়োজনীয় জিনিসপত্র ডোনেট করতে পারেন। অন্যরা এই ডোনেশন সেকশন থেকে প্রয়োজনীয় পণ্য সংগ্রহ করতে পারেন, যা সমাজে সহানুভূতির বন্ধনকে আরও দৃঢ় করে।</p>

<h3>Guptodhan.com-এর বিশেষ ফিচারসমূহ:</h3>
<ul>
  <li><strong>নিরাপদ লেনদেন:</strong> সাইটটি নিরাপদ পেমেন্ট গেটওয়ে ব্যবহার করে, যা ক্রেতা ও বিক্রেতাদের জন্য সুরক্ষিত লেনদেন নিশ্চিত করে।</li>
  <li><strong>ব্যবহারকারী-বান্ধব ইন্টারফেস:</strong> সহজ নেভিগেশন এবং পরিষ্কার ডিজাইনের মাধ্যমে ব্যবহারকারীরা সহজেই সাইটটি ব্যবহার করতে পারেন।</li>
  <li><strong>গ্রাহক সহায়তা:</strong> ২৪/৭ গ্রাহক সহায়তা সুবিধা রয়েছে, যা ব্যবহারকারীদের যেকোনো সমস্যায় সহায়তা করে।</li>
</ul>

<h3>Guptodhan.com কেন ব্যবহার করবেন?</h3>
<p>Guptodhan.com শুধুমাত্র একটি ই-কমার্স প্ল্যাটফর্ম নয়; এটি একটি কমিউনিটি যেখানে মানুষ তাদের প্রয়োজনীয় পণ্য কিনতে, বিক্রি করতে এবং ডোনেশন করতে পারে। এর উদ্ভাবনী ফিচার এবং ব্যবহারকারী-বান্ধব ইন্টারফেস ব্যবহারকারীদের সন্তুষ্টি নিশ্চিত করে।</p>

<p>#Guptodhan #Ecommerce #OnlineShopping #DonationPlatform #DigitalMarketplace</p>
`);

  const handleCancel = () => {
    alert('Cancel clicked! Form reset to static values.');
  };

  const handleDone = () => {
    const formData = {
      image: preview,
      title,
      btnText,
      btnLink,
      status,
      content,
    };

    console.log('CTA Form Data:', formData);
    alert('Form Submitted:\n' + JSON.stringify(formData, null, 2));
  };

  const handleRemove = () => {
    alert('Remove clicked! Image removed (static example).');
  };

  return (
    <div className="grid grid-cols-6 gap-2">
      <div className="col-span-2 space-y-4">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="cta_image">
            CTA Image <span className="text-red-500">*</span>
          </Label>
          <div className="relative border border-gray-300 rounded p-2 h-52 flex flex-col items-center justify-center">
            <img
              src={preview}
              alt="CTA Preview"
              className="object-contain h-full w-full"
            />
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleRemove}>
              Remove
            </Button>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="btn_text">CTA Button Text</Label>
          <Input
            type="text"
            id="btn_text"
            value={btnText}
            onChange={e => setBtnText(e.target.value)}
          />
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="btn_link">CTA Button Link</Label>
          <Input
            type="text"
            id="btn_link"
            value={btnLink}
            onChange={e => setBtnLink(e.target.value)}
          />
        </div>
      </div>

      <div className="col-span-4 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">
            CTA Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          <p className="text-xs font-semibold mb-2 mt-2">CTA Description</p>
          <RichTextEditor value={content} onChange={setContent} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select One" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Active</SelectItem>
                <SelectItem value="0">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-start items-center w-full">
          <div className="flex flex-wrap gap-2">
            <Button variant="destructive" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleDone}>Done</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
