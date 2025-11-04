import React from 'react';

import HeroImage from './HeroImage';
import HeroFooter from './HeroFooter';
import HeroNav from './HeroNav';
import { fetchNavigationCategoryData } from '@/lib/MainHomePage';

export default async function Hero() {
  const [categories] = await Promise.all([
    fetchNavigationCategoryData()
  ]);
  return (
    <div>
      <nav className="hidden lg:block">
        <HeroNav categories={categories} />
      </nav>

      <main>
        <HeroImage />
      </main>
      <footer>
        <HeroFooter />
      </footer>
    </div>
  );
}
