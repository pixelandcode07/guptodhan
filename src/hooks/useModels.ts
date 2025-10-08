// import { useState } from "react";
// import { toast } from "sonner";
// import { getModelsByBrand } from "@/services/modelApi";

// export function useModels() {
//   const [models, setModels] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   const fetchModels = async (brandId: string) => {
//     try {
//       setLoading(true);
//       const res = await getModelsByBrand(brandId);
//       setModels(res.data.data);
//     } catch {
//       toast.error("Failed to fetch models");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { models, loading, fetchModels };
// }
