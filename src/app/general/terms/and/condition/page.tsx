import SectionTitle from '@/components/ui/SectionTitle';
import React from 'react';
import TermsForm from './Components/TermsForm';

interface TermData {
  _id: string;
  termsId: string;
  category: string;
  description: string;
}

export default async function Page() {
  let term: TermData | null = null;

  try {
    const res = await fetch('http://localhost:3000/api/v1/terms-condition', {
      cache: 'no-store',
    });
    const data = await res.json();

    if (data.success && data.data.length > 0) {
      term = data.data[0];
    }
  } catch (error) {
    console.error('Failed to fetch terms:', error);
  }

  // Example categoryId (replace with your actual category ID)
  const categoryId = term?.category || '64f0b3a1234567890abcdef0';

  return (
    <div className="bg-white pt-5 min-h-screen">
      <SectionTitle text="Terms And Condition Update Form" />
      <div className="p-5">
        <p className="mb-4">Write Terms And Condition Here:</p>
        <TermsForm
          initialContent={term ? term.description : ''}
          termId={term?._id}      // if term exists, it's update
          categoryId={categoryId} // always pass category for create
        />
      </div>
    </div>
  );
}
