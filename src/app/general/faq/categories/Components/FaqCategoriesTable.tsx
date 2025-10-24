'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/ui/SectionTitle';
import { Edit, ListOrdered, Plus, Trash2, Loader2 } from 'lucide-react';
import { DataTable } from '@/components/TableHelper/data-table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { ColumnDef } from '@tanstack/react-table';
import { Label } from '@/components/ui/label'; // ✅ FIX: Label ইম্পোর্ট করা হয়েছে

// ডেটার টাইপ ডিফাইন করা হচ্ছে
type FaqCategory = {
  _id: string;
  name: string;
  isActive: boolean;
};

interface FaqCategoriesTableProps {
  initialData: FaqCategory[];
}

export default function FaqCategoriesTable({
  initialData,
}: FaqCategoriesTableProps) {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  const [categories, setCategories] = useState<FaqCategory[]>(initialData);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(false);

  const apiBase = '/api/v1/faq-category';

  const refreshData = async () => {
    if (!token) return;
    try {
      const res = await axios.get(apiBase, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data?.data || []);
    } catch (err) {
      toast.error('Failed to reload categories.');
    }
  };

  const handleAdd = async (closeDialog: () => void) => {
    if (!token) return toast.error('Authentication required.');
    if (!newCategoryName.trim())
      return toast.error('Category name is required.');

    setLoading(true);
    try {
      await axios.post(
        apiBase,
        { name: newCategoryName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Category added successfully!');
      setNewCategoryName('');
      closeDialog();
      await refreshData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add category.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (
    id: string,
    name: string,
    isActive: boolean,
    closeDialog: () => void
  ) => {
    if (!token) return toast.error('Authentication required.');
    setLoading(true);
    try {
      await axios.patch(
        `${apiBase}/${id}`,
        { name, isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Category updated successfully!');
      closeDialog();
      await refreshData();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Failed to update category.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (!token) return toast.error('Authentication required.');
    toast('Are you sure you want to delete this category?', {
      description: 'This action cannot be undone.',
      action: {
        label: 'Delete',
        onClick: async () => {
          setLoading(true);
          try {
            await axios.delete(`${apiBase}/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Deleted successfully!');
            await refreshData();
          } catch (error: any) {
            toast.error(
              error.response?.data?.message || 'Failed to delete category.'
            );
          } finally {
            setLoading(false);
          }
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {}, // ✅ FIX: onClick ফাংশন যোগ করা হয়েছে
      },
    });
  };

  // ✅ FIX: কলামগুলো FaqCategory টাইপের সাথে মেলানো হয়েছে
  const columns: ColumnDef<FaqCategory>[] = [
    {
      accessorKey: 'name',
      header: 'Category Name',
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => {
        const isActive = row.original.isActive;
        return (
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const cat = row.original;
        const [editName, setEditName] = useState(cat.name);
        const [editStatus, setEditStatus] = useState(
          cat.isActive ? 'active' : 'inactive'
        );
        const [isModalOpen, setIsModalOpen] = useState(false);

        return (
          <div className="flex gap-2">
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Edit className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>Edit Category</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 py-2">
                  <div>
                    <Label>Category Name</Label>
                    <Input
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select
                      value={editStatus}
                      onValueChange={v =>
                        setEditStatus(v as 'active' | 'inactive')
                      }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    onClick={() =>
                      handleUpdate(
                        cat._id,
                        editName,
                        editStatus === 'active',
                        () => setIsModalOpen(false)
                      )
                    }
                    disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : 'Update'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDelete(cat._id)}
              disabled={loading}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-white p-5">
      <div className="flex w-full justify-between items-center flex-wrap mb-4">
        {/* <SectionTitle text="View All FAQ Categories" /> */}
        <div className=""></div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add New Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <Input
                placeholder="Enter category name..."
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={() => handleAdd(() => {})} disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : 'Save'}
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={columns} data={categories ?? []} />
    </div>
  );
}
