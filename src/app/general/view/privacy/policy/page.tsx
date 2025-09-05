'use client';
import { RichTextEditor } from '@/components/ReusableComponents/RichTextEditor';
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
    `Welcome to Guptodhan! We value your trust and are committed to protecting your personal information. This Privacy Policy outlines how Guptodhan collects, uses, discloses, and protects your data when you use our services.

1. Information We Collect
When you use Guptodhan, we may collect the following types of information:

a. Personal Information:

Name

Email address

Phone number

Billing and shipping address

Payment details (processed securely by third-party payment providers)

b. Non-Personal Information:

Browser type

Device information

IP address

Cookies and usage data

c. Vendor Information:

Business name

Tax identification number

Product details and descriptions

2. How We Use Your Information
We use the information collected for the following purposes:

Account Creation and Management: To register your account and provide access to our services.

Order Fulfillment: To process and deliver your orders.

Customer Support: To respond to inquiries, resolve issues, and offer support.

Marketing and Promotions: To send you updates, promotional offers, and newsletters (with your consent).

Improving Our Services: To analyze user behavior and improve our platform's functionality.

3. Sharing Your Information
We do not sell or rent your personal information to third parties. However, we may share your information in the following scenarios:

With Vendors: When you place an order, your information is shared with the relevant vendor to fulfill your request.

With Service Providers: We may share information with trusted third-party service providers who assist us in operating our platform, such as payment processors, delivery partners, and hosting services.

For Legal Reasons: If required by law or to protect our rights and interests.

4. Cookies and Tracking Technologies
Guptodhan uses cookies and similar tracking technologies to enhance user experience. You can manage cookie preferences through your browser settings.

5. Data Security
We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction.

6. Your Rights
You have the following rights concerning your personal data:

Access: Request access to your personal information.

Correction: Request correction of any inaccurate or incomplete data.

Deletion: Request deletion of your personal information (subject to legal and contractual obligations).

Data Portability: Request a copy of your data in a machine-readable format.

To exercise these rights, please contact us at [Insert Contact Email].

7. Third-Party Links
Our platform may contain links to third-party websites. We are not responsible for the privacy practices of these external sites.

8. Changes to This Privacy Policy
We may update this Privacy Policy from time to time. Any changes will be posted on this page with the updated effective date.

9. Contact Us
If you have any questions or concerns about this Privacy Policy, please contact us at:

Guptodhan Support Team
Email: info@guptodhan.com
Phone: 01816500600

Thank you for choosing Guptodhan!`
  );

  return (
    <div className="bg-white pt-5">
      <SectionTitle text="Privacy Policy Update Form" />

      <div className="p-5">
        <p>Write Privacy Policies Here :</p>
        {/* এখন plain text কে HTML এ কনভার্ট করে পাঠাচ্ছি */}
        <RichTextEditor value={plainToHtml(text)} onChange={setText} />
        <div className="flex justify-center items-center py-7">
          <Button>Update Privacy Policy</Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
