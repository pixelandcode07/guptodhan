'use client';

import { useState } from 'react';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

import { DataTable } from '@/components/TableHelper/data-table';
import SectionTitle from '@/components/ui/SectionTitle';
import { ColumnDef } from '@tanstack/react-table';

type Tems = {
  id: number;
  img: string;
  name: string;
  desc: string;
};

const initialTems: Tems[] = [
  {
    id: 1,
    img: 'https://github.com/shadcn.png',
    name: 'Rana Beach',
    desc: 'Autem Vel in volupta',
  },
  {
    id: 2,
    img: 'https://github.com/shadcn.png',
    name: 'Another Name',
    desc: 'Autem Vel in volupta',
  },
  {
    id: 3,
    img: 'https://github.com/shadcn.png',
    name: 'Some FAQ',
    desc: 'Autem Vel in volupta',
  },
];

export default function TemsTable() {
  const [data, setData] = useState<Tems[]>(initialTems);
  const [search, setSearch] = useState('');
  const [entries, setEntries] = useState('10');

  // ✅ Filter
  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Add New Row
  const handleAddNew = () => {
    const newItem: Tems = {
      id: Date.now(), // unique id
      img: 'https://github.com/shadcn.png',
      name: `New Item ${data.length + 1}`,
      desc: 'This is a new item',
    };
    setData(prev => [...prev, newItem]);
  };

  // ✅ Rearrange Example
  const handleRearrange = () => {
    setData(prev => [...prev].reverse()); // just reverse order
  };

  // ✅ Columns
  const columns: ColumnDef<Tems>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'img',
      header: 'Image',
      cell: ({ row }) => (
        <img
          src={row.original.img}
          alt={row.original.name}
          className="w-10 h-10 rounded-full"
        />
      ),
    },
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'desc',
      header: 'Description',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const item = row.original;

        const handleEdit = () => {
          alert(`Edit clicked for: ${item.name}`);
        };

        const handleDelete = () => {
          setData(prev => prev.filter(t => t.id !== item.id));
        };

        return (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleEdit}>
              Edit
            </Button>
            <Button size="sm" variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-white">
      <div className="flex w-full justify-between items-center pt-5 flex-wrap">
        <SectionTitle text="FAQ List" />
      </div>

      <div className="p-5">
        {/* Top Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          {/* Show Entries Dropdown */}
          <div className="flex items-center gap-2">
            <span>Show</span>
            <Select value={entries} onValueChange={setEntries}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span>entries</span>
          </div>

          {/* Search Input */}
          <div className="flex items-center gap-2">
            <span>Search:</span>
            <Input
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-64"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="py-4 pr-5 flex justify-end">
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAddNew}>
              Add New
            </Button>
            <Button size="sm" onClick={handleRearrange}>
              Rearrange
            </Button>
          </div>
        </div>

        {/* Data Table */}
        <DataTable columns={columns} data={filteredData} />
      </div>
    </div>
  );
}
