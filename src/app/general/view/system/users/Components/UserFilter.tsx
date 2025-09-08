'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/TableHelper/data-table';

export default function UsersFilter({
  data,
  columns,
}: {
  data: any[];
  columns: any;
}) {
  const [search, setSearch] = useState('');
  const [entries, setEntries] = useState('10');

  const filteredData = data.filter(item =>
    item.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Show:</span>
          <Select value={entries} onValueChange={setEntries}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 items-center w-full md:w-auto">
          <Input
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full md:w-64"
          />
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add New User
          </Button>
        </div>
      </div>

      <DataTable columns={columns} data={filteredData} />
    </div>
  );
}
