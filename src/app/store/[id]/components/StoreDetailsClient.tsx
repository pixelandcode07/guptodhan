'use client';

import { motion } from 'framer-motion';
import { StoreDetailsClientProps } from './types';
import StoreHeader from './StoreHeader';
import StoreSocialLinks from './StoreSocialLinks';
import StoreDescription from './StoreDescription';
import StoreProducts from './StoreProducts';

export default function StoreDetailsClient({ storeData, products = [] }: StoreDetailsClientProps) {
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="space-y-4 sm:space-y-6 pb-8 sm:pb-12"
    >
      <StoreHeader storeData={storeData} />
      <StoreSocialLinks socialLinks={storeData.storeSocialLinks} />
      <StoreDescription fullDescription={storeData.fullDescription} />
      <StoreProducts storeName={storeData.storeName} products={products} />
    </motion.div>
  );
}

