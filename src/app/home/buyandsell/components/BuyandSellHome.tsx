import axios from "axios";
import BuyandSellAdds from "./BuyandSellAdds";
import BuyandSellBanner from "./BuyandSellBanner";
import BuyandSellItems from "./BuyandSellItems";


const fetchBanner = async () => {
    try {
        const baseUrl = process.env.NEXTAUTH_URL;
        console.log("baseUrl:", baseUrl)
        const { data: postedData } = await axios.get(`${baseUrl}/api/v1/public/classifieds-banners`);
        console.log("PostedData:", postedData);
        return postedData.data || [];
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
};




export default async function BuyandSellHome() {
    const banner = await fetchBanner();
    return (
        <div className='mt-5 max-w-7xl mx-auto'>
            <BuyandSellBanner banner={banner} />
            <BuyandSellItems />
            <BuyandSellAdds />
        </div>
    )
}
