import { DataTable } from '@/components/TableHelper/data-table';
import { Flag, flag_columns } from '@/components/TableHelper/flag_columns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Move } from 'lucide-react';

function getData(): Flag[] {
  return [
    {
      id: 1,
      icon: '',
      name: 'New Collection',
      status: 'Active',
      featured: 'Featured',
      created_at: '2024-08-18 09:58:42 pm',
    },
    {
      id: 2,
      icon: '',
      name: 'Best',
      status: 'Inactive',
      featured: 'Featured',
      created_at: '2024-08-18 10:00:02 pm',
    },
    {
      id: 3,
      icon: '',
      name: 'Popular',
      status: 'Active',
      featured: 'Featured',
      created_at: '2024-08-18 10:00:20 pm',
    },
    {
      id: 4,
      icon: '',
      name: 'Offer',
      status: 'Active',
      featured: 'Not Featured',
      created_at: '2025-03-10 01:25:58 pm',
    },
    {
      id: 5,
      icon: '',
      name: 'Eid Collection',
      status: 'Active',
      featured: 'Featured',
      created_at: '2024-08-18 10:00:09 pm',
    },
  ];
}

export default function ViewAllFlagsPage() {
  const data = getData();
  return (
    <div className="m-5 p-5 border ">
      <div>
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">Product Flags</span>
        </h1>
      </div>
      <div className="flex items-center justify-end gap-4 mb-4">
        <span className="flex items-center gap-2">
          <span>Search:</span>
          <Input type="text" className="border border-gray-500" />
        </span>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Flag
        </Button>
        <Button variant="outline">
          <Move className="w-4 h-4 mr-2" />
          Rearrange Flags
        </Button>
      </div>
      <DataTable columns={flag_columns} data={data} />
    </div>
  );
}
