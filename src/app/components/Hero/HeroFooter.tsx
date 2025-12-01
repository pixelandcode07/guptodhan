import { Button } from '@/components/ui/button';
import { heroFooterData } from '@/data/hero_foot-data';
import { HandCoins, HeartHandshake, House } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function HeroFooter() {
  return (
    <>
      <div className="max-w-[90vw] mx-auto px-4 hidden lg:flex justify-around bg-gray-100 items-center gap-4 py-2 rounded-md overflow-x-auto">
        {heroFooterData.map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className="flex bg-white items-center justify-around gap-2 py-4 px-6 rounded-md">
            <div>
              <Image src={item.icon} alt="hero-image" width={40} height={40} />
            </div>
            <div>
              <h6 className="text-[#00005E] font-medium text-[10px] leading-[14px] tracking-[0.5px]">
                {item.title}
              </h6>
            </div>
          </Link>
        ))}
      </div>
      <div className="lg:hidden flex justify-center items-center gap-4 py-2 md:px-4 bg-white rounded-md overflow-x-auto">
        <div className="flex items-center justify-center py-4 md:px-6 rounded-md">
          <Button variant={'HomeBuy'} size={'lg'} className="rounded-none">
            <House size={32} className='hidden md:block'  />
            <Link href={'/home/buyandsell'}>Buy & Sale</Link>
          </Button>
          <Button variant={'HomeDoante'} size={'lg'} className="rounded-none">
            <HandCoins size={32} className='hidden md:block' />
            <Link href={'/home/donation'}>Donation</Link>
          </Button>
          <Button variant={'HomeServices'} size={'lg'} className="rounded-none">
            <HeartHandshake size={32} className='hidden md:block' />
            <Link href={'/home/donate'}>Services</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
