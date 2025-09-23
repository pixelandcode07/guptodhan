// import axios from "axios";
import BuyandSellAdds from "./BuyandSellAdds";
import BuyandSellBanner from "./BuyandSellBanner";
import BuyandSellItems from "./BuyandSellItems";


// const fetchBanner = async () => {
//     try {
//         const baseUrl = process.env.NEXTAUTH_URL; // http://localhost:3000
//         console.log("baseUrl:",baseUrl)
//         const { data: postedData } = await axios.get(`${baseUrl}/api/v1/classifieds-banners`);
//         console.log("PostedData:", postedData);
//         return postedData.data || [];
//     } catch (error) {
//         console.error("Error fetching posts:", error);
//         return [];
//     }
// };

const fetchBanner = async () => {
    try {
        const baseUrl = process.env.NEXTAUTH_URL;
        if (!baseUrl) throw new Error("NEXTAUTH_URL is not defined");

        const res = await fetch(`${baseUrl}/api/v1/classifieds-banners`);
        if (!res.ok) throw new Error("Failed to fetch banners");

        const data = await res.json();
        return data.data || [];
    } catch (err) {
        console.error("Error fetching banners:", err);
        return [];
    }
};


export default async function BuyandSellHome() {
    const banner = await fetchBanner();
    console.log("Banner:", banner)
    return (
        <div className='mt-5 max-w-7xl mx-auto'>
            <BuyandSellBanner />
            <BuyandSellItems />
            <BuyandSellAdds />
        </div>
    )
}
