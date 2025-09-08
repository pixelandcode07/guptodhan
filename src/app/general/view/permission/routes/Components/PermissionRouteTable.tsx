'use client';

import { useState } from 'react';
import { DataTable } from '@/components/TableHelper/data-table';
import { permition_role_list_columns } from '@/components/TableHelper/permition_route_list_columns';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

type ApiRoute = {
  sl: number;
  route: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | string;
  createdAt: string;
  updatedAt: string;
};

interface PermissionRouteTableProps {
  data: ApiRoute[];
}

export default function PermissionRouteTable({
  data,
}: PermissionRouteTableProps) {
  const [search, setSearch] = useState('');
  const [entries, setEntries] = useState<number | 'all'>(10);

  // Filter by search
  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // Slice based on entries
  const displayedData =
    entries === 'all' ? filteredData : filteredData.slice(0, entries);

  return (
    <div className="space-y-4">
      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 pb-4">
        <div className="flex items-center gap-2">
          <label htmlFor="entries" className="text-sm font-medium">
            Show:
          </label>
          <Select
            value={entries.toString()}
            onValueChange={value =>
              setEntries(value === 'all' ? 'all' : Number(value))
            }>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 items-center w-full md:w-auto">
          <Input
            type="search"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full md:w-64"
          />
          <Button>
            <RefreshCcw />
            Regenerate Route
          </Button>
        </div>
      </div>

      {/* DataTable */}
      <DataTable columns={permition_role_list_columns} data={displayedData} />
    </div>
  );
}
