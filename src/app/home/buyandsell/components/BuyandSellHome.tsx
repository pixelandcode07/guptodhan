import axios from "axios";
import BuyandSellAdds from "./BuyandSellAdds";
import BuyandSellBanner from "./BuyandSellBanner";
import BuyandSellItems from "./BuyandSellItems";

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

const getAllCategories = async () => {
    try {
        const baseUrl = process.env.NEXTAUTH_URL;
        // const { data: allCategory } = await axios.get(`${baseUrl}/api/v1/public/classifieds-categories`)
        const { data: allCategory } = await axios.get(`${baseUrl}/api/v1/public/categories-with-subcategories`)
        console.log("allCategory", allCategory)
        return allCategory.data || [];
    } catch (error) {
        console.log('Unable to get all categories', error)
        return [];
    }
}




export default async function BuyandSellHome() {
    const banner = await fetchBanner();
    const allCategory = await getAllCategories()
    return (
        <div className='mt-5 max-w-7xl mx-auto'>
            <BuyandSellBanner banner={banner} />
            <BuyandSellItems allCategory={allCategory} />
            <BuyandSellAdds />
        </div>
    )
}
