"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DataTable } from "@/components/TableHelper/data-table";
import { getFlagColumns, type Flag } from "@/components/TableHelper/flag_columns";
import FlagModal from "./FlagModal";

type ApiFlag = {
  _id: string;
  productFlagId: string;
  name: string;
  icon: string;
  status: "active" | "inactive";
  featured: boolean;
  createdAt: string;
};

export default function FlagsClient() {
  const { data: session } = useSession();
  type AugmentedSession = typeof session & { accessToken?: string; user?: typeof session.user & { role?: string } };
  const s = session as AugmentedSession | null;
  const token = s?.accessToken;
  const userRole = s?.user?.role;

  const [flags, setFlags] = useState<Flag[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Flag | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [featuredModalOpen, setFeaturedModalOpen] = useState(false);
  const [featuredFlag, setFeaturedFlag] = useState<Flag | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteFlag, setDeleteFlag] = useState<Flag | null>(null);

  const fetchFlags = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/v1/product-config/productFlag");
      const apiFlags: ApiFlag[] = response.data.data;
      
      const mappedFlags: Flag[] = apiFlags.map((f, index) => ({
        _id: f._id,
        id: index + 1,
        productFlagId: f.productFlagId,
        name: f.name,
        icon: f.icon,
        status: f.status === "active" ? "Active" : "Inactive",
        featured: f.featured ? "Featured" : "Not Featured",
        created_at: f.createdAt,
      }));
      
      setFlags(mappedFlags);
    } catch (error) {
      console.error("Error fetching flags:", error);
      toast.error("Failed to fetch flags");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFlags();
  }, [fetchFlags]);

  const deriveProductFlagId = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  const onSubmit = async (data: { name: string; icon: string; status?: string }) => {
    try {
      const payload = {
        productFlagId: deriveProductFlagId(data.name),
        name: data.name,
        icon: data.icon || '',
        ...(editing && { status: data.status }),
      };

      if (editing) {
        await axios.patch(`/api/v1/product-config/productFlag/${editing._id}`, payload, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(userRole ? { "x-user-role": userRole } : {}),
            "Content-Type": "application/json",
          },
        });
        toast.success("Flag updated successfully!");
      } else {
        await axios.post("/api/v1/product-config/productFlag", payload, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(userRole ? { "x-user-role": userRole } : {}),
            "Content-Type": "application/json",
          },
        });
        toast.success("Flag created successfully!");
      }

      setOpen(false);
      setEditing(null);
      await fetchFlags();
    } catch (error) {
      console.error("Error saving flag:", error);
      toast.error(`Failed to ${editing ? "update" : "create"} flag`);
    }
  };

  const onEdit = useCallback((flag: Flag) => {
    setEditing(flag);
    setOpen(true);
  }, []);

  const onDelete = useCallback((flag: Flag) => {
    setDeleteFlag(flag);
    setDeleteModalOpen(true);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteFlag) return;

    try {
      await axios.delete(`/api/v1/product-config/productFlag/${deleteFlag._id}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      });
      toast.success("Flag deleted successfully!");
      setDeleteModalOpen(false);
      await fetchFlags();
    } catch (error) {
      console.error("Error deleting flag:", error);
      toast.error("Failed to delete flag");
    }
  };

  const onToggleFeatured = useCallback((flag: Flag) => {
    setFeaturedFlag(flag);
    setFeaturedModalOpen(true);
  }, []);

  const handleFeaturedToggle = async () => {
    if (!featuredFlag) return;

    try {
      const newFeaturedStatus = featuredFlag.featured === "Featured" ? false : true;
      await axios.patch(`/api/v1/product-config/productFlag/${featuredFlag._id}`, {
        featured: newFeaturedStatus,
      }, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
          "Content-Type": "application/json",
        }
      });
      
      toast.success(`Flag ${newFeaturedStatus ? "featured" : "unfeatured"} successfully`);
      setFeaturedModalOpen(false);
      await fetchFlags();
    } catch (error) {
      console.error("Error toggling featured status:", error);
      toast.error("Failed to update featured status");
    }
  };

  const columns = useMemo(() => getFlagColumns({ onEdit, onDelete, onToggleFeatured }), [onEdit, onDelete, onToggleFeatured]);

  const filteredFlags = useMemo(() => {
    return flags.filter((flag) => {
      const matchesSearch = flag.name.toLowerCase().includes(searchText.toLowerCase()) ||
                           flag.productFlagId.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = statusFilter === "all" || flag.status.toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [flags, searchText, statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Flags</h1>
        <Button onClick={() => setOpen(true)}>
          Add New Flag
        </Button>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search flags..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable columns={columns} data={filteredFlags} />

      <FlagModal
        open={open}
        onOpenChange={setOpen}
        onSubmit={onSubmit}
        editing={editing ? {
          name: editing.name,
          icon: editing.icon,
          status: editing.status.toLowerCase(),
        } : null}
      />

      <Dialog open={featuredModalOpen} onOpenChange={setFeaturedModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Toggle Featured Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Are you sure you want to {featuredFlag?.featured === "Featured" ? "remove" : "set"} this flag as {featuredFlag?.featured === "Featured" ? "not featured" : "featured"}?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setFeaturedModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleFeaturedToggle}>
                {featuredFlag?.featured === "Featured" ? "Remove Featured" : "Set Featured"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Flag</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Are you sure you want to delete the flag "{deleteFlag?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirm}>
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
