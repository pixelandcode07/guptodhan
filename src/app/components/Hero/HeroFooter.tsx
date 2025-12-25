'use client';

import { Button } from '@/components/ui/button';
import { heroFooterData } from '@/data/hero_foot-data';
import { HandCoins, HeartHandshake, House, Construction } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';

export default function HeroFooter() {
  const [open, setOpen] = useState(false);

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpen(true);
  };

  return (
    <>
      {/* Desktop Version */}
      <div className="max-w-[90vw] mx-auto mt-5 px-4 hidden lg:flex justify-around bg-gray-100 items-center gap-4 py-2 rounded-md overflow-x-auto">
        {heroFooterData.map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            onClick={handleItemClick}
            className="flex bg-white items-center justify-around gap-3 py-5 px-8 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
          >
            <div className="flex-shrink-0">
              <Image src={item.icon} alt={item.title} width={44} height={44} className="object-contain" />
            </div>
            <div>
              <h6 className="text-[#00005E] font-semibold text-sm tracking-tight">
                {item.title}
              </h6>
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile Version */}
      <div className="lg:hidden flex justify-center items-center gap-3 py-3 px-4 bg-white rounded-md overflow-x-auto">
        <Link href={'/home/buyandsell'}>
          <Button variant={'HomeBuy'} size={'lg'} className="rounded-lg min-w-[120px]">
            <House size={28} className="hidden md:block" />
            <span className="text-sm font-medium">Buy & Sale</span>
          </Button>
        </Link>
        <Link href={'/home/donation'}>
          <Button variant={'HomeDoante'} size={'lg'} className="rounded-lg min-w-[120px]">
            <HandCoins size={28} className="hidden md:block" />
            <span className="text-sm font-medium">Donation</span>
          </Button>
        </Link>
        <Button variant={'HomeServices'} size={'lg'} className="rounded-lg min-w-[120px]">
          <HeartHandshake size={28} className="hidden md:block" />
          <span className="text-sm font-medium">Services</span>
        </Button>
      </div>

      {/* Dialog for "Work in Progress" */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 mb-4">
              <Construction className="h-12 w-12 text-yellow-600 animate-pulse" />
            </div>
            <DialogTitle className="text-center text-2xl font-bold text-gray-800">
              Page Under Development
            </DialogTitle>
            <DialogDescription className="text-center text-base text-gray-600 mt-3">
              This feature is currently being built with care. <br />
              We&apos;re working hard to bring it to you soon!
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex justify-center">
            <Button onClick={() => setOpen(false)} size="lg" className="px-8">
              Got it, Thanks!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}