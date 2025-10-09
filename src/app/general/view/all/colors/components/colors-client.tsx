"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import { DataTable } from "@/components/TableHelper/data-table";
import { Color, getColorColumns } from "@/components/TableHelper/color_columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ColorModal from "./color-modal";


type Session = {
  user?: {
    role?: string;
  };
  accessToken?: string;
};

type ApiColor = {
  _id: string;
  productColorId: string;
  color: string;
  colorName: string;
  colorCode: string;
  status: "active" | "inactive";
  createdAt: string;
};

export default function ColorsClient() {
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Color | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: session } = useSession();
  type AugmentedSession = Session & { accessToken?: string; user?: Session["user"] & { role?: string } };
  const s = session as AugmentedSession | null;
  const token = s?.accessToken;
  const userRole = s?.user?.role;

  const fetchColors = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/v1/product-config/productColor", {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      });

      const mappedColors: Color[] = response.data.data.map((c: ApiColor, index: number) => ({
        _id: c._id,
        id: index + 1,
        productColorId: c.productColorId,
        name: c.colorName,
        code: c.colorCode,
        status: c.status === "active" ? "Active" : "Inactive",
        created_at: new Date(c.createdAt).toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
      }));

      setColors(mappedColors);
    } catch (error) {
      console.error("Error fetching colors:", error);
      toast.error("Failed to fetch colors");
    } finally {
      setLoading(false);
    }
  }, [token, userRole]);

  useEffect(() => {
    fetchColors();
  }, [fetchColors]);

  const resetForm = () => {
    setEditing(null);
    setOpen(false);
  };

  const deriveProductColorId = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  const onSubmit = async (formData: { name: string; code: string; status?: string }) => {
    try {
      const payload = {
        productColorId: deriveProductColorId(formData.name),
        color: formData.name,
        colorName: formData.name,
        colorCode: formData.code,
        ...(editing && { status: formData.status === "Active" ? "active" : "inactive" }),
      };

      if (editing) {
        await axios.patch(`/api/v1/product-config/productColor/${editing._id}`, payload, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(userRole ? { "x-user-role": userRole } : {}),
          },
        });
        toast.success("Color updated successfully!");
      } else {
        await axios.post(`/api/v1/product-config/productColor`, payload, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(userRole ? { "x-user-role": userRole } : {}),
          },
        });
        toast.success("Color created successfully!");
      }

      resetForm();
      await fetchColors();
    } catch (error) {
      console.error("Error saving color:", error);
      toast.error(editing ? "Failed to update color" : "Failed to create color");
    }
  };

  const onEdit = useCallback((color: Color) => {
    setEditing(color);
    setOpen(true);
  }, []);

  const onDelete = useCallback(async (color: Color) => {
    if (window.confirm("Are you sure you want to delete this color?")) {
      try {
        await axios.delete(`/api/v1/product-config/productColor/${color._id}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(userRole ? { "x-user-role": userRole } : {}),
          },
        });
        toast.success("Color deleted successfully!");
        await fetchColors();
      } catch (error) {
        console.error("Error deleting color:", error);
        toast.error("Failed to delete color");
      }
    }
  }, [token, userRole, fetchColors]);

  const columns = useMemo(() => getColorColumns({ onEdit, onDelete }), [onEdit, onDelete]);

  const filteredColors = useMemo(() => {
    let filtered = colors;

    if (searchText) {
      filtered = filtered.filter(
        (color) =>
          color.name.toLowerCase().includes(searchText.toLowerCase()) ||
          color.code.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((color) => color.status === statusFilter);
    }

    return filtered;
  }, [colors, searchText, statusFilter]);

  return (
    <div className="m-5 p-5 border">
      <div>
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">Product Colors</span>
        </h1>
      </div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <span>Search:</span>
            <Input
              type="text"
              className="border border-gray-500"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search colors..."
            />
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <Button
          className="bg-green-600 hover:bg-green-700"
          onClick={() => setOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Color
        </Button>
      </div>
      <DataTable columns={columns} data={filteredColors} />
      {loading && <div>Loading...</div>}
      
      <ColorModal
        open={open}
        onOpenChange={setOpen}
        onSubmit={onSubmit}
        editing={editing}
        onClose={resetForm}
      />
    </div>
  );
}
