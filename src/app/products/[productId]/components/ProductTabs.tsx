'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductQASection } from './ProductQASection';
import ProductReviewsTab from './ProductReviewsTab';
import { FileText, List, MessageCircleQuestion, Star } from 'lucide-react';

export default function ProductTabs({ product, reviews, onReviewsUpdate }: any) {
  const [activeTab, setActiveTab] = useState('specification');

  return (
    <div className="bg-white py-10 mt-4 border-t border-gray-100" id="product-details-tabs">
      <div className="container mx-auto px-0 sm:px-4 lg:max-w-7xl">
        
        <Tabs defaultValue="specification" onValueChange={setActiveTab} className="w-full">
          
          {/* Tabs Navigation */}
          <div className="flex flex-wrap justify-start gap-3 border-b border-gray-200 mb-6 px-4 sm:px-0">
            <TabButton 
              value="specification" 
              label="Specification" 
              activeTab={activeTab}
            />
            <TabButton 
              value="description" 
              label="Description" 
              activeTab={activeTab}
            />
            <TabButton 
              value="reviews" 
              label={`Reviews (${reviews.length})`} 
              activeTab={activeTab}
            />
            <TabButton 
              value="qna" 
              label="Q&A" 
              activeTab={activeTab}
            />
          </div>

          {/* Tab Content */}
          <div className="min-h-[300px] px-4 sm:px-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                
                {/* 1. Specification View (Star Tech Exact Design) */}
                <TabsContent value="specification" className="m-0 focus-visible:outline-none">
                  <div className="bg-white">
                    <h3 className="text-xl font-semibold text-slate-800 mb-5">Specification</h3>
                    
                    {product.specification ? (
                      <div className="overflow-x-auto">
                        {/* Star Tech Exact Table Styling:
                           - Key Column (Left): bg-[#EFF1F5], Text #666
                           - Value Column (Right): bg-white, Text #111
                           - Borders: #E5E7EB
                        */}
                        <div 
                          className="
                            w-full text-sm text-left
                            
                            /* Table Structure */
                            [&_table]:w-full [&_table]:border-collapse [&_table]:border [&_table]:border-gray-200
                            
                            /* Rows */
                            [&_tr]:border-b [&_tr]:border-gray-200 
                            [&_tr:last-child]:border-0
                            
                            /* Cells General */
                            [&_td]:px-4 [&_td]:py-3 [&_td]:align-top [&_td]:text-[14px] [&_td]:leading-relaxed
                            
                            /* Left Column (Key) */
                            [&_td:first-child]:bg-[#EFF1F5] 
                            [&_td:first-child]:text-[#666666] 
                            [&_td:first-child]:font-medium
                            [&_td:first-child]:w-[25%] 
                            [&_td:first-child]:min-w-[150px]
                            [&_td:first-child]:border-r [&_td:first-child]:border-gray-200

                            /* Right Column (Value) */
                            [&_td:last-child]:bg-white
                            [&_td:last-child]:text-[#111111]
                            
                            /* Hover Effect (Optional, subtle) */
                            [&_tr:hover_td]:bg-[#f9fafb]
                            [&_tr:hover_td:first-child]:bg-[#EFF1F5] /* Keep header bg same on hover */

                            /* Handling Section Headers inside table (if any td has colspan) */
                            [&_td[colspan]]:bg-[#F4F6FC]
                            [&_td[colspan]]:text-[#0099cc]
                            [&_td[colspan]]:font-bold
                            [&_td[colspan]]:text-[15px]
                            [&_td[colspan]]:py-2.5
                          "
                          dangerouslySetInnerHTML={{ __html: product.specification }} 
                        />
                      </div>
                    ) : (
                      <div className="text-center py-20 bg-gray-50 rounded border border-dashed">
                        <List className="mx-auto mb-3 text-gray-300" size={40} />
                        <p className="text-gray-500">No specifications available.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* 2. Description View */}
                <TabsContent value="description" className="m-0 focus-visible:outline-none">
                  <div className="bg-white">
                    <h3 className="text-xl font-semibold text-slate-800 mb-5">Description</h3>
                    
                    {product.fullDescription ? (
                      <article 
                        className="
                          prose prose-slate max-w-none text-gray-700
                          [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-slate-900 [&_h1]:mb-4
                          [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-slate-800 [&_h2]:mt-6 [&_h2]:mb-3
                          [&_p]:mb-4 [&_p]:leading-7 [&_p]:text-[15px]
                          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4
                          [&_li]:mb-2
                          [&_strong]:font-bold [&_strong]:text-slate-900
                        "
                        dangerouslySetInnerHTML={{ __html: product.fullDescription }} 
                      />
                    ) : (
                      <div className="text-center py-20 bg-gray-50 rounded border border-dashed">
                        <FileText className="mx-auto mb-3 text-gray-300" size={40} />
                        <p className="text-gray-500">No description available.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* 3. Reviews View */}
                <TabsContent value="reviews" className="m-0 focus-visible:outline-none">
                  <ProductReviewsTab 
                    product={product} 
                    reviews={reviews} 
                    onReviewsUpdate={onReviewsUpdate} 
                  />
                </TabsContent>

                {/* 4. Q&A View */}
                <TabsContent value="qna" className="m-0 focus-visible:outline-none">
                  <ProductQASection productId={product._id} initialQA={product.qna || []} />
                </TabsContent>

              </motion.div>
            </AnimatePresence>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

// Star Tech Style Tab Button
function TabButton({ value, label, activeTab }: { value: string, label: string, activeTab: string }) {
  const isActive = activeTab === value;
  
  return (
    <TabsTrigger
      value={value}
      className={`
        px-5 py-2 text-[13px] sm:text-sm font-bold uppercase rounded-[3px] transition-all duration-200
        ${isActive 
          ? 'bg-[#E2136E] text-white shadow-sm' // Active: Your Pink Theme Color or Star Tech Red/Orange
          : 'bg-white text-gray-600 hover:text-[#E2136E] hover:bg-gray-50' // Inactive
        }
      `}
    >
      {label}
    </TabsTrigger>
  );
}