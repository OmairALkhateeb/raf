'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, ChevronRight, ChevronDown, Home, ShoppingBag, Heart, User, Globe, Tag, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/common/Logo';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { categories } from '@/data/categories';

export default function MobileMenu() {
  const router = useRouter();
  const { isMobileMenuOpen, setMobileMenuOpen, showToast } = useApp();
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { isAuthenticated, logout } = useAuth();
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const close = () => setMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    close();
    showToast(language === 'en' ? 'Signed out successfully' : 'تم تسجيل الخروج بنجاح', 'success');
    router.push('/');
  };

  const navItems = [
    { href: '/', label: t.nav.home, icon: Home },
    { href: '/products', label: t.nav.products, icon: ShoppingBag },
    { href: '/brands', label: t.nav.brands, icon: Tag },
    { href: '/cart', label: t.nav.cart, icon: ShoppingBag, badge: itemCount },
    { href: '/wishlist', label: t.nav.wishlist, icon: Heart, badge: wishlistCount },
    {
      href: isAuthenticated ? '/account' : '/login',
      label: isAuthenticated ? t.nav.account : (language === 'en' ? 'Sign In' : 'تسجيل الدخول'),
      icon: User,
    },
  ];

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: isRTL ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? '100%' : '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed top-0 ${isRTL ? 'right-0' : 'left-0'} h-full w-72 bg-[#FAF7F2] z-[70] flex flex-col shadow-modal lg:hidden`}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-cream-darker">
              <Logo size="sm" />
              <button onClick={close} className="p-2 hover:bg-cream-dark transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Nav items */}
            <div className="flex-1 overflow-y-auto py-4">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  className="flex items-center justify-between px-4 py-3 hover:bg-cream-dark transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className="text-[#C9A84C]" />
                    <span className="text-sm font-medium text-[#2D1F1F]">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge != null && item.badge > 0 && (
                      <span className="min-w-[20px] h-5 bg-[#C9A84C] text-white text-xs font-bold flex items-center justify-center px-1 rounded-md">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight size={14} className={`text-gray-400 ${isRTL ? 'rtl-flip' : ''}`} />
                  </div>
                </Link>
              ))}

              <div className="px-4 pt-4 pb-2">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">
                  {t.nav.allCategories}
                </p>
              </div>

              {categories.map(cat => {
                const subs = cat.subCategories ?? [];
                const isExp = expanded === cat.id;
                return (
                  <div key={cat.id} className="border-b border-cream-darker/40">
                    <div className="flex items-center">
                      <Link
                        href={`/products?category=${cat.slug}`}
                        onClick={close}
                        className="flex items-center gap-3 px-4 py-2.5 flex-1 hover:bg-cream-dark transition-colors"
                      >
                        <span className="text-sm text-gray-700">
                          {language === 'ar' ? cat.nameAr : cat.name}
                        </span>
                      </Link>
                      {subs.length > 0 && (
                        <button
                          onClick={() => setExpanded(isExp ? null : cat.id)}
                          className="px-4 py-2.5 text-gray-400 hover:text-[#C9A84C]"
                          aria-label="Toggle sub-categories"
                        >
                          <ChevronDown size={16} className={`transition-transform ${isExp ? 'rotate-180' : ''}`} />
                        </button>
                      )}
                    </div>
                    {isExp && subs.length > 0 && (
                      <div className={`pb-2 ${isRTL ? 'pr-12' : 'pl-12'}`}>
                        {subs.map(sub => (
                          <Link
                            key={sub.id}
                            href={`/products?category=${cat.slug}&subCategory=${sub.slug}`}
                            onClick={close}
                            className="block py-1.5 text-[13px] text-gray-500 hover:text-[#C9A84C] transition-colors"
                          >
                            {language === 'ar' ? sub.nameAr : sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-cream-darker space-y-2.5">
              <button
                onClick={() => {
                  setLanguage(language === 'en' ? 'ar' : 'en');
                  close();
                }}
                className="flex items-center gap-2 w-full px-4 py-3 bg-[#2D1F1F] text-[#E8D5A3] text-[11px] font-black tracking-[0.15em] uppercase rounded-md hover:bg-[#C9A84C] hover:text-[#2D1F1F] transition-colors"
              >
                <Globe size={16} />
                {language === 'en' ? 'التبديل إلى العربية' : 'Switch to English'}
              </button>
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-3 border border-[#2D1F1F]/15 text-red-400 text-[11px] font-black tracking-[0.15em] uppercase rounded-md hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  {language === 'en' ? 'Sign Out' : 'تسجيل الخروج'}
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
