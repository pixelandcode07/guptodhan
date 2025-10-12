'use client';

import Link from 'next/link';
import { useState } from 'react';
import { blogs_columns } from '@/components/TableHelper/blogs_columns';
import { DataTable } from '@/components/TableHelper/data-table';
import SectionTitle from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/button';
import { ListOrdered, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

export default function BlogTable({ blogs: initialBlogs }) {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [deletingId, setDeletingId] = useState<string | null>(null); // ✅ track deleting blog

  // Delete blog function
  const deleteBlog = async (id: string) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this blog?'
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(id); // ✅ start deleting
      const res = await axios.delete(`/api/v1/blog/${id}`);

      if (res.data.success) {
        toast.success('Blog deleted successfully!');
        setBlogs(prev => prev.filter((blog: any) => blog._id !== id));
      } else {
        toast.error(res.data.message || 'Failed to delete blog.');
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete blog.');
    } finally {
      setDeletingId(null); // ✅ done deleting
    }
  };

  // Combine columns + action buttons
  const columnsWithActions = [
    ...blogs_columns,
    {
      header: 'Actions',
      cell: ({ row }: any) => {
        const blog = row.original;
        const isDeleting = deletingId === blog._id; // check if this blog is deleting
        return (
          <div className="flex gap-2">
            <Link href={`/general/view/all/blogs/edit?id=${blog._id}`}>
              <Button
                size="sm"
                variant="outline"
                title="Edit"
                disabled={isDeleting}>
                <Edit className="w-4 h-4" />
              </Button>
            </Link>

            <Button
              size="sm"
              variant="destructive"
              title="Delete"
              onClick={() => deleteBlog(blog._id)}
              disabled={isDeleting} // disable while deleting
            >
              {isDeleting ? 'Deleting...' : <Trash2 className="w-4 h-4" />}
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-white p-5">
      <div className="flex w-full justify-between items-center pt-5 flex-wrap">
        <SectionTitle text="View All Blogs" />
        <Button variant="destructive" size="sm" asChild>
          <a href="#">
            <ListOrdered className="h-4 w-4 mr-2" />
            Rearrange
          </a>
        </Button>
      </div>

      <DataTable columns={columnsWithActions} data={blogs} />
    </div>
  );
}
