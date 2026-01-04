import { fetchFeaturedCategories } from '@/lib/MainHomePage/fetchFeaturedCategoryData';
import PageHeader from '../../../components/ReusableComponents/PageHeader';
import { ShopByCategory } from './ShopByCategory';
export default async function Feature() {
  const featuredData = await fetchFeaturedCategories();
  return (
    <div className="mb-0 my-3 md:max-w-[95vw] xl:container mx-auto px-8">
      <div className="flex justify-center mt-8">
        <PageHeader
          title="Featured Category"
        />
      </div>
      <section className="container mx-auto">
        <main className=" flex flex-col items-center justify-around">
          <ShopByCategory featuredData={featuredData} />
        </main>
      </section>
    </div>
  );
}