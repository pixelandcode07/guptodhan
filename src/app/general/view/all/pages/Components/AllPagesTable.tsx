'use client';

import { all_page_columns } from '@/components/TableHelper/all_page_columns';
import { DataTable } from '@/components/TableHelper/data-table';

type PageData = {
  id: number;
  image: string;
  title: string;
  url: string;
  status: string;
};

type Props = {
  pages: PageData[];
};

export default function AllPagesTable({ pages }: Props) {

  return (
    <div>
      {/* Filter & Search */}

      <DataTable columns={all_page_columns} data={pages} />
    </div>
  );
}
