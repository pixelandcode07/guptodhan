import axios from "axios";

export async function fetchSeoPages(token: string) {
    const baseUrl = process.env.NEXTAUTH_URL;
    if (!token) {
        console.error("No token provided for fetching SEO pages");
        return [];
    }
    try {
        const res = await axios.get(`${baseUrl}/api/v1/seo-settings/all`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return res.data.data || res.data.pages || [];
    } catch (error: any) {
        console.error("Error fetching SEO pages:", error);
        return [];
    }
}