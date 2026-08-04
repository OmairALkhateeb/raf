'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, HelpCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const cx = 'max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16';

interface FaqItem {
  q: { en: string; ar: string };
  a: { en: string; ar: string };
}

interface FaqCategory {
  title: { en: string; ar: string };
  items: FaqItem[];
}

const CATEGORIES: FaqCategory[] = [
  {
    title: { en: 'Orders & Payment', ar: 'الطلبات والدفع' },
    items: [
      {
        q: { en: 'How do I place an order?', ar: 'كيف يمكنني تقديم طلب؟' },
        a: {
          en: 'Browse our collection, add items to your cart, and follow the checkout steps to confirm your shipping details and payment method.',
          ar: 'تصفح مجموعتنا، أضف المنتجات إلى سلتك، واتبع خطوات الدفع لتأكيد تفاصيل الشحن وطريقة الدفع.',
        },
      },
      {
        q: { en: 'What payment methods do you accept?', ar: 'ما هي طرق الدفع المتاحة؟' },
        a: {
          en: 'We accept cash on delivery and all major credit and debit cards for a secure checkout experience.',
          ar: 'نقبل الدفع عند الاستلام وجميع بطاقات الائتمان والخصم الرئيسية لتجربة دفع آمنة.',
        },
      },
      {
        q: { en: 'Can I change or cancel my order?', ar: 'هل يمكنني تغيير أو إلغاء طلبي؟' },
        a: {
          en: 'Orders can be modified or cancelled within 1 hour of placement by contacting our customer service team.',
          ar: 'يمكن تعديل أو إلغاء الطلبات خلال ساعة واحدة من تقديمها عن طريق التواصل مع فريق خدمة العملاء.',
        },
      },
    ],
  },
  {
    title: { en: 'Shipping & Delivery', ar: 'الشحن والتوصيل' },
    items: [
      {
        q: { en: 'How long does delivery take?', ar: 'كم تستغرق مدة التوصيل؟' },
        a: {
          en: 'Orders within Muscat typically arrive within 1-2 business days. Other governorates in Oman receive deliveries within 3-5 business days.',
          ar: 'تصل الطلبات داخل مسقط عادة خلال 1-2 يوم عمل. المحافظات الأخرى في عمان تستلم طلباتها خلال 3-5 أيام عمل.',
        },
      },
      {
        q: { en: 'Is shipping free?', ar: 'هل الشحن مجاني؟' },
        a: {
          en: 'Yes, shipping is free on all orders above 10 OMR. Orders below this amount incur a flat delivery fee.',
          ar: 'نعم، الشحن مجاني لجميع الطلبات فوق 10 ريال عماني. الطلبات الأقل من هذا المبلغ يتم فرض رسوم توصيل ثابتة عليها.',
        },
      },
      {
        q: { en: 'Do you ship outside Oman?', ar: 'هل تشحنون خارج عمان؟' },
        a: {
          en: 'Currently we only deliver within the Sultanate of Oman. We are working on expanding to GCC countries soon.',
          ar: 'نقوم حاليًا بالتوصيل داخل سلطنة عمان فقط. نعمل على التوسع لدول الخليج قريبًا.',
        },
      },
    ],
  },
  {
    title: { en: 'Returns & Exchanges', ar: 'الإرجاع والاستبدال' },
    items: [
      {
        q: { en: 'What is your return policy?', ar: 'ما هي سياسة الإرجاع؟' },
        a: {
          en: 'You may return unused items in their original packaging within 14 days of delivery for a full refund.',
          ar: 'يمكنك إرجاع المنتجات غير المستخدمة في عبواتها الأصلية خلال 14 يومًا من التسليم لاسترداد كامل المبلغ.',
        },
      },
      {
        q: { en: 'How do I start a return?', ar: 'كيف أبدأ عملية إرجاع؟' },
        a: {
          en: 'Visit the Returns page, fill in your order number, and our team will arrange a pickup or provide drop-off instructions.',
          ar: 'قم بزيارة صفحة الإرجاع، وأدخل رقم طلبك، وسيقوم فريقنا بترتيب الاستلام أو تزويدك بتعليمات التسليم.',
        },
      },
    ],
  },
  {
    title: { en: 'Products', ar: 'المنتجات' },
    items: [
      {
        q: { en: 'Are your products authentic?', ar: 'هل منتجاتكم أصلية؟' },
        a: {
          en: 'All products sold on RAF are 100% authentic and sourced directly from authorized brand partners.',
          ar: 'جميع المنتجات المباعة على رف أصلية 100% ويتم الحصول عليها مباشرة من شركاء العلامات التجارية المعتمدين.',
        },
      },
      {
        q: { en: 'How can I check product availability?', ar: 'كيف يمكنني معرفة توفر المنتج؟' },
        a: {
          en: 'Stock status is shown on every product page. If an item is out of stock, you can request a notification for when it returns.',
          ar: 'يظهر حالة توفر المنتج في صفحة كل منتج. إذا كان المنتج غير متوفر، يمكنك طلب إشعار عند توفره مجددًا.',
        },
      },
    ],
  },
];

