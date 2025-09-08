import SectionTitle from '@/components/ui/SectionTitle';
import React from 'react';
import TestimonialsTable from './Components/TestimonialsTable';

const page = () => {
  return (
    <div className="pb-6 pt-5 space-y-6 bg-white">
      <SectionTitle text="Testimonials" />
      <div className="px-5">
        <TestimonialsTable /> {/* Client-side logic lives here */}
      </div>
    </div>
  );
};

export default page;
