'use client';

import { ColumnDef } from '@tanstack/react-table';

export type Transaction = {
  trxId: string;
  amount: string;
  cardType: string;
  payment: string;
};

export const transactions_columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'trxId',
    header: 'TRX ID',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
  },
  {
    accessorKey: 'cardType',
    header: 'Card Type/Brand',
  },
  {
    accessorKey: 'payment',
    header: 'Payment Through',
  },
];
