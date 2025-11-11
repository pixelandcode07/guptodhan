'use client';

import Link from 'next/link';
import { Move } from 'lucide-react';

type RearrangeButtonProps = {
  href: string;
  label?: string;
  className?: string;
};

export default function RearrangeButton({ href, label, className }: RearrangeButtonProps) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 border rounded bg-white hover:bg-gray-50 flex items-center justify-center gap-2 text-sm ${className || ''}`}
    >
      <Move className="w-4 h-4" />
      <span className="hidden sm:inline">{label || 'Rearrange'}</span>
      <span className="sm:hidden">Rearrange</span>
    </Link>
  );
}


