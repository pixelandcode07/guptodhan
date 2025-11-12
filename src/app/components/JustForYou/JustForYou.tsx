import PageHeader from '@/components/ReusableComponents/PageHeader';
import ProductGrid from '@/components/ReusableComponents/ProductGrid';
import { Product } from '@/types/ProductType';
// import ProductCard from '../ProductCard';
// import { AnimatePresence } from 'framer-motion';

interface Props {
  products: Product[];
}

// JustForYou.tsx
export function JustForYou({ products }: Props) {
  return (
    <section className="max-w-[95vw] xl:max-w-[90vw] mx-auto px-4 bg-gradient-to-b from-purple-50 to-white py-10">
      <PageHeader
        title="Just For You"
        buttonLabel="Explore"
        buttonHref="/home/view/all/random/products"
      />
      <ProductGrid products={products} />
    </section>
  );
}