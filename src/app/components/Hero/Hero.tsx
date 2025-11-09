
import HeroImage from './HeroImage';
import HeroFooter from './HeroFooter';
// import HeroNav from './HeroNav';
import { fetchEcommerceBanners, fetchNavigationCategoryData } from '@/lib/MainHomePage';
import { HeroNav } from './HeroNav';
// import HeroNavOld from './HeroNavOld';

export default async function Hero() {
  const [categories, ecommerceBanners] = await Promise.all([
    fetchNavigationCategoryData(),
    fetchEcommerceBanners()
  ]);

  const { leftBanners, rightBanners, bottomBanners } = ecommerceBanners;

  return (
    <div>
      <nav className="hidden lg:block">
        <HeroNav categories={categories} />
      </nav>

      <main className='max-w-[95vw] xl:max-w-[90vw] mx-auto px-4 pt-10'>
        <HeroImage
          leftBanners={leftBanners}
          rightBanners={rightBanners}
          bottomBanners={bottomBanners}
        />
      </main>
      <footer>
        <HeroFooter />
      </footer>
    </div>
  );
}
