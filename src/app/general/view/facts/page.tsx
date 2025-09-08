import SectionTitle from '@/components/ui/SectionTitle';
import FactsTable from './Components/FactTabile';

const facts = [
  {
    id: 1,
    title: 'Products For Sale tes',
    desc: 'Diam maecenas ultricies mi eget mauris test',
    count: '12',
    status: 'Active',
  },
  {
    id: 2,
    title: 'Products For Sale tes',
    desc: 'Diam maecenas ultricies mi eget mauris test',
    count: '12',
    status: 'Active',
  },
  {
    id: 3,
    title: 'Products For Sale tes',
    desc: 'Diam maecenas ultricies mi eget mauris test',
    count: '12',
    status: 'Active',
  },
  {
    id: 4,
    title: 'Products For Sale tes',
    desc: 'Diam maecenas ultricies mi eget mauris test',
    count: '12',
    status: 'Active',
  },
];

export default function FactsPage() {
  return (
    <div className="bg-white pt-5 px-5">
      <SectionTitle text="View All Facts" />
      <FactsTable data={facts} />
    </div>
  );
}
