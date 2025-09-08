import SectionTitle from '@/components/ui/SectionTitle';
import AllPagesTable from './Components/AllPagesTable';

// Static data
const pageData = [
  {
    id: 1,
    image: 'https://github.com/shadcn.png',
    title: 'Sacha Lowe',
    url: 'https://github.com/shadcn.png',
    status: 'active',
  },
  {
    id: 2,
    image: 'https://github.com/shadcn.png',
    title: 'Sacha Lowe',
    url: 'https://github.com/shadcn.png',
    status: 'active',
  },
  {
    id: 3,
    image: 'https://github.com/shadcn.png',
    title: 'Sacha Lowe',
    url: 'https://github.com/shadcn.png',
    status: 'active',
  },
];

export default function Page() {
  return (
    <div className="pb-6 pt-5 space-y-6 bg-white">
      <SectionTitle text="View All Custom Pages" />
      <div className="px-5">
        <AllPagesTable pages={pageData} />
      </div>
    </div>
  );
}
