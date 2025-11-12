import PageHeader from '@/components/ReusableComponents/PageHeader';
import ProductGrid from '@/components/ReusableComponents/ProductGrid';
import { EcommerceBannerType } from '@/types/ecommerce-banner-type';
import { Product } from '@/types/ProductType';
import Image from 'next/image';
import Link from 'next/link';
// import ProductCard from '../ProductCard';
// import { AnimatePresence } from 'framer-motion';

interface Props {
  products: Product[];
  topShoppage?: EcommerceBannerType[];
}

// BestSell.tsx
export function BestSell({ products, topShoppage }: Props) {
  return (
    <section className="max-w-[95vw] xl:max-w-[90vw] mx-auto px-4 bg-gradient-to-b from-amber-50 to-white py-10">
      <PageHeader
        title="Best Selling"
        buttonLabel="View More"
        buttonHref="/home/view/all/best-sell/products"
      />
      <ProductGrid products={products} />
      {/* Middle Banner */}
      {topShoppage?.[0] && (
        <div className="mt-12">
          <Link href={topShoppage[0].bannerLink || '#'}>
            <div className="overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow">
              <Image
                src={topShoppage[0].bannerImage}
                alt={topShoppage[0].bannerTitle || 'Flash Sale Banner'}
                width={1400}
                height={320}
                className="w-full h-auto rounded-2xl"
              />
            </div>
          </Link>
        </div>
      )}
    </section>
  );
}
