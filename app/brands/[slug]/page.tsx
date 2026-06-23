import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BrandStore from '@/components/brands/BrandStore';
import { getBrand, getBrandProducts, getRelatedProducts } from '@/lib/api/brands';
import { brands } from '@/data/brands';

// Pre-render a page for every known brand slug (mock now; the real API can still
// add brands on demand because the route is dynamic by default).
export function generateStaticParams() {
  return brands.map(b => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: PageProps<'/brands/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrand(slug);
  if (!brand) return { title: 'Brand Not Found' };
  return {
    title: `${brand.name} — Brand Store`,
    description: brand.description,
  };
}

export default async function BrandPage({ params }: PageProps<'/brands/[slug]'>) {
  const { slug } = await params;
  const brand = await getBrand(slug);
  if (!brand) notFound();

  const [products, related] = await Promise.all([
    getBrandProducts(slug),
    getRelatedProducts(slug, 8),
  ]);

  return <BrandStore brand={brand} products={products} related={related} />;
}
