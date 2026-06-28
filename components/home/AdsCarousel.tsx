'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { flickr } from '@/utils/mockImage';

/**
 * A single promotional ad. Easy to extend or move to a CMS/data file later.
 * `image` is a pair (desktop + mobile) so we can ship art tuned per breakpoint.
 */
interface Ad {
  id: string;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  buttonText: string;
  buttonTextAr: string;
  image: string;
  imageMobile?: string;
  href: string;
  /** Optional accent for the corner ribbon (e.g. "New", "Limited"). */
  ribbon?: string;
  ribbonAr?: string;
}

// Source of truth for the homepage ads strip. Edit here to update the page.
// Images use the same mock helper as the rest of the site so they stay
// consistent until the real CMS-served banners take over.
const ADS: Ad[] = [
  {
    id: 'ad-luxury-perfumes',
    title: 'The Art of Fragrance',
    titleAr: 'فنّ العطر',
    subtitle: 'Signature scents from Amouage and beyond — for moments worth remembering.',
    subtitleAr: 'عطور مميّزة من أموآج وأكثر — للحظات تستحق أن تُذكر.',
    buttonText: 'Shop Perfumes',
    buttonTextAr: 'تسوق العطور',
    image: flickr('perfume,luxury,bottle', 'ad-perfumes-d', 1200, 1400),
    imageMobile: flickr('perfume,luxury,bottle', 'ad-perfumes-m', 900, 1100),
    href: '/products?category=perfumes',
    ribbon: 'Featured',
    ribbonAr: 'مميّز',
  },
  {
    id: 'ad-makeup-edit',
    title: 'The Makeup Edit',
    titleAr: 'تشكيلة المكياج',
    subtitle: 'A curated collection of lips, eyes and complexion essentials.',
    subtitleAr: 'تشكيلة مختارة من أساسيات الشفاه والعيون والوجه.',
    buttonText: 'Shop Makeup',
    buttonTextAr: 'تسوق المكياج',
    image: flickr('makeup,cosmetics,lipstick', 'ad-makeup-d', 1200, 1400),
    imageMobile: flickr('makeup,cosmetics,lipstick', 'ad-makeup-m', 900, 1100),
    href: '/products?category=makeup',
    ribbon: 'New',
    ribbonAr: 'جديد',
  },
  {
    id: 'ad-gifts',
    title: 'Beautifully Packaged Gifts',
    titleAr: 'هدايا بتغليف يليق بها',
    subtitle: 'Curated bundles for weddings, Eid, newborns and every occasion.',
    subtitleAr: 'باقات منسّقة للأعراس والعيد والمواليد وكل مناسبة.',
    buttonText: 'Shop Gifts',
    buttonTextAr: 'تسوق الهدايا',
    image: flickr('gift,box,luxury', 'ad-gifts-d', 1200, 1400),
    imageMobile: flickr('gift,box,luxury', 'ad-gifts-m', 900, 1100),
    href: '/products?category=gifts',
    ribbon: 'Limited',
    ribbonAr: 'محدود',
  },
];

interface AdsCarouselProps {
  ads?: Ad[];
}

/**
 * Editorial homepage ads strip.
 *
 * Layout:
 *  - mobile  : 1 card visible, native scroll-snap horizontal swipe + dot indicators
 *  - tablet  : 2 cards visible at a time, swipeable
 *  - desktop : 3 cards visible side-by-side in a premium grid
 *
 * Implementation notes:
 *  - We deliberately avoid a slider library — native scroll-snap is enough,
 *    plays nicely with RTL, never overflows the viewport horizontally, and
 *    works on every mobile browser without JS.
 *  - The track is `overflow-x-auto` with `overscroll-behavior-x: contain` so the
 *    page itself never gets pulled sideways.
 */
