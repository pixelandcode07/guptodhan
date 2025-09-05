'use client';

import { useState } from 'react';

import { DataTable } from '@/components/TableHelper/data-table';
import { permition_role_list_columns } from '@/components/TableHelper/permition_route_list_columns';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/ui/SectionTitle';
import { RefreshCcw } from 'lucide-react';

// Example data (you can fetch from API later)

type ApiRoute = {
  sl: number;
  route: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | string;
  createdAt: string;
  updatedAt: string;
};
const apiRoutes: ApiRoute[] = [
  {
    sl: 1,
    route: 'save/rearranged/vendor/categories',
    name: 'BuySellCategoryRearrangeSave',
    method: 'POST',
    createdAt: '2025-07-06 11:42:14 pm',
    updatedAt: '2025-08-20 09:53:10 pm',
  },
  {
    sl: 2,
    route: 'rearrange/vendor/categories',
    name: 'VendorCategoryRearrange',
    method: 'GET',
    createdAt: '2025-07-06 11:42:14 pm',
    updatedAt: '2025-08-20 09:53:10 pm',
  },
  {
    sl: 3,
    route: 'update/vendor/category',
    name: 'VendorCategoryUpdate',
    method: 'POST',
    createdAt: '2025-07-06 11:42:14 pm',
    updatedAt: '2025-08-20 09:53:10 pm',
  },
  {
    sl: 4,
    route: 'edit/vendor/category/{slug}',
    name: 'VendorCategoryEdit',
    method: 'GET',
    createdAt: '2025-07-06 11:42:14 pm',
    updatedAt: '2025-08-20 09:53:10 pm',
  },
  {
    sl: 5,
    route: 'delete/vendor/category/{slug}',
    name: 'VendorCategoryDelete',
    method: 'GET',
    createdAt: '2025-07-06 11:42:14 pm',
    updatedAt: '2025-08-20 09:53:10 pm',
  },
  {
    sl: 6,
    route: 'view/vendor/categories',
    name: 'VendorCategoryView',
    method: 'GET',
    createdAt: '2025-07-06 11:42:14 pm',
    updatedAt: '2025-08-20 09:53:10 pm',
  },
  {
    sl: 7,
    route: 'save/vendor/category',
    name: 'VendorCategorySave',
    method: 'POST',
    createdAt: '2025-07-06 11:42:14 pm',
    updatedAt: '2025-08-20 09:53:10 pm',
  },
  {
    sl: 8,
    route: 'create/vendor/category',
    name: 'VendorCategoryCreateNew',
    method: 'GET',
    createdAt: '2025-07-06 11:42:14 pm',
    updatedAt: '2025-08-20 09:53:10 pm',
  },
  {
    sl: 9,
    route: 'submit/blog/reply',
    name: 'SubmitReplyOfComment',
    method: 'POST',
    createdAt: '2025-07-06 11:42:14 pm',
    updatedAt: '2025-08-20 09:53:09 pm',
  },
  {
    sl: 10,
    route: 'get/blog/comment/info/{id}',
    name: 'GetBlogCommentInfo',
    method: 'GET',
    createdAt: '2025-07-06 11:42:14 pm',
    updatedAt: '2025-08-20 09:53:09 pm',
  },
  {
    sl: 11,
    route: 'delete/blog/comments/{slug}',
    name: 'DeleteBlogComment',
    method: 'GET',
    createdAt: '2025-07-06 11:42:14 pm',
    updatedAt: '2025-08-20 09:53:09 pm',
  },
  {
    sl: 12,
    route: 'approve/blog/comments/{slug}',
    name: 'ApproveBlogComment',
    method: 'GET',
    createdAt: '2025-07-06 11:42:14 pm',
    updatedAt: '2025-08-20 09:53:09 pm',
  },
  {
    sl: 13,
    route: 'blog/comments',
    name: 'BlogComments',
    method: 'GET',
    createdAt: '2025-07-06 11:42:14 pm',
    updatedAt: '2025-08-20 09:53:09 pm',
  },
  {
    sl: 14,
    route: 'save/rearranged/blogs',
    name: 'saveRearrangedBlogs',
    method: 'POST',
    createdAt: '2025-07-06 11:42:14 pm',
    updatedAt: '2025-08-20 09:53:09 pm',
  },
  {
    sl: 15,
    route: 'rearrange/blogs',
    name: 'RearrangeBlog',
    method: 'GET',
    createdAt: '2025-07-06 11:42:14 pm',
    updatedAt: '2025-08-20 09:53:09 pm',
  },
  {
    sl: 16,
    route: 'update/status/order/courier',
    name: '',
    method: 'POST',
    createdAt: '2025-07-06 11:42:13 pm',
    updatedAt: '2025-08-20 09:53:09 pm',
  },
  {
    sl: 17,
    route: 'add/bulk/order/courier',
    name: '',
    method: 'POST',
    createdAt: '2025-07-06 11:42:13 pm',
    updatedAt: '2025-08-20 09:53:09 pm',
  },
  {
    sl: 18,
    route: 'add/order/{orderid}/courier',
    name: '',
    method: 'GET',
    createdAt: '2025-07-06 11:42:13 pm',
    updatedAt: '2025-08-20 09:53:09 pm',
  },
  {
    sl: 19,
    route: 'check-order/{order_no}',
    name: 'checkOrder',
    method: 'GET',
    createdAt: '2025-07-06 11:42:13 pm',
    updatedAt: '2025-08-20 09:53:09 pm',
  },
  {
    sl: 20,
    route: 'search/order',
    name: 'searchOrder',
    method: 'GET',
    createdAt: '2025-07-06 11:42:13 pm',
    updatedAt: '2025-08-20 09:53:09 pm',
  },
];

export default function PermitionUsers() {
  const [search, setSearch] = useState('');

  const filteredData = apiRoutes.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pb-6 pt-5 space-y-6 bg-white">
      <SectionTitle text="Permission Route List" />
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
              <RefreshCcw />
              Regenerte Route
            </Button>
          </div>
        </div>
        <DataTable columns={permition_role_list_columns} data={filteredData} />
      </div>
    </div>
  );
}
