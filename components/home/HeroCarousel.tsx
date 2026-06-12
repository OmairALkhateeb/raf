'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, type PanInfo, type Variants } from 'framer-motion';
import { Banner } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeroCarouselProps {
  banners: Banner[];
}

const SLIDE_DURATION = 6500;
const SWIPE_THRESHOLD = 60;

const slideVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

// Staggered reveal: each content element enters slightly after the previous
const contentContainer: Variants = {
  enter: {},
  center: { transition: { staggerChildren: 0.1, delayChildren: 0.25 } },
  exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
};

const contentItem: Variants = {
  enter: { opacity: 0, y: 32 },
  center: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.3 } },
};

export default function HeroCarousel({ banners }: HeroCarouselProps) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const { language, isRTL } = useLanguage();

  const next = useCallback(() => {
    setDirection(1);
    setActive(i => (i + 1) % banners.length);
  }, [banners.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setActive(i => (i - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [next, isPaused]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) next();
    else if (info.offset.x > SWIPE_THRESHOLD) prev();
  };

  const banner = banners[active];

  return (
    <div
      className="relative w-full overflow-hidden bg-[#2D1F1F]"
      style={{ height: 'min(88vh, 780px)', minHeight: '520px' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides — crossfade between slides, slow Ken Burns zoom while visible */}
      <AnimatePresence mode="sync">
        <motion.div
          key={active}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 1.1, ease: [0.45, 0, 0.25, 1] }}
          className="absolute inset-0"
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1 }}
            animate={{ scale: 1.08 }}
            transition={{ duration: (SLIDE_DURATION + 1500) / 1000, ease: 'linear' }}
          >
            <Image
              src={banner.image}
              alt={language === 'ar' ? banner.titleAr : banner.title}
              fill
              priority={active === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
          </motion.div>

          {/* Multi-layer overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Grain texture overlay for luxury feel */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Swipe layer — captures horizontal drags on touch devices */}
      <motion.div
        className="absolute inset-0 z-10"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragEnd={handleDragEnd}
      >
        {/* Slide content */}
        <div
          className={`absolute inset-0 flex items-center ${isRTL ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`px-8 sm:px-16 lg:px-24 max-w-3xl ${isRTL ? 'text-right' : 'text-left'}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${active}`}
                variants={contentContainer}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {/* Overline label */}
                <motion.div
                  variants={contentItem}
                  className={`flex items-center gap-3 mb-5 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <div className="w-12 h-px bg-[#C9A84C]" />
                  <span className="text-[#C9A84C] text-[11px] font-black tracking-[0.4em] uppercase">
                    RAF · Luxury Collection
                  </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                  variants={contentItem}
                  className="font-serif font-bold text-white leading-[1.05] mb-6"
                  style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)' }}
                >
                  {language === 'ar' ? banner.titleAr : banner.title}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  variants={contentItem}
                  className="text-white/70 text-base sm:text-lg leading-relaxed mb-10 max-w-lg font-light"
                >
                  {language === 'ar' ? banner.subtitleAr : banner.subtitle}
                </motion.p>

                {/* CTA buttons */}
                <motion.div
                  variants={contentItem}
                  className={`flex flex-wrap items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <Link
                    href={banner.ctaLink}
                    className="group inline-flex items-center gap-3 bg-[#C9A84C] text-[#2D1F1F] px-8 py-4 text-[11px] font-black tracking-[0.25em] uppercase hover:bg-white transition-all duration-300"
                  >
                    {language === 'ar' ? banner.ctaAr : banner.cta}
                    <ChevronRight
                      size={14}
                      className={`transition-transform duration-300 group-hover:translate-x-1 ${isRTL ? 'rotate-180' : ''}`}
                    />
                  </Link>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 text-white/80 text-[11px] font-semibold tracking-[0.2em] uppercase border-b border-white/30 pb-0.5 hover:text-[#C9A84C] hover:border-[#C9A84C] transition-all duration-300"
                  >
                    {language === 'ar' ? 'كل المنتجات' : 'View All'}
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Slide counter — top right */}
      <div className="absolute top-6 right-8 z-20 flex items-center gap-2">
        <span className="text-white text-lg font-serif">0{active + 1}</span>
        <div className="w-px h-6 bg-white/30 rotate-12" />
        <span className="text-white/40 text-sm font-light">0{banners.length}</span>
      </div>

      {/* Navigation arrows — desktop only; mobile swipes */}
      <button
        onClick={prev}
        className={`hidden sm:flex absolute top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-white/25 text-white items-center justify-center hover:bg-white/10 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-300 ${
          isRTL ? 'right-6' : 'left-6'
        }`}
        aria-label="Previous"
      >
        <ChevronLeft size={20} className={isRTL ? 'rotate-180' : ''} />
      </button>
      <button
        onClick={next}
        className={`hidden sm:flex absolute top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-white/25 text-white items-center justify-center hover:bg-white/10 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-300 ${
          isRTL ? 'left-6' : 'right-6'
        }`}
        aria-label="Next"
      >
        <ChevronRight size={20} className={isRTL ? 'rotate-180' : ''} />
      </button>

      {/* Progress dots — bottom center */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > active ? 1 : -1); setActive(i); }}
            className={`transition-all duration-500 rounded-full ${
              i === active
                ? 'w-8 h-1.5 bg-[#C9A84C]'
                : 'w-1.5 h-1.5 bg-white/35 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Auto-play progress bar */}
      {!isPaused && (
        <motion.div
          key={`progress-${active}`}
          className="absolute bottom-0 left-0 h-[2px] bg-[#C9A84C]/60 z-20"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: SLIDE_DURATION / 1000, ease: 'linear' }}
        />
      )}
    </div>
  );
}
