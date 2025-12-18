import React, { Suspense } from 'react'
import DonationHome from './components/DonationHome'
import DonationBanner from './components/DonationBanner'
import { Metadata } from 'next'

// 🔥 ডাটা যাতে ক্যাশ না হয় এবং সবসময় লেটেস্ট থাকে
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Donation Campaigns - Guptodhan",
        description: "Browse and claim donation items.",
    };
}

// Data Fetching Function
async function getDonationData() {
    // 🔥 URL ফিক্স: লোকালহোস্ট বা লাইভ লিংক নিশ্চিত করা
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    console.log("🔍 Fetching Donation Data from:", baseUrl);

    try {
        // দুটি API একসাথে কল করা হচ্ছে
        const [campaignsRes, categoriesRes] = await Promise.all([
            fetch(`${baseUrl}/api/v1/public/donation-campaigns`, { cache: 'no-store' }), 
            fetch(`${baseUrl}/api/v1/public/donation-categories`, { cache: 'no-store' })
        ]);

        if (!campaignsRes.ok) console.error("❌ Campaign API Failed:", campaignsRes.status);
        if (!categoriesRes.ok) console.error("❌ Category API Failed:", categoriesRes.status);

        const campaignsData = await campaignsRes.json();
        const categoriesData = await categoriesRes.json();

        // টার্মিনালে ডাটা প্রিন্ট হবে (Debug)
        console.log(`✅ Campaigns: ${campaignsData.data?.length || 0}`);
        console.log(`✅ Categories: ${categoriesData.data?.length || 0}`);

        return {
            campaigns: campaignsData.success ? campaignsData.data : [],
            categories: categoriesData.success ? categoriesData.data : []
        };
    } catch (error) {
        console.error("💥 Data Fetch Error in Donation Page:", error);
        return { campaigns: [], categories: [] };
    }
}

// Loading Spinner Component
const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64 w-full">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
);

// Skeleton for Banner
const BannerSkeleton = () => (
    <div className="py-6 container mx-auto px-4">
        <div className="w-full h-[300px] md:h-[450px] bg-gray-200 animate-pulse rounded-2xl"></div>
    </div>
);

export default async function DonationHomePage() {
    const { campaigns, categories } = await getDonationData();

    return (
        <div className="bg-gray-50 min-h-screen pb-10">
            <Suspense fallback={<BannerSkeleton />}>
                <DonationBanner />
            </Suspense>
            
            <Suspense fallback={<LoadingSpinner />}>
                <DonationHome 
                    initialCampaigns={campaigns} 
                    initialCategories={categories} 
                />
            </Suspense>
        </div>
    )
}