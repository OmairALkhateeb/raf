'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Share2, AtSign, Globe } from 'lucide-react';
import Logo from '@/components/common/Logo';
import { useLanguage } from '@/contexts/LanguageContext';
import { categories } from '@/data/categories';

export default function Footer() {
  const { language, t, isRTL } = useLanguage();

  return (
    <footer className="bg-[#1A1210] text-[#E8D5A3]" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Newsletter strip */}
      <div className="border-b border-white/8">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-16">
          <div className="max-w-xl mx-auto text-center">
            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-[#C9A84C] mb-4 block">
              {language === 'ar' ? 'ابقَ على تواصل' : 'Stay Connected'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif text-white mb-3">{t.home.newsletter}</h3>
            <p className="text-sm text-white/40 mb-8 leading-relaxed">{t.home.newsletterDesc}</p>
            <form onSubmit={e => e.preventDefault()} className={`flex gap-0 max-w-md mx-auto ${isRTL ? 'flex-row-reverse' : ''}`}>
              <input
                type="email"
                placeholder={t.home.emailPlaceholder}
                className={`flex-1 h-12 bg-white/6 border border-white/15 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#C9A84C] transition-colors ${isRTL ? 'pr-4 text-right' : 'pl-4'}`}
              />
              <button
                type="submit"
                className="h-12 px-7 bg-[#C9A84C] text-[#2D1F1F] text-[11px] font-black tracking-widest uppercase hover:bg-white transition-colors duration-200 whitespace-nowrap flex-shrink-0"
              >
                {t.home.subscribeBtn}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Logo variant="light" size="md" />
            <p className="mt-5 text-[13px] text-white/35 leading-relaxed">{t.footer.tagline}</p>

            <div className="flex gap-2.5 mt-6">
              {[Share2, AtSign, Globe].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 border border-white/15 flex items-center justify-center text-white/40 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-200"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>

            <div className="mt-7 space-y-3">
              {[
                { Icon: Phone, text: '+968 2412 3456' },
                { Icon: Mail, text: 'hello@raf.om' },
                { Icon: MapPin, text: 'Al Qurum, Muscat, Oman' },
              ].map(({ Icon, text }, i) => (
                <div key={i} className={`flex items-start gap-3 text-[13px] text-white/35 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Icon size={13} className="text-[#C9A84C] flex-shrink-0 mt-0.5" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-white/60 mb-5">{t.nav.allCategories}</h4>
            <ul className="space-y-3">
              {categories.map(cat => (
                <li key={cat.id}>
                  <Link
                    href={`/products?category=${cat.id}`}
                    className="text-[13px] text-white/35 hover:text-[#C9A84C] transition-colors"
                  >
                    {language === 'ar' ? cat.nameAr : cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-white/60 mb-5">{t.footer.quickLinks}</h4>
            <ul className="space-y-3">
              {[
                { href: '/', label: t.nav.home },
                { href: '/products', label: t.nav.products },
                { href: '/account', label: t.nav.account },
                { href: '/wishlist', label: t.nav.wishlist },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[13px] text-white/35 hover:text-[#C9A84C] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer service */}
          <div>
            <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-white/60 mb-5">{t.footer.customerService}</h4>
            <ul className="space-y-3">
              {[t.footer.faq, t.footer.shipping, t.footer.returns, t.footer.contact, t.footer.privacy, t.footer.terms].map((label, i) => (
                <li key={i}>
                  <Link href="#" className="text-[13px] text-white/35 hover:text-[#C9A84C] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-5 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="text-[11px] text-white/25 tracking-wide">{t.footer.rights}</span>
          <span className="text-[11px] text-white/25 tracking-wide">
            {language === 'ar' ? 'صُنع بفخر في عُمان 🇴🇲' : 'Made with pride in Oman 🇴🇲'}
          </span>
        </div>
      </div>
    </footer>
  );
}
