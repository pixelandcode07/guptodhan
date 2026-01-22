// src/app/products/[productId]/components/ProductTabs.tsx
// ✅ PROFESSIONAL: Fully responsive, modern design

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
    { id: 'specification', label: 'Specification', icon: <LayoutList size={18} /> },
    { id: 'description', label: 'Description', icon: <FileText size={18} /> },
    { id: 'reviews', label: `Reviews (${reviews?.length || 0})`, icon: <Star size={18} /> },
    { id: 'qna', label: 'Q&A', icon: <MessageCircleQuestion size={18} /> },
  ];

  return (
    <div className="w-full bg-gradient-to-b from-slate-50/50 to-white py-8 md:py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        
        {/* Professional Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-1.5 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Product Information</h2>
          </div>
          <p className="text-slate-500 ml-5 text-sm md:text-base">Detailed specifications and customer reviews</p>
        </div>

        {/* Main Tabs Container */}
        <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <Tabs defaultValue="specification" onValueChange={setActiveTab} className="w-full">
            
            {/* ===== PROFESSIONAL TAB HEADER ===== */}
            <div className="border-b border-slate-100 bg-white px-4 md:px-8 pt-6 md:pt-8">
              <TabsList className="inline-flex w-full md:w-auto h-auto bg-transparent p-0 gap-2 md:gap-4 overflow-x-auto pb-4 md:pb-0">
                {tabs.map((tab, index) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="relative px-3 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl flex items-center gap-2 text-xs md:text-sm font-medium md:font-semibold transition-all duration-300 border-none shadow-none whitespace-nowrap flex-shrink-0 md:flex-shrink
                    text-slate-500 hover:text-slate-700 hover:bg-slate-50 
                    data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500"
                  >
                    {/* Subtle Glow Effect */}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="tabGlow"
                        className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 -z-10 blur"
                        initial={false}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
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

            {/* ===== TAB CONTENT SECTION ===== */}
            <div className="p-6 md:p-10 lg:p-16 min-h-[500px] md:min-h-[600px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  
                  {/* ===== 1. SPECIFICATION TAB ===== */}
                  <TabsContent value="specification" className="m-0 focus-visible:outline-none">
                    <div className="max-w-5xl mx-auto">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-8">
                        <div className="h-7 w-1 bg-blue-600 rounded-full"></div>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900">Technical Specifications</h3>
                      </div>

                      {product?.specification ? (
                        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
                          <div 
                            className="w-full
                              [&_table]:w-full
                              [&_table]:border-collapse
                              [&_tbody_tr]:border-b [&_tbody_tr]:border-slate-100
                              [&_tbody_tr:last-child]:border-0
                              [&_tbody_tr:hover]:bg-slate-50
                              [&_td]:p-4 md:p-6
                              [&_td:first-child]:bg-gradient-to-r [&_td:first-child]:from-slate-50 [&_td:first-child]:to-slate-25
                              [&_td:first-child]:font-semibold [&_td:first-child]:text-slate-900
                              [&_td:first-child]:w-[25%] md:w-[30%]
                              [&_td:last-child]:text-slate-600
                              [&_th]:p-4 md:p-6
                              [&_th]:bg-gradient-to-r [&_th]:from-blue-50 [&_th]:to-slate-50
                              [&_th]:text-left [&_th]:font-semibold [&_th]:text-slate-900
                              text-sm md:text-base"
                            dangerouslySetInnerHTML={{ __html: product.specification }} 
                          />
                        </div>
                      ) : (
                        <EmptyState 
                          icon={<LayoutList size={56} />}
                          title="No Specifications"
                          description="Specifications for this product are not available yet"
                        />
                      )}
                    </div>
                  </TabsContent>

                  {/* ===== 2. DESCRIPTION TAB ===== */}
                  <TabsContent value="description" className="m-0 focus-visible:outline-none">
                    <div className="max-w-5xl mx-auto">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-8">
                        <div className="h-7 w-1 bg-blue-600 rounded-full"></div>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900">Product Description</h3>
                      </div>

                      {product?.fullDescription ? (
                        <article 
                          className="prose prose-slate prose-sm md:prose-base max-w-none
                            text-slate-600 leading-relaxed
                            [&_p]:mb-4 md:[&_p]:mb-6
                            [&_h1]:text-2xl md:[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-6 [&_h1]:text-slate-900
                            [&_h2]:text-xl md:[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-4 [&_h2]:text-slate-900 [&_h2]:mt-8
                            [&_h3]:text-lg md:[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-3 [&_h3]:text-slate-800 [&_h3]:mt-6
                            [&_ul]:ml-4 md:[&_ul]:ml-6 [&_ul]:list-disc [&_ul]:space-y-2
                            [&_ol]:ml-4 md:[&_ol]:ml-6 [&_ol]:list-decimal [&_ol]:space-y-2
                            [&_li]:text-slate-600
                            [&_strong]:font-semibold [&_strong]:text-slate-900
                            [&_em]:italic [&_em]:text-slate-700
                            [&_img]:rounded-2xl [&_img]:my-6 md:[&_img]:my-8 [&_img]:border [&_img]:border-slate-100
                            [&_blockquote]:border-l-4 [&_blockquote]:border-blue-600 [&_blockquote]:pl-4 md:[&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:text-slate-700 [&_blockquote]:my-4 md:[&_blockquote]:my-6
                            [&_code]:bg-slate-100 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_code]:text-red-600
                            [&_pre]:bg-slate-900 [&_pre]:text-white [&_pre]:p-4 md:[&_pre]:p-6 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:my-4 md:[&_pre]:my-6"
                          dangerouslySetInnerHTML={{ __html: product.fullDescription }} 
                        />
                      ) : (
                        <EmptyState 
                          icon={<FileText size={56} />}
                          title="No Description"
                          description="Description for this product is not available yet"
                        />
                      )}
                    </div>
                  </TabsContent>

                  {/* ===== 3. REVIEWS TAB ===== */}
                  <TabsContent value="reviews" className="m-0 focus-visible:outline-none">
                    <div className="max-w-5xl mx-auto">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="h-7 w-1 bg-blue-600 rounded-full"></div>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900">Customer Reviews</h3>
                      </div>
                      
                      {reviews && reviews.length > 0 ? (
                        <ProductReviewsTab 
                          product={product} 
                          reviews={reviews} 
                          onReviewsUpdate={onReviewsUpdate} 
                        />
                      ) : (
                        <EmptyState 
                          icon={<Star size={56} />}
                          title="No Reviews Yet"
                          description="Be the first to review this product"
                        />
                      )}
                    </div>
                  </TabsContent>

                  {/* ===== 4. Q&A TAB ===== */}
                  <TabsContent value="qna" className="m-0 focus-visible:outline-none">
                    <div className="max-w-5xl mx-auto">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="h-7 w-1 bg-blue-600 rounded-full"></div>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900">Questions & Answers</h3>
                      </div>
                      
                      {product?.qna && product.qna.length > 0 ? (
                        <ProductQASection 
                          productId={product._id} 
                          initialQA={product.qna} 
                        />
                      ) : (
                        <EmptyState 
                          icon={<MessageCircleQuestion size={56} />}
                          title="No Questions Yet"
                          description="Ask a question about this product to get answers from the community"
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
    </div>
  );
}

// ===== EMPTY STATE COMPONENT =====
function EmptyState({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 md:py-24">
      <div className="text-slate-300 mb-6">
        {icon}
      </div>
      <h4 className="text-lg md:text-xl font-semibold text-slate-900 mb-2">
        {title}
      </h4>
      <p className="text-slate-500 text-center max-w-sm text-sm md:text-base">
        {description}
      </p>
    </div>
  );
}