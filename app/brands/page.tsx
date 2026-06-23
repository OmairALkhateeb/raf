import type { Metadata } from 'next';
import BrandsIndex from '@/components/brands/BrandsIndex';
import { getBrands } from '@/lib/api/brands';

export const metadata: Metadata = {
  title: 'Brand Stores',
  description: 'Explore dedicated mini-stores for every brand on RAF — beauty, perfumes, wellness and gifts.',
};

export default async function BrandsPage() {
  const brands = await getBrands();
  return <BrandsIndex brands={brands} />;
}
