'use client';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/TableHelper/data-table';
import SectionTitle from '@/components/ui/SectionTitle';
import { teams_columns } from '@/components/TableHelper/teams_columns';
import { ArrowUpDown, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import axios from 'axios';

interface Team {
  _id: string;
  name: string;
  designation: string;
  image: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
  };
}

interface TeamsTableProps {
  data: Team[];
  error?: string | null;
}

export default function TeamsTable({ data, error }: TeamsTableProps) {
  const [teams, setTeams] = useState<Team[]>(data);

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  // 🗑️ Delete Handler
  const deleteTeam = async (id: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return;

    try {
      await axios.delete(`http://localhost:3000/api/v1/about/team/${id}`);
      setTeams(prev => prev.filter(team => team._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete member!');
    }
  };

  // 📌 Columns with Actions
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
        const team = row.original as Team;
        return (
          <div className="flex gap-2">
            {/* ✏️ Edit Button */}
            <Link href={`/general/view/terms/edit?id=${team._id}`}>
              <Button size="sm" className="cursor-pointer" variant="outline">
                <Edit className="w-4 h-4" />
              </Button>
            </Link>

            {/* 🗑️ Delete Button */}
            <Button
              size="sm"
              className="cursor-pointer"
              variant="destructive"
              onClick={() => deleteTeam(team._id)}>
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
        {/* Action Buttons */}
        <div className="py-4 pr-5 flex justify-end">
          <div className="flex gap-2">
            <Link href="/general/view/terms/add" className="cursor-pointer">
              <Button size="sm">Add New</Button>
            </Link>

            <Button size="sm">Rearrange</Button>
          </div>
        </div>

        {/* Data Table */}
        <DataTable columns={columnsWithActions} data={teams} />
      </div>
    </div>
  );
}
