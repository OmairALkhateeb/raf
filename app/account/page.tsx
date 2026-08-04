'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Package, Heart, MapPin, Settings, LogOut, ChevronRight, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockUser, mockOrders } from '@/data/mockUser';
import { useLanguage } from '@/contexts/LanguageContext';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import type { Address } from '@/types';

const cx = 'max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16';

const inputClass = 'w-full h-11 px-4 border border-[#2D1F1F]/15 bg-[#FAF7F2] text-sm text-[#2D1F1F] placeholder-[#2D1F1F]/30 rounded-md focus:outline-none focus:border-[#C9A84C] transition-colors';
const labelClass = 'block text-[10px] font-black tracking-[0.2em] uppercase text-[#2D1F1F]/45 mb-2';

type AddressForm = Omit<Address, 'id'>;

const emptyForm: AddressForm = {
  label: '',
  fullName: '',
  phone: '',
  street: '',
  city: '',
  governorate: '',
  isDefault: false,
};

export default function AccountPage() {
  const { language, t, isRTL } = useLanguage();
  const { showToast } = useApp();
  const router = useRouter();
  const { user, isAuthenticated, isAuthLoading, logout } = useAuth();

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthLoading, isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    showToast(language === 'en' ? 'Signed out successfully' : 'تم تسجيل الخروج بنجاح', 'success');
    router.push('/');
  };

  const [addresses, setAddresses] = useState<Address[]>(mockUser.addresses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressForm>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const updateForm = (field: keyof AddressForm, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const openAddModal = () => {
    setEditingId(null);
    setForm({ ...emptyForm, isDefault: addresses.length === 0 });
    setIsModalOpen(true);
  };

  const openEditModal = (addr: Address) => {
    setEditingId(addr.id);
    setForm({
      label: addr.label,
      fullName: addr.fullName,
      phone: addr.phone,
      street: addr.street,
      city: addr.city,
      governorate: addr.governorate,
      isDefault: addr.isDefault,
    });
    setIsModalOpen(true);
  };

  const isFormValid =
    form.label.trim() && form.fullName.trim() && form.phone.trim() &&
    form.street.trim() && form.city.trim() && form.governorate.trim();

  const handleSaveAddress = () => {
    if (!isFormValid) return;

    if (editingId) {
      setAddresses(prev =>
        prev.map(a => {
          if (a.id === editingId) return { ...a, ...form };
          return form.isDefault ? { ...a, isDefault: false } : a;
        }),
      );
      showToast(t.account.addressUpdated);
    } else {
      const newAddress: Address = { id: `addr${Date.now()}`, ...form };
      setAddresses(prev => [
        ...prev.map(a => (form.isDefault ? { ...a, isDefault: false } : a)),
        newAddress,
      ]);
      showToast(t.account.addressAdded);
    }
    setIsModalOpen(false);
  };

  const handleDeleteAddress = () => {
    if (!deleteId) return;
    setAddresses(prev => {
      const removed = prev.find(a => a.id === deleteId);
      const remaining = prev.filter(a => a.id !== deleteId);
      if (removed?.isDefault && remaining.length > 0 && !remaining.some(a => a.isDefault)) {
        remaining[0] = { ...remaining[0], isDefault: true };
      }
      return remaining;
    });
    setDeleteId(null);
    showToast(t.account.addressDeleted);
  };

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

  if (isAuthLoading || !isAuthenticated || !user) {
    return (
      <div className={`${cx} py-32 flex items-center justify-center`}>
        <Loader2 size={22} className="animate-spin text-[#C9A84C]" />
      </div>
    );
  }

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
                <Image src={user.avatar} alt={user.name} fill className="object-cover" sizes="80px" />
              </div>
              <h2 className="text-base font-semibold text-[#2D1F1F]">{user.name}</h2>
              <p className="text-xs text-[#2D1F1F]/45 mt-1">{user.email}</p>
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
              <button
                onClick={handleLogout}
                className={`flex items-center gap-3 w-full px-5 py-3.5 text-sm text-red-400 hover:bg-red-50 transition-colors border-t border-[#2D1F1F]/8 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
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
                <button
                  type="button"
                  onClick={openAddModal}
                  className="text-[10px] font-black tracking-[0.2em] uppercase text-[#C9A84C] hover:text-[#2D1F1F] transition-colors"
                >
                  {t.account.addAddress}
                </button>
              </div>
              {addresses.length === 0 ? (
                <div className="py-16 text-center">
                  <MapPin size={32} strokeWidth={1} className="text-[#2D1F1F]/15 mx-auto mb-4" />
                  <p className="text-[#2D1F1F]/40 text-sm">{t.account.noAddresses}</p>
                </div>
              ) : (
                <div>
                  {addresses.map((addr, ai) => (
                    <div
                      key={addr.id}
                      className={`px-6 py-5 ${ai < addresses.length - 1 ? 'border-b border-[#2D1F1F]/8' : ''}`}
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
                          <button
                            type="button"
                            onClick={() => openEditModal(addr)}
                            className="text-[10px] font-bold tracking-[0.1em] uppercase text-[#C9A84C] hover:text-[#2D1F1F] transition-colors"
                          >
                            {t.account.editAddress}
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteId(addr.id)}
                            className="text-[10px] font-bold tracking-[0.1em] uppercase text-red-400 hover:text-red-600 transition-colors"
                          >
                            {t.account.deleteAddress}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit address modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[60]"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              dir={isRTL ? 'rtl' : 'ltr'}
              className="fixed inset-x-4 bottom-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg bg-white rounded-xl shadow-2xl z-[70] overflow-hidden max-h-[90vh] flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-labelledby="address-modal-title"
            >
              <div className={`flex items-center justify-between px-6 py-4 border-b border-[#2D1F1F]/8 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h2 id="address-modal-title" className="text-base font-serif font-bold text-[#2D1F1F]">
                  {editingId ? t.account.editAddressTitle : t.account.addAddressTitle}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-[#2D1F1F]/40 hover:text-[#2D1F1F] transition-colors"
                  aria-label={t.account.cancel}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto">
                <div>
                  <label className={labelClass}>{t.account.addressLabelField}</label>
                  <input
                    type="text"
                    value={form.label}
                    onChange={e => updateForm('label', e.target.value)}
                    placeholder={t.account.addressLabelPlaceholder}
                    className={inputClass}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>{t.checkout.fullName}</label>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={e => updateForm('fullName', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t.checkout.phone}</label>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={e => updateForm('phone', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>{t.checkout.street}</label>
                  <input
                    type="text"
                    value={form.street}
                    onChange={e => updateForm('street', e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>{t.checkout.city}</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={e => updateForm('city', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t.checkout.governorate}</label>
                    <input
                      type="text"
                      value={form.governorate}
                      onChange={e => updateForm('governorate', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <label className={`flex items-center gap-2.5 cursor-pointer select-none ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="checkbox"
                    checked={form.isDefault}
                    onChange={e => updateForm('isDefault', e.target.checked)}
                    className="w-4 h-4 accent-[#C9A84C]"
                  />
                  <span className="text-sm text-[#2D1F1F]/70">{t.account.setAsDefault}</span>
                </label>

                <div className={`flex gap-3 pt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <button
                    type="button"
                    onClick={handleSaveAddress}
                    disabled={!isFormValid}
                    className="flex-1 h-11 bg-[#2D1F1F] text-white text-[11px] font-black tracking-[0.2em] uppercase rounded-md hover:bg-[#C9A84C] hover:text-[#2D1F1F] transition-colors disabled:opacity-40"
                  >
                    {t.account.saveAddress}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 h-11 border border-[#2D1F1F]/15 text-[#2D1F1F] text-[11px] font-black tracking-[0.2em] uppercase rounded-md hover:bg-[#FAF7F2] transition-colors"
                  >
                    {t.account.cancel}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[60]"
              onClick={() => setDeleteId(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              dir={isRTL ? 'rtl' : 'ltr'}
              className="fixed inset-x-4 bottom-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-sm bg-white rounded-xl shadow-2xl z-[70] overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-address-title"
            >
              <div className="p-6">
                <h2 id="delete-address-title" className="text-base font-serif font-bold text-[#2D1F1F] mb-2">
                  {t.account.confirmDeleteAddress}
                </h2>
                <p className="text-sm text-[#2D1F1F]/50 mb-6">{t.account.confirmDeleteAddressDesc}</p>
                <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <button
                    type="button"
                    onClick={handleDeleteAddress}
                    className="flex-1 h-11 bg-red-500 text-white text-[11px] font-black tracking-[0.2em] uppercase rounded-md hover:bg-red-600 transition-colors"
                  >
                    {t.account.deleteAddress}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteId(null)}
                    className="flex-1 h-11 border border-[#2D1F1F]/15 text-[#2D1F1F] text-[11px] font-black tracking-[0.2em] uppercase rounded-md hover:bg-[#FAF7F2] transition-colors"
                  >
                    {t.account.cancel}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