export default function FaqPage() {
  const { language, isRTL } = useLanguage();
  const [openKey, setOpenKey] = useState<string | null>('0-0');

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Page header */}
      <div className="border-b border-[#2D1F1F]/8 bg-white">
        <div className={`${cx} py-10 sm:py-14`}>
          <span className="block text-[10px] font-black tracking-[0.4em] uppercase text-[#C9A84C] mb-3">
            {language === 'en' ? 'Help Center' : 'مركز المساعدة'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#2D1F1F]">
            {language === 'en' ? 'Frequently Asked Questions' : 'الأسئلة الشائعة'}
          </h1>
          <p className="text-sm text-[#2D1F1F]/45 mt-3 max-w-xl leading-relaxed">
            {language === 'en'
              ? 'Find quick answers about orders, shipping, returns, and our products.'
              : 'اعثر على إجابات سريعة حول الطلبات والشحن والإرجاع ومنتجاتنا.'}
          </p>
        </div>
      </div>

      <div className={`${cx} py-10 sm:py-14`}>
        <div className="grid lg:grid-cols-[220px_1fr] gap-10 lg:gap-14" style={{ alignItems: 'start' }}>
          {/* Category nav (visual, non-functional anchors) */}
          <div className="hidden lg:block sticky top-24">
            <div className="border border-[#2D1F1F]/8 rounded-xl overflow-hidden">
              {CATEGORIES.map((cat, i) => (
                <a
                  key={i}
                  href={`#cat-${i}`}
                  className={`block px-5 py-3.5 text-sm font-medium text-[#2D1F1F]/70 hover:text-[#C9A84C] hover:bg-[#FAF7F2] transition-colors ${
                    i < CATEGORIES.length - 1 ? 'border-b border-[#2D1F1F]/8' : ''
                  }`}
                >
                  {language === 'en' ? cat.title.en : cat.title.ar}
                </a>
              ))}
            </div>

            <div className="mt-6 border border-[#2D1F1F]/8 rounded-xl p-6 bg-[#FAF7F2]">
              <HelpCircle size={20} className="text-[#C9A84C] mb-3" />
              <p className="text-sm text-[#2D1F1F]/60 leading-relaxed mb-4">
                {language === 'en' ? "Still need help? Our team is here for you." : 'ما زلت بحاجة للمساعدة؟ فريقنا هنا من أجلك.'}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-[11px] font-black tracking-[0.15em] uppercase text-[#C9A84C] hover:text-[#2D1F1F] transition-colors"
              >
                {language === 'en' ? 'Contact Us' : 'اتصل بنا'}
                <ArrowRight size={13} className={isRTL ? 'rtl-flip' : ''} />
              </Link>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-10">
            {CATEGORIES.map((cat, ci) => (
              <div key={ci} id={`cat-${ci}`}>
                <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-[#2D1F1F]/50 mb-4">
                  {language === 'en' ? cat.title.en : cat.title.ar}
                </h2>
                <div className="border border-[#2D1F1F]/8 rounded-xl overflow-hidden">
                  {cat.items.map((item, ii) => {
                    const key = `${ci}-${ii}`;
                    const isOpen = openKey === key;
                    return (
                      <div key={key} className={ii < cat.items.length - 1 ? 'border-b border-[#2D1F1F]/8' : ''}>
                        <button
                          onClick={() => setOpenKey(isOpen ? null : key)}
                          className={`w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-[#FAF7F2] transition-colors ${
                            isRTL ? 'flex-row-reverse text-right' : ''
                          }`}
                        >
                          <span className="text-sm font-bold text-[#2D1F1F]">
                            {language === 'en' ? item.q.en : item.q.ar}
                          </span>
                          <Plus
                            size={16}
                            className={`flex-shrink-0 text-[#C9A84C] transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <p className="px-6 pb-5 text-sm text-[#2D1F1F]/55 leading-relaxed">
                                {language === 'en' ? item.a.en : item.a.ar}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
