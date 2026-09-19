import { Suspense } from 'react'
import DonationHome from './components/DonationHome'
import DonationBanner from './components/DonationBanner'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Donation Campaigns - Guptodhan",
        description: "Browse and claim donation items.",
    };
}

// Data Fetching Function
async function getDonationData() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    // console.log("🔍 Fetching Donation Data from:", baseUrl);

    try {
        const [campaignsRes, categoriesRes] = await Promise.all([
            fetch(`${baseUrl}/api/v1/public/donation-campaigns`, { cache: 'no-store' }), 
            fetch(`${baseUrl}/api/v1/public/donation-categories`, { cache: 'no-store' })
        ]);

        const campaignsData = await campaignsRes.json();
        const categoriesData = await categoriesRes.json();

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

// ✅ Skeleton Alignment Fixed
const BannerSkeleton = () => (
    <div className="py-6 md:max-w-[95vw] xl:container mx-auto px-4 md:px-8">
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