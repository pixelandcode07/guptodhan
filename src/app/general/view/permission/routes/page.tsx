import SectionTitle from '@/components/ui/SectionTitle';
import PermissionRouteTable from './Components/PermissionRouteTable';

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

export default function PermitionUsersPage() {
  return (
    <div className="pb-6 pt-5 space-y-6 bg-white">
      <SectionTitle text="Permission Route List" />
      <div className="px-5">
        <PermissionRouteTable data={apiRoutes} />
      </div>
    </div>
  );
}
