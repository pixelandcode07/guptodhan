import { AverageRatingCard } from '@/app/components/ProductDetailsPage/AverageRatingCard';
import DeliveryOption from '@/app/components/ProductDetailsPage/DeliveryOption';
import { DescriptionBox } from '@/app/components/ProductDetailsPage/DescriptionBox';
import ProductDetails from '@/app/components/ProductDetailsPage/ProductDetails';
import { QASection } from '@/app/components/ProductDetailsPage/QASection';
import ReviewList from '@/app/components/ProductDetailsPage/ReviewLIst';
import ProductCarousel from '@/components/ReusableComponents/ProductCarousel';
import { carousel_data } from '@/data/carousel_data';
// import ProductCarousel from './../../components/ProductDetailsPage/ProductCarousel';

type ProductDetailsProps = {
  params: { id: string };
};

const qaData = [
  {
    id: 1,
    question: 'There appears to be a discrepancy in the serving information?',
    answer: 'There appears to be a discrepancy in the serving information',
    user: 'Riya Sharma',
    timeAgo: '6 months ago',
  },
  {
    id: 2,
    question: 'There appears to be a discrepancy in the serving information the serving information?',
    answer: 'There appears to be a discrepancy in the serving information',
    user: 'Riya Sharma',
    timeAgo: '6 months ago',
  },
];
export default function ProductDetailsPage({ params }: ProductDetailsProps) {
  // const product = products.find(p => p.id === Number(params.id));

  // if (!product) return notFound();

  return (
    <div className="max-w-7xl mx-auto py-7 ">
      <div className="grid grid-cols-1  xl:grid-cols-8 gap-3 ">
        <div className=" xl:col-span-6">
          <ProductDetails productId={params.id} />
        </div>
        <div className="xl:col-span-2">
          <DeliveryOption />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-10 gap-3">
        <div className="xl:col-span-8  px-4">
          <DescriptionBox />
          <div className="space-y-6  py-10">
            <div className="max-w-xl">
              <AverageRatingCard />
            </div>

            <ReviewList />
          </div>

          <QASection data={qaData} total={1234} />
        </div>
      </div>

      <div className="mt-4 mx-4">
        <ProductCarousel title="You may also like" products={carousel_data} />
      </div>

      <div className="bg-white mt-7"></div>
    </div>
  );
}
