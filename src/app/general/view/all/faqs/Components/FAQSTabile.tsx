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
import { faq_columns } from '@/components/TableHelper/faq_categories';

// ডেটার জন্য একটি টাইপ ডিফাইন করুন
type FAQ = {
  _id: string;
  // আপনার FAQ মডেল অনুযায়ী অন্যান্য ফিল্ড যোগ করুন
  question: string;
  answer: string;
  category: { name: string };
  isActive: boolean;
};

interface FAQSTabileProps {
  initialFaqs: FAQ[];
}

export default function FAQSTabile({ initialFaqs }: FAQSTabileProps) {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken; // API কলের জন্য টোকেন নিন

  const [faqs, setFaqs] = useState(initialFaqs);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const deleteFAQ = async (id: string) => {
    if (!token) return toast.error("Authentication required.");

    toast("Are you sure you want to delete this FAQ?", {
        action: {
            label: "Delete",
            onClick: async () => {
                setIsDeleting(id);
                try {
                    await axios.delete(`/api/v1/faq/${id}`, {
                        headers: { Authorization: `Bearer ${token}` } // ✅ টোকেন যোগ করুন
                    });
                    toast.success('FAQ deleted successfully!');
                    setFaqs(prev => prev.filter((faq) => faq._id !== id));
                } catch (error: any) {
                    toast.error(error.response?.data?.message || 'Failed to delete FAQ');
                } finally {
                    setIsDeleting(null);
                }
            }
        },
        cancel: { label: "Cancel", onClick: () => {} }
    });
  };

  // কলামের সাথে অ্যাকশন বাটন যোগ করা হচ্ছে
  const columnsWithActions: ColumnDef<FAQ>[] = [
    ...(faq_columns as ColumnDef<FAQ>[]),
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const faqItem = row.original;
        const isCurrentlyDeleting = isDeleting === faqItem._id;
        return (
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline" disabled={isCurrentlyDeleting}>
              <Link href={`/general/view/all/faqs/edit?id=${faqItem._id}`}>
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
    <div className="p-5">
      <div className="py-4 pr-5 flex justify-end gap-2">
        <Button size="sm" asChild>
          <Link href="/general/view/all/faqs/add">
            <Plus className="h-4 w-4 mr-2" />
            Add New FAQ
          </Link>
        </Button>
      </div>
      <DataTable columns={columnsWithActions} data={faqs} />
    </div>
  );
}