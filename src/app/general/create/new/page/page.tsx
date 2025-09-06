// app/seo/page.tsx
import SectionTitle from '@/components/ui/SectionTitle';
import SeoForm from './Components/SeoForm';

export default function Page() {
  // all static/default data can go here
  const defaultData = {
    pageTitle: '',
    metaTitle: '',
    metaKeywords: [] as string[],
    metaDescription: '',
    showInHeader: false,
    showInFooter: false,
    pageContent: '',
  };

  return (
    <div className="bg-white pt-5 p-5">
      <SectionTitle text="Page SEO Information" />
      <SeoForm defaultData={defaultData} />
    </div>
  );
}
