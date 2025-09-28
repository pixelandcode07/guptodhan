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

import { Plus } from 'lucide-react';
import { faq_columns } from '@/components/TableHelper/faq_categories';

type Faq = {
  id: number;
  category: string;
  qustion: string;
  answer: string;
  status: string;
};

const faq: Faq[] = [
  {
    id: 1,
    category: 'Shipping Information',
    qustion: 'Distinctio Et volup',
    answer: 'Qui illum ut quasi',
    status: 'Active',
  },
  {
    id: 2,
    category: 'Payment',
    qustion: 'Possimus asperiores',
    answer: 'Lorem quo elit labo',
    status: 'Active',
  },
  {
    id: 3,
    category: 'Shipping Information	',
    qustion: 'Temporibus qui sapie	',
    answer: 'Sint quibusdam facer',
    status: 'Active',
  },
  {
    id: 4,
    category: 'Shipping Information	',
    qustion: 'Veniam non et deser	',
    answer: 'Dolor eligendi magna	',
    status: 'Active',
  },
  {
    id: 5,
    category: 'Shipping ',
    qustion: 'Information	Voluptatibus sed aut',
    answer: '	Enim omnis quo reici',
    status: 'Active',
  },
];

export default function Tems() {
  const [search, setSearch] = useState('');

  const filteredBlogs = faq.filter(blog =>
    blog.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className=" bg-white">
      <div className="flex w-full justify-between items-center pt-5 flex-wrap">
        <div className="">
          <SectionTitle text="FAQ List" />
        </div>
      </div>
      <div className="p-5 pt-">
        <div className=" py-4 pr-5 flex justify-end ">
          <div className="flex gap-2 jstify-end">
            {' '}
            <Button size="sm" asChild>
              <a href="#">
                <Plus className="h-4 w-4 mr-2" />
                Add New FAQ
              </a>
            </Button>
            <Button size="sm" asChild>
              <a href="#">
                <Plus className="h-4 w-4 mr-2" />
                Rearrange
              </a>
            </Button>
          </div>
        </div>
        <DataTable columns={faq_columns} data={faq} />
      </div>
    </div>
  );
}
