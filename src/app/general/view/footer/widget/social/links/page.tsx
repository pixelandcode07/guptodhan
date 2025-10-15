import { SocialLinksServices } from '@/lib/modules/social-links/social-links.service'; // ✅ Import the correct service
import dbConnect from '@/lib/db';
import SocialLinks from '../../Components/Social_links';
import SectionTitle from '@/components/ui/SectionTitle';

// This is now an async Server Component
export default async function SocialLinksPage() {
  // Directly connect to the DB and call the service function on the server
  await dbConnect();
  const socialLinksData = await SocialLinksServices.getPublicSocialLinksFromDB();

  return (
    <div className="bg-white p-4 sm:p-6 min-h-screen">
        <SectionTitle text="Manage Social Media Links" />
        <div className="mt-4">
            {/* Pass the fetched data as a prop to the client component.
              JSON.parse(JSON.stringify(...)) is used to convert the Mongoose document
              to a plain object, which is safe to pass from Server to Client Components.
            */}
            <SocialLinks initialData={JSON.parse(JSON.stringify(socialLinksData))} />
        </div>
    </div>
  );
}