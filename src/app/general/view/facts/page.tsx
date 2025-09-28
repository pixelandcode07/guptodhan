import SectionTitle from '@/components/ui/SectionTitle';
import FactsTable from './Components/FactTabile';

export default async function FactsPage() {
  let facts = [];

  try {
    const res = await fetch('http://localhost:3000/api/v1/public/about/facts', {
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch facts');

    const json = await res.json();
    facts = json?.data || [];
  } catch (error) {
    console.error('Error fetching facts', error);
  }

  return (
    <div className="bg-white pt-5 px-5">
      <SectionTitle text="View All Facts" />
      <FactsTable initialData={facts} />
    </div>
  );
}
