import SectionTitle from '@/components/ui/SectionTitle';
import AboutUsForm from './Components/AboutUsForm'; // client component

// Server Component
export default async function Page() {
  // Fetch data from your API
  const res = await fetch('http://localhost:3000/api/v1/public/about/content', {
    cache: 'no-store',
  });

  const data = await res.json();
  const initialContent = data?.data?.aboutContent || '';
  return (
    <div className="bg-white pt-5 px-4">
      <SectionTitle text="General Information Form" />
      {/* Pass content to client component */}
      <AboutUsForm initialContent={initialContent} />
    </div>
  );
}
