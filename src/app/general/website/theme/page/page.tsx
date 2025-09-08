import React from 'react';
import ThemeColorCard from './Components/ThemeColorCard';
import SectionTitle from '@/components/ui/SectionTitle';

export default function page() {
  return (
    <div>
      <div className=" pt-5 pr-5">
        <SectionTitle text="Update Website Theme Color" />
      </div>

      <ThemeColorCard />
    </div>
  );
}
