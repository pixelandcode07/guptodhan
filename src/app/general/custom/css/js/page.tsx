import { Button } from '@/components/ui/button';

import SectionTitle from '@/components/ui/SectionTitle';

import CodeSnippet from './Components/CodeSnipate';

export default function page() {
  const handleUpdate = () => {
    console.log('click');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="p-4 pl-0 items-center flex justify-between gap-5">
        <SectionTitle text="Custom CSS & JS Form" />

        <div className="flex justify-end gap-2 mt-2">
          <Button variant="destructive">Cancel</Button>
          <Button onClick={handleUpdate}>Update Code</Button>
        </div>
      </div>
      <CodeSnippet />
    </div>
  );
}
