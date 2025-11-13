// src/components/ProductGrid.tsx
import ProductCard from './ProductCard';
import { Product } from '@/types/ProductType';
import { AnimatePresence } from 'framer-motion';

interface Props {
  products: Product[];
}

export default function ProductGrid({ products }: Props) {
  return (
    <div className="">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        <AnimatePresence mode="popLayout">
          {products.map((product, idx) => (
            <ProductCard key={product._id} product={product} index={idx} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}