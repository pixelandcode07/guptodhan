import SectionTitle from '@/components/ui/SectionTitle';
import CodeSnippet from './Components/CodeSnipate';
import { CustomCodeServices } from '@/lib/modules/custom-code/customCode.service'; // Import your service
import dbConnect from '@/lib/db'; // Import your database connection

// This is now an async Server Component
export default async function CustomCodePage() {
  // Directly connect to the DB and call the service function
  await dbConnect();
  const codeData = await CustomCodeServices.getPublicCodeFromDB();

  return (
    <div className="p-6 space-y-6">
      <SectionTitle text="Custom CSS & JS Form" />
      <CodeSnippet initialData={JSON.parse(JSON.stringify(codeData))} />
    </div>
  );
}