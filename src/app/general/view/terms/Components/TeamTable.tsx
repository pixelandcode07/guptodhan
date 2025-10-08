'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/TableHelper/data-table';
import SectionTitle from '@/components/ui/SectionTitle';
import { teams_columns } from '@/components/TableHelper/teams_columns';
import { Edit, Trash2, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

interface Team {
  _id: string;
  name: string;
  designation: string;
  image: string;
  socialLinks?: Record<string, string>;
}

export default function TeamsTable({ data }: { data: Team[] }) {
  const [teams, setTeams] = useState<Team[]>(data);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/v1/about/team/${id}`);
      setTeams(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete!');
    }
  };

  const columnsWithActions = [
    ...teams_columns,
    {
      header: () => (
        <div className="flex items-center">
          Actions <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      accessorKey: 'actions',
      cell: ({ row }: any) => {
        const team = row.original;
        return (
          <div className="flex gap-2">
            <Link href={`/general/view/terms/edit?id=${team._id}`}>
              <Button size="sm" variant="outline">
                <Edit className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDelete(team._id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-white">
      <div className="flex w-full justify-between items-center pt-5 flex-wrap">
        <SectionTitle text="Team List" />
      </div>

      <div className="p-5 pt-0">
        <div className="py-4 pr-5 flex justify-end">
          <Link href="/general/view/terms/add">
            <Button size="sm">Add New</Button>
          </Link>
        </div>
        <DataTable columns={columnsWithActions} data={teams} />
      </div>
    </div>
  );
}
