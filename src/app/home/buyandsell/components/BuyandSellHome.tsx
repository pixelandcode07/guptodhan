import BuyandSellAdds from "./BuyandSellAdds";
import BuyandSellBanner from "./BuyandSellBanner";
import BuyandSellItems from "./BuyandSellItems";

// ✅ Import your service functions directly
import { ClassifiedBannerServices } from '@/lib/modules/classifieds-banner/banner.service';
import { ClassifiedCategoryServices } from '@/lib/modules/classifieds-category/category.service';
import dbConnect from '@/lib/db';

export interface CategoryDataType {
    _id: string;
    name: string;
    icon?: string; // ✅ Corrected the type
    status: 'active' | 'inactive';
}

// This is now an async Server Component that fetches data directly
export default async function BuyandSellHome() {
    // Directly connect to the DB and call the service functions on the server
    await dbConnect();
    
    // Fetch banner and category data in parallel for better performance
    const [bannerData, categoryData] = await Promise.all([
        ClassifiedBannerServices.getAllPublicBannersFromDB(),
        ClassifiedCategoryServices.getCategoriesWithSubcategoriesFromDB()
    ]);

    // Convert Mongoose documents to plain objects to safely pass to client components
    const banners = JSON.parse(JSON.stringify(bannerData));
    const allCategories = JSON.parse(JSON.stringify(categoryData));

    return (
        <div className='mt-5 max-w-7xl mx-auto'>
            <BuyandSellBanner banner={banners} />
            <BuyandSellItems allCategory={allCategories} />
            <BuyandSellAdds />
        </div>
    )
}