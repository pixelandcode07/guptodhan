'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '../ui/button';
import { Edit } from 'lucide-react';

export type StoresDataType = {
  sl: number;
  route: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | string;
  createdAt: string;
  updatedAt: string;
};

export const permition_role_list_columns: ColumnDef<StoresDataType>[] = [
  { accessorKey: 'sl', header: 'SL' },
  { accessorKey: 'route', header: 'Route' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'method', header: 'Method' },
  { accessorKey: 'createdAt', header: 'Acount Created' },
  { accessorKey: 'updatedAt', header: 'Updated At' },
];
