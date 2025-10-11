import SectionTitle from '@/components/ui/SectionTitle';
import AboutUsForm from './Components/AboutUsForm';

export default async function Page() {
  // Fetch data from your API
  const res = await fetch('http://localhost:3000/api/v1/public/about/content', {
    cache: 'no-store',
  });

  const data = await res.json();

  if (!data?.data) {
    return <p>No About Us content found.</p>;
  }

  const aboutData = data.data; // pass all data as props
  console.log('aboutData', aboutData);

  return (
    <div className="bg-white pt-5 px-4">
      <SectionTitle text="General Information Form" />
      <AboutUsForm aboutData={aboutData} />
    </div>
  );
}
