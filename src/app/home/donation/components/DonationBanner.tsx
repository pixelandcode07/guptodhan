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
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    try {
        const response = await fetch(`${baseUrl}/api/v1/public/donation-configs`, {
            next: { tags: ['donation-config'] }, 
        });
        const result = await response.json();
        return result.success ? result.data : null;
    } catch (error) {
        // console.error('Failed to fetch banner config, using default.');
        return null;
    }
}

export default async function DonationBanner() {
    const config = await getDonationConfig();

    // 🔥 ডিফল্ট ব্যানার (যদি ডাটাবেস থেকে কনফিগারেশন না আসে)
    const displayConfig = config || {
        title: "Donate for Humanity",
        image: "/img/banner.png", // নিশ্চিত করুন এই ইমেজটি public/img ফোল্ডারে আছে
        shortDescription: "Your small contribution can make a big difference in someone's life. Start donating today.",
        buttonText: "Start Donating",
        buttonUrl: "/home/donation?donate=1"
    };

    return (
        <div className="py-6">
            <div className="container mx-auto px-4">
                <div className="relative w-full h-[300px] md:h-[450px] lg:h-[500px] rounded-2xl overflow-hidden shadow-xl group bg-gray-200">
                    <Image 
                        src={displayConfig.image} 
                        alt={displayConfig.title} 
                        fill
                        priority
                        className='object-cover' 
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    
                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white flex flex-col justify-center h-full items-start">
                        <div className="max-w-2xl space-y-5 animate-in fade-in slide-in-from-bottom-5 duration-700">
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
                                {displayConfig.title}
                            </h1>
                            <p className="text-base md:text-xl text-gray-100 line-clamp-3">
                                {displayConfig.shortDescription}
                            </p>
                            {displayConfig.buttonText && (
                                <div className="pt-2">
                                    <Link 
                                        href={displayConfig.buttonUrl}
                                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-blue-500/30"
                                    >
                                        {displayConfig.buttonText}
                                        <ArrowRight size={20} />
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