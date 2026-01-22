'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp } from './constants';
import { Product, Review } from './types';
import { ProductQASection } from './ProductQASection';
import ProductReviewsTab from './ProductReviewsTab';
import { LayoutList, FileText, Star, MessageCircleQuestion } from 'lucide-react';

export default function ProductTabs({ product, reviews, onReviewsUpdate }: any) {
  const [activeTab, setActiveTab] = useState('specification');

  const tabs = [
    { id: 'specification', label: 'Specification', icon: <LayoutList size={16} /> },
    { id: 'description', label: 'Description', icon: <FileText size={16} /> },
    { id: 'reviews', label: `Reviews (${reviews.length})`, icon: <Star size={16} /> },
    { id: 'qna', label: 'Q&A', icon: <MessageCircleQuestion size={16} /> },
  ];

  return (
    <div className="container mx-auto px-4 mt-12 mb-20">
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
        <Tabs defaultValue="specification" onValueChange={setActiveTab} className="w-full">
          
          {/* Professional Tab Header */}
          <div className="flex justify-center border-b border-slate-50 bg-white pt-4">
            <TabsList className="flex h-auto bg-slate-100/50 p-1.5 rounded-full mb-4 gap-1">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="relative px-6 py-2.5 rounded-full flex items-center gap-2 text-sm font-semibold transition-all duration-300 border-none shadow-none data-[state=active]:text-white data-[state=active]:bg-transparent text-slate-500 hover:text-slate-800"
                >
                  {/* Sliding Background Indicator */}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activePill"
                      className="absolute inset-0 bg-slate-900 rounded-full z-0"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Tab Content Section */}
          <div className="p-6 sm:p-12 min-h-[450px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {/* 1. Specification View - ✅ FIXED HTML STRUCTURE */}
                <TabsContent value="specification" className="m-0 focus-visible:outline-none">
                  <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-10">
                      <div className="w-1 h-6 bg-slate-900 rounded-full"></div>
                      <h3 className="text-xl font-bold text-slate-900">Technical Details</h3>
                    </div>
                    
                    {product.specification ? (
                      <div className="overflow-hidden rounded-2xl border border-slate-100">
                        {/* ✅ FIX: Wrap dangerouslySetInnerHTML in proper table structure */}
                        <div 
                          className="w-full [&_table]:w-full [&_tr]:border-b [&_tr]:border-slate-50 [&_tr:last-child]:border-0 [&_td]:p-5 [&_td:first-child]:bg-slate-50/80 [&_td:first-child]:font-bold [&_td:first-child]:text-slate-500 [&_td:first-child]:w-[30%] [&_td:last-child]:text-slate-700"
                          dangerouslySetInnerHTML={{ __html: product.specification }} 
                        />
                      </div>
                    ) : (
                      <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <LayoutList className="mx-auto mb-3 text-slate-300" size={48} />
                        <p className="text-slate-400 font-medium">No specifications available</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* 2. Description View */}
                <TabsContent value="description" className="m-0 focus-visible:outline-none">
                  <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-1 h-6 bg-slate-900 rounded-full"></div>
                      <h3 className="text-xl font-bold text-slate-900">About this product</h3>
                    </div>
                    
                    {product.fullDescription ? (
                      <article 
                        className="prose prose-slate prose-sm sm:prose-base max-w-none text-slate-600 leading-relaxed [&_p]:mb-4 [&_ul]:ml-6 [&_ul]:list-disc [&_ol]:ml-6 [&_ol]:list-decimal [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2 [&_img]:rounded-lg [&_img]:my-4"
                        dangerouslySetInnerHTML={{ __html: product.fullDescription }} 
                      />
                    ) : (
                      <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <FileText className="mx-auto mb-3 text-slate-300" size={48} />
                        <p className="text-slate-400 font-medium">No description available</p>
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