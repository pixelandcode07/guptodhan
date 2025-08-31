'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { sidebarData } from '@/data/sidebar';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const [openModule, setOpenModule] = useState<string | null>(null);

  const toggleModule = (title: string) => {
    setOpenModule(openModule === title ? null : title);
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0  bg-opacity-30 z-20 transition-opacity lg:hidden ${
          open ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setOpen(false)}
      />

      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#17263A] shadow-lg transform transition-transform duration-300
        ${
          open ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:shadow-none text-gray-300 flex flex-col`}>
        {/* 🔒 Fixed Logo Section */}
        <div className="p-3 text-xl flex justify-center items-center font-bold border-b flex-shrink-0 bg-[#17263A]">
          <Image src="/guptodhan.png" alt="Logo" width={150} height={45} />
        </div>

        {/* 🔽 Scrollable Links Section */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {/* Main Navigation */}
          {sidebarData.navMain.map(item => (
            <Link
              key={item.title}
              href={item.url}
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-700 hover:text-white transition-colors"
              onClick={() => setOpen(false)}>
              <item.icon size={18} />
              {item.title}
            </Link>
          ))}

          {/* Documents */}
          <div className="mt-4 border-t pt-4">
            {sidebarData.documents.map(item => (
              <Link
                key={item.title}
                href={item.url}
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-700 hover:text-white transition-colors"
                onClick={() => setOpen(false)}>
                <item.icon size={18} />
                {item.title}
              </Link>
            ))}
          </div>

          {/* Ecommerce Modules */}
          <div className="mt-4 border-t pt-4 space-y-2">
            {sidebarData.ecommerceModules.map(module => (
              <div key={module.title}>
                <button
                  className="flex justify-between w-full p-2 rounded hover:bg-gray-700 transition-colors font-semibold"
                  onClick={() => toggleModule(module.title)}>
                  <div className="flex items-center gap-2">
                    <module.icon size={18} />
                    {module.title}
                  </div>
                  <span
                    className={`transition-transform ${
                      openModule === module.title ? 'rotate-90' : 'rotate-0'
                    }`}>
                    ▸
                  </span>
                </button>

                {openModule === module.title && (
                  <div className="ml-6 mt-1 space-y-1">
                    {module.items.map(item => (
                      <Link
                        key={item.title}
                        href={item.url}
                        className="block p-2 rounded hover:bg-gray-700 hover:text-white transition-colors"
                        onClick={() => setOpen(false)}>
                        {item.title} {item.count && `(${item.count})`}{' '}
                        {item.isNew && (
                          <span className="text-green-400">New</span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}
