import { AverageRatingCard } from '@/app/components/ProductDetailsPage/AverageRatingCard';
import DeliveryOption from '@/app/components/ProductDetailsPage/DeliveryOption';
import ProductDetails from '@/app/components/ProductDetailsPage/ProductDetails';
import { QASection } from '@/app/components/ProductDetailsPage/QASection';
import { ReviewCard } from '@/app/components/ProductDetailsPage/ReviewCard';
import { products } from '@/data/products';
import { notFound } from 'next/navigation';

type ProductDetailsProps = {
  params: { id: string };
};

const reviews = [
  {
    id: 1,
    user: 'Vertric honer',
    verified: true,
    rating: 5,
    review:
      'I was a bit nervous to be buying a secondhand phone from Amazon, but I couldn’t be happier...',
    images: ['/img1.png', '/img2.png', '/img3.png'],
    sellerResponse: {
      message:
        'Thank you very much on behalf of Larkspur Shop. Keep following Larkspur Shop to get better products.',
      date: '1 year ago',
    },
  },
];

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
    question:
      'There appears to be a discrepancy in the serving information the serving information?',
    answer: 'There appears to be a discrepancy in the serving information',
    user: 'Riya Sharma',
    timeAgo: '6 months ago',
  },
];
export default function ProductDetailsPage({ params }: ProductDetailsProps) {
  const product = products.find(p => p.id === Number(params.id));

  if (!product) return notFound();

  return (
    <div className="container p-6">
      <div className="grid grid-cols-1  xl:grid-cols-8 gap-3 ">
        <div className=" xl:col-span-6">
          <ProductDetails />
        </div>
        <div className="xl:col-span-2">
          <DeliveryOption />
        </div>
      </div>

      <div className="space-y-6  py-10">
        <div className="max-w-xl">
          <AverageRatingCard />
        </div>

        <h2 className="text-lg font-semibold">
          All Reviews ({reviews.length})
        </h2>
        {reviews.map(r => (
          <ReviewCard key={r.id} review={r} />
        ))}
      </div>

      <div className="max-w-2xl mx-auto py-10">
        <QASection data={qaData} total={1234} />
      </div>
    </div>
  );
}
