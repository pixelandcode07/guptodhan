'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// আপনার banner.interface.ts ফাইল থেকে interface টি এখানে ব্যবহার করুন।
// যদি এটি server-only ফাইলে থাকে, তবে ক্লায়েন্ট কম্পোনেন্টের জন্য interface টি ডুপ্লিকেট করতে পারেন।
export interface IEcommerceBanner {
  _id: string; // Mongoose Document _id যোগ করা হলো
  bannerImage: string;
  bannerPosition: 'top-homepage' | 'left-homepage' | 'right-homepage' | 'middle-homepage' | 'bottom-homepage' | 'top-shoppage';
  textPosition: 'left' | 'right';
  bannerLink?: string;
  subTitle?: string;
  bannerTitle: string;
  bannerDescription?: string;
  buttonText?: string;
  buttonLink?: string;
  status: 'active' | 'inactive';
}

// আপনার API থেকে যে ফরম্যাটে রেসপন্স আসে তার জন্য একটি টাইপ
interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export default function HeroImage() {
  // বড় ব্যানারটির জন্য (top-homepage)
  const [topBanner, setTopBanner] = useState<IEcommerceBanner | null>(null);
  // ডানপাশের ব্যানারগুলোর জন্য (right-homepage)
  const [rightBanners, setRightBanners] = useState<IEcommerceBanner[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // --- ১. বড় ব্যানারটি ফেচ করা (top-homepage) ---
        const topRes = await fetch('/api/v1/public/ecommerce-banners?position=top-homepage');
        if (!topRes.ok) throw new Error('Failed to fetch top banner');
        
        const topData: ApiResponse<IEcommerceBanner[]> = await topRes.json();
        
        // getPublicBannersByPosition একটি array রিটার্ন করে, তাই প্রথম আইটেমটি নিচ্ছি
        if (topData.success && topData.data.length > 0) {
          setTopBanner(topData.data[0]);
        }

        // --- ২. ডানপাশের ব্যানারগুলো ফেচ করা (right-homepage) ---
        const rightRes = await fetch('/api/v1/public/ecommerce-banners?position=right-homepage');
        if (!rightRes.ok) throw new Error('Failed to fetch right banners');
        
        const rightData: ApiResponse<IEcommerceBanner[]> = await rightRes.json();
        
        if (rightData.success) {
          setRightBanners(rightData.data); // এখানে পুরো array টিই সেট করছি
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []); // এই useEffect শুধু কম্পোনেন্ট মাউন্ট হওয়র সময় রান করবে

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        {/* একটি সিম্পল লোডিং স্কেলিটন */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 h-[400px] bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="h-[190px] bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-[190px] bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto px-4 py-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* === বাম পাশের বড় ব্যানার === */}
        <div className="lg:col-span-2">
          {topBanner ? (
            <Link href={topBanner.bannerLink || '#'} className="block w-full h-[250px] md:h-[350px] lg:h-[400px] relative rounded-lg overflow-hidden group">
              <Image
                src={topBanner.bannerImage}
                alt={topBanner.bannerTitle}
                fill
                style={{ objectFit: 'cover' }}
                priority // LCP (Largest Contentful Paint) এর জন্য priority দেয়া ভালো
                className="transition-transform duration-300 group-hover:scale-105"
              />
              {/* আপনি চাইলে এখানে ব্যানারের টেক্সট ওভারলে করতে পারেন */}
            </Link>
          ) : (
            <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
              Top Banner Not Found
            </div>
          )}
        </div>

        {/* === ডান পাশের ছোট ব্যানারগুলো === */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {rightBanners.length > 0 ? (
            rightBanners.slice(0, 2).map((banner) => ( // শুধু প্রথম দুটি দেখাবে
              <Link key={banner._id} href={banner.bannerLink || '#'} className="block w-full h-[190px] relative rounded-lg overflow-hidden group">
                <Image
                  src={banner.bannerImage}
                  alt={banner.bannerTitle}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transition-transform duration-300 group-hover:scale-105"
                />
                {/* আপনি চাইলে এখানে ব্যানারের টেক্সট ওভারলে করতে পারেন */}
              </Link>
            ))
          ) : (
            <>
              <div className="w-full h-[190px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">Right Banner Not Found</div>
              <div className="w-full h-[190px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">Right Banner Not Found</div>
            </>
          )}

          {/* যদি ডানপাশে শুধু ১টি ব্যানার পাওয়া যায়, তবে দ্বিতীয়টির জন্য প্লেসহোল্ডার দেখাবে */}
          {rightBanners.length === 1 && (
              <div className="w-full h-[190px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">Placeholder</div>
          )}
        </div>
        
      </div>
    </div>
  );
}