import PageHeader from '@/components/ReusableComponents/PageHeader';
import ProductGrid from '@/components/ReusableComponents/ProductGrid';
import { fetchEcommerceBanners } from '@/lib/MainHomePage';
import { fetchBestSellingData } from '@/lib/MainHomePage/fetchBestSellingData';
import Image from 'next/image';
import Link from 'next/link';


export default async function BestSell() {
  const products = await fetchBestSellingData()
  const ecommerceBanners = await fetchEcommerceBanners()

  const { topShoppage } = ecommerceBanners;

  return (
    <section className="max-w-[95vw] xl:container mx-auto px-10 py-4">
      {/* bg-gradient-to-b from-amber-50 to-white py-10 */}
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
            <div className="overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-500">
              <Image
                src={topShoppage[0].bannerImage}
                alt={topShoppage[0].bannerTitle || 'Flash Sale Banner'}
                width={1400}
                height={320}
                className="w-full h-[300px] rounded-2xl object-cover"
              />
            </div>
          </Link>
        </div>
      )}
    </section>
  );
}
