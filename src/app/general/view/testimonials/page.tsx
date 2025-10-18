import SectionTitle from '@/components/ui/SectionTitle';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import TestimonialsTable from './Components/TestimonialsTable';
import { TestimonialServices } from '@/lib/modules/testimonial/testimonial.service'; // ✅ Import your service
import dbConnect from '@/lib/db'; // ✅ Import your database connection

// This is now an async Server Component
export default async function ViewTestimonialsPage() {
  // Directly connect to the DB and call the service function on the server
  await dbConnect();
  // Assuming you have a service function to get all testimonials for admin
  const testimonialsData = await TestimonialServices.getAllTestimonialsFromDB();

  return (
    <div className="pb-6 pt-5 space-y-6 bg-white">
      <SectionTitle text="Testimonials" />
      <div className="flex justify-end px-5">
        <Button asChild>
            <Link href="/general/add/testimonial">Add new Testimonial</Link>
        </Button>
      </div>
      <div className="px-5">
        {/* Pass the fetched data as a prop to the client component.
          JSON.parse(JSON.stringify(...)) converts the Mongoose document
          to a plain object, which is safe to pass from Server to Client Components.
        */}
        <TestimonialsTable initialTestimonials={JSON.parse(JSON.stringify(testimonialsData))} />
      </div>
    </div>
  );
}