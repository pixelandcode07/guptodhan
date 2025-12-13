// // 'use client'
// import { DataTable } from '@/components/TableHelper/data-table'
// import { view_buy_sell_columns } from '@/components/TableHelper/view_buy_sell_columns'
// import axios from 'axios';
// import { toast } from 'sonner';
// import CategoriesTable from './components/CategoriesTable';


import React from 'react';

// The function must be exported as the default
export default function BuySellCategoriesPage() {
  return (
    <div>
      <h1>Buy/Sell Categories Page</h1>
      {/* Your page content goes here */}
    </div>
  );
}


// const fetchCataData = async () => {
//     try {
//         const baseUrl = process.env.NEXTAUTH_URL;
//         const { data: postedData } = await axios.get(`${baseUrl}/api/v1/public/classifieds-categories`);
//         console.log("postedData:", postedData)
//         return postedData.data || [];
//     } catch (error) {
//         console.error("Error fetching posts:", error);
//         return [];
//     }
// };

// export default async function ViewBuySellCategories() {
//     const data = await fetchCataData();


//     return (
//         <div className="m-5 p-5 shadow-sm border border-gray-200 rounded-md bg-white transition-all duration-300 hover:shadow-lg hover:border-gray-300">
//             <div className='py-5'>
//                 <h1 className="text-lg font-semibold border-l-2 border-blue-500">
//                     <span className="pl-5">Category List</span>
//                 </h1>
//             </div>
//             {/* <DataTable columns={view_buy_sell_columns} data={data} /> */}
//             {/* <DataTable
//                 columns={view_buy_sell_columns(handleDelete)}
//                 data={data}
//                 rearrangePath="/general/rearrange/buy/sell/categories"
//             /> */}
//             <CategoriesTable data={data} />
//         </div>
//     )
// }
