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
  faqCategoryID: number;
  categoryName: string;
  isActive: boolean;
};

export default function FaqCategoriesTable() {
  const [categories, setCategories] = useState<FaqCategory[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingUpdateId, setLoadingUpdateId] = useState<number | null>(null);
  const [loadingDeleteId, setLoadingDeleteId] = useState<number | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const apiBase = '/general/faq/api/category';

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    try {
      const res = await fetch(apiBase, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load categories');
    }
  };

  const handleAdd = async (closeDialog: () => void) => {
    if (!newCategoryName.trim()) return toast.error('Enter category name');
    try {
      setLoadingAdd(true);
      await axios.post(apiBase, { categoryName: newCategoryName });
      toast.success('Category added');
      setNewCategoryName('');
      closeDialog();
      await refreshData();
    } catch {
      toast.error('Failed to add category');
    } finally {
      setLoadingAdd(false);
    }
  };

  const handleUpdate = async (
    id: number,
    categoryName: string,
    isActive: boolean,
    closeDialog: () => void
  ) => {
    try {
      setLoadingUpdateId(id);
      await axios.put(`${apiBase}/${id}`, { categoryName, isActive });
      toast.success('Category updated');
      closeDialog();
      await refreshData();
    } catch {
      toast.error('Failed to update category');
    } finally {
      setLoadingUpdateId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      setLoadingDeleteId(id);
      toast('Deleting...', { duration: 1000 });
      await axios.delete(`${apiBase}/${id}`);
      toast.success('Deleted successfully');
      await refreshData();
    } catch {
      toast.error('Failed to delete category');
    } finally {
      setLoadingDeleteId(null);
    }
  };

  const columnsWithActions = [
    ...faq_categories_columns,
    {
      header: 'Actions',
      cell: ({ row }: any) => {
        const cat = row.original as FaqCategory;
        const [editName, setEditName] = useState(cat.categoryName);
        const [editStatus, setEditStatus] = useState(
          cat.isActive ? 'active' : 'inactive'
        );

        return (
          <div className="flex gap-2">
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
                          cat.faqCategoryID,
                          editName,
                          editStatus === 'active',
                          () => {
                            const dialog =
                              document.querySelector('dialog[open]');
                            if (dialog) (dialog as HTMLDialogElement).close();
                          }
                        )
                      }
                      disabled={loadingUpdateId === cat.faqCategoryID}>
                      {loadingUpdateId === cat.faqCategoryID
                        ? 'Updating...'
                        : 'Update'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDelete(cat.faqCategoryID)}
              disabled={loadingDeleteId === cat.faqCategoryID}>
              {loadingDeleteId === cat.faqCategoryID ? (
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
                      await handleAdd(() => setAddDialogOpen(false)); // Close dialog after add
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
