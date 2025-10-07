import { useState } from "react";
import { toast } from "sonner";
import { getEditionsByModel } from "@/services/editionApi";

export function useEditions() {
  const [editions, setEditions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEditions = async (modelId: string) => {
    try {
      setLoading(true);
      const res = await getEditionsByModel(modelId);
      setEditions(res.data.data);
    } catch {
      toast.error("Failed to fetch editions");
    } finally {
      setLoading(false);
    }
  };

  return { editions, loading, fetchEditions };
}
