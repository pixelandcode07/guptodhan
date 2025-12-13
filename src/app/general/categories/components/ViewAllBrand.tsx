"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { DataTable } from "@/components/TableHelper/data-table";
import {
  view_brand_columns,
  FlattenedBrand,
} from "@/components/TableHelper/view_brand_columns";
import FancyLoadingPage from "../../loading";

export default function ViewAllBrand() {
  const [brands, setBrands] = useState<FlattenedBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const token = (session?.user as { accessToken?: string; role?: string })?.accessToken;
  const userRole = (session?.user as { role?: string })?.role;

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // 🔹 Step 1: Get all brands
      const brandsResponse = await axios.get("/api/v1/public/brands");
      const fetchedBrands = brandsResponse.data.data || [];

      const flattened: FlattenedBrand[] = [];

      // 🔹 Step 2: For each brand → get models and editions
      for (const brand of fetchedBrands) {
        const modelsResponse = await axios.get(`/api/v1/product-models?brandId=${brand._id}`);
        const fetchedModels = modelsResponse.data.data || [];

        if (fetchedModels.length === 0) {
          flattened.push({
            brandId: brand._id,
            brandName: brand.name,
            modelName: "No models",
            editionName: "No editions",
            logo: brand.logo,
          });
          continue;
        }

        for (const model of fetchedModels) {
          const editionsResponse = await axios.get(`/api/v1/editions?modelId=${model._id}`);
          const fetchedEditions = editionsResponse.data.data || [];

          // 🔹 Create one row per edition (if no edition → still one row)
          if (fetchedEditions.length > 0) {
            for (const edition of fetchedEditions) {
              flattened.push({
                brandId: brand._id,
                brandName: brand.name,
                modelName: model.name,
                editionName: edition.name,
                logo: brand.logo,
              });
            }
          } else {
            flattened.push({
              brandId: brand._id,
              brandName: brand.name,
              modelName: model.name,
              editionName: "No editions",
              logo: brand.logo,
            });
          }
        }
      }

      setBrands(flattened);
    } catch (err) {
      console.error(err);
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;
    try {
      await axios.delete(`/api/v1/brands/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-user-role": userRole,
        },
      });
      fetchAllData(); // Refresh data after delete
    } catch (err) {
      alert("Error deleting brand");
    }
  };

  if (loading) return <FancyLoadingPage />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">View All Brands</h1>
      <DataTable columns={view_brand_columns(handleDelete)} data={brands} />
    </div>
  );
}
