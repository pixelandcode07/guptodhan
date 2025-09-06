import SectionTitle from '@/components/ui/SectionTitle';
import React from 'react';
import TermsForm from './Components/TermsForm';

export default function page() {
  return (
    <div className="bg-white pt-5">
      <SectionTitle text="Terms And Condition Update Form" />

      <div className="p-5">
        <p>Write Terms And Condition Here :</p>
        <TermsForm />
      </div>
    </div>
  );
}
