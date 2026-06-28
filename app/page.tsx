import type { Metadata } from 'next';
import HeroCarousel from '@/components/home/HeroCarousel';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BrandShowcase from '@/components/home/BrandShowcase';
import BannerSection from '@/components/home/BannerSection';
import AdsCarousel from '@/components/home/AdsCarousel';
import { getBanners } from '@/lib/api/banners';
import { categories } from '@/data/categories';
import { getBestsellerProducts } from '@/data/products';
import { getFeaturedBrands } from '@/data/brands';

export const metadata: Metadata = {
  title: 'RAF | Beauty, Care, Wellness & Gifts',
};

export default async function HomePage() {
  // Banners are admin-managed and fetched by placement (mock now, API-ready).
  const [heroBanners, middleBanners, bottomBanners] = await Promise.all([
    getBanners('home_hero'),
    getBanners('home_middle'),
    getBanners('home_bottom'),
  ]);

  const bestsellers = getBestsellerProducts();
  const brands = getFeaturedBrands();

  return (
    <div>
      <HeroCarousel banners={heroBanners} />

      {/* Featured promotions — replaces the old trust-badges row. */}
      <AdsCarousel />

      {/* Primary gateway: shop by category */}
      <CategoryGrid categories={categories} />

      {/* Shop by brand — promoted high on the page (was previously near the footer). */}
      <BrandShowcase brands={brands} />

      {/* Mid-page marketing banners (clickable → related products) */}
      <BannerSection banners={middleBanners} />

      {/* A single, focused product strip keeps the home page from feeling crowded */}
      <FeaturedProducts
        products={bestsellers.slice(0, 5)}
        label="Most Loved"
        title="Bestsellers"
        subtitle="The products our customers keep coming back for"
        viewAllHref="/products?sort=popular"
        dark
      />

      <BannerSection banners={bottomBanners} />
    </div>
  );
}
