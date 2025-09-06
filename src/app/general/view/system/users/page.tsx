'use client';

import { useState } from 'react';

import SectionTitle from '@/components/ui/SectionTitle';
import { DataTable } from '@/components/TableHelper/data-table';
import { all_page_columns } from '@/components/TableHelper/all_page_columns';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { seystem_users_columns } from '@/components/TableHelper/system_users_columns';

// Example data (you can fetch from API later)
const userData = [
  {
    id: 1,
    name: 'Amir Hamja ',
    email: 'amir@gmailcom',
    phone: '01816500800',
    address: 'Dhaka Bangladesh',
    createDate: '025-06-24 12:04:11 pm',
    userType: 'Revoke SuperAdmin',
  },
  {
    id: 2,
    name: 'Amir Hamja ',
    email: 'amir@gmailcom',
    phone: '01816500800',
    address: 'Dhaka Bangladesh',
    createDate: '025-06-24 12:04:11 pm',
    userType: 'Revoke SuperAdmin',
  },
  {
    id: 3,

    name: 'Amir Hamja ',
    email: 'amir@gmailcom',
    phone: '01816500800',
    address: 'Dhaka Bangladesh',
    createDate: '025-06-24 12:04:11 pm',
    userType: 'Make SuperAdmin',
  },
];

export default function Users() {
  const [search, setSearch] = useState('');

  const filteredData = userData.filter(item =>
    item.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pb-6 pt-5 space-y-6 bg-white">
      <SectionTitle text="Seystem Users List" />
      <div className="px-5 p">
        {/* Filter & Search */}
        <div className="flex flex-col md:flex-row pb-4 md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="entries" className="text-sm font-medium">
              Show:
            </label>
            <select
              id="entries"
              className="border rounded-md px-2 py-1 text-sm">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="search"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border px-3 py-2 rounded-md w-full md:w-64 text-sm"
            />
            <Button>
              <Plus />
              Add New User
            </Button>
          </div>
        </div>

        <DataTable columns={seystem_users_columns} data={userData} />
      </div>
    </div>
  );
}
