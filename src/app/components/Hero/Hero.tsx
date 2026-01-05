
import HeroImage from './HeroImage';
import HeroFooter from './HeroFooter';
import { fetchEcommerceBanners, fetchNavigationCategoryData } from '@/lib/MainHomePage';
import { HeroNav } from './HeroNav';

export default async function Hero() {
  const [categories, ecommerceBanners] = await Promise.all([
    fetchNavigationCategoryData(),
    fetchEcommerceBanners()
  ]);

  const { leftBanners, rightBanners, bottomBanners } = ecommerceBanners;

  return (
    <div>
      <nav className="hidden lg:block ">
        <HeroNav categories={categories} />
      </nav>
      <section className='container mx-auto'>
        <main className='max-w-[95vw] xl:container mx-auto px-10 md:pt-3'>
          <HeroImage
            leftBanners={leftBanners}
            rightBanners={rightBanners}
            bottomBanners={bottomBanners}
          />
        </main>
      </section>
      <footer>
        <HeroFooter />
      </footer>
    </div>
  );
}
