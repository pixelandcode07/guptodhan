'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DataTable } from '@/components/TableHelper/data-table';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react'; // ✅ useSession ইম্পোর্ট করুন
import { ColumnDef } from '@tanstack/react-table';
import { fact_columns } from '@/components/TableHelper/fact_columns';

// ডেটার জন্য একটি টাইপ ডিফাইন করুন
type Fact = {
  _id: string;
  factTitle: string;
  factCount: number;
  shortDescription: string;
  status: 'active' | 'inactive';
};

interface FactsTableProps {
  initialData: Fact[];
}

export default function FactsTable({ initialData }: FactsTableProps) {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken; // API কলের জন্য টোকেন নিন

  const [facts, setFacts] = useState(initialData);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const refreshData = async () => {
    // This function can be used to re-fetch data if needed
    try {
      const res = await axios.get('/api/v1/about/facts', { headers: { Authorization: `Bearer ${token}` }});
      setFacts(res.data.data);
    } catch (error) {
      toast.error('Failed to refresh data.');
    }
  };

  const deleteFact = (id: string) => {
    if (!token) return toast.error("Authentication required.");

    toast("Are you sure you want to delete this fact?", {
        action: {
            label: "Delete",
            onClick: async () => {
                setIsDeleting(id);
                try {
                    await axios.delete(`/api/v1/about/facts/${id}`, {
                        headers: { Authorization: `Bearer ${token}` } // ✅ টোকেন যোগ করুন
                    });
                    toast.success('Fact deleted successfully!');
                    setFacts(prev => prev.filter(fact => fact._id !== id));
                } catch (error: any) {
                    toast.error(error.response?.data?.message || 'Failed to delete fact.');
                } finally {
                    setIsDeleting(null);
                }
            }
        },
        cancel: { label: "Cancel", onClick: () => {} }
    });
  };

  const columnsWithActions: ColumnDef<Fact>[] = [
    ...(fact_columns as ColumnDef<Fact>[]),
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const factItem = row.original;
        const isCurrentlyDeleting = isDeleting === factItem._id;
        return (
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline" disabled={isCurrentlyDeleting}>
              <Link href={`/general/view/facts/edit?id=${factItem._id}`}>
                <Edit className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => deleteFact(factItem._id)}
              disabled={isCurrentlyDeleting}
            >
              {isCurrentlyDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-5">
      <div className="py-4 flex justify-end">
        <Button size="sm" asChild>
          <Link href="/general/view/facts/add">
            <Plus className="h-4 w-4 mr-2" />
            Add New Fact
          </Link>
        </Button>
      </div>
      <DataTable columns={columnsWithActions} data={facts} />
    </div>
  );
}