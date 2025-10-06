/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { DataTable } from '@/components/TableHelper/data-table';
import { fact_columns } from '@/components/TableHelper/fact_columns';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Edit, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Link from 'next/link';
import { toast } from 'sonner'; // ✅ Added

type Fact = {
  _id: string;
  factTitle: string;
  factCount: number;
  shortDescription: string;
  status: string;
};

type Props = { initialData: Fact[] };

export default function FactsTable({ initialData }: Props) {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  const [facts, setFacts] = useState<Fact[]>(initialData);

  // --- Delete Function ---
  const deleteFact = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/about/facts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFacts(prev => prev.filter(fact => fact._id !== id));
      toast.success('Fact deleted successfully ✅');
    } catch (error: any) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete fact ❌');
    }
  };

  // --- Edit Function (optional inline update example) ---
  const editFact = async (id: string, updatedData: Partial<Fact>) => {
    try {
      const res = await axios.patch(
        `http://localhost:3000/api/v1/about/facts/${id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFacts(prev =>
        prev.map(fact =>
          fact._id === id ? { ...fact, ...res.data.data } : fact
        )
      );
      toast.success('Fact updated successfully ✅');
    } catch (error) {
      console.error('Edit failed:', error);
      toast.error('Failed to update fact ❌');
    }
  };

  // --- Columns with Actions ---
  const columnsWithActions = [
    ...fact_columns,
    {
      header: () => (
        <div className="flex items-center">
          Actions <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      accessorKey: 'actions',
      cell: ({ row }: any) => {
        const fact = row.original as Fact;
        return (
          <div className="flex gap-2">
            <Link
              href={{
                pathname: '/general/view/facts/edit',
                query: {
                  id: fact._id,
                  factTitle: fact.factTitle,
                  factCount: fact.factCount,
                  shortDescription: fact.shortDescription,
                  status: fact.status,
                },
              }}>
              <Button size="sm" className="cursor-pointer" variant="outline">
                <Edit className="w-4 h-4" />
              </Button>
            </Link>

            <Button
              size="sm"
              className="cursor-pointer"
              variant="destructive"
              onClick={() => deleteFact(fact._id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex justify-end gap-2 mb-4">
        <Link className="cursor-pointer" href="/general/view/facts/add">
          <Button className="cursor-pointer" variant="secondary" size="sm">
            Add New
          </Button>
        </Link>
      </div>

      <DataTable columns={columnsWithActions} data={facts} />
    </div>
  );
}
