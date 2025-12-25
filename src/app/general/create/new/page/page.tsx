import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import SeoForm from './Components/SeoForm';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import SectionTitle from '@/components/ui/SectionTitle';

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'admin') {
    redirect('/');
  }

  const defaultData = {
    pageTitle: '',
    metaTitle: '',
    metaKeywords: [],
    metaDescription: '',
    showInHeader: false,
    showInFooter: false,
    pageContent: '',
  };

  return (
    <div className="container mx-auto py-10">
      {/* <h1 className="text-3xl font-bold mb-8">Create New SEO Page</h1> */}
      <SectionTitle text="Page SEO Information" />
      <SeoForm defaultData={defaultData} />
    </div>
  );
}