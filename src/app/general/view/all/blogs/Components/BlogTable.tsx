'use client';

import Link from 'next/link';
import { useState } from 'react';
import { DataTable } from '@/components/TableHelper/data-table';
import SectionTitle from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Loader2, PlusCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { ColumnDef } from '@tanstack/react-table';

// Define the type for your blog data
// Ensure this matches the data structure coming from your API
export type Blog = {
    _id: string;
    title: string;
    category: { name: string };
    status: 'published' | 'draft';
    // Add any other fields you need for the table
};

interface BlogTableProps {
    initialBlogs: Blog[];
}

export default function BlogTable({ initialBlogs }: BlogTableProps) {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const deleteBlog = (id: string) => {
    if (!token) {
        return toast.error("Authentication failed. Please log in again.");
    }
    
    toast("Are you sure you want to delete this blog?", {
        description: "This action cannot be undone.",
        action: {
            label: "Delete",
            onClick: async () => {
                setIsDeleting(id);
                try {
                    await axios.delete(`/api/v1/blog/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.success('Blog deleted successfully!');
                    setBlogs(prev => prev.filter(blog => blog._id !== id));
                } catch (error: any) {
                    toast.error(error.response?.data?.message || 'Failed to delete blog.');
                } finally {
                    setIsDeleting(null);
                }
            }
        },
        cancel: {
            label: "Cancel",
            onClick: () => {}, // This empty function is required
        }
    });
  };

  // Define your columns here, correctly typed for 'Blog'
  const blogs_columns: ColumnDef<Blog>[] = [
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "category.name",
        header: "Category",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
            return <span className={`capitalize px-2 py-1 text-xs font-semibold rounded-full ${status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{status}</span>
        }
    },
  ];

  const columnsWithActions: ColumnDef<Blog>[] = [
    ...blogs_columns,
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const blog = row.original;
        const isCurrentlyDeleting = isDeleting === blog._id;
        return (
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline" title="Edit" disabled={isCurrentlyDeleting}>
                <Link href={`/general/add/new/blog?id=${blog._id}`}>
                    <Edit className="w-4 h-4" />
                </Link>
            </Button>
            <Button
              size="sm"
              variant="destructive"
              title="Delete"
              onClick={() => deleteBlog(blog._id)}
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
        <SectionTitle text="View All Blogs" />
        <Button variant="outline" size="sm" asChild>
          <Link href="/general/add/new/blog">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Blog
          </Link>
        </Button>
      </div>
      <DataTable columns={columnsWithActions} data={blogs} />
    </div>
  );
}