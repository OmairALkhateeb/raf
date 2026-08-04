'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Store, ShoppingBag, User } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

// Mobile-only bottom navigation. Premium, RTL-aware, fixed to the bottom and
// hidden from `lg` up. The centre "Cart" action is emphasised. "Categories"
// opens the existing category drawer (MobileMenu) rather than navigating.

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { setMobileMenuOpen } = useApp();
  const { itemCount } = useCart();
  const { language, isRTL } = useLanguage();
  const { isAuthenticated } = useAuth();

  const tr = (en: string, ar: string) => (language === 'ar' ? ar : en);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const linkCls = (active: boolean) =>
    `flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
      active ? 'text-[#C9A84C]' : 'text-[#2D1F1F]/55'
    }`;

  return (
    <nav
      dir={isRTL ? 'rtl' : 'ltr'}
      aria-label={tr('Primary', 'التنقل الرئيسي')}
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#2D1F1F]/10 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch h-16 max-w-lg mx-auto px-2">
        {/* Home */}
        <Link href="/" className={linkCls(isActive('/'))}>
          <Home size={20} strokeWidth={isActive('/') ? 2.4 : 2} />
          <span className="text-[10px] font-bold tracking-wide">{tr('Home', 'الرئيسية')}</span>
        </Link>

        {/* Categories — opens the drawer */}
        <button onClick={() => setMobileMenuOpen(true)} className={linkCls(false)}>
          <LayoutGrid size={20} />
          <span className="text-[10px] font-bold tracking-wide">{tr('Categories', 'الأقسام')}</span>
        </button>

        {/* Cart — emphasised centre action */}
        <Link href="/cart" className="flex flex-col items-center justify-center flex-1 h-full">
          <div className="relative -mt-5 mb-0.5">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-[0_6px_16px_rgba(201,168,76,0.45)] transition-colors ${
              isActive('/cart') ? 'bg-[#2D1F1F]' : 'bg-[#C9A84C]'
            }`}>
              <ShoppingBag size={20} className="text-white" />
            </div>
            {itemCount > 0 && (
              <span className="absolute -top-1 -end-1 min-w-[18px] h-[18px] px-1 bg-[#2D1F1F] text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-white">
                {itemCount}
              </span>
            )}
          </div>
          <span className={`text-[10px] font-bold tracking-wide ${isActive('/cart') ? 'text-[#C9A84C]' : 'text-[#2D1F1F]/55'}`}>
            {tr('Cart', 'السلة')}
          </span>
        </Link>

        {/* Brands */}
        <Link href="/brands" className={linkCls(isActive('/brands'))}>
          <Store size={20} strokeWidth={isActive('/brands') ? 2.4 : 2} />
          <span className="text-[10px] font-bold tracking-wide">{tr('Brands', 'العلامات')}</span>
        </Link>

        {/* Account */}
        <Link href={isAuthenticated ? '/account' : '/login'} className={linkCls(isActive('/account') || isActive('/login'))}>
          <User size={20} strokeWidth={isActive('/account') || isActive('/login') ? 2.4 : 2} />
          <span className="text-[10px] font-bold tracking-wide">
            {isAuthenticated ? tr('Account', 'حسابي') : tr('Sign In', 'تسجيل الدخول')}
          </span>
        </Link>
      </div>
    </nav>
  );
}
