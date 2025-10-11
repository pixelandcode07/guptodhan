'use client';

import { blogs_columns } from '@/components/TableHelper/blogs_columns';
import { DataTable } from '@/components/TableHelper/data-table';
import SectionTitle from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/button';
import { ListOrdered } from 'lucide-react';

export default function BlogTable({ blogs }) {
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
      <DataTable columns={blogs_columns} data={blogs} />{' '}
    </div>
  );
}
