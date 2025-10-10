// app/(your-path)/facts/page.tsx
import SectionTitle from '@/components/ui/SectionTitle';

import axios from 'axios';
import FactsTable from './Components/FactTabile';

const fetchFacts = async () => {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const { data } = await axios.get(`${baseUrl}/api/v1/public/about/facts`);
    return data;
  } catch (error) {
    console.log('fetch facts Error:', error);
    return { data: [] };
  }
};

export default async function FactsPage() {
  const facts = await fetchFacts();
  console.log(facts);

  return (
    <div className="bg-white pt-5 px-5 min-h-screen">
      <SectionTitle text="View All Facts" />
      <FactsTable initialData={facts?.data || []} />
    </div>
  );
}
