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
import { fact_columns } from '@/components/TableHelper/fact_columns';
import { ArrowUpDown, Edit, Trash2, Download } from 'lucide-react';

type Fact = {
  id: number;
  title: string;
  desc: string;
  count: string | number;
  status: string;
};

type Props = {
  data: Fact[];
};

export default function FactsTable({ data }: Props) {
  const [search, setSearch] = useState('');
  const [facts, setFacts] = useState(data);

  const filteredData = facts.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  // Button Handlers
  const handleAddNew = () => {
    const newFact = {
      id: facts.length + 1,
      title: 'New Fact',
      desc: 'New description',
      count: 0,
      status: 'Active',
    };
    setFacts([...facts, newFact]);
    alert('New fact added!');
  };

  const handleRearrange = () => {
    setFacts([...facts].reverse());
    alert('Facts rearranged!');
  };

  const handleEdit = (id: number) => {
    const fact = facts.find(f => f.id === id);
    if (fact) alert(`Editing: ${fact.title}`);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this fact?')) {
      setFacts(facts.filter(f => f.id !== id));
      alert('Fact deleted!');
    }
  };

  // Add action buttons to the table dynamically
  const columnsWithActions = [
    ...fact_columns,
    {
      header: () => (
        <div className="flex items-center">
          Actions
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      accessorKey: 'actions',
      cell: ({ row }: unknown) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEdit(row.original.id)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDelete(row.original.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Buttons */}
      <div className="flex justify-end gap-2 mb-4">
        <Button variant="secondary" size="sm" onClick={handleAddNew}>
          Add New
        </Button>
        <Button variant="secondary" size="sm" onClick={handleRearrange}>
          Rearrange
        </Button>
      </div>

      {/* Show Entries & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <Select defaultValue="10">
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
          <Button variant="ghost" size="sm" title="Download">
            <Download className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span>Search:</span>
          <Input
            placeholder="Search facts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      <DataTable columns={columnsWithActions} data={filteredData} />
    </div>
  );
}
