import { RichTextEditor } from '@/components/ReusableComponents/RichTextEditor';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/ui/SectionTitle';
import React from 'react';

const page = () => {
  return (
    <div className="bg-white pt-5 ">
      <SectionTitle text="Shipping Policy Update Form" />

      <div className="p-5">
        <p>Write Shipping Policies Here :</p>
        <RichTextEditor />
        <div className="flex justify-center items-center py-7">
          <Button>Update Shipping Policy</Button>
        </div>
      </div>
    </div>
  );
};

export default page;
