'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/TableHelper/data-table';
import SectionTitle from '@/components/ui/SectionTitle';
import { teams_columns } from '@/components/TableHelper/teams_columns';
import { Edit, Trash2, Loader2, PlusCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react'; // ✅ Import useSession for authentication
import { ColumnDef } from '@tanstack/react-table';

// Define a type for your Team Member data
type TeamMember = {
  _id: string;
  name: string;
  designation: string;
  image: string;
  socialLinks?: Record<string, string>;
};

interface TeamsTableProps {
  initialData: TeamMember[];
}

export default function TeamsTable({ initialData }: TeamsTableProps) {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken; // Get the token for API calls

  const [teams, setTeams] = useState<TeamMember[]>(initialData);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (!token) {
        return toast.error("Authentication failed. Please log in.");
    }

    toast("Are you sure you want to delete this team member?", {
        description: "This action cannot be undone.",
        action: {
            label: "Delete",
            onClick: async () => {
                setIsDeleting(id);
                try {
                    await axios.delete(`/api/v1/about/team/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.success('Team member deleted successfully!');
                    setTeams(prev => prev.filter(t => t._id !== id));
                } catch (error: any) {
                    toast.error(error.response?.data?.message || 'Failed to delete team member.');
                } finally {
                    setIsDeleting(null);
                }
            }
        },
        cancel: {
            label: "Cancel",
            onClick: () => {},
        }
    });
  };

  const columnsWithActions: ColumnDef<TeamMember>[] = [
    ...(teams_columns as ColumnDef<TeamMember>[]),
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const team = row.original;
        const isCurrentlyDeleting = isDeleting === team._id;
        return (
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline" title="Edit" disabled={isCurrentlyDeleting}>
                <Link href={`/general/team/config?id=${team._id}`}>
                    <Edit className="w-4 h-4" />
                </Link>
            </Button>
            <Button
              size="sm"
              variant="destructive"
              title="Delete"
              onClick={() => handleDelete(team._id)}
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
    <div className="bg-white p-5 m-5 shadow-sm border rounded-md">
      <div className="flex w-full justify-between items-center pt-5 mb-5 flex-wrap">
        <SectionTitle text="Team Members List" />
        <Button variant="outline" size="sm" asChild>
          <Link href="/general/team/config">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Member
          </Link>
        </Button>
      </div>
      <DataTable columns={columnsWithActions} data={teams} />
    </div>
  );
}