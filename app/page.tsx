import type { Metadata } from 'next';
import HeroCarousel from '@/components/home/HeroCarousel';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BrandShowcase from '@/components/home/BrandShowcase';
import PromoBanner from '@/components/home/PromoBanner';
import { banners } from '@/data/banners';
import { categories } from '@/data/categories';
import { getFeaturedProducts, getBestsellerProducts, getNewProducts } from '@/data/products';
import { getFeaturedBrands } from '@/data/brands';

export const metadata: Metadata = {
  title: 'RAF | Authentic Omani Products — Home',
};

export default function HomePage() {
  const featured = getFeaturedProducts();
  const bestsellers = getBestsellerProducts();
  const newArrivals = getNewProducts();
  const brands = getFeaturedBrands();

  return (
    <div>
      <HeroCarousel banners={banners} />

      <PromoBanner />

      <FeaturedProducts
        products={featured.slice(0, 10)}
        label="Curated For You"
        title="Featured Collection"
        subtitle="Discover our hand-picked selection of authentic Omani luxury products"
        viewAllHref="/products?sort=popular"
      />

      <CategoryGrid categories={categories} />

      <FeaturedProducts
        products={bestsellers.slice(0, 5)}
        label="Most Loved"
        title="Bestsellers"
        subtitle="The products our customers keep coming back for"
        viewAllHref="/products?sort=popular"
        dark
      />

      <BrandShowcase brands={brands} />

      <FeaturedProducts
        products={newArrivals.slice(0, 5)}
        label="Just Arrived"
        title="New Arrivals"
        subtitle="Fresh additions to our curated Omani collection"
        viewAllHref="/products?sort=newest"
      />
    </div>
  );
}
