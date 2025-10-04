import React from 'react';

import HeroImage from './HeroImage';
import HeroFooter from './HeroFooter';
import HeroNav from './HeroNav';

export default function Hero() {
  return (
    <div>
      <nav className="hidden lg:block">
        <HeroNav />
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
