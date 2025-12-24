import { fetchFeaturedCategories } from '@/lib/MainHomePage/fetchFeaturedCategoryData';
import PageHeader from '../../../components/ReusableComponents/PageHeader';
import { ShopByCategory } from './ShopByCategory';
export default async function Feature() {
  const featuredData = await fetchFeaturedCategories();
  return (
    <div className="bg-gray-100 mb-0 my-3 md:max-w-[95vw] xl:max-w-[90vw] mx-auto px-4">
      <div className="flex justify-center mt-8">
        <PageHeader
          title="Featured Category"
        />
      </div>
      <main className=" flex flex-col items-center justify-around">
        <ShopByCategory featuredData={featuredData} />
      </main>
    </div>
  );
}