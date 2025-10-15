import CTAForm from './Components/CTAForm';
import { AboutCtaServices } from '@/lib/modules/about-cta/cta.service'; // Import your service
import dbConnect from '@/lib/db'; // Import your database connection
import SectionTitle from '@/components/ui/SectionTitle';

// This is now an async Server Component
export default async function CTAPage() {
  // Directly connect to the DB and call the service function on the server
  await dbConnect();
  const ctaData = await AboutCtaServices.getPublicCtaFromDB();

  return (
    <div className="bg-white pt-5 p-4 sm:p-6">
        <SectionTitle text="Call to Action (CTA) Setup" />
        <div className="mt-4">
            {/* Pass the fetched data as a prop to the client component.
              JSON.parse(JSON.stringify(...)) is used to convert the Mongoose document
              to a plain object, which is safe to pass from Server to Client Components.
            */}
            <CTAForm initialData={JSON.parse(JSON.stringify(ctaData))} />
        </div>
    </div>
  );
}