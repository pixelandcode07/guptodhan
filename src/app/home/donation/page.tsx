import React, { Suspense } from 'react'
import DonationHome from './components/DonationHome'
import DonationBanner from './components/DonationBanner'
import { Metadata } from 'next'

// Metadata Generation (SEO)
export async function generateMetadata(): Promise<Metadata> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    try {
        const response = await fetch(`${baseUrl}/api/v1/public/donation-configs`, { 
            next: { tags: ['donation-config'] } 
        });
        const result = await response.json();
        const data = result.success ? result.data : null;

        if (data) {
            return {
                title: `${data.title} - Donate | Guptodhan`,
                description: data.shortDescription,
                openGraph: {
                    title: data.title,
                    description: data.shortDescription,
                    images: [{ url: data.image }],
                },
            };
        }
    } catch (e) { console.error(e) }

    return {
        title: "Donation Campaigns - Guptodhan",
        description: "Browse and claim donation items.",
    };
}

// Data Fetching
async function getDonationData() {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    try {
        const [campaignsRes, categoriesRes] = await Promise.all([
            fetch(`${baseUrl}/api/v1/public/donation-campaigns`, { cache: 'no-store' }), 
            fetch(`${baseUrl}/api/v1/public/donation-categories`, { next: { revalidate: 86400 } })
        ]);

        const campaigns = await campaignsRes.json();
        const categories = await categoriesRes.json();

        return {
            campaigns: campaigns.success ? campaigns.data : [],
            categories: categories.success ? categories.data : []
        };
    } catch (error) {
        console.error("Data fetch error:", error);
        return { campaigns: [], categories: [] }; // এরর হলে খালি অ্যারে রিটার্ন করবে, সাদা পেজ হবে না
    }
}

// 🔥 Loading Component (আলাদা করে নিলাম সুন্দর দেখানোর জন্য)
const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64 w-full">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
);

// 🔥 Banner Loading Skeleton
const BannerSkeleton = () => (
    <div className="py-6 container mx-auto px-4">
        <div className="w-full h-[300px] md:h-[450px] bg-gray-200 animate-pulse rounded-2xl"></div>
    </div>
);

export default async function DonationHomePage() {
    // সার্ভার সাইডে ডাটা ফেচ
    const { campaigns, categories } = await getDonationData();

    return (
        <div>
            {/* 🔥 ফিক্স: ব্যানারকেও Suspense এর ভেতর রাখা হলো */}
            <Suspense fallback={<BannerSkeleton />}>
                <DonationBanner />
            </Suspense>
            
            {/* মেইন কন্টেন্ট */}
            <Suspense fallback={<LoadingSpinner />}>
                <DonationHome 
                    initialCampaigns={campaigns} 
                    initialCategories={categories} 
                />
            </Suspense>
        </div>
    )
}