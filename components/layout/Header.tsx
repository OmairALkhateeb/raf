'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Heart, User, Menu, Search, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/common/Logo';
import MegaMenu from '@/components/layout/MegaMenu';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useApp } from '@/contexts/AppContext';
import { products } from '@/data/products';
import DeliveryLocationSelector from '@/components/layout/DeliveryLocationSelector';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { isSearchOpen, setSearchOpen, setMobileMenuOpen } = useApp();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchSuggestions([]); return; }
    const q = searchQuery.toLowerCase();
    const matches = products
      .filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.nameAr.includes(searchQuery) ||
        p.brand.toLowerCase().includes(q)
      )
      .slice(0, 6)
      .map(p => language === 'ar' ? p.nameAr : p.name);
    setSearchSuggestions(matches);
  }, [searchQuery, language]);

  const handleSearch = (q?: string) => {
    const query = q || searchQuery;
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Promo top bar */}
      <div className="bg-[#2D1F1F] text-[#C9A84C] text-center text-[11px] py-2.5 px-4 font-semibold tracking-[0.15em] uppercase">
        {language === 'en'
          ? 'Free shipping on orders above OMR 10  ·  Use code RAF15 for 15% off'
          : 'شحن مجاني للطلبات فوق 10 ر.ع.  ·  كود RAF15 للخصم 15%'}
      </div>

      {/* Delivery location bar */}
      <DeliveryLocationSelector />

      <header
        dir={isRTL ? 'rtl' : 'ltr'}
        className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
          scrolled ? 'shadow-[0_2px_24px_rgba(0,0,0,0.08)] border-b border-transparent' : 'border-b border-[#2D1F1F]/8'
        }`}
      >
        {/* Main header row */}
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex items-center justify-between h-[68px] gap-6">

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 text-[#2D1F1F] hover:text-[#C9A84C] transition-colors"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            {/* Logo */}
            <div className="flex-shrink-0">
              <Logo size="md" />
            </div>

            {/* Center nav — desktop mega menu */}
            <MegaMenu />

            {/* Right icons */}
            <div className="flex items-center gap-3">
              {/* Search — desktop */}
              <div className="hidden lg:block relative" ref={searchRef}>
                <AnimatePresence mode="wait">
                  {isSearchOpen ? (
                    <motion.div
                      key="search-open"
                      initial={{ width: 40, opacity: 0 }}
                      animate={{ width: 280, opacity: 1 }}
                      exit={{ width: 40, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="relative"
                    >
                      <input
                        type="text"
                        autoFocus
                        placeholder={t.nav.search}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        className={`w-full h-9 bg-[#FAF7F2] border border-[#2D1F1F]/15 text-sm rounded-md focus:outline-none focus:border-[#C9A84C] transition-colors ${
                          isRTL ? 'pr-4 pl-9 text-right' : 'pl-4 pr-9'
                        }`}
                      />
                      <button
                        onClick={() => { setSearchOpen(false); setSearchQuery(''); setSearchSuggestions([]); }}
                        className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C9A84C] ${isRTL ? 'left-2' : 'right-2'}`}
                      >
                        <X size={14} />
                      </button>
                      <AnimatePresence>
                        {searchSuggestions.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute top-full mt-1 w-full bg-white shadow-lg border border-[#2D1F1F]/8 overflow-hidden z-50 rounded-md"
                          >
                            {searchSuggestions.map((s, i) => (
                              <button
                                key={i}
                                onClick={() => handleSearch(s)}
                                className={`w-full text-[13px] hover:bg-[#FAF7F2] px-4 py-2.5 transition-colors flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}
                              >
                                <Search size={11} className="text-[#C9A84C] flex-shrink-0" />
                                {s}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="search-icon"
                      onClick={() => setSearchOpen(true)}
                      className="p-2 text-[#2D1F1F]/70 hover:text-[#C9A84C] transition-colors"
                      aria-label="Search"
                    >
                      <Search size={19} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Search mobile */}
              <button
                onClick={() => setSearchOpen(!isSearchOpen)}
                className="lg:hidden p-1.5 text-[#2D1F1F]/70 hover:text-[#C9A84C] transition-colors"
                aria-label="Search"
              >
                <Search size={19} />
              </button>

              {/* Language */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-[#2D1F1F]/60 hover:text-[#C9A84C] transition-colors"
              >
                <Globe size={14} />
                {language === 'en' ? 'عربي' : 'EN'}
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-1.5 text-[#2D1F1F]/70 hover:text-[#C9A84C] transition-colors"
                aria-label="Wishlist"
              >
                <Heart size={19} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C9A84C] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account */}
              <Link
                href="/account"
                className="hidden sm:flex p-1.5 text-[#2D1F1F]/70 hover:text-[#C9A84C] transition-colors"
                aria-label="Account"
              >
                <User size={19} />
              </Link>

              {/* Cart CTA */}
              <Link
                href="/cart"
                className="flex items-center gap-2.5 bg-[#2D1F1F] text-white px-5 py-2.5 text-[11px] font-bold tracking-[0.2em] uppercase rounded-md hover:bg-[#C9A84C] transition-colors duration-300"
                aria-label="Cart"
              >
                <ShoppingBag size={15} />
                {itemCount > 0 ? itemCount : ''}
                <span className="hidden sm:inline">{language === 'ar' ? 'الحقيبة' : 'Bag'}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile search dropdown */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-[#2D1F1F]/8 overflow-hidden bg-white"
            >
              <div className="px-4 py-3 relative">
                <input
                  type="text"
                  placeholder={t.nav.search}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  autoFocus
                  className={`w-full h-10 bg-[#FAF7F2] border border-[#2D1F1F]/15 text-sm px-4 rounded-md focus:outline-none focus:border-[#C9A84C] ${isRTL ? 'pl-10 text-right' : 'pr-10'}`}
                />
                <button onClick={() => handleSearch()} className={`absolute top-1/2 -translate-y-1/2 mt-0.5 p-2 text-[#C9A84C] ${isRTL ? 'left-6' : 'right-6'}`}>
                  <Search size={16} />
                </button>
                {searchSuggestions.length > 0 && (
                  <div className="mt-1 bg-white border border-[#2D1F1F]/8 shadow-lg rounded-md overflow-hidden">
                    {searchSuggestions.map((s, i) => (
                      <button key={i} onClick={() => handleSearch(s)} className="w-full text-sm hover:bg-[#FAF7F2] px-4 py-2.5 text-left transition-colors">
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
