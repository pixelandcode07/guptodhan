import SectionTitle from '@/components/ui/SectionTitle';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import TestimonialsTable from './Components/TestimonialsTable';

async function getTestimonials() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/testimonial`,
    {
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch testimonials');
  }

  return res.json();
}

export default async function Page() {
  const testimonials = await getTestimonials();

  return (
    <div className="pb-6 pt-5 space-y-6 bg-white">
      <SectionTitle text="Testimonials" />
      <div className="flex justify-end">
        <Link href="/general/add/testimonial">
          <Button>Add new Testimonial</Button>
        </Link>
      </div>
      <div className="px-5">
        <TestimonialsTable testimonials={testimonials} />
      </div>
    </div>
  );
}
