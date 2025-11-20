// import React from "react";
// import {
//   Star,
//   ChevronRight,
//   CheckCircle,
//   MapPin,
//   Heart,
//   ShoppingCart,
// } from "lucide-react";

// export default function ProductDetails() {
//   return (
//     <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-10">
      
//       {/* ================= BREADCRUMB ================= */}
//       <div className="bg-gray-100 py-2">
//         <div className="container mx-auto px-4 text-sm text-gray-500 flex items-center gap-2">
//           <span>Home</span> <ChevronRight size={14} />
//           <span>Men's Fashion</span> <ChevronRight size={14} />
//           <span className="text-gray-800">Product Details</span>
//         </div>
//       </div>

//       {/* ================= PRODUCT MAIN SECTION ================= */}
//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-6 rounded-lg shadow-sm">
          
//           {/* Left: Image Gallery */}
//           <div className="lg:col-span-4">
//             <div className="border rounded-lg overflow-hidden mb-4 bg-gray-50 flex items-center justify-center h-[400px]">
//               <img 
//                 src="https://placehold.co/400x500/1e3a8a/white?text=Navy+Blue+Shirt" 
//                 alt="Men's Shirt" 
//                 className="w-full h-full object-contain"
//               />
//             </div>
//             <div className="flex gap-2 overflow-x-auto">
//                 {[1, 2, 3, 4].map((img) => (
//                    <div key={img} className="w-20 h-20 border rounded cursor-pointer hover:border-orange-500 bg-gray-50 flex-shrink-0">
//                       <img src={`https://placehold.co/100x100/e2e8f0/gray?text=View+${img}`} alt="thumb" className="w-full h-full object-cover"/>
//                    </div>
//                 ))}
//             </div>
//           </div>

//           {/* Middle: Product Info */}
//           <div className="lg:col-span-5">
//             <h1 className="text-2xl font-semibold text-gray-800 mb-2">
//               Men's Casual Navy Blue Printed Shirt - Premium Quality
//             </h1>
            
//             <div className="flex items-center gap-4 mb-4 text-sm">
//                 <div className="flex text-yellow-400">
//                     {[1,2,3,4].map(s=><Star key={s} size={16} fill="currentColor"/>)}
//                     <Star size={16} className="text-gray-300" fill="currentColor"/>
//                 </div>
//                 <span className="text-blue-600 hover:underline cursor-pointer">58 Ratings</span>
//                 <span className="text-gray-400">|</span>
//                 <span className="text-blue-600 hover:underline cursor-pointer">2 Answered Questions</span>
//             </div>

//             <div className="flex items-end gap-3 mb-6">
//                 <span className="text-3xl font-bold text-orange-600">৳ 1,850</span>
//                 <span className="text-gray-400 line-through mb-1">৳ 6,500</span>
//                 <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">-66%</span>
//             </div>

//             {/* Colors */}
//             <div className="mb-6">
//                 <span className="text-gray-700 font-medium block mb-2">Available Color: Navy Blue</span>
//                 <div className="flex gap-2">
//                     <button className="w-8 h-8 rounded-full bg-blue-900 border-2 border-orange-500 ring-2 ring-offset-1 ring-orange-200"></button>
//                     <button className="w-8 h-8 rounded-full bg-black border border-gray-300"></button>
//                     <button className="w-8 h-8 rounded-full bg-white border border-gray-300"></button>
//                 </div>
//             </div>

//             {/* Sizes */}
//             <div className="mb-8">
//                 <span className="text-gray-700 font-medium block mb-2">Select Size: <span className="font-bold">XS</span></span>
//                 <div className="flex gap-3">
//                     {['XS', 'S', 'L', 'XL'].map((size, idx) => (
//                         <button 
//                             key={size} 
//                             className={`px-4 py-2 border rounded min-w-[50px] font-medium ${idx === 0 ? 'border-orange-500 text-orange-600 bg-orange-50' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}
//                         >
//                             {size}
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             {/* Buttons */}
//             <div className="flex gap-4">
//                 <button className="flex-1 bg-blue-100 text-blue-900 border border-blue-900 py-3 rounded font-bold hover:bg-blue-200 transition">
//                     Buy Now
//                 </button>
//                 <button className="flex-1 bg-orange-500 text-white py-3 rounded font-bold hover:bg-orange-600 transition flex justify-center items-center gap-2">
//                     <ShoppingCart size={18} /> Add To Cart
//                 </button>
//             </div>
//           </div>

//           {/* Right: Delivery & Seller */}
//           <div className="lg:col-span-3 space-y-4">
             
