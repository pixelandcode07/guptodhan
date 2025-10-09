// app/custom-code/page.tsx
import SectionTitle from '@/components/ui/SectionTitle';
import CodeSnippet from './CodeSnippet';

export default async function Page() {
  const res = await fetch(`localhost:3000/api/v1/public/custom-code`, {
    next: { tags: ['custom-code'] },
  });

  const json = await res.json();
  const codeData = json?.data || {
    customCSS: '',
    headerScript: '',
    footerScript: '',
  };

  return (
    <div className="p-6 space-y-6">
      <SectionTitle text="Custom CSS & JS Form" />
      <CodeSnippet initialData={codeData} />
    </div>
  );
}
