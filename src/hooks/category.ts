import { Category, SubCategory } from "@/types/category";
import axios from "axios";


const API_URL = process.env.NEXTAUTH_URL;



// Get all main categories
export const getCategories = async (): Promise<Category[]> => {
    try {
        const res = await axios.get(`/api/v1/public/classifieds-categories`);
        return res.data?.data || [];
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}


// Get subcategories by category ID
export const getSubCategories = async (id: string): Promise<SubCategory[]> => {
    try {
        const res = await axios.get(`/api/v1/public/classifieds-categories/${id}/subcategories`);
        return res.data?.data || [];
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        throw error;
    }
};