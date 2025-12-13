import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function FooterLinks() {
  return (
    <div className="bg-gray-100">
      <div className="max-w-[95vw] xl:max-w-[90vw] mx-auto px-4 grid justify-between py-20 grid-cols-1 md:grid-cols-12 gap-4">
        <div className="image col-span-2">
          <Image src="/img/logo.png" width={130} height={44} alt="logo" />
        </div>
        <div className="col-span-10">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <ul>
              <li>
                <Link href={'#'} className="text-base">
                  About
                </Link>
              </li>
              <li>
                <Link href={'#'} className="text-gray-500">
                  About Us
                </Link>
              </li>
              <li>
                <Link href={'#'} className="text-gray-500">
                  Our Branches
                </Link>
              </li>
              <li>
                <Link href={'#'} className="text-gray-500">
                  Changelog
                </Link>
              </li>
            </ul>
            <ul>
              <li>
                <Link href={'#'} className="text-base">
                  Quick Links
                </Link>
              </li>
              <li>
                <Link href={'#'} className="text-gray-500">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href={'#'} className="text-gray-500">
                  Recipes
                </Link>
              </li>
              <li>
                <Link href={'#'} className="text-gray-500">
                  Contact Us
                </Link>
              </li>
            </ul>
            <ul>
              <li>
                <Link href={'#'} className="text-base">
                  Help & Support
                </Link>
              </li>
              <li>
                <Link href={'#'} className="text-gray-500">
                  Terms of Privacy
                </Link>
              </li>
              <li>
                <Link href={'#'} className="text-gray-500">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href={'#'} className="text-gray-500">
                  Security
                </Link>
              </li>
            </ul>
            <ul>
              <li>
                <Link href={'#'} className="text-base">
                  Company
                </Link>
              </li>
              <li>
                <Link href={'#'} className="text-gray-500">
                  Blog
                </Link>
              </li>
              <li>
                <Link href={'#'} className="text-gray-500">
                  Contact
                </Link>
              </li>
            </ul>
            <ul>
              <li>
                <Link href={'#'} className="text-base">
                  Social
                </Link>
              </li>
              <li>
                <Link href={'#'} className="text-gray-500">
                  Facebook
                </Link>
              </li>
              <li>
                <Link href={'#'} className="text-gray-500">
                  Instagram
                </Link>
              </li>
              <li>
                <Link href={'#'} className="text-gray-500">
                  Twitter
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
