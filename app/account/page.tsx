'use client';

import Image from 'next/image';
import Link from 'next/link';
import { User, Package, Heart, MapPin, Settings, LogOut, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockUser, mockOrders } from '@/data/mockUser';
import { useLanguage } from '@/contexts/LanguageContext';

const cx = 'max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16';

export default function AccountPage() {
  const { language, t, isRTL } = useLanguage();

  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    processing: { bg: 'bg-amber-50', text: 'text-amber-700', label: t.account.processing },
    shipped: { bg: 'bg-blue-50', text: 'text-blue-700', label: t.account.shipped },
    delivered: { bg: 'bg-[#C9A84C]/10', text: 'text-[#C9A84C]', label: t.account.delivered },
    cancelled: { bg: 'bg-red-50', text: 'text-red-600', label: t.account.cancelled },
  };

  const navItems = [
    { href: '/account', label: t.account.profile, icon: User },
    { href: '/account', label: t.account.orders, icon: Package, badge: mockOrders.length },
    { href: '/wishlist', label: t.account.wishlist, icon: Heart },
    { href: '/account', label: t.account.addresses, icon: MapPin },
    { href: '/account', label: t.account.settings, icon: Settings },
  ];

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Page header */}
      <div className="border-b border-[#2D1F1F]/8 bg-white">
        <div className={`${cx} py-10 sm:py-14`}>
          <span className="block text-[10px] font-black tracking-[0.4em] uppercase text-[#C9A84C] mb-3">
            {language === 'en' ? 'My Account' : 'حسابي'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#2D1F1F]">{t.account.title}</h1>
        </div>
      </div>

      <div className={`${cx} py-10 sm:py-14`}>
        <div className="grid lg:grid-cols-[280px_1fr] gap-8 lg:gap-14" style={{ alignItems: 'start' }}>
          {/* Sidebar */}
          <div className="space-y-5">
            {/* Profile card */}
            <div className="border border-[#2D1F1F]/8 rounded-xl p-8 text-center">
              <div className="relative w-20 h-20 overflow-hidden mx-auto mb-4 ring-2 ring-[#C9A84C] ring-offset-2 rounded-full">
                <Image src={mockUser.avatar} alt={mockUser.name} fill className="object-cover" sizes="80px" />
              </div>
              <h2 className="text-base font-semibold text-[#2D1F1F]">{mockUser.name}</h2>
              <p className="text-xs text-[#2D1F1F]/45 mt-1">{mockUser.email}</p>
              <span className="inline-block mt-3 px-3 py-1 bg-[#C9A84C]/10 text-[#C9A84C] text-[10px] font-black tracking-[0.15em] uppercase rounded-md">
                {language === 'en' ? 'Premium Member' : 'عضو مميز'}
              </span>
            </div>

            {/* Nav */}
            <div className="border border-[#2D1F1F]/8 rounded-xl overflow-hidden">
              {navItems.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className={`flex items-center justify-between px-5 py-3.5 hover:bg-[#FAF7F2] transition-colors ${
                    i < navItems.length - 1 ? 'border-b border-[#2D1F1F]/8' : ''
                  } ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <item.icon size={15} className="text-[#C9A84C]" />
                    <span className="text-sm font-medium text-[#2D1F1F]">{item.label}</span>
                  </div>
                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {'badge' in item && item.badge != null && (
                      <span className="min-w-[18px] h-[18px] bg-[#C9A84C] text-white text-[9px] font-black flex items-center justify-center px-1 rounded-md">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight size={12} className={`text-[#2D1F1F]/25 ${isRTL ? 'rtl-flip' : ''}`} />
                  </div>
                </Link>
              ))}
              <button className={`flex items-center gap-3 w-full px-5 py-3.5 text-sm text-red-400 hover:bg-red-50 transition-colors border-t border-[#2D1F1F]/8 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <LogOut size={15} />
                {t.account.logout}
              </button>
            </div>
          </div>

          {/* Main content */}
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-0 border border-[#2D1F1F]/8 rounded-xl overflow-hidden">
              {[
                { label: language === 'en' ? 'Total Orders' : 'إجمالي الطلبات', value: mockOrders.length },
                { label: language === 'en' ? 'Delivered' : 'تم التسليم', value: mockOrders.filter(o => o.status === 'delivered').length },
                { label: language === 'en' ? 'Total Spent' : 'إجمالي الإنفاق', value: `OMR ${mockOrders.reduce((s, o) => s + o.total, 0).toFixed(3)}` },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`p-6 text-center ${i < 2 ? 'border-r border-[#2D1F1F]/8' : ''}`}
                >
                  <p className="text-2xl sm:text-3xl font-serif font-bold text-[#C9A84C] mb-1">{stat.value}</p>
                  <p className="text-[10px] font-black tracking-[0.2em] uppercase text-[#2D1F1F]/40">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Orders */}
            <div className="border border-[#2D1F1F]/8 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#2D1F1F]/8">
                <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-[#2D1F1F]/50">
                  {t.account.orders}
                </h3>
              </div>

              {mockOrders.length === 0 ? (
                <div className="py-16 text-center">
                  <Package size={32} strokeWidth={1} className="text-[#2D1F1F]/15 mx-auto mb-4" />
                  <p className="text-[#2D1F1F]/40 text-sm">{t.account.noOrders}</p>
                </div>
              ) : (
                <div>
                  {mockOrders.map((order, oi) => {
                    const sc = statusConfig[order.status] || statusConfig.processing;
                    return (
                      <div key={order.id} className={`px-6 py-5 ${oi < mockOrders.length - 1 ? 'border-b border-[#2D1F1F]/8' : ''}`}>
                        <div className={`flex items-start justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div>
                            <p className="text-sm font-bold text-[#2D1F1F] tracking-wide">{order.id}</p>
                            <p className="text-xs text-[#2D1F1F]/40 mt-0.5">{order.date}</p>
                          </div>
                          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className={`px-3 py-1 text-[10px] font-black tracking-[0.12em] uppercase rounded-md ${sc.bg} ${sc.text}`}>
                              {sc.label}
                            </span>
                            <span className="text-sm font-bold text-[#2D1F1F]">
                              OMR {order.total.toFixed(3)}
                            </span>
                          </div>
                        </div>

                        {/* Product thumbnails */}
                        <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          {order.items.slice(0, 4).map(item => (
                            <div
                              key={item.product.id}
                              className="relative w-14 h-14 overflow-hidden bg-[#F5F3EF] border border-[#2D1F1F]/8 rounded-md flex-shrink-0"
                            >
                              <Image
                                src={item.product.images[0]}
                                alt={item.product.name}
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            </div>
                          ))}
                          {order.items.length > 4 && (
                            <div className="w-14 h-14 border border-[#2D1F1F]/8 rounded-md flex items-center justify-center text-xs font-bold text-[#2D1F1F]/40 bg-[#FAF7F2]">
                              +{order.items.length - 4}
                            </div>
                          )}
                        </div>

                        {order.trackingNumber && (
                          <p className="text-xs text-[#2D1F1F]/40 mt-3">
                            {language === 'en' ? 'Tracking' : 'التتبع'}:{' '}
                            <span className="font-bold text-[#C9A84C]">{order.trackingNumber}</span>
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Addresses */}
            <div className="border border-[#2D1F1F]/8 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#2D1F1F]/8">
                <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-[#2D1F1F]/50">
                  {t.account.addresses}
                </h3>
                <button className="text-[10px] font-black tracking-[0.2em] uppercase text-[#C9A84C] hover:text-[#2D1F1F] transition-colors">
                  {t.account.addAddress}
                </button>
              </div>
              <div>
                {mockUser.addresses.map((addr, ai) => (
                  <div
                    key={addr.id}
                    className={`px-6 py-5 ${ai < mockUser.addresses.length - 1 ? 'border-b border-[#2D1F1F]/8' : ''}`}
                  >
                    <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div>
                        <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-sm font-bold text-[#2D1F1F]">{addr.label}</span>
                          {addr.isDefault && (
                            <span className="px-2.5 py-0.5 bg-[#C9A84C]/10 text-[#C9A84C] text-[9px] font-black tracking-[0.15em] uppercase rounded-md">
                              {t.account.defaultAddress}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#2D1F1F]/70">{addr.fullName}</p>
                        <p className="text-sm text-[#2D1F1F]/45 mt-0.5">{addr.street}, {addr.city}, {addr.governorate}</p>
                        <p className="text-sm text-[#2D1F1F]/45">{addr.phone}</p>
                      </div>
                      <div className={`flex gap-4 flex-shrink-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <button className="text-[10px] font-bold tracking-[0.1em] uppercase text-[#C9A84C] hover:text-[#2D1F1F] transition-colors">
                          {t.account.editAddress}
                        </button>
                        <button className="text-[10px] font-bold tracking-[0.1em] uppercase text-red-400 hover:text-red-600 transition-colors">
                          {t.account.deleteAddress}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
