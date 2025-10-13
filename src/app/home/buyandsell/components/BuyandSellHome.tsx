import axios from "axios";
import BuyandSellAdds from "./BuyandSellAdds";
import BuyandSellBanner from "./BuyandSellBanner";
import BuyandSellItems from "./BuyandSellItems";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { getServerSession } from "next-auth";
// import { useAllPublicCategory } from "@/lib/actions/getAllPublicCategoryAds";
// import { headers } from "next/headers";

export interface CategoryDataType {
    _id: string;
    name: string;
    icon?: 'string | undefined';
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








export default async function BuyandSellHome() {
    const banner = await fetchBanner();
    // const allCategory = await getAllPublicCategoryAds();
    return (
        <div className='mt-5 max-w-7xl mx-auto'>
            <BuyandSellBanner banner={banner} />
            <BuyandSellItems allCategory={allCategory} />
            <BuyandSellAdds />
        </div>
    )
}
