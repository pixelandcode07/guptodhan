'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DataTable } from '@/components/TableHelper/data-table';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { ColumnDef } from '@tanstack/react-table';
import { faq_columns } from '@/components/TableHelper/faq_categories';

// Type Definition
type FAQ = {
  _id: string;
  faqID: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
};

interface FAQSTabileProps {
  initialFaqs: FAQ[];
}

export default function FAQSTabile({ initialFaqs }: FAQSTabileProps) {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Handle Delete
  const deleteFAQ = async (id: string) => {
    if (!token) return toast.error("Authentication required.");

    // Simple confirm (You can use a Modal here if you want)
    const confirmDelete = window.confirm("Are you sure you want to delete this FAQ?");
    if(!confirmDelete) return;

    setIsDeleting(id);
    try {
        await axios.delete(`/api/v1/faq/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('FAQ deleted successfully!');
        setFaqs(prev => prev.filter((faq) => faq._id !== id));
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to delete FAQ');
    } finally {
        setIsDeleting(null);
    }
  };

  // Columns definition
  const columnsWithActions: ColumnDef<FAQ>[] = [
    ...(faq_columns as ColumnDef<FAQ>[]), // Assuming faq_columns are properly defined
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const faqItem = row.original;
        const isCurrentlyDeleting = isDeleting === faqItem._id;
        return (
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline" disabled={isCurrentlyDeleting}>
              <Link href={`/general/view/all/faqs/edit?_id=${faqItem._id}`}>
                <Edit className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => deleteFAQ(faqItem._id)}
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
    <div className="bg-white rounded-lg border shadow-sm">
        {/* Header Action Area */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-700">All FAQs</h2>
            <Button size="sm" asChild className="bg-primary hover:bg-primary/90">
                <Link href="/general/view/all/faqs/add">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New FAQ
                </Link>
            </Button>
        </div>
        
        {/* Table Area */}
        <div className="p-4">
            <DataTable columns={columnsWithActions} data={faqs} />
        </div>
    </div>
  );
}