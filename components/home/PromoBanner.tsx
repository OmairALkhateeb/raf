'use client';

import { motion } from 'framer-motion';
import { Truck, ShieldCheck, CreditCard, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PromoBanner() {
  const { language, isRTL } = useLanguage();

  const promos = [
    {
      icon: Truck,
      title: language === 'en' ? 'Complimentary Shipping' : 'شحن مجاني',
      desc: language === 'en' ? 'On all orders above OMR 10' : 'لجميع الطلبات فوق 10 ر.ع.',
    },
    {
      icon: ShieldCheck,
      title: language === 'en' ? 'Authenticated Products' : 'منتجات موثقة',
      desc: language === 'en' ? '100% genuine Omani brands' : '100% علامات تجارية عمانية',
    },
    {
      icon: CreditCard,
      title: language === 'en' ? 'Secure Checkout' : 'دفع آمن',
      desc: language === 'en' ? 'Encrypted & protected payments' : 'مدفوعات مشفرة ومحمية',
    },
    {
      icon: RotateCcw,
      title: language === 'en' ? 'Easy Returns' : 'إرجاع سهل',
      desc: language === 'en' ? '14-day hassle-free returns' : 'إرجاع مجاني خلال 14 يوم',
    },
  ];

  return (
    <section className="border-y border-[#2D1F1F]/8 bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#2D1F1F]/8">
          {promos.map((promo, i) => {
            const Icon = promo.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className={`flex items-center gap-4 py-6 px-6 sm:px-8 ${isRTL ? 'flex-row-reverse text-right' : ''}`}
              >
                <div className="w-10 h-10 rounded-full border border-[#C9A84C]/30 flex items-center justify-center flex-shrink-0">
                  <Icon size={17} className="text-[#C9A84C]" />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-wide text-[#2D1F1F] uppercase">{promo.title}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">{promo.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
