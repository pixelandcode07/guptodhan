import SectionTitle from '@/components/ui/SectionTitle';
import BlogEntryFormWrapper from './Components/BlogEntryFormWrapper';

function page() {
  return (
    <div className=" pt-5 bg-white space-y-4">
      <SectionTitle text="Blog Entry Form" />
      <BlogEntryFormWrapper />;
    </div>
  );
}

export default page;
