import React from 'react';
import SeoOptimizationForm from './Components/SeoOptimizationForm';
import OpenGraphForm from './Components/OpenGraphForm';

export default function page() {
  return (
    <div>
      <div className="mx-auto grid grid-cols-1 mt-5 lg:grid-cols-2 gap-6">
        <SeoOptimizationForm />
        <OpenGraphForm />
      </div>
    </div>
  );
}
