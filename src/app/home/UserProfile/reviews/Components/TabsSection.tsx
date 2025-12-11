// 'use client';
// import { useState } from 'react';
// import Reviewed from './Reviewed';
// import History from './History';

// export default function Tabs() {
//   const [activeTab, setActiveTab] = useState<'toReview' | 'history'>(
//     'toReview'
//   );

//   return (
//     <div className=" bg-white rounded-md">
//       {/* Tabs */}
//       <div className="flex gap-3 mb-6">
//         <button
//           className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 cursor-pointer ${
//             activeTab === 'toReview'
//               ? 'bg-blue-500 text-white shadow-md'
//               : 'bg-gray-200 text-gray-700 hover:bg-blue-300 hover:text-white'
//           }`}
//           onClick={() => setActiveTab('toReview')}>
//           To Be Reviewed
//         </button>
//         <button
//           className={`px-4 py-2 rounded-md flex gap-2 justify-center items-center font-medium transition-colors duration-200 cursor-pointer ${
//             activeTab === 'history'
//               ? 'bg-blue-500 text-white shadow-md'
//               : 'bg-gray-200 text-gray-700 hover:bg-blue-300 hover:text-white'
//           }`}
//           onClick={() => setActiveTab('history')}>
//           History
//           <span className="rounded-full ml-1 bg-red-500 text-white text-xs font-bold px-[6px] py-[2px]">
//             3
//           </span>
//         </button>
//       </div>

//       {/* Tab Content */}
//       <div>
//         {activeTab === 'toReview' && <Reviewed />}
//         {activeTab === 'history' && <History />}
//       </div>
//     </div>
//   );
// }


"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ToBeReview from "./ToBeReview";
import ReviewHistory from "./ReviewHistory";

export default function TabsSection() {
  return (
    <Tabs defaultValue="toReview" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="toReview">To be Review</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>

      <TabsContent value="toReview">
        <ToBeReview />
      </TabsContent>

      <TabsContent value="history">
        <ReviewHistory />
      </TabsContent>
    </Tabs>
  );
}
