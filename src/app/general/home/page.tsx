'use client';

import ChartCard from './Components/CardChart';
import CircleChart from './Components/CircleChart';

import SalesAnalyticsChart from './Components/SalaesAnlytcChart';
import { ShoppingCart, DollarSign, Users, Package } from 'lucide-react';
import { Table } from './Components/Table';
import { DataTable } from '@/components/TableHelper/data-table';
import { customer_data_columns } from '@/components/TableHelper/customer_data_column';
import { transactions_columns } from '@/components/TableHelper/transations_columns';

const chartDataArray = [
  {
    title: 'No of Orders (Monthly)',
    value: 35,
    data: [
      { name: 'Jan-25', success: 10, failed: 2 },
      { name: 'Feb-25', success: 15, failed: 5 },
      { name: 'Mar-25', success: 10, failed: 1 },
    ],
    color: '#3b82f6',
    Icon: ShoppingCart,
    iconColor: '#3b82f6',
    withButton: false,
  },
  {
    title: 'Total Revenue (Monthly)',
    value: '$45,000',
    data: [
      { name: 'Jan-25', success: 12000, failed: 0 },
      { name: 'Feb-25', success: 15000, failed: 0 },
      { name: 'Mar-25', success: 18000, failed: 0 },
    ],
    color: '#22c55e',
    Icon: DollarSign,
    iconColor: '#22c55e',
    withButton: false,
  },
  {
    title: 'Todays order (daily)',
    value: 52,
    data: [
      { name: '9AM', success: 12, failed: 1 },
      { name: '12PM', success: 22, failed: 2 },
      { name: '3PM', success: 18, failed: 0 },
    ],
    color: '#f97316',
    Icon: Package,
    iconColor: '#f97316',
    withButton: true,
  },
  {
    title: 'Registered Users (Monthly)',
    value: 670,
    data: [
      { name: 'Jan-25', success: 120, failed: 0 },
      { name: 'Feb-25', success: 250, failed: 0 },
      { name: 'Mar-25', success: 300, failed: 0 },
    ],
    color: '#e11d48',
    Icon: Users,
    iconColor: '#e11d48',
    withButton: false,
  },
];

// Transactions Data
const transactionsData = [
  {
    trxId: '09:14:54 PM, 27th August 2025',
    amount: '৳ 2400',
    cardType: 'N/A',
    payment: 'COD',
    status: 'VALID',
  },
  {
    trxId: '06:53:30 PM, 1st August 2025',
    amount: '৳ 200',
    cardType: 'N/A',
    payment: 'COD',
    status: 'VALID',
  },
  {
    trxId: '01:17:38 PM, 29th July 2025',
    amount: '৳ 3350',
    cardType: 'N/A',
    payment: 'COD',
    status: 'VALID',
  },
  {
    trxId: '12:09:14 PM, 29th July 2025',
    amount: '৳ 5359',
    cardType: 'N/A',
    payment: 'COD',
    status: 'VALID',
  },
  {
    trxId: '01:24:28 PM, 27th July 2025',
    amount: '৳ 2290',
    cardType: 'N/A',
    payment: 'COD',
    status: 'VALID',
  },
];

// Customers Data
const customerData = [
  {
    avatar: 'https://github.com/shadcn.png',
    name: 'Dewan center',
    phone: '',
    email: 'mjoy98592@gmail.com',
    location: 'dogri Bazar, agargaow, kaji Kandi, naria, shariatpur',
    date: '01:31:38 AM, 3rd September 2025',
  },
  {
    avatar: 'https://github.com/shadcn.png',
    name: 'Tareq Mahmud',
    phone: '',
    email: 'tmahmud771@gmail.com',
    location: '',
    date: '06:00:00 AM, 1st January 1970',
  },
  {
    avatar: 'https://github.com/shadcn.png',
    name: 'Harun Rashid',
    phone: '01740648071',
    email: '',
    location: 'Gosairhat Bazar, Shariatpur.',
    date: '11:33:19 AM, 31st August 2025',
  },
  {
    avatar: 'https://github.com/shadcn.png',
    name: 'Harun Rashid',
    phone: '',
    email: 'harunlinklion@gmail.com',
    location: 'Gosairhat Bazar, Shariatpur.',
    date: '11:29:17 AM, 31st August 2025',
  },
  {
    avatar: 'https://github.com/shadcn.png',
    name: 'Pabel Mun',
    phone: '',
    email: 'lockpabel99@gmail.com',
    location: '',
    date: '06:00:00 AM, 1st January 1970',
  },
];

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {chartDataArray.map(card => (
          <ChartCard
            key={card.title}
            title={card.title}
            value={card.value}
            color={card.color}
            data={card.data}
            Icon={card.Icon}
            iconColor={card.iconColor}
            withButton={card.withButton}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 h-full md:grid-cols-5 gap-4">
        <div className=" sm:grid-cols-1 md:col-span-2">
          <CircleChart />
        </div>
        <div className="sm:grid-cols-3 col-span-3">
          <SalesAnalyticsChart />
        </div>
      </div>

      <div className="gap-5 space-y-6 grid grid-cols-1 md:grid-cols-2">
        <DataTable columns={customer_data_columns} data={customerData} />
        <DataTable columns={transactions_columns} data={transactionsData} />
      </div>
    </div>
  );
}
