'use client';

import { navigationData } from '@/data/navigation_data';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function MobailMenuBtn() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="p-2 bg-blue-600 text-white rounded-md focus:outline-none">
        {mobileOpen ? '✕' : '☰'}
      </button>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mt-2 bg-blue-700 text-white rounded-md shadow-md">
          {navigationData.map(nav => (
            <div key={nav.title} className="border-b border-blue-600">
              {/* Main Menu */}
              <button
                onClick={() =>
                  setOpenSubmenu(openSubmenu === nav.title ? null : nav.title)
                }
                className="w-full flex justify-between items-center px-4 py-3 font-semibold hover:bg-blue-600 transition">
                {nav.title}
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    openSubmenu === nav.title ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Submenu Accordion */}
              {openSubmenu === nav.title && (
                <div className="flex flex-col bg-blue-800">
                  {nav.subtitles.map(sub => (
                    <Link
                      key={sub.title}
                      href={sub.href}
                      className="px-6 py-2 text-sm hover:bg-blue-600 transition">
                      {sub.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Buy & Sale + Donation buttons */}
          <div className="flex flex-col px-4 py-3 gap-2">
            <Link
              href="/buy-sell"
              className="bg-blue-500 text-white text-center py-2 rounded-md hover:bg-blue-600 transition">
              🏠 Buy & Sale
            </Link>
            <Link
              href="/donation"
              className="bg-green-500 text-white text-center py-2 rounded-md hover:bg-green-600 transition">
              💰 Donation
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
