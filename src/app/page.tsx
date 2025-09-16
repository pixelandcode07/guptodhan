import Feature from './components/Feature/Feature';
import FlashSale from './components/FlashSale/FlashSale';
import Hero from './components/Hero/Hero';

import { products } from '@/data/products';
import ProductCard from './components/ProductDetailsPage/ProductCard';

export default function MainHomePage() {
  return (
    <div>
      <Hero />
      <Feature />
      {/* test for product card  */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <FlashSale />
    </div>
  );
}
