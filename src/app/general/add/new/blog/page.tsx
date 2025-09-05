'use client';

import TagsInput from './Components/TagInput';
import BlogSeoForm from './Components/BlogSeoInfo';

import BlogForm from './Components/BlogEntryForm';
import SectionTitle from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/button';
import { RichTextEditor } from '@/components/ReusableComponents/RichTextEditor';

function page() {
  return (
    <div className=" pt-5 bg-white space-y-4">
      <SectionTitle text="Blog Entry Form" />
      <div className="px-5 pt-4 space-y-4">
        <BlogForm />
        <RichTextEditor />
        <TagsInput />
        <BlogSeoForm />
      </div>

      <div className="flex justify-center pb-5 gap-4 mt-6">
        <Button variant="destructive">Cencle</Button>
        <Button>Update</Button>
      </div>
    </div>
  );
}

export default page;
