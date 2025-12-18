import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface DonationConfig {
    title: string;
    image: string;
    shortDescription: string;
    buttonText: string;
    buttonUrl: string;
}

async function getDonationConfig() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    try {
        const response = await fetch(`${baseUrl}/api/v1/public/donation-configs`, {
            next: { tags: ['donation-config'] }, 
        });
        const result = await response.json();
        return result.success ? result.data : null;
    } catch (error) {
        return null;
    }
}

export default async function DonationBanner() {
    const config = await getDonationConfig();

    const displayConfig = config || {
        title: "Donate for Humanity",
        image: "/img/banner.png", 
        shortDescription: "Your small contribution can make a big difference in someone's life. Join us in our mission to help the needy.",
        buttonText: "Donate Now",
        buttonUrl: "/home/donation?donate=1"
    };

    return (
        <div className="py-6">
            <div className="container mx-auto px-4">
                <div className="relative w-full aspect-[4/3] md:aspect-[2/1] lg:aspect-[16/5] rounded-2xl overflow-hidden shadow-xl group bg-gray-200">
                    <Image 
                        src={displayConfig.image} 
                        alt={displayConfig.title} 
                        fill
                        priority
                        className='object-cover object-center'
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                    />
                    
                    {/* 🔥 FIX: Deep Shadow সরিয়ে Gradient দেওয়া হয়েছে।
                        - to-transparent: উপরের অংশ স্বচ্ছ থাকবে (ইমেজ নরমাল দেখাবে)
                        - from-black/80: শুধু একদম নিচে যেখানে লেখা আছে সেখানে ডার্ক হবে
                    */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    
                    <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 text-white">
                        <div className="max-w-3xl space-y-3 md:space-y-5 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-2 md:pb-4">
                            
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg">
                                {displayConfig.title}
                            </h1>
                            
                            <p className="text-sm md:text-xl text-gray-100 line-clamp-2 md:line-clamp-3 drop-shadow-md font-medium">
                                {displayConfig.shortDescription}
                            </p>
                            
                            {displayConfig.buttonText && (
                                <div className="pt-2">
                                    <Link 
                                        href={displayConfig.buttonUrl}
                                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 md:px-8 md:py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-blue-500/30 text-sm md:text-base"
                                    >
                                        {displayConfig.buttonText}
                                        <ArrowRight size={18} className="md:w-5 md:h-5" />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}