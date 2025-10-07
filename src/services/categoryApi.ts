import axios from "axios";

export const getCategory = (id: string) => axios.get(`/api/v1/public/classifieds-categories/${id}`);

export const updateCategory = (id: string, data: FormData, token: string) => {
    return axios.patch(`/api/v1/classifieds-categories/${id}`, data, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
    });
}

export const getSubCategories = (categoryId: string) => {
    return axios.get(`/api/v1/public/classifieds-categories/${categoryId}/subcategories`);
}