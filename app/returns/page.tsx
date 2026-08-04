'use client';

import { useState } from 'react';
import { PackageCheck, PackageX, Undo2, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const cx = 'max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16';
const inputClass = 'w-full h-11 px-4 border border-[#2D1F1F]/15 bg-[#FAF7F2] text-sm text-[#2D1F1F] placeholder-[#2D1F1F]/30 rounded-md focus:outline-none focus:border-[#C9A84C] transition-colors';
const labelClass = 'block text-[10px] font-black tracking-[0.2em] uppercase text-[#2D1F1F]/45 mb-2';

const ELIGIBLE = [
  { en: 'Item is unused, unworn, and in its original packaging', ar: 'المنتج غير مستخدم وفي عبوته الأصلية' },
  { en: 'Return is requested within 14 days of delivery', ar: 'تم طلب الإرجاع خلال 14 يومًا من التسليم' },
  { en: 'Original receipt or order number is provided', ar: 'تقديم الإيصال الأصلي أو رقم الطلب' },
];

const NOT_ELIGIBLE = [
  { en: 'Items marked as final sale or clearance', ar: 'المنتجات المُصنّفة كبيع نهائي أو تصفية' },
  { en: 'Fragrances or cosmetics with broken seals', ar: 'العطور أو مستحضرات التجميل ذات الأختام المكسورة' },
  { en: 'Gift cards and personalized items', ar: 'بطاقات الهدايا والمنتجات المخصصة' },
];

export default function ReturnsPage() {
  const { language, isRTL } = useLanguage();
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Page header */}
      <div className="border-b border-[#2D1F1F]/8 bg-white">
        <div className={`${cx} py-10 sm:py-14`}>
          <span className="block text-[10px] font-black tracking-[0.4em] uppercase text-[#C9A84C] mb-3">
            {language === 'en' ? 'Customer Care' : 'خدمة العملاء'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#2D1F1F]">
            {language === 'en' ? 'Returns & Exchanges' : 'الإرجاع والاستبدال'}
          </h1>
          <p className="text-sm text-[#2D1F1F]/45 mt-3 max-w-xl leading-relaxed">
            {language === 'en'
              ? "Not quite right? Start a return below and we'll take care of the rest."
              : 'ليس كما توقعت؟ ابدأ عملية الإرجاع أدناه وسنتولى الباقي.'}
          </p>
        </div>
      </div>

      <div className={`${cx} py-10 sm:py-14`}>
        <div className="grid lg:grid-cols-[1fr_420px] gap-10 lg:gap-16">
          {/* Policy */}
          <div className="space-y-8">
            <div>
              <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-[#2D1F1F]/50 mb-6">
                {language === 'en' ? 'Return Policy' : 'سياسة الإرجاع'}
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="border border-[#2D1F1F]/8 rounded-xl p-6">
                  <div className="w-11 h-11 flex items-center justify-center bg-[#C9A84C]/10 rounded-md mb-4">
                    <PackageCheck size={18} className="text-[#C9A84C]" />
                  </div>
                  <h3 className="text-sm font-bold text-[#2D1F1F] mb-3">
                    {language === 'en' ? 'Eligible for Return' : 'مؤهل للإرجاع'}
                  </h3>
                  <ul className="space-y-2 text-sm text-[#2D1F1F]/55 leading-relaxed">
                    {ELIGIBLE.map((item, i) => (
                      <li key={i} className={`flex gap-2.5 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                        <span className="text-[#C9A84C] flex-shrink-0">✓</span>
                        {language === 'en' ? item.en : item.ar}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border border-[#2D1F1F]/8 rounded-xl p-6">
                  <div className="w-11 h-11 flex items-center justify-center bg-red-50 rounded-md mb-4">
                    <PackageX size={18} className="text-red-400" />
                  </div>
                  <h3 className="text-sm font-bold text-[#2D1F1F] mb-3">
                    {language === 'en' ? 'Not Eligible' : 'غير مؤهل'}
                  </h3>
                  <ul className="space-y-2 text-sm text-[#2D1F1F]/55 leading-relaxed">
                    {NOT_ELIGIBLE.map((item, i) => (
                      <li key={i} className={`flex gap-2.5 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                        <span className="text-red-400 flex-shrink-0">✕</span>
                        {language === 'en' ? item.en : item.ar}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="border border-[#2D1F1F]/8 rounded-xl p-8 bg-[#FAF7F2]">
              <h3 className="text-sm font-bold text-[#2D1F1F] mb-4">
                {language === 'en' ? 'How Refunds Work' : 'كيف تتم استعادة المبلغ'}
              </h3>
              <p className="text-sm text-[#2D1F1F]/55 leading-relaxed mb-3">
                {language === 'en'
                  ? 'Once we receive and inspect your returned item, your refund will be processed within 5-7 business days to your original payment method. Cash on delivery orders are refunded via bank transfer.'
                  : 'بمجرد استلام المنتج المرتجع وفحصه، سيتم معالجة استرداد المبلغ خلال 5-7 أيام عمل إلى طريقة الدفع الأصلية. طلبات الدفع عند الاستلام تُسترد عبر التحويل البنكي.'}
              </p>
              <p className="text-sm text-[#2D1F1F]/55 leading-relaxed">
                {language === 'en'
                  ? 'Exchanges for a different size or color are processed as soon as the original item is received.'
                  : 'يتم معالجة الاستبدال بمقاس أو لون مختلف بمجرد استلام المنتج الأصلي.'}
              </p>
            </div>
          </div>

          {/* Return request form */}
          <div>
            <div className="border border-[#2D1F1F]/8 rounded-xl p-8 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <Undo2 size={18} className="text-[#C9A84C]" />
                <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-[#2D1F1F]/50">
                  {language === 'en' ? 'Start a Return' : 'ابدأ عملية إرجاع'}
                </h2>
              </div>

              {submitted ? (
                <div className="text-center py-8">
                  <PackageCheck size={36} strokeWidth={1.2} className="text-[#C9A84C] mx-auto mb-4" />
                  <h3 className="text-base font-bold text-[#2D1F1F] mb-2">
                    {language === 'en' ? 'Request Received' : 'تم استلام الطلب'}
                  </h3>
                  <p className="text-sm text-[#2D1F1F]/50 leading-relaxed">
                    {language === 'en'
                      ? "We'll email you pickup instructions within 24 hours."
                      : 'سنرسل لك تعليمات الاستلام عبر البريد الإلكتروني خلال 24 ساعة.'}
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                  className="space-y-5"
                >
                  <div>
                    <label className={labelClass}>{language === 'en' ? 'Order Number' : 'رقم الطلب'}</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={orderNumber}
                        onChange={e => setOrderNumber(e.target.value)}
                        placeholder="RAF-000000"
                        required
                        className={`${inputClass} ${isRTL ? 'pr-4 pl-10' : 'pl-4 pr-10'}`}
                      />
                      <Search size={15} className={`absolute top-1/2 -translate-y-1/2 text-[#2D1F1F]/25 ${isRTL ? 'left-3.5' : 'right-3.5'}`} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>{language === 'en' ? 'Email Address' : 'البريد الإلكتروني'}</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{language === 'en' ? 'Reason for Return' : 'سبب الإرجاع'}</label>
                    <textarea
                      value={reason}
                      onChange={e => setReason(e.target.value)}
                      rows={4}
                      placeholder={language === 'en' ? 'Tell us what went wrong...' : 'أخبرنا بما حدث...'}
                      className={`w-full px-4 py-3 border border-[#2D1F1F]/15 bg-[#FAF7F2] text-sm text-[#2D1F1F] placeholder-[#2D1F1F]/30 rounded-md focus:outline-none focus:border-[#C9A84C] transition-colors resize-y min-h-[100px] ${
                        isRTL ? 'text-right' : 'text-left'
                      }`}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full h-12 bg-[#2D1F1F] text-white text-[11px] font-black tracking-[0.25em] uppercase rounded-md hover:bg-[#C9A84C] transition-colors"
                  >
                    {language === 'en' ? 'Submit Request' : 'إرسال الطلب'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