//              {/* Delivery Widget */}
//              <div className="bg-gray-50 p-4 rounded border">
//                 <div className="flex justify-between items-center mb-4">
//                     <span className="text-gray-500 text-sm">Delivery To</span>
//                     <button className="text-blue-600 text-sm font-medium">Change</button>
//                 </div>
//                 <div className="flex items-start gap-3 mb-4">
//                     <MapPin className="text-gray-500 mt-1" size={18} />
//                     <div className="text-sm">
//                         <p className="font-medium">Dhaka, Dhaka City North</p>
//                         <p className="text-gray-500">Standard Delivery</p>
//                     </div>
//                 </div>
//                 <div className="flex items-center gap-3 border-t pt-3">
//                      <div className="text-green-600"><CheckCircle size={18}/></div>
//                      <span className="text-sm font-medium text-gray-700">Cash on Delivery Available</span>
//                 </div>
//              </div>

//              {/* Seller Widget */}
//              <div className="bg-gray-50 p-4 rounded border">
//                  <div className="mb-2">
//                     <span className="text-gray-500 text-xs">Sold By</span>
//                     <div className="font-bold text-gray-800">RGHIEN HOUSE</div>
//                  </div>
//                  <div className="flex gap-2 text-xs mb-4">
//                      <div className="bg-white border px-2 py-1 rounded text-center flex-1">
//                          <span className="block font-bold text-gray-800">100%</span>
//                          <span className="text-[10px] text-gray-500">Chat Response</span>
//                      </div>
//                      <div className="bg-white border px-2 py-1 rounded text-center flex-1">
//                          <span className="block font-bold text-gray-800">90%</span>
//                          <span className="text-[10px] text-gray-500">Ship on Time</span>
//                      </div>
//                      <div className="bg-white border px-2 py-1 rounded text-center flex-1">
//                          <span className="block font-bold text-gray-800">99%</span>
//                          <span className="text-[10px] text-gray-500">Positive Rating</span>
//                      </div>
//                  </div>
//                  <button className="w-full text-blue-600 border border-blue-600 text-sm py-2 rounded hover:bg-blue-50">
//                      View Shop
//                  </button>
//              </div>

//           </div>
//         </div>
//       </div>

//       {/* ================= DETAILS & REVIEWS TABS ================= */}
//       <div className="container mx-auto px-4 mb-8">
//         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//             {/* Tab Headers */}
//             <div className="flex border-b bg-gray-50 overflow-x-auto">
//                 <button className="px-6 py-3 text-orange-600 border-b-2 border-orange-600 font-bold text-sm whitespace-nowrap">Product Details</button>
//                 <button className="px-6 py-3 text-gray-600 hover:text-orange-600 font-medium text-sm whitespace-nowrap">Reviews (58)</button>
//                 <button className="px-6 py-3 text-gray-600 hover:text-orange-600 font-medium text-sm whitespace-nowrap">Q&A</button>
//             </div>

//             <div className="p-6">
//                 {/* Description Content */}
//                 <h3 className="text-lg font-bold mb-4">Description</h3>
//                 <div className="text-sm text-gray-600 leading-relaxed space-y-4">
//                     <p>
//                         Just as a book is judged by its cover, the first thing you notice when you pick up this premium shirt is the quality of the fabric. 
//                         Nothing surprising, because advanced manufacturing allows for a comfortable fit suitable for any occasion.
//                     </p>
//                     <p>
//                         And how good that in such realities, everything is fine with the design. The navy blue color offers a classic look that never goes out of style.
//                         Perfect for office wear or casual outings.
//                     </p>
//                     <ul className="list-disc pl-5 space-y-1 mt-4">
//                         <li>Fabric: 100% Cotton</li>
//                         <li>Fit: Slim Fit</li>
//                         <li>Sleeve: Full Sleeve</li>
//                         <li>Wash Care: Machine Wash</li>
//                     </ul>
//                 </div>
//             </div>
//         </div>
//       </div>

//       {/* ================= RATINGS SECTION ================= */}
//       <div className="container mx-auto px-4 mb-8">
//          <div className="bg-white p-6 rounded-lg shadow-sm">
//              <h3 className="text-lg font-bold mb-6">Customer Reviews</h3>
//              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                  {/* Rating Summary */}
//                  <div>
//                      <div className="flex items-end gap-2 mb-2">
//                          <span className="text-4xl font-bold text-gray-800">4.5</span>
//                          <span className="text-gray-500 mb-1">/ 5</span>
//                      </div>
//                      <div className="flex text-yellow-400 text-sm mb-4">
//                         <Star fill="currentColor" />
//                         <Star fill="currentColor" />
//                         <Star fill="currentColor" />
//                         <Star fill="currentColor" />
//                         <Star className="text-gray-300" fill="currentColor" />
//                      </div>
//                      <p className="text-sm text-gray-500 mb-4">5,391 Ratings</p>
                     
