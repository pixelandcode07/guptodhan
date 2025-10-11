/* eslint-disable @typescript-eslint/no-explicit-any */
import SectionTitle from '@/components/ui/SectionTitle';
import CodeSnippet from './Components/CodeSnipate';

export default async function Page() {
  let codeData = { customCSS: '', headerScript: '', footerScript: '' };
  let error = null;

  try {
    const res = await fetch('http://localhost:3000/api/v1/public/custom-code', {
      cache: 'no-store', // always fresh data
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    codeData = json?.data || codeData;
  } catch (err: any) {
    error = err.message || 'Something went wrong while fetching custom code';
  }

  return (
    <div className="p-6 space-y-6">
      <div className="p-4 pl-0 items-center flex justify-between gap-5">
        <SectionTitle text="Custom CSS & JS Form" />
      </div>

      {/* Pass fetched data as props */}
      <CodeSnippet initialData={codeData} error={error} />
    </div>
  );
}
