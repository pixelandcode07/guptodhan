'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductQASection } from './ProductQASection';
import ProductReviewsTab from './ProductReviewsTab';
import { FileText, List, MessageCircleQuestion, Star } from 'lucide-react';

export default function ProductTabs({ product, reviews, onReviewsUpdate }: any) {
  const [activeTab, setActiveTab] = useState('specification');

  // ট্যাব লিস্ট
  const tabs = [
    { id: 'specification', label: 'Specification', icon: <List size={16} /> },
    { id: 'description', label: 'Description', icon: <FileText size={16} /> },
    { id: 'qna', label: `Questions (${product.qna?.length || 0})`, icon: <MessageCircleQuestion size={16} /> },
    { id: 'reviews', label: `Reviews (${reviews.length})`, icon: <Star size={16} /> },
  ];

  return (
    <div className="container mx-auto px-4 mt-8 mb-20" id="product-details-tabs">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Tabs defaultValue="specification" onValueChange={setActiveTab} className="w-full">
          
          {/* Star Tech Style Tab Header */}
          <div className="border-b border-gray-200 bg-[#F5F5F5]">
            <TabsList className="w-full h-auto bg-transparent p-0 justify-start flex-wrap gap-0">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="
                    px-6 py-3 rounded-none border-none text-sm font-semibold transition-colors
                    data-[state=active]:bg-[#00005E] data-[state=active]:text-white data-[state=active]:shadow-none 
                    text-gray-600 hover:text-[#00005E] hover:bg-gray-200
                  "
                >
                  {/* আইকন চাইলে রাখতে পারেন, না চাইলে মুছে দিতে পারেন */}
                  <span className="hidden sm:inline-block mr-2">{tab.icon}</span>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Tab Content Area */}
          <div className="p-6 sm:p-8 min-h-[300px] bg-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                
                {/* 1. Specification Tab */}
                <TabsContent value="specification" className="m-0 focus-visible:outline-none">
                  <div className="max-w-5xl">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Specification</h2>
                    
                    {product.specification ? (
                      <div className="overflow-x-auto border border-gray-200 rounded-md">
                        {/* Star Tech Exact Table Styling */}
                        <div 
                          className="
                            w-full text-sm text-left
                            
                            /* Table Structure */
                            [&_table]:w-full [&_table]:border-collapse
                            
                            /* Rows */
                            [&_tr]:border-b [&_tr]:border-gray-200 
                            [&_tr:last-child]:border-0
                            
                            /* Cells General */
                            [&_td]:px-4 [&_td]:py-3 [&_td]:align-top [&_td]:text-[14px] [&_td]:leading-relaxed
                            
                            /* Left Column (Key) - Star Tech Gray */
                            [&_td:first-child]:bg-[#EFF1F5] 
                            [&_td:first-child]:text-[#666666] 
                            [&_td:first-child]:font-semibold
                            [&_td:first-child]:w-[25%] 
                            [&_td:first-child]:min-w-[150px]
                            [&_td:first-child]:border-r [&_td:first-child]:border-gray-200

                            /* Right Column (Value) - White */
                            [&_td:last-child]:bg-white
                            [&_td:last-child]:text-[#111111]
                            
                            /* Hover Effect */
                            [&_tr:hover_td:last-child]:bg-[#f9fafb]

                            /* Handling Section Headers (Main Features, Warranty etc.) */
                            [&_td[colspan]]:bg-[#F4F6FC]
                            [&_td[colspan]]:text-[#00005E]
                            [&_td[colspan]]:font-bold
                            [&_td[colspan]]:text-[15px]
                            [&_td[colspan]]:py-2.5
                            [&_td[colspan]]:border-b
                          "
                          dangerouslySetInnerHTML={{ __html: product.specification }} 
                        />
                      </div>
                    ) : (
                      <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <List className="mx-auto mb-3 text-gray-300" size={40} />
                        <p className="text-gray-500">No specifications available for this product.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* 2. Description Tab */}
                <TabsContent value="description" className="m-0 focus-visible:outline-none">
                  <div className="max-w-5xl">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Description</h2>
                    
                    {product.fullDescription ? (
                      <article 
                        className="
                          prose prose-slate max-w-none text-gray-700 leading-7
                          [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mb-4
                          [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-800 [&_h2]:mt-6 [&_h2]:mb-3
                          [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-800 [&_h3]:mb-2
                          [&_p]:mb-4 [&_p]:text-[15px]
                          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4
                          [&_li]:mb-2
                          [&_img]:rounded-lg [&_img]:my-6 [&_img]:shadow-sm
                          [&_strong]:font-bold [&_strong]:text-[#00005E]
                        "
                        dangerouslySetInnerHTML={{ __html: product.fullDescription }} 
                      />
                    ) : (
                      <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <FileText className="mx-auto mb-3 text-gray-300" size={40} />
                        <p className="text-gray-500">No description available.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* 3. Questions Tab */}
                <TabsContent value="qna" className="m-0 focus-visible:outline-none">
                  <div className="max-w-5xl">
                    <div className="mb-6">
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900">Questions ({product.qna?.length || 0})</h2>
                      <p className="text-gray-600 text-sm mt-1">Have question about this product? Get specific details about this product from expert.</p>
                    </div>
                    <ProductQASection productId={product._id} initialQA={product.qna || []} />
                  </div>
                </TabsContent>

                {/* 4. Reviews Tab */}
                <TabsContent value="reviews" className="m-0 focus-visible:outline-none">
                  <div className="max-w-5xl">
                    <div className="mb-6">
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900">Reviews ({reviews.length})</h2>
                      <p className="text-gray-600 text-sm mt-1">Get specific details about this product from customers who own it.</p>
                    </div>
                    <ProductReviewsTab 
                      product={product} 
                      reviews={reviews} 
                      onReviewsUpdate={onReviewsUpdate} 
                    />
                  </div>
                </TabsContent>

              </motion.div>
            </AnimatePresence>
          </div>
        </Tabs>
      </div>
    </div>
  );
}