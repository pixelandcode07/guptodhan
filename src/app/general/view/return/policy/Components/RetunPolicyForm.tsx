'use client'; // this component handles all client-side interactivity

import RichTextEditor from '@/components/ReusableComponents/RichTextEditor';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';

export default function ReturnPolicyForm() {
  const [content, setContent] = useState(` <h2>Return Policy (English)</h2>

<h3>Eligibility for Returns:</h3>
<ul>
  <li>Products can be returned within 7 days from the date of purchase.</li>
  <li>The item must be in unused condition, with original packaging, manuals, and all accessories intact.</li>
  <li>A valid purchase receipt or invoice is required for all returns.</li>
</ul>

<h3>Non-Returnable Items:</h3>
<ul>
  <li>Items that have been physically damaged or altered by the customer.</li>
  <li>Earphones, screen protectors, and other consumable items are not eligible for return.</li>
</ul>

<h3>Return Process:</h3>
<ul>
  <li>Customers must contact us through our store, website, phone, or Facebook page to initiate a return.</li>
  <li>Our Facebook Page is <a href="https://www.fb.com/erubiponi" target="_blank">www.fb.com/erubiponi</a></li>
  <li>Our representative will verify the product if it is applicable for return.</li>
  <li>After verification, the item can either be exchanged or a store credit can be issued.</li>
  <li>Cash refunds are only available for unavailability of the product.</li>
</ul>

<h3>Restocking Fee:</h3>
<ul>
  <li>A 13% restocking and warranty activation fee will be applied to returns without defects.</li>
  <li>1500 Taka will be added to the 13% fee if the warranty is activated (if a SIM card is inserted or connected to the internet).</li>
</ul>

<h3>Defective Products:</h3>
<ul>
  <li>If the product is found to be defective by the representative, it cannot be exchanged but repaired under the shop warranty.</li>
</ul>

<hr>

<h2>ইরু বাংলাদেশ বা ইরু স্মার্ট টেক ফেরতের নীতি (Bengali)</h2>

<h3>ফেরতের যোগ্যতা:</h3>
<ul>
  <li>পণ্যটি ক্রয়ের ৭ দিনের মধ্যে নির্দিষ্ট কিছু শর্ত মেনে ফেরত দেওয়া যাবে।</li>
  <li>পণ্যটি অব্যবহৃত অবস্থায় থাকতে হবে।</li>
  <li>মূল প্যাকেজিং, ম্যানুয়াল এবং সমস্ত আনুষাঙ্গিক অক্ষত অবস্থায় থাকতে হবে।</li>
  <li>ফেরতের জন্য একটি আউটলেট কর্তৃক ইসকৃত রশিদটি থাকতে হবে।</li>
</ul>

<h3>যে পণ্য ফেরত দেওয়া যাবে না:</h3>
<ul>
  <li>পণ্য যদি গ্রাহক দ্বারা ক্ষতিগ্রস্থ বা পরিবর্তিত হয়ে থাকে তাহলে পণ্যটি রিটার্ন করা যাবে না।</li>
  <li>ইয়ারফোন, স্ক্রিন প্রোটেক্টর, এবং অন্যান্য ব্যবহৃত জিনিস নষ্ট হলে পণ্যটি ফেরার যোগ্য নয়।</li>
</ul>

<h3>ফেরত প্রক্রিয়া:</h3>
<ul>
  <li>গ্রাহকরা আমাদের শো-রুম, ওয়েবসাইট, ফোন বা ফেসবুক পেজ এর মাধ্যমে যোগাযোগ করে ফেরত প্রক্রিয়া শুরু করতে পারবেন।</li>
  <li>ফেরত দিতে চাওয়া পণ্যটি আমাদের একজন প্রতিনিধি যাচাই করে সিদ্ধান্ত নিবেন যে পণ্যটি পরিবর্তন করা যাবে কি না, বা ক্যাশ ক্রেডিট দেওয়া হবে কি না।</li>
  <li>সিদ্ধান্ত যদি গ্রাহক মেনে থাকেন, কেবল তখনই প্রক্রিয়া সম্পন্ন হবে।</li>
  <li>নগদ টাকা ফেরত শুধুমাত্র পণ্যের রিপ্লেসমেন্ট না থাকলে এবং ক্রয়ের ৩ দিনের মধ্যে প্রযোজ্য হবে।</li>
</ul>

<h3>রিস্টকিং ফি:</h3>
<ul>
  <li>কোন রকম ত্রুটি ছাড়া ফেরতের জন্য ১৩% রিস্টকিং ফি এবং রি-ওয়ারেন্টি ফি প্রযোজ্য।</li>
  <li>১৩% ফিরের সাথে ওয়ারেন্টি ভায়োলেশন হলে (সিম লাগানো বা ইন্টারনেট কানেকশন) ১৫০০ টাকা অতিরিক্ত যুক্ত হবে।</li>
</ul>

<h3>ত্রুটিযুক্ত পণ্য:</h3>
<ul>
  <li>যদি পণ্যটি ত্রুটিযুক্ত প্রমাণিত হয়, তবে এটি পরিবর্তন বা ফেরত দেওয়া যাবে না। তবে ওয়ারেন্টি নীতিমালা অনুযায়ী মেরামত করা যাবে।</li>
</ul>

<p>রিটার্ন পলিসি ইরু স্মার্ট টেক যেকোনো সময় পরিবর্তন, সংযোজন বা বিয়োজন করার অধিকার সংরক্ষণ করে।</p>

<p>Eru Smart Tech has the right to change the policy at any time without notice.</p>
`);

  const handleUpdate = () => {
    // handle update logic here, e.g., send content to backend
    console.log('Updated Terms:', content);
    alert('Terms and Conditions Updated Successfully!');
  };

  return (
    <div>
      <RichTextEditor value={content} onChange={setContent} />
      <div className="flex justify-center items-center py-7">
        <Button onClick={handleUpdate}>Update Return Policy</Button>
      </div>
    </div>
  );
}
