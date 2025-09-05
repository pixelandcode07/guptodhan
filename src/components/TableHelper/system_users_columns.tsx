'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch'; // ✅ তোমার কাস্টম Switch

export type Size = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  createDate: string;
  userType: string;
};

import { Row } from '@tanstack/react-table';

function ActionCell({ row }: { row: Row<Size> }) {
  const type = row.getValue('userType') as string;
  const [checked, setChecked] = React.useState(type === 'Make SuperAdmin');

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={checked}
        onCheckedChange={val => {
          setChecked(val);
          // এখানে তুমি চাইলে API কল করতে পারো
          console.log(
            val ? 'Make SuperAdmin' : 'Revoke SuperAdmin',
            'for user:',
            row.getValue('name')
          );
        }}
        className={
          checked
            ? 'data-[state=checked]:bg-green-600'
            : 'data-[state=unchecked]:bg-red-600'
        }
      />
      <Button
        variant="ghost"
        size="sm"
        className="text-red-600 hover:text-red-700 hover:bg-red-50">
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}

export const seystem_users_columns: ColumnDef<Size>[] = [
  {
    accessorKey: 'id',
    header: 'SL',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
  },
  {
    accessorKey: 'userType',
    header: 'User Type',
    cell: ({ row }) => {
      const type = row.getValue('userType') as string;
      return (
        <span
          className={
            type === 'Make SuperAdmin'
              ? 'text-green-600 font-medium'
              : type === 'Revoke SuperAdmin'
              ? 'text-red-600 font-medium'
              : ''
          }>
          {type}
        </span>
      );
    },
  },
  {
    id: 'action',
    header: 'Action',
    cell: ({ row }) => <ActionCell row={row} />,
  },
];
