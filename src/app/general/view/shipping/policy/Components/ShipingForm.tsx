'use client'; // this component handles all client-side interactivity

import RichTextEditor from '@/components/ReusableComponents/RichTextEditor';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';

export default function ShipingForm() {
  const [content, setContent] = useState(` `);

  const handleUpdate = () => {
    // handle update logic here, e.g., send content to backend
    console.log('Updated Terms:', content);
    alert('Terms and Conditions Updated Successfully!');
  };

  return (
    <div>
      <RichTextEditor value={content} onChange={setContent} />
      <div className="flex justify-center items-center py-7">
        <Button onClick={handleUpdate}>Update Shipping Policy</Button>
      </div>
    </div>
  );
}
