// components/Footer.tsx
import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full border-t bg-gray-50">
      <div className=" px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
          <div>{new Date().getFullYear()} © Guptodhan</div>
          <div className="hidden sm:block text-right">
            Developed by Pixel & Code
          </div>
        </div>
      </div>
    </footer>
  );
}
