'use client';

import { DataTable } from '@/components/TableHelper/data-table';
import { faq_columns } from '@/components/TableHelper/faq_categories';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import axios from 'axios';
import { toast } from 'sonner';

interface FAQSTabileProps {
  faq: any[];
  refreshData?: () => void; // optional callback to refresh parent data
  loading?: boolean;
}

export default function FAQSTabile({ faq, refreshData, loading }: FAQSTabileProps) {
  const deleteFAQ = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    const toastId = toast.loading('Deleting FAQ...');
    try {
      await axios.delete(`http://localhost:3000/api/v1/faq/${id}`);
      toast.success('FAQ deleted successfully!', { id: toastId });
      refreshData?.(); // refresh table after deletion
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete FAQ', { id: toastId });
    }
  };

  // Add actions column
  const columnsWithActions = [
    ...faq_columns,
    {
      header: () => (
        <div className="flex items-center">
          Actions <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      accessorKey: 'actions',
      cell: ({ row }: any) => {
        const faqItem = row.original;
        return (
          <div className="flex gap-2">
            {/* Edit Button */}
            <Link
              href={{
                pathname: '/general/view/all/faqs/edit',
                query: {
                  id: faqItem._id,
                  category: faqItem.category,
                  question: faqItem.question,
                  answer: faqItem.answer,
                  isActive: faqItem.isActive,
                },
              }}
            >
              <Button size="sm" variant="outline">
                <Edit className="w-4 h-4" />
              </Button>
            </Link>

            {/* Delete Button */}
            <Button size="sm" variant="destructive" onClick={() => deleteFAQ(faqItem._id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-5">
      {/* Top Buttons */}
      <div className="py-4 pr-5 flex justify-end gap-2">
        <Button size="sm" asChild>
          <Link href="/general/view/all/faqs/add">
            <Plus className="h-4 w-4 mr-2" />
            Add New FAQ
          </Link>
        </Button>

        <Button size="sm" asChild>
          <a href="#">
            <Plus className="h-4 w-4 mr-2" />
            Rearrange
          </a>
        </Button>
      </div>

      {/* Data Table */}
      <DataTable columns={columnsWithActions} data={faq}  />
    </div>
  );
}
