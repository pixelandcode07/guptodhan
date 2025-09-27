'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/general/view/footer/widget/1', label: 'Footer Widget 1' },
  { href: '/general/view/footer/widget/2', label: 'Footer Widget 2' },
  { href: '/general/view/footer/widget/3', label: 'Footer Widget 3' },
  { href: '/general/view/footer/widget/social/links', label: 'Social Links' },
];

export default function FooterWidgetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="border mt-5">
      <div className=" pl-5 text-xl font-semibold  py-4  border-b-[1px]">
        Footer Settings
      </div>
      <div className="grid grid-cols-1  md:grid-cols-8 ">
        {/* Left Sidebar Tabs */}
        <div className=" bg-white rounded-md md:col-span-2">
          {tabs.map(tab => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`block px-3 border-b py-4 text-center  text-sm font-medium ${
                pathname === tab.href
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}>
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Right Side Content */}
        <div className="md:col-span-6 bg-white border-l">{children}</div>
      </div>
    </div>
  );
}
