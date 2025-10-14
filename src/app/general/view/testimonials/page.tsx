import SectionTitle from '@/components/ui/SectionTitle';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import TestimonialsTable from './Components/TestimonialsTable';
import axios from 'axios';

const getTestimonials = async () => {
  try {
    const baseUrl = process.env.NEXTAUTH_URL;
    const { data } = await axios.get(`${baseUrl}/api/v1/testimonial`);
    return data;
  } catch (error) {
    console.log('fetch facts Error:', error);
    return { data: [] };
  }
};

export default async function Page() {
  const testimonials = await getTestimonials();
  console.log(testimonials);

  return (
    <div className="pb-6 pt-5 space-y-6 bg-white">
      <SectionTitle text="Testimonials" />
      <div className="flex justify-end">
        <Link href="/general/add/testimonial">
          <Button>Add new Testimonial</Button>
        </Link>
      </div>
      <div className="px-5">
        <TestimonialsTable testimonials={testimonials.data} />
      </div>
    </div>
  );
}
