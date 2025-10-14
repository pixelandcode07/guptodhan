import SectionTitle from '@/components/ui/SectionTitle';
import React from 'react';
import TermsForm from './Components/TermsForm';
import axios from 'axios';

interface TermData {
  _id: string;
  termsId: string;
  category: string;
  description: string;
}

const fetchTermsConditin = async () => {
  try {
    const baseUrl = process.env.NEXTAUTH_URL;
    const { data } = await axios.get(`${baseUrl}/api/v1/terms-condition`);
    return data;
  } catch (error) {
    console.log('fetch settings Error', error);
    return null;
  }
};

export default async function Page() {
  const trams = await fetchTermsConditin();

  const termData: TermData | null =
    trams?.data && trams.data.length > 0 ? trams.data[0] : null;

  return (
    <div className="bg-white pt-5 min-h-screen">
      <SectionTitle text="Terms And Condition Update Form" />
      <div className="p-5">
        <p className="mb-4">Write Terms And Condition Here:</p>

        {/* ✅ Pass props correctly */}
        {termData ? (
          <TermsForm
            initialContent={termData.description}
            termId={termData._id}
            categoryId={termData.category}
          />
        ) : (
          <TermsForm initialContent="" />
        )}
      </div>
    </div>
  );
}
