'use client';

import { Card, CardTitle } from '@/components/ui/card';
import { Facebook, Instagram, Twitter, Linkedin, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { StoreData } from './types';

interface StoreSocialLinksProps {
  socialLinks: StoreData['storeSocialLinks'];
}

export default function StoreSocialLinks({ socialLinks }: StoreSocialLinksProps) {
  if (!socialLinks || (!socialLinks.facebook && !socialLinks.instagram && !socialLinks.twitter && !socialLinks.linkedIn && !socialLinks.whatsapp)) {
    return null;
  }

  return (
    <Card className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
      <div className=" sm:p-4 md:p-6 pb-1 sm:pb-2">
        <CardTitle className="text-base sm:text-lg">Follow Us</CardTitle>
      </div>
      <div className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {socialLinks.facebook && (
            <Link
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
            >
              <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Facebook</span>
            </Link>
          )}
          {socialLinks.instagram && (
            <Link
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors text-xs sm:text-sm"
            >
              <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Instagram</span>
            </Link>
          )}
          {socialLinks.twitter && (
            <Link
              href={socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors text-xs sm:text-sm"
            >
              <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Twitter</span>
            </Link>
          )}
          {socialLinks.linkedIn && (
            <Link
              href={socialLinks.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-xs sm:text-sm"
            >
              <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">LinkedIn</span>
            </Link>
          )}
          {socialLinks.whatsapp && (
            <Link
              href={`https://wa.me/${socialLinks.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs sm:text-sm"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}

