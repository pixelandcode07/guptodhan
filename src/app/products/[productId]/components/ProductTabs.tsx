'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { fadeInUp } from './constants';
import { Product, Review } from './types';
import { ProductQASection } from './ProductQASection';
import ProductReviewsTab from './ProductReviewsTab';

interface ProductTabsProps {
  product: Product;
  reviews: Review[];
  onReviewsUpdate: (reviews: Review[]) => void;
}

export default function ProductTabs({ product, reviews, onReviewsUpdate }: ProductTabsProps) {
  return (
    <div className="container mx-auto px-4 mt-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <Tabs defaultValue="specification" className="w-full">
          <div className="bg-[#f9fafb] border-b border-gray-200 px-6">
            <TabsList className="flex h-auto bg-transparent p-0 gap-8">
              {['specification', 'description', 'reviews', 'qna'].map((tab) => (
                <TabsTrigger 
                  key={tab}
                  value={tab} 
                  className="px-0 py-4 rounded-none font-medium text-gray-500 border-b-2 border-transparent data-[state=active]:text-[#0099cc] data-[state=active]:border-[#0099cc] data-[state=active]:border-b-[3px] data-[state=active]:font-bold data-[state=active]:bg-blue-50/50 data-[state=active]:px-3 data-[state=active]:rounded-t-md transition-all capitalize text-base hover:text-[#0099cc] hover:border-b-2 hover:border-gray-300"
                >
                  {tab === 'reviews' ? `Reviews (${reviews.length})` : tab === 'qna' ? 'Questions' : tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="p-6 md:p-8 min-h-[300px]">
            {/* Specification */}
            <TabsContent value="specification">
              <motion.div variants={fadeInUp} initial="hidden" animate="visible">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Product Specification</h3>
                <div 
                  className="w-full [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_td]:p-3 [&_td]:border-b [&_td]:border-gray-100 [&_td:first-child]:text-gray-500 [&_td:first-child]:w-1/3 [&_td:last-child]:text-gray-800 [&_li]:mb-2"
                  dangerouslySetInnerHTML={{ __html: product.specification || '<p class="text-gray-400">No Data.</p>' }} 
                />
              </motion.div>
            </TabsContent>

            {/* Description */}
            <TabsContent value="description">
              <motion.div variants={fadeInUp} initial="hidden" animate="visible">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Product Description</h3>
                <div 
                  className="prose max-w-none text-gray-600 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.fullDescription }} 
                />
              </motion.div>
            </TabsContent>

            {/* Reviews */}
            <TabsContent value="reviews">
              <ProductReviewsTab 
                product={product} 
                reviews={reviews} 
                onReviewsUpdate={onReviewsUpdate}
              />
            </TabsContent>

            {/* QnA */}
            <TabsContent value="qna">
              <ProductQASection productId={product._id} initialQA={product.qna || []} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

