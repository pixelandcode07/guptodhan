'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, Review } from './types';
import { ProductQASection } from './ProductQASection';
import ProductReviewsTab from './ProductReviewsTab';
import { LayoutList, FileText, Star, MessageCircleQuestion, MessageSquare, PenTool } from 'lucide-react';

export default function ProductTabs({ product, reviews, onReviewsUpdate }: any) {
  const [activeTab, setActiveTab] = useState('specification');

  const tabs = [
    { id: 'specification', label: 'Specification', icon: <LayoutList size={16} /> },
    { id: 'description', label: 'Description', icon: <FileText size={16} /> },
    { id: 'questions', label: `Questions (${product.qna?.length || 0})`, icon: <MessageCircleQuestion size={16} /> },
    { id: 'reviews', label: `Reviews (${reviews.length})`, icon: <Star size={16} /> },
  ];

  return (
    <div className="container mx-auto px-4 mt-12 mb-20">
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <Tabs defaultValue="specification" onValueChange={setActiveTab} className="w-full">
          
          {/* Tab Header - Simple & Clean */}
          <div className="border-b border-slate-200 bg-white px-6">
            <TabsList className="flex h-auto bg-transparent p-0 gap-0 rounded-none">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="relative px-6 py-4 rounded-none flex items-center gap-2 text-sm font-medium transition-colors border-none shadow-none text-slate-600 hover:text-slate-900 data-[state=active]:text-white data-[state=active]:bg-red-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-red-600 after:transition-all after:duration-300 data-[state=active]:after:h-0"
                >
                  <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
                    {tab.icon}
                    {tab.label}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Tab Content Section */}
          <div className="p-6 sm:p-8 min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* 1. Specification View */}
                <TabsContent value="specification" className="m-0 focus-visible:outline-none">
                  <div className="max-w-4xl">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-1 h-6 bg-slate-900 rounded-full"></div>
                      <h3 className="text-xl font-bold text-slate-900">Specification</h3>
                    </div>
                    
                    {product.specification ? (
                      <div className="overflow-x-auto">
                        <div 
                          className="text-slate-700 [&_table]:w-full [&_table]:border-collapse [&_th]:bg-slate-50 [&_th]:text-left [&_th]:px-4 [&_th]:py-3 [&_th]:font-semibold [&_th]:text-slate-900 [&_td]:px-4 [&_td]:py-3 [&_td]:border-b [&_td]:border-slate-200 [&_tr:hover]:bg-slate-50"
                          dangerouslySetInnerHTML={{ __html: product.specification }} 
                        />
                      </div>
                    ) : (
                      <div className="text-center py-20 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                        <LayoutList className="mx-auto mb-3 text-slate-300" size={48} />
                        <p className="text-slate-400 font-medium">No specifications available</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* 2. Description View */}
                <TabsContent value="description" className="m-0 focus-visible:outline-none">
                  <div className="max-w-4xl">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-1 h-6 bg-slate-900 rounded-full"></div>
                      <h3 className="text-xl font-bold text-slate-900">Description</h3>
                    </div>
                    
                    {product.fullDescription ? (
                      <article 
                        className="prose prose-slate prose-sm sm:prose-base max-w-none text-slate-600 leading-relaxed [&_p]:mb-4 [&_ul]:ml-6 [&_ul]:list-disc [&_ol]:ml-6 [&_ol]:list-decimal [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2 [&_img]:rounded-lg [&_img]:my-4"
                        dangerouslySetInnerHTML={{ __html: product.fullDescription }} 
                      />
                    ) : (
                      <div className="text-center py-20 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                        <FileText className="mx-auto mb-3 text-slate-300" size={48} />
                        <p className="text-slate-400 font-medium">No description available</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* 3. Questions View */}
                <TabsContent value="questions" className="m-0 focus-visible:outline-none">
                  <div className="max-w-4xl">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-6 bg-slate-900 rounded-full"></div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">Questions (0)</h3>
                          <p className="text-sm text-slate-500 mt-1">Have question about this product? Get specific details about the product from expert.</p>
                        </div>
                      </div>
                      <button className="px-5 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">
                        Ask Question
                      </button>
                    </div>

                    <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                      <MessageSquare className="mb-4 text-slate-300" size={48} />
                      <p className="text-slate-500 font-medium mb-2">There are no questions asked yet.</p>
                      <p className="text-slate-400 text-sm">Be the first one to ask a question.</p>
                    </div>
                  </div>
                </TabsContent>

                {/* 4. Reviews View */}
                <TabsContent value="reviews" className="m-0 focus-visible:outline-none">
                  <div className="max-w-4xl">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-6 bg-slate-900 rounded-full"></div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">Reviews (0)</h3>
                          <p className="text-sm text-slate-500 mt-1">Get specific details about the product from customers who own it.</p>
                        </div>
                      </div>
                      <button className="px-5 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
                        <PenTool size={16} />
                        Write a Review
                      </button>
                    </div>

                    {reviews.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                        <Star className="mb-4 text-slate-300" size={48} />
                        <p className="text-slate-500 font-medium mb-2">This product has no reviews yet.</p>
                        <p className="text-slate-400 text-sm">Be the first one to write a review.</p>
                      </div>
                    ) : (
                      <ProductReviewsTab 
                        product={product} 
                        reviews={reviews} 
                        onReviewsUpdate={onReviewsUpdate} 
                      />
                    )}
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