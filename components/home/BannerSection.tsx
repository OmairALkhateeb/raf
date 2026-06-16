'use client';

import { Banner } from '@/types';
import BannerCard from './BannerCard';

interface BannerSectionProps {
  banners: Banner[];
  /** Single full-width banner, or a responsive grid for multiple. */
  ratio?: string;
}

/** Renders a placement's banners. Hidden entirely when none are configured. */
export default function BannerSection({ banners, ratio }: BannerSectionProps) {
  if (!banners || banners.length === 0) return null;

  const isSingle = banners.length === 1;

  return (
    <section className="bg-[#FAF7F2]">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16">
        <div className={isSingle ? '' : 'grid gap-5 md:grid-cols-2'}>
          {banners.map(b => (
            <BannerCard key={b.id} banner={b} ratio={ratio ?? (isSingle ? '24/7' : '16/10')} />
          ))}
        </div>
      </div>
    </section>
  );
}
