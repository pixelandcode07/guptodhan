import axios from "axios";
import BuyandSellAdds from "./BuyandSellAdds";
import BuyandSellBanner from "./BuyandSellBanner";
import BuyandSellItems from "./BuyandSellItems";

export interface CategoryDataType {
    _id: string;
    name: string;
    icon?: string; // ✅ Corrected the type
    status: 'active' | 'inactive';
}


const fetchBanner = async () => {
    try {
        const baseUrl = process.env.NEXTAUTH_URL;
        // console.log("baseUrl:", baseUrl)
        const { data: postedData } = await axios.get(`${baseUrl}/api/v1/public/classifieds-banners`);
        // console.log("PostedData:", postedData);
        return postedData.data || [];
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
};

const fetchAllBuySellData = async () => {
    try {
        const baseUrl = process.env.NEXTAUTH_URL;
        // console.log("baseUrl:", baseUrl)
        const { data: allCategory } = await axios.get(`${baseUrl}/api/v1/public/classifieds-categories/with-ad-counts`);
        console.log("PostedData:", allCategory);
        return allCategory.data || [];
    } catch (error) {
        console.error("Error fetching Buy and Sell All Data:", error);
        return [];
    }
}








export default async function BuyandSellHome() {
    const banner = await fetchBanner();
    const allCategory = await fetchAllBuySellData();
    // console.log("allCategory=====>", allCategory)
    return (
        <div className='mt-5 max-w-7xl mx-auto'>
            <BuyandSellBanner banner={banner} />
            <BuyandSellItems allCategory={allCategory} />
            <BuyandSellAdds />
        </div>
    )
}