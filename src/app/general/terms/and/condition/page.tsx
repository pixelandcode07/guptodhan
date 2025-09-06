import { RichTextEditor } from '@/components/RichTextEditor/RichTextEditor';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/ui/SectionTitle';
import React from 'react';

const page = () => {
  return (
    <div className="bg-white pt-5 ">
      <SectionTitle text="Terms And Condition Update Form" />

      <div className="p-5">
        <p>Write Terms And Condition Here :</p>
        <RichTextEditor />
        <div className="flex justify-center items-center py-7">
          <Button>Update Terms And Condition</Button>
        </div>
      </div>
    </div>
  );
};

export default page;
