'use client';

import { useState } from 'react';
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
import { ListOrdered, Plus } from 'lucide-react';
import { DataTable } from '@/components/TableHelper/data-table';
import { faq_categories_columns } from '@/components/TableHelper/faq_columns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type FaqCategories = {
  id: number;
  name: string;
  slug: string;
  status: string;
};

export default function FaqCategoriesTable() {
  const [search, setSearch] = useState('');
  const [entries, setEntries] = useState('10');
  const [categories, setCategories] = useState<FaqCategories[]>([
    {
      id: 1,
      name: 'Shipping Information',
      slug: 'shipping-information',
      status: 'active',
    },
    { id: 2, name: 'Payment', slug: 'payment', status: 'active' },
    {
      id: 3,
      name: 'Orders & Returns',
      slug: 'orders-returns',
      status: 'active',
    },
  ]);
  const [newCategory, setNewCategory] = useState('');

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    const newCat: FaqCategories = {
      id: Date.now(),
      name: newCategory,
      slug: newCategory.toLowerCase().replace(/\s+/g, '-'),
      status: 'active',
    };
    setCategories(prev => [...prev, newCat]);
    setNewCategory('');
  };

  const handleDelete = (id: number) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
  };

  const handleEdit = (id: number, updated: Partial<FaqCategories>) => {
    setCategories(prev =>
      prev.map(cat => (cat.id === id ? { ...cat, ...updated } : cat))
    );
  };

  // Columns with Actions
  const columnsWithActions = [
    ...faq_categories_columns,
    {
      header: 'Actions',
      cell: ({ row }: any) => {
        const cat = row.original as FaqCategories;
        return (
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Category</DialogTitle>
                </DialogHeader>
                <Input
                  defaultValue={cat.name}
                  onChange={e => handleEdit(cat.id, { name: e.target.value })}
                />
              </DialogContent>
            </Dialog>

            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDelete(cat.id)}>
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-white">
      <div className="flex w-full justify-between items-center pt-5 flex-wrap">
        <SectionTitle text="View All faq Categories" />
      </div>
      <div className="p-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          {/* Show Entries */}
          <div className="flex items-center gap-2">
            <span>Show</span>
            <Select defaultValue={entries} onValueChange={setEntries}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span>entries</span>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2">
            <span>Search:</span>
            <Input
              placeholder="Search categories..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-64"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="py-4 pr-5 flex justify-end">
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => alert('Rearrange functionality not implemented')}>
              <ListOrdered className="h-4 w-4 mr-2" />
              Rearrange Category
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Category</DialogTitle>
                </DialogHeader>
                <Input
                  placeholder="Category name"
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="mb-3"
                />
                <Button onClick={handleAddCategory}>Save</Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* DataTable */}
        <DataTable columns={columnsWithActions} data={filteredCategories} />
      </div>
    </div>
  );
}
