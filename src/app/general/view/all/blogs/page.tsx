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
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">View All Blogs</CardTitle>
        <Button variant="destructive" size="sm" asChild>
          <a href="#">
            <ListOrdered className="h-4 w-4 mr-2" />
            Rearrange
          </a>
        </Button>
      </CardHeader>
      <CardContent>
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

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center w-12">SL</TableHead>
                <TableHead className="text-center">Title</TableHead>
                <TableHead className="text-center">Image</TableHead>
                <TableHead className="text-center">Category</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Published</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBlogs.map((blog, index) => (
                <TableRow key={blog.id}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell>{blog.title}</TableCell>
                  <TableCell className="text-center">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-14 h-14 object-cover rounded-md mx-auto"
                    />
                  </TableCell>
                  <TableCell className="text-center">{blog.category}</TableCell>
                  <TableCell className="text-center">{blog.status}</TableCell>
                  <TableCell className="text-center">
                    {blog.published}
                  </TableCell>
                  <TableCell className="flex items-center justify-center gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="p-1"
                      asChild>
                      <a
                        href={`https://app-area.guptodhan.com/edit/blog/${blog.id}`}>
                        <Edit className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="destructive" size="sm" className="p-1">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-4 text-sm text-gray-500">
          <p>
            Showing 1 to {filteredBlogs.length} of {blogs.length} entries
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="default" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
