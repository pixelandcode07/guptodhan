'use client'; // this component handles all client-side interactivity

import RichTextEditor from '@/components/ReusableComponents/RichTextEditor';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';

export default function PrivacyForm() {
  const [content, setContent] =
    useState(`  <p>Welcome to Guptodhan! We value your trust and are committed to protecting your personal information. This Privacy Policy outlines how Guptodhan collects, uses, discloses, and protects your data when you use our services.</p>

  <h2>1. Information We Collect</h2>
  <p>When you use Guptodhan, we may collect the following types of information:</p>

  <h3>a. Personal Information:</h3>
  <ul>
    <li>Name</li>
    <li>Email address</li>
    <li>Phone number</li>
    <li>Billing and shipping address</li>
    <li>Payment details (processed securely by third-party payment providers)</li>
  </ul>

  <h3>b. Non-Personal Information:</h3>
  <ul>
    <li>Browser type</li>
    <li>Device information</li>
    <li>IP address</li>
    <li>Cookies and usage data</li>
  </ul>

  <h3>c. Vendor Information:</h3>
  <ul>
    <li>Business name</li>
    <li>Tax identification number</li>
    <li>Product details and descriptions</li>
  </ul>

  <h2>2. How We Use Your Information</h2>
  <p>We use the information collected for the following purposes:</p>
  <ul>
    <li><strong>Account Creation and Management:</strong> To register your account and provide access to our services.</li>
    <li><strong>Order Fulfillment:</strong> To process and deliver your orders.</li>
    <li><strong>Customer Support:</strong> To respond to inquiries, resolve issues, and offer support.</li>
    <li><strong>Marketing and Promotions:</strong> To send you updates, promotional offers, and newsletters (with your consent).</li>
    <li><strong>Improving Our Services:</strong> To analyze user behavior and improve our platform's functionality.</li>
  </ul>

  <h2>3. Sharing Your Information</h2>
  <p>We do not sell or rent your personal information to third parties. However, we may share your information in the following scenarios:</p>
  <ul>
    <li><strong>With Vendors:</strong> When you place an order, your information is shared with the relevant vendor to fulfill your request.</li>
    <li><strong>With Service Providers:</strong> We may share information with trusted third-party service providers who assist us in operating our platform, such as payment processors, delivery partners, and hosting services.</li>
    <li><strong>For Legal Reasons:</strong> If required by law or to protect our rights and interests.</li>
  </ul>

  <h2>4. Cookies and Tracking Technologies</h2>
  <p>Guptodhan uses cookies and similar tracking technologies to enhance user experience. You can manage cookie preferences through your browser settings.</p>

  <h2>5. Data Security</h2>
  <p>We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction.</p>

  <h2>6. Your Rights</h2>
  <p>You have the following rights concerning your personal data:</p>
  <ul>
    <li><strong>Access:</strong> Request access to your personal information.</li>
    <li><strong>Correction:</strong> Request correction of any inaccurate or incomplete data.</li>
    <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal and contractual obligations).</li>
    <li><strong>Data Portability:</strong> Request a copy of your data in a machine-readable format.</li>
  </ul>
  <p>To exercise these rights, please contact us at <a href="mailto:info@guptodhan.com">info@guptodhan.com</a>.</p>

  <h2>7. Third-Party Links</h2>
  <p>Our platform may contain links to third-party websites. We are not responsible for the privacy practices of these external sites.</p>

  <h2>8. Changes to This Privacy Policy</h2>
  <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with the updated effective date.</p>

  <h2>9. Contact Us</h2>
  <p>If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
  <p>
    <strong>Guptodhan Support Team</strong><br>
    Email: <a href="mailto:info@guptodhan.com">info@guptodhan.com</a><br>
    Phone: 01816500600
  </p>

  <p>Thank you for choosing Guptodhan!</p>`);

  const handleUpdate = () => {
    // handle update logic here, e.g., send content to backend
    console.log('Updated Terms:', content);
    alert('Terms and Conditions Updated Successfully!');
  };

  return (
    <div>
      <RichTextEditor value={content} onChange={setContent} />
      <div className="flex justify-center items-center py-7">
        <Button onClick={handleUpdate}>Update Privacy Policy</Button>
      </div>
    </div>
  );
}
