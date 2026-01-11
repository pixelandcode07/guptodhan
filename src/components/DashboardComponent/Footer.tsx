// components/Footer.tsx
import Link from 'next/link';
import React from 'react';

export default function Footer() {
  return (
    <footer className="max-w-[95vw] xl:max-w-[90vw] mx-auto px-4 border-t bg-gray-50">
      <div className=" px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
          <div>{new Date().getFullYear()} © Guptodhan</div>
          <div className="hidden sm:block text-right">
            Developed by   
          </div>
        </div>
      </div>
    </footer>
  );
}