export default function AdsCarousel({ ads = ADS }: AdsCarouselProps) {
  const { language, isRTL } = useLanguage();
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Track the most-visible card so the indicators reflect the current ad.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const items = Array.from(track.querySelectorAll<HTMLElement>('[data-ad-card]'));
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        // Pick whichever card is most visible right now.
        const top = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!top) return;
        const idx = items.indexOf(top.target as HTMLElement);
        if (idx !== -1) setActiveIndex(idx);
      },
      { root: track, threshold: [0.5, 0.75, 1] },
    );

    items.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [ads.length]);

  const scrollToIndex = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelectorAll<HTMLElement>('[data-ad-card]')[i];
    if (!card) return;
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  }, []);

  return (
    <section
      dir={isRTL ? 'rtl' : 'ltr'}
      className="bg-[#FAF7F2] py-12 sm:py-16 lg:py-20"
      aria-label={isRTL ? 'إعلانات وعروض RAF' : 'RAF promotions'}
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section header — quietly editorial, matches the existing luxury tone. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center mb-10 sm:mb-12"
        >
          <span className="text-[10px] font-black tracking-[0.45em] uppercase mb-3 text-[#C9A84C]">
            {language === 'ar' ? 'عروض حصرية' : 'Exclusive'}
          </span>
          <div className={`flex items-center gap-4 sm:gap-5 w-full max-w-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="flex-1 h-px bg-[#C9A84C]/30" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#2D1F1F] whitespace-nowrap">
              {language === 'ar' ? 'إعلانات وعروض' : 'Featured Promotions'}
            </h2>
            <div className="flex-1 h-px bg-[#C9A84C]/30" />
          </div>
        </motion.div>

        {/* Carousel track.
            - `mx-` negative margins are used to let the cards bleed slightly off the gutter on
              mobile while keeping the section's container constraints on desktop.
            - `snap-x snap-mandatory` makes swipe feel premium and locks each card into place. */}
        <div
          ref={trackRef}
          className="
            -mx-6 sm:-mx-10 lg:mx-0
            flex gap-4 sm:gap-5 lg:gap-6
            overflow-x-auto snap-x snap-mandatory
            pb-2
            hide-scrollbar
            [scroll-padding-inline:1.5rem]
            sm:[scroll-padding-inline:2.5rem]
            lg:[scroll-padding-inline:0]
          "
          style={{ overscrollBehaviorX: 'contain' }}
        >
          {/* Leading spacer so mobile cards align with the section's gutter. */}
          <div aria-hidden className="shrink-0 w-6 sm:w-10 lg:hidden" />

          {ads.map((ad, i) => (
            <AdCard key={ad.id} ad={ad} index={i} />
          ))}

          {/* Trailing spacer so the last card can fully snap into view. */}
          <div aria-hidden className="shrink-0 w-6 sm:w-10 lg:hidden" />
        </div>

        {/* Dot indicators — visible only when the carousel actually scrolls
            (mobile + tablet). On desktop everything is in view at once. */}
        {ads.length > 1 && (
          <div className="lg:hidden flex justify-center gap-2 mt-6" role="tablist" aria-label="Promotions">
            {ads.map((ad, i) => (
              <button
                key={ad.id}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`${language === 'ar' ? 'إعلان' : 'Promotion'} ${i + 1}`}
                onClick={() => scrollToIndex(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === activeIndex
                    ? 'w-7 h-1.5 bg-[#C9A84C]'
                    : 'w-1.5 h-1.5 bg-[#2D1F1F]/20 hover:bg-[#2D1F1F]/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────────────────── */

function AdCard({ ad, index }: { ad: Ad; index: number }) {
  const { language, isRTL } = useLanguage();
  const title = isRTL ? ad.titleAr : ad.title;
  const subtitle = isRTL ? ad.subtitleAr : ad.subtitle;
  const cta = isRTL ? ad.buttonTextAr : ad.buttonText;
  const ribbon = ad.ribbon ? (isRTL ? ad.ribbonAr : ad.ribbon) : undefined;

  return (
    <motion.div
      data-ad-card
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.24) }}
      className="
        shrink-0 snap-start
        w-[82%]
        sm:w-[calc((100%-1.25rem)/2)]
        lg:w-[calc((100%-3rem)/3)]
      "
    >
      <Link
        href={ad.href}
        className="group relative block overflow-hidden bg-[#2D1F1F] rounded-2xl"
        style={{ aspectRatio: '4/5' }}
      >
        {/* Background art — desktop + mobile sources tuned independently. */}
        <Image
          src={ad.image}
          alt={title}
          fill
          sizes="(max-width: 640px) 82vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105 hidden sm:block"
        />
        <Image
          src={ad.imageMobile ?? ad.image}
          alt={title}
          fill
          sizes="82vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105 sm:hidden"
        />

        {/* Soft luxury overlay — readable text without burying the photograph. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#2D1F1F]/30 via-transparent to-transparent" />

        {/* Optional gold ribbon — top-start corner, RTL-aware via logical inset. */}
        {ribbon && (
          <div
            className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} px-3 py-1.5 bg-[#C9A84C] text-[#2D1F1F] text-[9px] sm:text-[10px] font-black tracking-[0.25em] uppercase rounded-md`}
          >
            {ribbon}
          </div>
        )}

        {/* Thin gold frame — appears on hover for the editorial feel. */}
        <div className="absolute inset-3 sm:inset-4 rounded-xl border border-[#C9A84C]/0 group-hover:border-[#C9A84C]/40 transition-colors duration-500 pointer-events-none" />

        {/* Content block, anchored to bottom. */}
        <div
          className={`absolute inset-0 flex flex-col justify-end p-5 sm:p-6 lg:p-7 ${
            isRTL ? 'text-right items-end' : 'text-left items-start'
          }`}
        >
          {/* Decorative gold hairline. */}
          <div className="w-10 h-px bg-[#C9A84C] mb-3 sm:mb-4" />

          <h3
            className="font-serif font-bold text-white leading-tight mb-2"
            style={{ fontSize: 'clamp(1.15rem, 2.2vw, 1.75rem)' }}
          >
            {title}
          </h3>

          <p className="text-white/75 text-xs sm:text-sm leading-relaxed mb-5 line-clamp-2 max-w-[34ch]">
            {subtitle}
          </p>

          <span
            className={`inline-flex items-center gap-2 bg-[#C9A84C] text-[#2D1F1F] px-5 sm:px-6 py-2.5 sm:py-3 text-[10px] sm:text-[11px] font-black tracking-[0.25em] uppercase rounded-md group-hover:bg-white transition-colors duration-300 ${
              isRTL ? 'flex-row-reverse' : ''
            }`}
          >
            {cta}
            <ChevronRight
              size={12}
              className={`transition-transform duration-300 group-hover:translate-x-1 ${isRTL ? 'rotate-180' : ''}`}
              aria-hidden
            />
          </span>
        </div>

        {/* Screen-reader only label so the whole card is announced as one link. */}
        <span className="sr-only">{language === 'ar' ? `${title} — ${cta}` : `${title} — ${cta}`}</span>
      </Link>
    </motion.div>
  );
}
