import Link from 'next/link';
import { Product } from '@/data/products';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <img
          src={product.image}
          alt={product.name}
          className="rounded-lg mb-4"
        />
        <p className="text-gray-600 mb-2">${product.price}</p>
        <Link href={`/products/${product.id}`}>
          <Button className="w-full">View Details</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