//                      {/* Progress Bars */}
//                      <div className="space-y-2 text-sm text-gray-600">
//                          {[5, 4, 3, 2, 1].map((star) => (
//                              <div key={star} className="flex items-center gap-3">
//                                  <div className="flex items-center w-12">
//                                     {star} <Star size={12} className="ml-1 text-gray-400" />
//                                  </div>
//                                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
//                                      <div 
//                                         className="h-full bg-orange-400" 
//                                         style={{ width: star === 5 ? '70%' : star === 4 ? '20%' : '5%'}}
//                                      ></div>
//                                  </div>
//                                  <span className="w-10 text-right text-xs">{star === 5 ? '4.2K' : star === 4 ? '500' : '10'}</span>
//                              </div>
//                          ))}
//                      </div>
//                  </div>

//                  {/* Review List (Static) */}
//                  <div className="space-y-6">
//                      <div className="border-b pb-4">
//                          <div className="flex justify-between items-start mb-2">
//                              <div>
//                                  <div className="flex items-center gap-2">
//                                      <div className="flex text-yellow-400 text-xs">
//                                          <Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/>
//                                      </div>
//                                      <span className="text-xs font-bold text-gray-700">Verified Purchase</span>
//                                  </div>
//                                  <p className="text-gray-800 text-sm mt-2">
//                                     I was a bit nervous buying this online, but I couldn't be happier! The fabric is soft and the fit is perfect.
//                                  </p>
//                              </div>
//                              <span className="text-xs text-gray-400">2 weeks ago</span>
//                          </div>
//                          <div className="bg-gray-50 p-3 rounded text-xs text-gray-600 mt-2">
//                              <span className="font-bold block mb-1">Seller Response:</span>
//                              Thank you very much on behalf of RGHIEN HOUSE. Keep following us for better products!
//                          </div>
//                      </div>
//                  </div>
//              </div>
//          </div>
//       </div>

//       {/* ================= RELATED PRODUCTS ================= */}
//       <div className="container mx-auto px-4">
//         <h3 className="text-xl font-bold mb-6">You may also like</h3>
//         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
//             {/* Product Card 1 */}
//             <div className="bg-white p-3 rounded border hover:shadow-md transition cursor-pointer">
//                 <div className="h-32 bg-gray-100 mb-2 flex items-center justify-center">
//                     <img src="https://placehold.co/150x150?text=Epilator" alt="p" className="h-full object-contain"/>
//                 </div>
//                 <h4 className="text-sm font-medium text-gray-700 line-clamp-2 h-10">Philips Satinelle Essential Epilator</h4>
//                 <div className="text-orange-600 font-bold mt-2">৳ 4,500</div>
//             </div>
//              {/* Product Card 2 */}
//              <div className="bg-white p-3 rounded border hover:shadow-md transition cursor-pointer">
//                 <div className="h-32 bg-gray-100 mb-2 flex items-center justify-center">
//                     <img src="https://placehold.co/150x150?text=Hair+Dryer" alt="p" className="h-full object-contain"/>
//                 </div>
//                 <h4 className="text-sm font-medium text-gray-700 line-clamp-2 h-10">Panasonic Wet/Dry Epilator</h4>
//                 <div className="text-orange-600 font-bold mt-2">৳ 6,800</div>
//             </div>
//              {/* Product Card 3 */}
//              <div className="bg-white p-3 rounded border hover:shadow-md transition cursor-pointer">
//                 <div className="h-32 bg-gray-100 mb-2 flex items-center justify-center">
//                     <img src="https://placehold.co/150x150?text=Curler" alt="p" className="h-full object-contain"/>
//                 </div>
//                 <h4 className="text-sm font-medium text-gray-700 line-clamp-2 h-10">Double Ceramic Curler</h4>
//                 <div className="text-orange-600 font-bold mt-2">৳ 2,750</div>
//             </div>
//              {/* Product Card 4 */}
//              <div className="bg-white p-3 rounded border hover:shadow-md transition cursor-pointer">
//                 <div className="h-32 bg-gray-100 mb-2 flex items-center justify-center">
//                     <img src="https://placehold.co/150x150?text=Volumizer" alt="p" className="h-full object-contain"/>
//                 </div>
//                 <h4 className="text-sm font-medium text-gray-700 line-clamp-2 h-10">Revlon One-Step Volumizer</h4>
//                 <div className="text-orange-600 font-bold mt-2">৳ 4,800</div>
//             </div>
//         </div>
//       </div>

//     </div>
//   );
// }

import React from 'react'

export default function hometestpage() {
  return (
    <div>
      <h1>hello world</h1>
    </div>
  )
}
