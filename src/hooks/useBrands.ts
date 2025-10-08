// import { useState, useEffect } from "react";
// import { toast } from "sonner";
// import { getAllBrands } from "@/services/brandApi";

// export function useBrands() {
//   const [brands, setBrands] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   const fetchBrands = async () => {
//     try {
//       setLoading(true);
//       const res = await getAllBrands();
//       setBrands(res.data.data);
//     } catch {
//       toast.error("Failed to fetch brands");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBrands();
//   }, []);

//   return { brands, loading, fetchBrands };
// }
