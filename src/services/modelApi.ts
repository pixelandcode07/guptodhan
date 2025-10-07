import axios from "axios";

export const getModelsByBrand = (brandId: string) =>
  axios.get(`/api/v1/product-models?brandId=${brandId}`);
export const createModel = (data: any, token: string) =>
  axios.post(`/api/v1/product-models`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const updateModel = (id: string, data: any, token: string) =>
  axios.patch(`/api/v1/product-models/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const deleteModel = (id: string, token: string) =>
  axios.delete(`/api/v1/product-models/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
