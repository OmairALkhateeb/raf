'use client';

import Link from 'next/link';
import { Package, Home, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const cx = 'max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16';

export default function CheckoutSuccessPage() {
  const { t, isRTL, language } = useLanguage();
  const orderId = `ORD-2025-${Math.floor(Math.random() * 900 + 100)}`;

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Top bar */}
      <div className="border-b border-[#2D1F1F]/8 bg-white">
        <div className={`${cx} py-10 sm:py-14`}>
          <span className="block text-[10px] font-black tracking-[0.4em] uppercase text-[#C9A84C] mb-3">
            {language === 'en' ? 'Order Placed' : 'تم الطلب'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#2D1F1F]">{t.checkout.orderConfirmed}</h1>
        </div>
      </div>

      <div className={`${cx} py-16 sm:py-24`}>
        <div className="max-w-lg mx-auto text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 180, damping: 14 }}
            className="mb-8"
          >
            <div className="w-20 h-20 bg-[#C9A84C]/10 flex items-center justify-center mx-auto rounded-full">
              <CheckCircle size={40} className="text-[#C9A84C]" strokeWidth={1.5} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            <p className="text-[#2D1F1F]/50 text-sm mb-2 leading-relaxed">{t.checkout.orderConfirmedDesc}</p>
            <p className="text-sm font-bold text-[#C9A84C] tracking-widest mb-10">#{orderId}</p>

            {/* Steps */}
            <div className="border border-[#2D1F1F]/8 rounded-xl p-8 mb-8 text-left">
              <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-[#2D1F1F]/45 mb-6">
                {language === 'en' ? "What happens next?" : "ماذا يحدث بعد ذلك؟"}
              </h3>
              <div className="space-y-5">
                {[
                  language === 'en' ? 'You will receive a confirmation email shortly' : 'ستتلقى رسالة تأكيد بالبريد الإلكتروني قريباً',
                  language === 'en' ? 'Your order will be carefully prepared and packed' : 'سيتم تجهيز طلبك وتغليفه بعناية',
                  language === 'en' ? 'Delivery within 2–4 business days' : 'التسليم خلال 2–4 أيام عمل',
                ].map((text, i) => (
                  <div key={i} className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                    <div className="w-6 h-6 bg-[#C9A84C] text-white text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5 rounded-md">
                      {i + 1}
                    </div>
                    <p className="text-sm text-[#2D1F1F]/65 leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Link
                href="/account"
                className="flex-1 h-12 border border-[#2D1F1F]/20 rounded-md text-[#2D1F1F] text-[11px] font-black tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:border-[#2D1F1F] hover:bg-[#2D1F1F] hover:text-white transition-colors"
              >
                <Package size={14} />
                {t.checkout.trackOrder}
              </Link>
              <Link
                href="/"
                className="flex-1 h-12 bg-[#C9A84C] text-[#2D1F1F] text-[11px] font-black tracking-[0.2em] uppercase flex items-center justify-center gap-2 rounded-md hover:bg-[#2D1F1F] hover:text-white transition-colors"
              >
                <Home size={14} />
                {t.checkout.continueShopping}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
