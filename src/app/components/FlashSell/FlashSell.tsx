import PageHeader from '@/components/ReusableComponents/PageHeader';
import ProductGrid from '@/components/ReusableComponents/ProductGrid';
import Link from 'next/link';
import Image from 'next/image';
import { fetchFlashSaleData } from '@/lib/MainHomePage/fetchFlashSaleData';
import { fetchEcommerceBanners } from '@/lib/MainHomePage';


export default async function FlashSell() {
  const products = await fetchFlashSaleData();
  const ecommerceBanners = await fetchEcommerceBanners();
  const { middleHomepage } = ecommerceBanners;
  return (
    <section className="max-w-[95vw] xl:container mx-auto px-2 md:px-10 py-4">
      {/* bg-gradient-to-b from-red-50 to-white py-10 */}
      <PageHeader
        title="Flash Sale"
        buttonLabel="Shop All Products"
        buttonHref="/home/view/all/flash-sell/products"
      />
      <ProductGrid products={products} />

      {/* Middle Banner */}
      {middleHomepage?.[0] && (
        <div className="mt-12">
          <Link href={middleHomepage[0].bannerLink || '#'}>
            <div className="overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-500 ">
              <Image
                src={middleHomepage[0].bannerImage}
                alt={middleHomepage[0].bannerTitle || 'Flash Sale Banner'}
                width={1400}
                height={320}
                className="w-full md:h-[200px] lg:h-[300px] rounded-2xl object-cover"
              />
            </div>
          </Link>
        </div>
      )}
    </section>
  );
}