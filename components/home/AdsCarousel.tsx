'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { flickr } from '@/utils/mockImage';

interface PromoBanner {
  id: string;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  href: string;
  image: string;
  /** Marketing label — e.g. "Featured", "Offer". */
  label?: string;
  labelAr?: string;
}

const PROMO_BANNERS: PromoBanner[] = [
  {
    id: 'promo-raf15',
    title: '15% Off Your First Order',
    titleAr: 'خصم 15% على أول طلب',
    subtitle: 'Use code RAF15 at checkout — on beauty, perfumes & gifts.',
    subtitleAr: 'استخدمي كود RAF15 — على الجمال والعطور والهدايا.',
    href: '/products',
    image: flickr('luxury,perfume,gold', 'promo-raf15', 1200, 480),
    label: 'Offer',
    labelAr: 'عرض',
  },
  {
    id: 'promo-perfumes',
    title: 'Signature Fragrances',
    titleAr: 'عطور مميّزة',
    subtitle: 'Amouage & curated luxury scents — delivered across Oman.',
    subtitleAr: 'أموآج وعطور فاخرة — توصيل لجميع محافظات عُمان.',
    href: '/products?category=perfumes',
    image: flickr('perfume,bottle,luxury', 'promo-perfumes', 1200, 480),
    label: 'Featured',
    labelAr: 'مميّز',
  },
  {
    id: 'promo-gifts',
    title: 'Wedding & Occasion Gifts',
    titleAr: 'هدايا الأعراس والمناسبات',
    subtitle: 'Custom packaging & personalized names — order with special notes.',
    subtitleAr: 'تغليف مخصص وأسماء شخصية — اكتبي ملاحظاتك عند الطلب.',
    href: '/products?category=gifts',
    image: flickr('gift,wedding,luxury', 'promo-gifts', 1200, 480),
    label: 'New',
    labelAr: 'جديد',
  },
  {
    id: 'promo-shipping',
    title: 'Free Shipping Over OMR 10',
    titleAr: 'شحن مجاني فوق 10 ر.ع.',
    subtitle: 'Fast delivery to Muscat, Salalah & all governorates.',
    subtitleAr: 'توصيل سريع لمسقط وصلالة وجميع المحافظات.',
    href: '/products',
    image: flickr('delivery,box,luxury', 'promo-shipping', 1200, 480),
    label: 'Offer',
    labelAr: 'عرض',
  },
];

const AUTO_INTERVAL = 5000;

interface AdsCarouselProps {
  banners?: PromoBanner[];
}

/**
 * Horizontal rectangular promo banners — marketing offers, not product cards.
 * Mobile: one banner + peek of the next. Desktop: auto-advancing carousel.
 */
