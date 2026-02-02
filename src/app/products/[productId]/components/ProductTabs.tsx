'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp } from './constants';
import { Product, Review } from './types';
import { ProductQASection } from './ProductQASection';
import ProductReviewsTab from './ProductReviewsTab';

export default function ProductTabs({ product, reviews, onReviewsUpdate }: any) {
  const [activeTab, setActiveTab] = useState('specification');

  const tabs = [
    { id: 'specification', label: 'Specification' },
    { id: 'description', label: 'Description' },
    { id: 'questions', label: `Questions (${product.qna?.length || 0})` },
    { id: 'reviews', label: `Reviews (${reviews.length})` },
  ];

  return (
    <div className="container mx-auto px-4 mt-8 mb-20">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Tabs defaultValue="specification" onValueChange={setActiveTab} className="w-full">
          
          {/* Star Tech Style Tab Header */}
          <TabsList className="w-full h-auto bg-[#F5F5F5] border-b border-gray-200 rounded-none p-0 justify-start flex-wrap">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="px-6 py-3 rounded-none border-none data-[state=active]:bg-[#EF4A23] data-[state=active]:text-white data-[state=active]:shadow-none bg-transparent text-gray-700 hover:bg-gray-100 transition-colors font-medium text-sm"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Specification Tab */}
                <TabsContent value="specification" className="m-0 focus-visible:outline-none">
                  <div className="max-w-5xl">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Specification</h2>
                    
                    {product.specification ? (
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div 
                          className="specification-table [&_table]:w-full [&_table]:border-collapse [&_tr]:border-b [&_tr]:border-gray-200 [&_tr:last-child]:border-0 [&_td]:p-4 [&_td:first-child]:bg-gray-50 [&_td:first-child]:font-semibold [&_td:first-child]:text-gray-700 [&_td:first-child]:w-[35%] [&_td:last-child]:text-gray-600 [&_th]:hidden"
                          dangerouslySetInnerHTML={{ __html: product.specification }} 
                        />
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <p className="text-gray-500">No specifications available</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Description Tab */}
                <TabsContent value="description" className="m-0 focus-visible:outline-none">
                  <div className="max-w-5xl">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Description</h2>
                    
                    {product.fullDescription ? (
                      <div 
                        className="prose prose-gray max-w-none text-gray-700 leading-relaxed [&_p]:mb-4 [&_ul]:ml-6 [&_ul]:list-disc [&_ol]:ml-6 [&_ol]:list-decimal [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2 [&_img]:rounded-lg [&_img]:my-4 [&_strong]:text-gray-900 [&_strong]:font-bold"
                        dangerouslySetInnerHTML={{ __html: product.fullDescription }} 
                      />
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <p className="text-gray-500">No description available</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Questions Tab */}
                <TabsContent value="questions" className="m-0 focus-visible:outline-none">
                  <div className="max-w-5xl">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Questions ({product.qna?.length || 0})</h2>
                    <p className="text-gray-600 mb-6">Have question about this product? Get specific details about this product from expert.</p>
                    
                    <ProductQASection productId={product._id} initialQA={product.qna || []} />
                  </div>
                </TabsContent>

                {/* Reviews Tab */}
                <TabsContent value="reviews" className="m-0 focus-visible:outline-none">
                  <div className="max-w-5xl">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Reviews ({reviews.length})</h2>
                    <p className="text-gray-600 mb-6">Get specific details about this product from customers who own it.</p>
                    
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