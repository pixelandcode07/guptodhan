import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, ChevronRight } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

type Store = {
  storeLogo: string;
  storeBanner: string;
  storeName: string;
  followers: number;
  positiveRating: number;
};

export default function StoreHeader({ store }: { store: Store }) {
  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-4">
        <Breadcrumb>
          <BreadcrumbList className="text-sm">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator>
              <ChevronRight className="w-4 h-4" />
            </BreadcrumbSeparator>

            <BreadcrumbItem>
              <BreadcrumbPage>Shop</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Banner */}
      <div className="relative w-full h-[220px] overflow-hidden rounded-md bg-gray-200">
        <Image
          src={store.storeBanner}
          alt={store.storeName}
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Store Info (BELOW banner) */}
      <div className="relative flex items-center gap-4 px-4 -mt-10">
        {/* Store Logo */}
        <div className="relative w-24 h-24 rounded-full bg-gray-300 overflow-hidden border-4 border-white">
          <Image
            src={store.storeLogo}
            alt={store.storeName}
            fill
            className="object-cover"
          />
        </div>

        {/* Store Name & Meta */}
        <div>
          <div className="flex items-center gap-2 mt-8">
            <h1 className="text-lg font-semibold">{store.storeName}</h1>
            <CheckCircle className="w-4 h-4 text-blue-500" />
          </div>

          <p className="text-sm text-muted-foreground">
            {store.positiveRating} % Positive seller ratings
          </p>
        </div>
      </div>
    </>
  );
}

