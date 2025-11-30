'use client';

import { FC } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Image from 'next/image';

type OrderStatus = 'Canceled' | 'Delivered' | 'Pending';

interface OrderItem {
  id: number;
  store: string;
  verified: boolean;
  productName: string;
  size: string;
  color: string;
  price: number;
  qty: number;
  image: string;
  status: OrderStatus;
}

const orders: OrderItem[] = [
  {
    id: 1,
    store: 'TechStore Pro',
    verified: true,
    productName: 'Braun Silk-épil 9 Cordless Epilator',
    size: 'XL',
    color: 'Green',
    price: 7200,
    qty: 1,
    image: '/img/product/p-2.png',
    status: 'Canceled',
  },
  {
    id: 2,
    store: 'TechStore Pro',
    verified: true,
    productName: 'Braun Silk-épil 9 Cordless Epilator',
    size: 'XL',
    color: 'Green',
    price: 7200,
    qty: 1,
    image: '/img/product/p-4.png',
    status: 'Delivered',
  },
  {
    id: 3,
    store: 'TechStore Pro',
    verified: true,
    productName: 'Braun Silk-épil 9 Cordless Epilator',
    size: 'XL',
    color: 'Green',
    price: 7200,
    qty: 1,
    image: '/img/product/p-3.png',
    status: 'Canceled',
  },
];

const statusStyles: Record<OrderStatus, string> = {
  Canceled: 'bg-red-100 text-red-600',
  Delivered: 'bg-green-100 text-green-600',
  Pending: 'bg-yellow-100 text-yellow-600',
};

const Reviewed: FC = () => {
  return (
    <div className="space-y-4">
      {orders.map(order => (
        <div
          key={order.id}
          className="flex items-start justify-between rounded-md border bg-gray-50 p-4">
          <div className="flex gap-4">
            <Image
              src={order.image}
              alt={order.productName}
              width={100}
              height={100}
              className="rounded-md object-cover"
            />
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                {order.store}
                {order.verified && (
                  <span className="text-blue-500 text-sm font-medium">
                    Verified Seller ✅
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-700">{order.productName}</p>
              <p className="text-sm text-gray-500">
                Size: {order.size}, Color: {order.color}
              </p>
              <p className="mt-1 font-semibold text-blue-600">
                ৳ {order.price.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Qty {order.qty}</p>
            </div>
          </div>

          <Badge
            className={cn(
              'rounded px-3 py-1 text-xs font-medium',
              statusStyles[order.status]
            )}>
            {order.status}
          </Badge>
        </div>
      ))}
    </div>
  );
};

export default Reviewed;


// import Image from 'next/image';
// import axios from 'axios';
// import { Badge } from '@/components/ui/badge';
// import { Star } from 'lucide-react';
// import { cn } from '@/lib/utils';

// interface ReviewType {
//   _id: string;
//   reviewId: string;
//   productId: string;
//   userId: string;
//   userName: string;
//   userEmail: string;
//   uploadedTime: string;
//   rating: number;
//   comment: string;
//   userImage: string;
//   reviewImages: string[];
// }

// // ---- SERVER-SIDE FETCH WITH AXIOS ----
// async function getReviews(): Promise<ReviewType[]> {
//   try {
//     const res = await axios.get(
//       '/api/v1/product-review',
//       {
//         // Disable caching in Next.js server
//         headers: { 'Cache-Control': 'no-store' }
//       }
//     );

//     return res.data.data; // your API response structure
//   } catch (error) {
//     console.error('Failed to fetch reviews', error);
//     return [];
//   }
// }

// export default async function ToBeReview() {
//   const reviews = await getReviews();

//   if (!reviews.length) return <p>No reviews found.</p>;

//   return (
//     <div className="space-y-4">
//       {reviews
//         .sort(
//           (a, b) =>
//             new Date(b.uploadedTime).getTime() -
//             new Date(a.uploadedTime).getTime()
//         )
//         .map((review) => (
//           <div
//             key={review._id}
//             className="rounded-md border bg-gray-50 p-4 flex gap-4 items-start"
//           >
//             {/* User Image */}
//             <Image
//               src={review.userImage}
//               alt={review.userName}
//               width={60}
//               height={60}
//               className="rounded-full object-cover"
//             />

//             <div className="flex-1">
//               {/* User Info */}
//               <div className="flex items-center justify-between">
//                 <p className="font-semibold text-gray-800">{review.userName}</p>
//                 <Badge className="bg-blue-100 text-blue-700">
//                   Rating: {review.rating}/5
//                 </Badge>
//               </div>

//               {/* Rating Stars */}
//               <div className="flex gap-1 my-1">
//                 {Array.from({ length: 5 }).map((_, i) => (
//                   <Star
//                     key={i}
//                     size={16}
//                     className={cn(
//                       i < review.rating ? 'text-yellow-500' : 'text-gray-300',
//                       'fill-current'
//                     )}
//                   />
//                 ))}
//               </div>

//               {/* Comment */}
//               <p className="mt-1 text-gray-700">{review.comment}</p>

//               {/* Review Images */}
//               {review.reviewImages?.length > 0 && (
//                 <div className="flex gap-2 mt-3 flex-wrap">
//                   {review.reviewImages.map((img, idx) => (
//                     <Image
//                       key={idx}
//                       src={img}
//                       alt="review-image"
//                       width={100}
//                       height={100}
//                       className="rounded-md object-cover border"
//                     />
//                   ))}
//                 </div>
//               )}

//               {/* Time */}
//               <p className="text-xs text-gray-500 mt-2">
//                 Uploaded: {new Date(review.uploadedTime).toLocaleString()}
//               </p>
//             </div>
//           </div>
//         ))}
//     </div>
//   );
// }
