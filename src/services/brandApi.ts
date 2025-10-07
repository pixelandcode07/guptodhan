import axios from "axios";

export const getAllBrands = () => axios.get("/api/v1/public/brands");
export const createBrand = (data: FormData, token: string) =>
  axios.post("/api/v1/brands", data, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
  });
export const updateBrand = (id: string, data: any, token: string) =>
  axios.patch(`/api/v1/brands/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const deleteBrand = (id: string, token: string) =>
  axios.delete(`/api/v1/brands/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
