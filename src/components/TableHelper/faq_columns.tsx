'use client';

import { ColumnDef } from '@tanstack/react-table';

export type StoresDataType = {
  id: number;
  name: string;
  slug: string;
  status: string;
};

export const faq_categories_columns: ColumnDef<StoresDataType>[] = [
  {
    accessorKey: 'id',
    header: 'SL',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  // {
  //   accessorKey: 'action',
  //   header: 'Action',
  //   cell: () => {
  //     return (
  //       <div className="flex items-center gap-2">
  //         <Button className="bg-yellow-400 hover:bg-yellow-500 text-black cursor-pointer">
  //           <Edit />
  //         </Button>
  //         <Button className="bg-red-700 hover:bg-red-800 text-white cursor-pointer">
  //           <DeleteIcon />
  //         </Button>
  //       </div>
  //     );
  //   },
  // },
];
