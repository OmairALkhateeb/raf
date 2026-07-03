'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, CreditCard, Banknote, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';

const cx = 'max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16';

type Step = 'contact' | 'shipping' | 'payment' | 'review';
const STEPS: Step[] = ['contact', 'shipping', 'payment', 'review'];

const inputClass = 'w-full h-11 px-4 border border-[#2D1F1F]/15 bg-[#FAF7F2] text-sm text-[#2D1F1F] placeholder-[#2D1F1F]/30 rounded-md focus:outline-none focus:border-[#C9A84C] transition-colors';
const labelClass = 'block text-[10px] font-black tracking-[0.2em] uppercase text-[#2D1F1F]/45 mb-2';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart, orderNotes, setOrderNotes } = useCart();
  const { language, t, isRTL } = useLanguage();

  const [step, setStep] = useState<Step>('contact');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  const [form, setForm] = useState({
    fullName: 'Mohammed Al-Rashidi',
    email: 'mohammed@example.com',
    phone: '+968 9123 4567',
    street: '123 Al-Qurum Street',
    city: 'Muscat',
    governorate: 'Muscat',
    country: 'Oman',
    zipCode: '100',
    cardNumber: '•••• •••• •••• 4242',
    expiry: '12/27',
    cvv: '•••',
  });

  const stepIndex = STEPS.indexOf(step);
  const shipping = subtotal > 10 ? 0 : 2.0;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const next = () => {
    const nextStep = STEPS[stepIndex + 1];
    if (nextStep) setStep(nextStep);
  };

  const handlePlaceOrder = () => {
    clearCart();
    router.push('/checkout/success');
  };

  const stepLabels: Record<Step, string> = {
    contact: language === 'en' ? 'Contact' : 'التواصل',
    shipping: language === 'en' ? 'Shipping' : 'الشحن',
    payment: language === 'en' ? 'Payment' : 'الدفع',
    review: language === 'en' ? 'Review' : 'المراجعة',
  };

  if (items.length === 0) {
    return (
      <div className={`${cx} py-32 text-center`}>
        <p className="text-[#2D1F1F]/40 text-sm mb-6">{language === 'en' ? 'Your cart is empty' : 'سلتك فارغة'}</p>
        <Link href="/products" className="text-[10px] font-black tracking-[0.25em] uppercase text-[#C9A84C] hover:text-[#2D1F1F] transition-colors">
          {language === 'en' ? 'Continue Shopping' : 'متابعة التسوق'}
        </Link>
      </div>
    );
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Page header */}
      <div className="border-b border-[#2D1F1F]/8 bg-white">
        <div className={`${cx} py-10 sm:py-14`}>
          <span className="block text-[10px] font-black tracking-[0.4em] uppercase text-[#C9A84C] mb-3">
            {language === 'en' ? 'Secure Checkout' : 'الدفع الآمن'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#2D1F1F]">{t.checkout.title}</h1>
        </div>
      </div>

      {/* Steps progress */}
      <div className="border-b border-[#2D1F1F]/8 bg-white">
        <div className={`${cx} h-14 flex items-center`}>
          <div className={`flex items-center gap-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {STEPS.map((s, i) => (
              <div key={s} className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-6 h-6 flex items-center justify-center text-[10px] font-black border rounded-md transition-all ${
                    i < stepIndex
                      ? 'border-[#C9A84C] bg-[#C9A84C] text-white'
                      : i === stepIndex
                      ? 'border-[#2D1F1F] bg-[#2D1F1F] text-white'
                      : 'border-[#2D1F1F]/20 text-[#2D1F1F]/30'
                  }`}>
                    {i < stepIndex ? <CheckCircle size={12} /> : i + 1}
                  </div>
                  <span className={`text-[10px] font-black tracking-[0.15em] uppercase hidden sm:block ${
                    i === stepIndex ? 'text-[#2D1F1F]' : i < stepIndex ? 'text-[#C9A84C]' : 'text-[#2D1F1F]/30'
                  }`}>
                    {stepLabels[s]}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-12 sm:w-20 h-px mx-4 transition-colors ${i < stepIndex ? 'bg-[#C9A84C]' : 'bg-[#2D1F1F]/12'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`${cx} py-10 sm:py-14`}>
        <div className="grid lg:grid-cols-[1fr_380px] gap-10 lg:gap-16">
          {/* Form */}
          <div>
            <AnimatePresence mode="wait">
              {/* Contact */}
              {step === 'contact' && (
                <motion.div key="contact" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
                  <div className="border border-[#2D1F1F]/8 rounded-xl p-8">
                    <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-[#2D1F1F]/50 mb-7">{t.checkout.contactInfo}</h2>
                    <div className="grid sm:grid-cols-2 gap-5">
                      {[
                        { label: t.checkout.fullName, field: 'fullName', span: false },
                        { label: t.checkout.phone, field: 'phone', span: false },
                        { label: t.checkout.email, field: 'email', span: true },
                      ].map(({ label, field, span }) => (
                        <div key={field} className={span ? 'sm:col-span-2' : ''}>
                          <label className={labelClass}>{label}</label>
                          <input
                            type="text"
                            value={form[field as keyof typeof form]}
                            onChange={e => update(field, e.target.value)}
                            className={inputClass}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Shipping */}
              {step === 'shipping' && (
                <motion.div key="shipping" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
                  <div className="border border-[#2D1F1F]/8 rounded-xl p-8">
                    <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-[#2D1F1F]/50 mb-7">{t.checkout.shippingAddress}</h2>
                    <div className="grid sm:grid-cols-2 gap-5">
                      {[
                        { label: t.checkout.street, field: 'street', span: true },
                        { label: t.checkout.city, field: 'city', span: false },
                        { label: t.checkout.governorate, field: 'governorate', span: false },
                        { label: t.checkout.country, field: 'country', span: false },
                        { label: t.checkout.zipCode, field: 'zipCode', span: false },
                      ].map(({ label, field, span }) => (
                        <div key={field} className={span ? 'sm:col-span-2' : ''}>
                          <label className={labelClass}>{label}</label>
                          <input
                            type="text"
                            value={form[field as keyof typeof form]}
                            onChange={e => update(field, e.target.value)}
                            className={inputClass}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Order notes */}
                    <div className="mt-6 pt-6 border-t border-[#2D1F1F]/8">
                      <label className={labelClass}>{t.checkout.orderNotes}</label>
                      <p className="text-xs text-[#2D1F1F]/40 mb-3 leading-relaxed">
                        {t.checkout.orderNotesHint}
                      </p>
                      <textarea
                        value={orderNotes}
                        onChange={e => setOrderNotes(e.target.value)}
                        placeholder={t.checkout.orderNotesPlaceholder}
                        rows={4}
                        className={`w-full px-4 py-3 border border-[#2D1F1F]/15 bg-[#FAF7F2] text-sm text-[#2D1F1F] placeholder-[#2D1F1F]/30 rounded-md focus:outline-none focus:border-[#C9A84C] transition-colors resize-y min-h-[100px] ${
                          isRTL ? 'text-right' : 'text-left'
                        }`}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Payment */}
              {step === 'payment' && (
                <motion.div key="payment" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
                  <div className="border border-[#2D1F1F]/8 rounded-xl p-8">
                    <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-[#2D1F1F]/50 mb-7">{t.checkout.paymentMethod}</h2>
                    <div className="space-y-3 mb-7">
                      {[
                        { value: 'cod' as const, label: t.checkout.cod, icon: Banknote },
                        { value: 'card' as const, label: t.checkout.creditCard, icon: CreditCard },
                      ].map(opt => (
                        <label
                          key={opt.value}
                          className={`flex items-center gap-4 p-5 border-2 rounded-lg cursor-pointer transition-all ${
                            paymentMethod === opt.value
                              ? 'border-[#C9A84C] bg-[#C9A84C]/5'
                              : 'border-[#2D1F1F]/12 hover:border-[#2D1F1F]/30'
                          } ${isRTL ? 'flex-row-reverse' : ''}`}
                        >
                          <input
                            type="radio"
                            value={opt.value}
                            checked={paymentMethod === opt.value}
                            onChange={() => setPaymentMethod(opt.value)}
                            className="accent-[#C9A84C]"
                          />
                          <opt.icon size={18} className={paymentMethod === opt.value ? 'text-[#C9A84C]' : 'text-[#2D1F1F]/35'} />
                          <span className="text-sm font-medium text-[#2D1F1F]">{opt.label}</span>
                        </label>
                      ))}
                    </div>

                    {paymentMethod === 'card' && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 pt-5 border-t border-[#2D1F1F]/8">
                        <div>
                          <label className={labelClass}>{t.checkout.cardNumber}</label>
                          <input type="text" value={form.cardNumber} onChange={e => update('cardNumber', e.target.value)} className={inputClass} />
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                          <div>
                            <label className={labelClass}>{t.checkout.expiry}</label>
                            <input type="text" value={form.expiry} onChange={e => update('expiry', e.target.value)} className={inputClass} />
                          </div>
                          <div>
                            <label className={labelClass}>{t.checkout.cvv}</label>
                            <input type="text" value={form.cvv} onChange={e => update('cvv', e.target.value)} className={inputClass} />
                          </div>
                        </div>
                        <div className={`flex items-center gap-2 text-xs text-[#2D1F1F]/40 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Lock size={11} className="text-[#C9A84C]" />
                          {language === 'en' ? 'Your payment information is encrypted and secure' : 'معلومات الدفع مشفرة وآمنة'}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Review */}
              {step === 'review' && (
                <motion.div key="review" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
                  <div className="border border-[#2D1F1F]/8 rounded-xl p-8">
                    <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-[#2D1F1F]/50 mb-7">{t.checkout.orderReview}</h2>
                    <div className="space-y-4 mb-6">
                      {items.map(item => {
                        const name = language === 'ar' ? item.product.nameAr : item.product.name;
                        return (
                          <div key={item.product.id} className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className="relative w-16 h-16 overflow-hidden bg-[#F5F3EF] rounded-md flex-shrink-0">
                              <Image src={item.product.images[0]} alt={name} fill sizes="64px" className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[#2D1F1F] line-clamp-1">{name}</p>
                              <p className="text-xs text-[#2D1F1F]/40 mt-0.5">
                                {language === 'en' ? 'Qty' : 'الكمية'}: {item.quantity}
                              </p>
                            </div>
                            <span className="text-sm font-bold text-[#2D1F1F]">
                              OMR {(item.product.price * item.quantity).toFixed(3)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="border-t border-[#2D1F1F]/8 pt-5 space-y-3 text-sm">
                      <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-[#2D1F1F]/45">{language === 'en' ? 'Delivery to' : 'التسليم إلى'}</span>
                        <span className="font-medium text-[#2D1F1F]">{form.city}, {form.country}</span>
                      </div>
                      <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-[#2D1F1F]/45">{language === 'en' ? 'Payment' : 'طريقة الدفع'}</span>
                        <span className="font-medium text-[#2D1F1F]">
                          {paymentMethod === 'cod' ? t.checkout.cod : t.checkout.creditCard}
                        </span>
                      </div>
                      {orderNotes.trim() && (
                        <div className={`pt-3 border-t border-[#2D1F1F]/8 ${isRTL ? 'text-right' : 'text-left'}`}>
                          <span className="block text-[10px] font-black tracking-[0.2em] uppercase text-[#2D1F1F]/45 mb-1">
                            {t.checkout.orderNotes}
                          </span>
                          <p className="text-sm text-[#2D1F1F]/70 leading-relaxed whitespace-pre-wrap">
                            {orderNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className={`flex gap-3 mt-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {stepIndex > 0 && (
                <button
                  onClick={() => setStep(STEPS[stepIndex - 1])}
                  className={`flex items-center gap-2 px-6 h-12 border border-[#2D1F1F]/20 rounded-md text-[11px] font-black tracking-[0.2em] uppercase text-[#2D1F1F]/60 hover:border-[#2D1F1F] hover:text-[#2D1F1F] transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <ArrowLeft size={13} className={isRTL ? 'rtl-flip' : ''} />
                  {t.checkout.back}
                </button>
              )}
              {step !== 'review' ? (
                <button
                  onClick={next}
                  className={`flex-1 h-12 bg-[#2D1F1F] text-white text-[11px] font-black tracking-[0.25em] uppercase flex items-center justify-center gap-2.5 rounded-md hover:bg-[#C9A84C] transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  {t.checkout.next}
                  <ChevronRight size={14} className={isRTL ? 'rtl-flip' : ''} />
                </button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handlePlaceOrder}
                  className={`flex-1 h-12 bg-[#C9A84C] text-[#2D1F1F] text-[11px] font-black tracking-[0.25em] uppercase flex items-center justify-center gap-2.5 rounded-md hover:bg-[#2D1F1F] hover:text-white transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <Lock size={13} />
                  {t.checkout.placeOrder}
                </motion.button>
              )}
            </div>
          </div>

          {/* Order summary sidebar */}
          <div>
            <div className="border border-[#2D1F1F]/8 rounded-xl p-6 sticky top-24">
              <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-[#2D1F1F]/50 mb-6">
                {t.cart.orderSummary}
              </h3>

              {/* Item count info */}
              <div className="mb-5 pb-5 border-b border-[#2D1F1F]/8">
                <p className="text-xs text-[#2D1F1F]/40">
                  {items.reduce((s, i) => s + i.quantity, 0)} {language === 'en' ? 'items' : 'عناصر'}
                </p>
              </div>

              <div className="space-y-3.5 mb-5">
                <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-[#2D1F1F]/50">{t.cart.subtotal}</span>
                  <span className="font-medium text-[#2D1F1F]">OMR {subtotal.toFixed(3)}</span>
                </div>
                <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-[#2D1F1F]/50">{t.cart.shipping}</span>
                  <span className={`font-medium ${shipping === 0 ? 'text-[#C9A84C]' : 'text-[#2D1F1F]'}`}>
                    {shipping === 0 ? t.cart.freeShipping : `OMR ${shipping.toFixed(3)}`}
                  </span>
                </div>
                <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-[#2D1F1F]/50">{t.cart.tax}</span>
                  <span className="font-medium text-[#2D1F1F]">OMR {tax.toFixed(3)}</span>
                </div>
              </div>

              <div className="border-t border-[#2D1F1F]/8 pt-5">
                <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-sm font-bold text-[#2D1F1F] uppercase tracking-wide">{t.cart.total}</span>
                  <span className="text-xl font-bold text-[#C9A84C]">OMR {total.toFixed(3)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
