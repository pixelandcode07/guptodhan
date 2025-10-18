import FaqCategoriesTable from './Components/FaqCategoriesTable';
import dbConnect from '@/lib/db';
import SectionTitle from '@/components/ui/SectionTitle';
import { FAQCategoryServices } from '@/lib/modules/faq-category/faqCategory.service';

// This is now an async Server Component
export default async function FaqCategoriesPage() {
  // Directly connect to the DB and call the service function on the server
  await dbConnect();
  // Assuming you have a service function to get all categories for admin
  const initialData = await FAQCategoryServices.getAllFAQCategoriesFromDB(); 

  return (
    <div className="bg-white p-4 sm:p-6 min-h-screen">
      <SectionTitle text="FAQ Categories Management" />
      {/* Pass the fetched data as a prop to the client component.
        JSON.parse(JSON.stringify(...)) converts the Mongoose document
        to a plain object, which is safe to pass from Server to Client Components.
      */}
      <FaqCategoriesTable initialData={JSON.parse(JSON.stringify(initialData))} />
    </div>
  );
}