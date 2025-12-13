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
            // 🔥 ISR (3600) বাদ দিয়ে Tag ব্যবহার করা হলো
            // এর মানে: যতক্ষণ না অ্যাডমিন আপডেট করবে, ততক্ষণ ক্যাশ থাকবে।
            // আপডেট করলে সাথে সাথে ক্যাশ ভেঙে নতুন ডাটা দেখাবে।
            next: { tags: ['donation-config'] }, 
        });
        const result = await response.json();
        return result.success ? result.data : null;
    } catch (error) {
        console.error('Failed to fetch banner:', error);
        return null;
    }
}

export default async function DonationBanner() {
    const config = await getDonationConfig();

    const displayConfig = config || {
        title: "Donate for Humanity",
        image: "/img/banner.png",
        shortDescription: "Your contribution can change lives. Join us in our mission.",
        buttonText: "Donate Now",
        buttonUrl: "/donate"
    };

    return (
        <div className="py-6">
            <div className="container mx-auto px-4">
                <div className="relative w-full h-[300px] md:h-[450px] lg:h-[500px] rounded-2xl overflow-hidden shadow-xl group bg-gray-100">
                    <Image 
                        src={displayConfig.image} 
                        alt={displayConfig.title} 
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 95vw, 1200px"
                        className='object-cover transition-transform duration-700 group-hover:scale-105' 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white">
                        <div className="max-w-3xl space-y-4">
                            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight drop-shadow-md">
                                {displayConfig.title}
                            </h1>
                            <p className="text-sm md:text-lg text-gray-200 line-clamp-2 md:line-clamp-3 drop-shadow-sm">
                                {displayConfig.shortDescription}
                            </p>
                            {displayConfig.buttonText && displayConfig.buttonUrl && (
                                <div className="pt-4">
                                    <Link 
                                        href={displayConfig.buttonUrl}
                                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
                                    >
                                        {displayConfig.buttonText}
                                        <ArrowRight size={18} />
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