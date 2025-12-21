// import dbConnect from '@/lib/db';
// import { VendorProductServices } from '@/lib/modules/product/vendorProduct.service';
// import { CategoryServices } from '@/lib/modules/ecommerce-category/services/ecomCategory.service';
// import { StoreServices } from '@/lib/modules/vendor-store/vendorStore.service';
// import { ProductFlagServices } from '@/lib/modules/product-config/services/productFlag.service';
// import ProductTableClient from './components/ProductTableClient';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// // This is now a Server Component
// export default async function ViewAllProductsPage() {
//   await dbConnect();
//   // const session = await getServerSession(authOptions);
//   // const id = session?.user?.vendorId;
//   // console.log("session---->", session)
//   // console.log("User---->", session?.user)
//   // console.log("vendorId---->", id)

//   // Fetch all necessary data on the server
//   const [productsData, categoriesData, storesData, flagsData] = await Promise.all([
//     VendorProductServices.getAllVendorProductsFromDB(),
//     CategoryServices.getAllCategoriesFromDB(),
//     StoreServices.getAllStoresFromDB(),
//     ProductFlagServices.getAllProductFlagsFromDB(),
//   ]);

//   // Transform data to plain objects
//   const initialData = {
//     products: JSON.parse(JSON.stringify(productsData || [])),
//     categories: JSON.parse(JSON.stringify(categoriesData || [])),
//     stores: JSON.parse(JSON.stringify(storesData || [])),
//     flags: JSON.parse(JSON.stringify(flagsData || [])),
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
//       <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
//         {/* Header Section */}
//         <div className="mb-6 sm:mb-8">
//           <div className="flex items-center justify-between">
//             <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">All Products</h1>
//           </div>
//         </div>

//         {/* Client Component for Interactive Table */}
//         <ProductTableClient initialData={initialData} />
//       </div>
//     </div>
//   );
// }

// app/products/all/page.tsx

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ProductTableClient from './components/ProductTableClient';
import axios from 'axios';

export default async function ViewAllProductsPage() {
  const session = await getServerSession(authOptions);
  const vendorId = (session?.user as any)?.vendorId;

  // লগইন না থাকলে বা vendorId না থাকলে ব্লক করুন
  if (!vendorId) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p className="text-red-600 text-xl font-bold">Access Denied</p>
        <p>Vendor login required to view products.</p>
      </div>
    );
  }

  let initialData = {
    products: [],
    categories: [],
    stores: [],
    flags: [],
  };

  try {
    // আপনার API কল — vendorId দিয়ে
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/public/vendor-store/store-with-product/${vendorId}`
    );

    const apiData = response.data.data;

    const store = apiData.store;
    const productsWithReviews = apiData.productsWithReviews || [];

    // ProductTableClient-এর জন্য প্রয়োজনীয় ফরম্যাটে ডাটা তৈরি করুন
    const products = productsWithReviews.map((p: any) => ({
      ...p,
      // vendorStoreId এবং vendorName ঠিক রাখুন (যদিও ইতিমধ্যে আছে)
      vendorStoreId: p.vendorStoreId?._id || store._id,
      vendorName: p.vendorName || store.storeName,
      // category, flag ইত্যাদি অবজেক্ট থেকে নাম নিন (যদি string না থাকে)
      category: typeof p.category === 'object' ? p.category : { _id: p.category, name: 'Unknown' },
      flag: typeof p.flag === 'object' ? p.flag : { _id: p.flag, name: 'Unknown' },
    }));

    // categories এবং flags আলাদা করে সংগ্রহ করুন (ফিল্টার বা ড্রপডাউনের জন্য)
    const uniqueCategories = Array.from(
      new Map(
        productsWithReviews
          .filter((p: any) => p.category && p.category._id)
          .map((p: any) => [p.category._id, p.category])
      ).values()
    );

    const uniqueFlags = Array.from(
      new Map(
        productsWithReviews
          .filter((p: any) => p.flag && p.flag._id)
          .map((p: any) => [p.flag._id, p.flag])
      ).values()
    );

    initialData = {
      products,
      categories: uniqueCategories,
      stores: [store], // শুধু নিজের স্টোর
      flags: uniqueFlags,
    };
  } catch (error: any) {
    console.error('Failed to fetch vendor products:', error);
    const errorMessage = error.response?.data?.message || 'Failed to load products';

    return (
      <div className="container mx-auto p-8 text-center">
        <p className="text-red-600 text-xl font-bold">Error</p>
        <p>{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              My Products ({initialData.products.length})
            </h1>
          </div>
        </div>

        <ProductTableClient initialData={initialData} />
      </div>
    </div>
  );
}