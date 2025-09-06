'use client';
import { RichTextEditor } from '@/components/RichTextEditor/RichTextEditor';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/ui/SectionTitle';
import React, { useState } from 'react';

// helper (same logic যেটা editor এ ব্যবহার করছি)
const plainToHtml = (text: string) => {
  if (!text) return '';
  if (/<[a-z][\s\S]*>/i.test(text)) return text; // already HTML
  return text
    .split('\n')
    .map(line => `<p>${line || '<br>'}</p>`)
    .join('');
};

const Page = () => {
  const [text, setText] = useState(
    `Eru BD and Eru smart Tech has a unique return policy if the customer has a change of mind.

Return Policy (English):


Eligibility for Returns:

Products can be returned within 7 days from the date of purchase.

The item must be in unused condition, with original packaging, manuals, and all accessories intact.

A valid purchase receipt or invoice is required for all returns.

Non-Returnable Items:

Items that have been physically damaged or altered by the customer.
Earphones, screen protectors, and other consumable items are not eligible for return.

Return Process:

Customers must contact us through our store, website, phone or Facebook page to initiate a return.

Our Facebook Page is www.fb.com/erubiponi 

Our representative will verify the product if the product is applicable for return. 

After verification, the item can either be exchanged or a store credit can be issued. 

Cash refunds are only available for unavailability of the product. 

Restocking Fee:

A 13% of restocking and warranty activation fee will be applied to returns without defects. 

1500 taka will be added more with 13% if the warranty is activated( if inserted sim card or connected with internet anyhow)

Defective Products:

If the product is found to be defective by the representative, it cannot be exchanged but repaired under the shop warranty.


ইরু বাংলাদেশ বা ইরু স্মার্ট টেক হতে কেনা পন্যের রিটার্ন পলিসি (Bengali):

ফেরতের যোগ্যতা:

পণ্যটি ক্রয়ের ৭ দিনের মধ্যে নির্দিষ্ট কিছু শর্ত মেনে ফেরত দেওয়া যাবে।

১। পণ্যটি অব্যবহৃত অবস্থায় থাকতে হবে।

২। মূল প্যাকেজিং, ম্যানুয়াল এবং সমস্ত আনুষাঙ্গিক অক্ষত অবস্থায় থাকতে হবে। 

৩। ফেরতের জন্য একটি আউটলেট কর্তৃক ইসকৃত রশিদটি থাকতে হবে। 

যে পণ্য ফেরত দেওয়া যাবে না:

১। পণ্য যদি গ্রাহক দ্বারা  ক্ষতিগ্রস্থ বা পরিবর্তিত হয়ে থাকে তাহলে পণ্যটি রিটার্ন করা যাবে না। 

২। ইয়ারফোন, স্ক্রিন প্রোটেক্টর, এবং অন্যান্য ব্যবহৃত জিনিস নষ্ট হলে পণ্যটি ফেরার যোগ্য নয় বলে বিবেচিত হবে। 

ফেরত প্রক্রিয়া:

গ্রাহকরা আমাদের শো-রুম, ওয়েবসাইট, ফোন বা ফেসবুক পেজ এর মাধ্যমে যোগাযোগ করে ফেরত প্রক্রিয়া শুরু করতে পারবেন।

ফেরত দিতে চাওয়া পণ্যটি আমাদের একজন প্রতিনিধি যাচাই করে সিদ্ধান্ত নিবেন যে পণ্যটি পরিবর্তন করা যাবে কি না, বা ক্যাশ ক্রেডিট দেওয়া হবে কি না। এ বিষয়ে হেরো স্মার্ট টেক কর্তৃপক্ষের নেওয়া সিদ্ধান্ত চূড়ান্ত সিদ্ধান্ত। পন্যে ত্রুটি পাওয়া গেলে ঐ পন্য ফেরত অযোগ্য বলে বিবেচিত হবে

 সিদ্ধান্ত যদি গ্রহীতা মেনে থাকেন তাহলেই কেবল এই প্রক্রিয়া সম্পন্ন হবে। 
ক্রেতার দেওয়া কোন সিদ্ধান্ত ইরু স্মার্ট টেক মানতে বাধ্য নয়। 


নগদ টাকা ফেরত শুধুমাত্র পণ্যের রিপ্লেসমেন্ট না থাকলে তখন প্রযোজ্য হবে। এবং তা ক্রয়ের ৩ দিনের মধ্যে করতে হবে।

রিস্টকিং ফি:

কোন রকম ত্রুটি ছাড়া ফেরতের জন্য ১৩% রিস্টকিং ফি এবং রি-ওয়ারেন্টি ফি প্রযোজ্য।

১৩% এর সাথে সাথে ওয়ারেন্টি ভায়োলেশনে হলে(সিম লাগানো হলে বা ইন্টারনেট কানেকশন করা হলে) ১৩% এর সাথে আরো ১৫০০ টাকা যুক্ত হবে।


ত্রুটিযুক্ত পণ্য:

যদি পণ্যটি ত্রুটিযুক্ত প্রমাণিত হয়, তবে এটি পরিবর্তন বা ফেরত দেওয়া যাবে না। তবে ওয়ারেন্টিনীতিমালা অনুযায়ী মেরামত করা যাবে।

 

 

 রিটার্ন পলিসির বিষয়ে ইরু স্মার্ট টেক যেকোনো সময় যেকোন পরিবর্তন পরিবর্তন সংযোজন বিয়োজন এর অধিকার সংরক্ষণ করে। 

 

 Eru Smart tech has right to change the policy any time without notice.`
  );

  return (
    <div className="bg-white pt-5">
      <SectionTitle text="Return Policy Update Form" />

      <div className="p-5">
        <p>Write Return Policies Here :</p>
        {/* এখন plain text কে HTML এ কনভার্ট করে পাঠাচ্ছি */}
        <RichTextEditor value={plainToHtml(text)} onChange={setText} />
        <div className="flex justify-center items-center py-7">
          <Button>Update Return Policy</Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
