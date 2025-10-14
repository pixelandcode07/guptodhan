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
import { Edit, ListOrdered, Plus, Trash2 } from 'lucide-react';
import { DataTable } from '@/components/TableHelper/data-table';
import { faq_categories_columns } from '@/components/TableHelper/faq_columns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import axios from 'axios';

type FaqCategory = {
  _id: string;
  name: string;
  isActive: boolean;
};

export default function FaqCategoriesTable({ data }: { data: any[] }) {
  const [categories, setCategories] = useState<FaqCategory[]>(data || []);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingUpdateId, setLoadingUpdateId] = useState<string | null>(null);
  const [loadingDeleteId, setLoadingDeleteId] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const apiBase = '/api/v1/faq-category';

  useEffect(() => {
    refreshData();
  }, []);

  // ✅ Load all categories
  const refreshData = async () => {
    try {
      const res = await axios.get(apiBase);
      const result = res.data?.data || res.data;
      setCategories(result);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load categories');
    }
  };

  // ✅ Add category
  const handleAdd = async (closeDialog: () => void) => {
    if (!newCategoryName.trim()) return toast.error('Enter category name');
    const payload = { name: newCategoryName, isActive: true };

    try {
      setLoadingAdd(true);
      const res = await axios.post(apiBase, payload);
      if (res.data?.success) {
        toast.success('Category added');
        setNewCategoryName('');
        closeDialog();
        await refreshData();
      } else {
        toast.error(res.data?.message || 'Failed to add category');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to add category');
    } finally {
      setLoadingAdd(false);
    }
  };

  // ✅ Update category
  const handleUpdate = async (
    id: string,
    name: string,
    isActive: boolean,
    closeDialog: () => void
  ) => {
    try {
      setLoadingUpdateId(id);
      const res = await axios.patch(`${apiBase}/${id}`, { name, isActive });
      if (res.data?.success) {
        toast.success('Category updated');
        closeDialog();
        await refreshData();
      } else {
        toast.error(res.data?.message || 'Failed to update category');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to update category');
    } finally {
      setLoadingUpdateId(null);
    }
  };

  // ✅ Delete category
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      setLoadingDeleteId(id);
      toast.message('Deleting...', { duration: 1000 });
      const res = await axios.delete(`${apiBase}/${id}`);
      if (res.data?.success) {
        toast.success('Deleted successfully');
        await refreshData();
      } else {
        toast.error(res.data?.message || 'Failed to delete category');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to delete category');
    } finally {
      setLoadingDeleteId(null);
    }
  };

  // ✅ Columns with edit/delete actions
  const columnsWithActions = [
    ...faq_categories_columns,
    {
      header: 'Actions',
      cell: ({ row }: any) => {
        const cat = row.original as FaqCategory;
        const [editName, setEditName] = useState(cat.name);
        const [editStatus, setEditStatus] = useState(
          cat.isActive ? 'active' : 'inactive'
        );

        return (
          <div className="flex gap-2">
            {/* Edit Button + Modal */}
            <Dialog>
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
                    <label className="text-sm font-medium">Category Name</label>
                    <Input
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      value={editStatus}
                      onValueChange={v => setEditStatus(v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      onClick={() =>
                        handleUpdate(
                          cat._id,
                          editName,
                          editStatus === 'active',
                          () => setAddDialogOpen(false)
                        )
                      }
                      disabled={loadingUpdateId === cat._id}>
                      {loadingUpdateId === cat._id ? 'Updating...' : 'Update'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Delete Button */}
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDelete(cat._id)}
              disabled={loadingDeleteId === cat._id}>
              {loadingDeleteId === cat._id ? (
                'Deleting...'
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-white">
      <div className="flex w-full justify-between items-center flex-wrap">
        <SectionTitle text="View All FAQ Categories" />
      </div>

      <div className="p-5">
        <div className="py-4 flex justify-end gap-2">
          <Button
            size="sm"
            onClick={() => toast.info('Rearrange not implemented')}>
            <ListOrdered className="h-4 w-4 mr-2" />
            Rearrange Category
          </Button>

          {/* Add New Category Dialog */}
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add New Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Add Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <Input
                  placeholder="Category name"
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                />
                <div className="flex justify-end gap-2 pt-2">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    onClick={async () => {
                      await handleAdd(() => setAddDialogOpen(false));
                    }}
                    disabled={loadingAdd}>
                    {loadingAdd ? 'Adding...' : 'Save'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <DataTable columns={columnsWithActions} data={categories ?? []} />
      </div>
    </div>
  );
}
