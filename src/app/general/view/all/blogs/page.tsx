// app/blogs/page.tsx

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ListOrdered } from 'lucide-react';
import { DataTable } from '@/components/TableHelper/data-table';
import { blogs_columns } from '@/components/TableHelper/blogs_columns';
import SectionTitle from '@/components/ui/SectionTitle';

type Blog = {
  id: number;
  title: string;
  image: string;
  category: string;
  status: string;
  published: string;
};

const blogs: Blog[] = [
  {
    id: 1,
    title: 'Guptodhan.com: কীভাবে ব্যবহার করবেন এবং কী সুবিধা পাবেন?',
    image: '/blogImages/1Rzmf1738560493.jpg',
    category: 'E-commerce',
    status: 'Active',
    published: '2024-11-10',
  },
  {
    id: 2,
    title: 'গুপ্তধন ডট কম – ইকমার্স মডিউলের শর্তাবলী',
    image: '/blogImages/f1xjC1741673614.jpg',
    category: 'E-commerce',
    status: 'Active',
    published: '2025-03-11',
  },
  {
    id: 3,
    title: 'গুপ্তধন ডট কম – ক্রয়-বিক্রয় (Buy&Sale) পরিষেবার নিয়মাবলী !',
    image: '/blogImages/OPqsX1741672537.jpg',
    category: 'Buy&Sale',
    status: 'Active',
    published: '2025-03-11',
  },
  {
    id: 4,
    title: 'গুপ্তধন ডট কম – ডোনেশন মডিউলের নীতিমালা',
    image: '/blogImages/waaRK1741673378.jpg',
    category: 'Donation',
    status: 'Active',
    published: '2025-03-11',
  },
];

export default function BlogPage() {
  const [search, setSearch] = useState('');

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className=" bg-white">
      <div className="flex w-full justify-between items-center pt-5 flex-wrap">
        <div className="">
          <SectionTitle text="View All Blogs" />
        </div>

        <div className=" pr-5">
          <Button variant="destructive" size="sm" asChild>
            <a href="#">
              <ListOrdered className="h-4 w-4 mr-2" />
              Rearrange
            </a>
          </Button>
        </div>
      </div>
      <div className="p-5 pt-">
        {' '}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          {/* Show Entries Dropdown */}
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
          </div>

          {/* Search Input */}
          <div className="flex items-center gap-2">
            <span>Search:</span>
            <Input
              placeholder="Search blogs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-64"
            />
          </div>
        </div>
        <DataTable columns={blogs_columns} data={blogs} />
      </div>
    </div>
  );
}
