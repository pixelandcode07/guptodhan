// app/(your-path)/facts/Components/FactsTable.tsx
'use client';

import { DataTable } from '@/components/TableHelper/data-table';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'sonner';
import React, { useState, useEffect } from 'react';
import { fact_columns } from '@/components/TableHelper/fact_columns'; // 👉 তুমি তোমার columns এখানে ডিফাইন করবে

interface FactsTableProps {
  initialData: any[];
}

export default function FactsTable({ initialData }: FactsTableProps) {
  const [facts, setFacts] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const refreshData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/v1/public/about/facts');
      setFacts(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteFact = async (id: string) => {
    if (!confirm('Are you sure you want to delete this Fact?')) return;
    const toastId = toast.loading('Deleting Fact...');
    try {
      await axios.delete(`/api/v1/about/facts/${id}`);
      toast.success('Fact deleted successfully!', { id: toastId });
      refreshData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete Fact', { id: toastId });
    }
  };

  const columnsWithActions = [
    ...fact_columns,
    {
      header: 'Actions',
      cell: ({ row }: any) => {
        const factItem = row.original;
        return (
          <div className="flex gap-2">
            <Link
              href={{
                pathname: '/general/view/facts/edit',
                query: {
                  id: factItem._id,
                  factTitle: factItem.factTitle,
                  factCount: factItem.factCount,
                  shortDescription: factItem.shortDescription,
                  status: factItem.status,
                },
              }}>
              <Button size="sm" variant="outline">
                <Edit className="w-4 h-4" />
              </Button>
            </Link>

            <Button
              size="sm"
              variant="destructive"
              onClick={() => deleteFact(factItem._id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-5">
      <div className="py-4 flex justify-end gap-2">
        <Button size="sm" asChild>
          <Link href="/general/view/all/facts/add">
            <Plus className="h-4 w-4 mr-2" />
            Add New Fact
          </Link>
        </Button>
      </div>
      <DataTable columns={columnsWithActions} data={facts} />
    </div>
  );
}
