import SectionTitle from '@/components/ui/SectionTitle';

import CodeSnippet from './Components/CodeSnipate';

export default function page() {
  return (
    <div className="p-6 space-y-6">
      <div className="p-4 pl-0 items-center flex justify-between gap-5">
        <SectionTitle text="Custom CSS & JS Form" />
      </div>
      <CodeSnippet />
    </div>
  );
}