export default function AdsCarousel({ banners = PROMO_BANNERS }: AdsCarouselProps) {
  const { language, isRTL } = useLanguage();
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const scrollToIndex = useCallback((i: number, smooth = true) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelectorAll<HTMLElement>('[data-promo-banner]')[i];
    if (!card) return;

    // Scroll only the carousel track — never the page (scrollIntoView jumps the viewport).
    const behavior: ScrollBehavior = smooth ? 'smooth' : 'auto';
    const left = isRTL
      ? card.offsetLeft - (track.clientWidth - card.clientWidth)
      : card.offsetLeft;

    track.scrollTo({ left, behavior });
    setActiveIndex(i);
  }, [isRTL]);

  const next = useCallback(() => {
    scrollToIndex((activeIndex + 1) % banners.length);
  }, [activeIndex, banners.length, scrollToIndex]);

  const prev = useCallback(() => {
    scrollToIndex((activeIndex - 1 + banners.length) % banners.length);
  }, [activeIndex, banners.length, scrollToIndex]);

  // Track visible banner via IntersectionObserver
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const items = Array.from(track.querySelectorAll<HTMLElement>('[data-promo-banner]'));
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        const top = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!top) return;
        const idx = items.indexOf(top.target as HTMLElement);
        if (idx !== -1) setActiveIndex(idx);
      },
      { root: track, threshold: [0.5, 0.75] },
    );

    items.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [banners.length]);

  // Auto-advance
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, AUTO_INTERVAL);
    return () => clearInterval(timer);
  }, [next, isPaused]);

  return (
    <section
      dir={isRTL ? 'rtl' : 'ltr'}
      className="bg-white pt-3 pb-2 sm:py-6 lg:py-8 border-b border-[#2D1F1F]/6"
      aria-label={isRTL ? 'عروض وإعلانات RAF' : 'RAF promotions'}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-16">
        {/* Carousel track — one banner + peek on mobile */}
        <div className="relative">
          <div
            ref={trackRef}
            className="
              flex gap-3 sm:gap-4
              overflow-x-auto snap-x snap-mandatory
              hide-scrollbar pb-1
              [scroll-padding-inline:0]
            "
            style={{ overscrollBehaviorX: 'contain', overflowAnchor: 'none' }}
          >
            {banners.map((banner, i) => (
              <PromoBannerCard key={banner.id} banner={banner} index={i} />
            ))}
          </div>

          {/* Desktop nav arrows */}
          {banners.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                className={`hidden sm:flex absolute top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/90 border border-[#2D1F1F]/10 text-[#2D1F1F] items-center justify-center rounded-full shadow-sm hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors ${
                  isRTL ? 'right-2' : 'left-2'
                }`}
                aria-label={isRTL ? 'السابق' : 'Previous'}
              >
                <ChevronLeft size={16} className={isRTL ? 'rotate-180' : ''} />
              </button>
              <button
                type="button"
                onClick={next}
                className={`hidden sm:flex absolute top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/90 border border-[#2D1F1F]/10 text-[#2D1F1F] items-center justify-center rounded-full shadow-sm hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors ${
                  isRTL ? 'left-2' : 'right-2'
                }`}
                aria-label={isRTL ? 'التالي' : 'Next'}
              >
                <ChevronRight size={16} className={isRTL ? 'rotate-180' : ''} />
              </button>
            </>
          )}
        </div>

        {/* Dot indicators */}
        {banners.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-2 sm:mt-3" role="tablist">
            {banners.map((banner, i) => (
              <button
                key={banner.id}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`${language === 'ar' ? 'إعلان' : 'Promotion'} ${i + 1}`}
                onClick={() => scrollToIndex(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === activeIndex
                    ? 'w-6 h-1.5 bg-[#C9A84C]'
                    : 'w-1.5 h-1.5 bg-[#2D1F1F]/15 hover:bg-[#2D1F1F]/30'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function PromoBannerCard({ banner, index }: { banner: PromoBanner; index: number }) {
  const { language, isRTL } = useLanguage();
  const title = isRTL ? banner.titleAr : banner.title;
  const subtitle = isRTL ? banner.subtitleAr : banner.subtitle;
  const label = banner.label ? (isRTL ? banner.labelAr : banner.label) : undefined;

  return (
    <motion.div
      data-promo-banner
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.18) }}
      className="
        shrink-0 snap-start
        w-[88%] sm:w-[calc(100%-2rem)] lg:w-full
      "
    >
      <Link
        href={banner.href}
        className="group relative flex overflow-hidden bg-[#2D1F1F] rounded-xl border border-[#2D1F1F]/8
          h-[120px] sm:h-[140px] lg:h-[160px]"
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={banner.image}
            alt={title}
            fill
            sizes="(max-width: 640px) 88vw, (max-width: 1024px) 90vw, 1200px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
          {isRTL && (
            <div className="absolute inset-0 bg-gradient-to-l from-black/40 via-transparent to-transparent" />
          )}
        </div>

        {/* Label badge */}
        {label && (
          <span
            className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} z-10 px-2.5 py-1 bg-[#C9A84C] text-[#2D1F1F] text-[9px] font-black tracking-[0.2em] uppercase rounded-md`}
          >
            {label}
          </span>
        )}

        {/* Text content */}
        <div
          className={`relative z-10 flex flex-col justify-center flex-1 px-4 sm:px-8 py-3 min-w-0 ${
            isRTL ? 'text-right items-end' : 'text-left items-start'
          }`}
        >
          <h3 className="font-serif font-bold text-white text-sm sm:text-lg lg:text-xl leading-tight mb-1 line-clamp-1">
            {title}
          </h3>
          <p className="text-white/70 text-[11px] sm:text-xs lg:text-sm leading-snug line-clamp-2 max-w-[28ch] sm:max-w-md">
            {subtitle}
          </p>
        </div>

        {/* Decorative arrow hint */}
        <div
          className={`hidden sm:flex items-center px-4 text-[#C9A84C]/60 group-hover:text-[#C9A84C] transition-colors ${
            isRTL ? 'flex-row-reverse' : ''
          }`}
        >
          <ChevronRight size={18} className={isRTL ? 'rotate-180' : ''} />
        </div>
      </Link>
    </motion.div>
  );
}
