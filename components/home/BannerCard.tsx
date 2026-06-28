'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Banner } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { bannerHref } from '@/utils/bannerLink';
import { trackBannerClick } from '@/lib/api/banners';

interface BannerCardProps {
  banner: Banner;
  /** Aspect ratio for the card image area. */
  ratio?: string;
}

/**
 * A single clickable marketing banner. Resolves its own click target and fires
 * (non-blocking) click tracking. Never a dead image.
 */
export default function BannerCard({ banner, ratio = '21/9' }: BannerCardProps) {
  const { language, isRTL } = useLanguage();
  const title = language === 'ar' ? banner.titleAr : banner.title;
  const subtitle = language === 'ar' ? banner.subtitleAr : banner.subtitle;
  const button = language === 'ar' ? banner.buttonTextAr : banner.buttonText;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
    >
      <Link
        href={bannerHref(banner)}
        onClick={() => trackBannerClick(banner.id)}
        className="group relative block overflow-hidden rounded-2xl"
        style={{ aspectRatio: ratio, backgroundColor: banner.bgColor ?? '#2D1F1F' }}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Desktop / mobile art */}
        <Image
          src={banner.imageDesktop}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105 hidden sm:block"
        />
        <Image
          src={banner.imageMobile}
          alt={title}
          fill
          sizes="100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105 sm:hidden"
        />

        {/* Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t ${isRTL ? 'sm:bg-gradient-to-l' : 'sm:bg-gradient-to-r'} from-black/75 via-black/30 to-transparent`} />

        {/* Content */}
        <div className={`absolute inset-0 flex flex-col justify-center p-7 sm:p-10 max-w-md ${isRTL ? 'text-right items-end ml-auto' : 'text-left items-start'}`}>
          <h3
            className="font-serif font-bold leading-tight mb-2"
            style={{ color: banner.textColor ?? '#F5F0E8', fontSize: 'clamp(1.4rem, 3vw, 2.2rem)' }}
          >
            {title}
          </h3>
          <p className="text-white/75 text-sm sm:text-base mb-5 line-clamp-2">{subtitle}</p>
          <span className="inline-flex items-center gap-2 bg-[#C9A84C] text-[#2D1F1F] px-6 py-3 text-[11px] font-black tracking-[0.2em] uppercase rounded-md group-hover:bg-white transition-colors duration-300">
            {button}
            <ChevronRight size={14} className={`transition-transform duration-300 group-hover:translate-x-1 ${isRTL ? 'rotate-180' : ''}`} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
