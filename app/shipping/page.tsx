'use client';

import { Truck, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const cx = 'max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16';

const RATES = [
  { region: { en: 'Muscat', ar: 'مسقط' }, time: { en: '1-2 business days', ar: '1-2 يوم عمل' }, fee: { en: 'Free above 10 OMR', ar: 'مجاني فوق 10 ريال' } },
  { region: { en: 'Dhofar', ar: 'ظفار' }, time: { en: '3-5 business days', ar: '3-5 أيام عمل' }, fee: { en: '2.000 OMR', ar: '2.000 ريال' } },
  { region: { en: 'Al Batinah', ar: 'الباطنة' }, time: { en: '2-4 business days', ar: '2-4 أيام عمل' }, fee: { en: '1.500 OMR', ar: '1.500 ريال' } },
  { region: { en: "Ad Dakhiliyah", ar: 'الداخلية' }, time: { en: '2-4 business days', ar: '2-4 أيام عمل' }, fee: { en: '1.500 OMR', ar: '1.500 ريال' } },
  { region: { en: 'Other Governorates', ar: 'محافظات أخرى' }, time: { en: '3-6 business days', ar: '3-6 أيام عمل' }, fee: { en: '2.500 OMR', ar: '2.500 ريال' } },
];

const STEPS = [
  { Icon: ShieldCheck, title: { en: 'Order Confirmed', ar: 'تأكيد الطلب' }, desc: { en: 'Your order is verified and prepared for packing.', ar: 'يتم التحقق من طلبك وتجهيزه للتغليف.' } },
  { Icon: Truck, title: { en: 'Dispatched', ar: 'تم الشحن' }, desc: { en: 'Your package leaves our fulfillment center.', ar: 'تغادر شحنتك مركز التوزيع الخاص بنا.' } },
  { Icon: MapPin, title: { en: 'Out for Delivery', ar: 'قيد التوصيل' }, desc: { en: 'A courier is on the way to your address.', ar: 'المندوب في طريقه إلى عنوانك.' } },
  { Icon: Clock, title: { en: 'Delivered', ar: 'تم التسليم' }, desc: { en: 'Enjoy your order — signature may be required.', ar: 'استمتع بطلبك — قد يلزم التوقيع عند الاستلام.' } },
];

export default function ShippingPage() {
  const { language, isRTL } = useLanguage();

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Page header */}
      <div className="border-b border-[#2D1F1F]/8 bg-white">
        <div className={`${cx} py-10 sm:py-14`}>
          <span className="block text-[10px] font-black tracking-[0.4em] uppercase text-[#C9A84C] mb-3">
            {language === 'en' ? 'Delivery' : 'التوصيل'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#2D1F1F]">
            {language === 'en' ? 'Shipping Information' : 'معلومات الشحن'}
          </h1>
          <p className="text-sm text-[#2D1F1F]/45 mt-3 max-w-xl leading-relaxed">
            {language === 'en'
              ? 'Everything you need to know about how we get your order to your door.'
              : 'كل ما تحتاج معرفته حول كيفية وصول طلبك إلى بابك.'}
          </p>
        </div>
      </div>

      <div className={`${cx} py-10 sm:py-14 space-y-14`}>
        {/* Delivery timeline */}
        <div>
          <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-[#2D1F1F]/50 mb-6">
            {language === 'en' ? 'How Delivery Works' : 'كيف يتم التوصيل'}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map((step, i) => (
              <div key={i} className="border border-[#2D1F1F]/8 rounded-xl p-6 relative">
                <span className="absolute top-4 right-6 text-3xl font-serif font-bold text-[#2D1F1F]/6">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="w-11 h-11 flex items-center justify-center bg-[#C9A84C]/10 rounded-md mb-4">
                  <step.Icon size={18} className="text-[#C9A84C]" />
                </div>
                <h3 className="text-sm font-bold text-[#2D1F1F] mb-1.5">
                  {language === 'en' ? step.title.en : step.title.ar}
                </h3>
                <p className="text-xs text-[#2D1F1F]/45 leading-relaxed">
                  {language === 'en' ? step.desc.en : step.desc.ar}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Rates table */}
        <div>
          <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-[#2D1F1F]/50 mb-6">
            {language === 'en' ? 'Rates & Delivery Times' : 'الأسعار وأوقات التوصيل'}
          </h2>
          <div className="border border-[#2D1F1F]/8 rounded-xl overflow-hidden">
            <div className={`grid grid-cols-3 px-6 py-3.5 bg-[#FAF7F2] border-b border-[#2D1F1F]/8 ${isRTL ? 'text-right' : ''}`}>
              <span className="text-[10px] font-black tracking-[0.15em] uppercase text-[#2D1F1F]/50">
                {language === 'en' ? 'Region' : 'المنطقة'}
              </span>
              <span className="text-[10px] font-black tracking-[0.15em] uppercase text-[#2D1F1F]/50">
                {language === 'en' ? 'Delivery Time' : 'مدة التوصيل'}
              </span>
              <span className="text-[10px] font-black tracking-[0.15em] uppercase text-[#2D1F1F]/50">
                {language === 'en' ? 'Fee' : 'الرسوم'}
              </span>
            </div>
            {RATES.map((rate, i) => (
              <div
                key={i}
                className={`grid grid-cols-3 px-6 py-4 ${i < RATES.length - 1 ? 'border-b border-[#2D1F1F]/8' : ''} ${isRTL ? 'text-right' : ''}`}
              >
                <span className="text-sm font-bold text-[#2D1F1F]">{language === 'en' ? rate.region.en : rate.region.ar}</span>
                <span className="text-sm text-[#2D1F1F]/55">{language === 'en' ? rate.time.en : rate.time.ar}</span>
                <span className="text-sm font-medium text-[#C9A84C]">{language === 'en' ? rate.fee.en : rate.fee.ar}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#2D1F1F]/40 mt-4 leading-relaxed">
            {language === 'en'
              ? 'Business days exclude Fridays and public holidays. Delivery estimates begin once your order is dispatched.'
              : 'أيام العمل لا تشمل أيام الجمعة والعطلات الرسمية. تبدأ تقديرات التوصيل بمجرد شحن طلبك.'}
          </p>
        </div>

        {/* Notes */}
        <div className="border border-[#2D1F1F]/8 rounded-xl p-8 bg-[#FAF7F2]">
          <h3 className="text-sm font-bold text-[#2D1F1F] mb-3">
            {language === 'en' ? 'Good to Know' : 'يجدر بك معرفة'}
          </h3>
          <ul className={`space-y-2.5 text-sm text-[#2D1F1F]/55 leading-relaxed ${isRTL ? 'pr-5' : 'pl-5'}`}>
            <li className="list-disc">
              {language === 'en'
                ? 'A tracking number is sent via SMS and email as soon as your order ships.'
                : 'يتم إرسال رقم تتبع عبر الرسائل النصية والبريد الإلكتروني بمجرد شحن طلبك.'}
            </li>
            <li className="list-disc">
              {language === 'en'
                ? 'Someone must be available to receive the package at the provided address.'
                : 'يجب أن يكون هناك شخص متاح لاستلام الطرد في العنوان المُقدم.'}
            </li>
            <li className="list-disc">
              {language === 'en'
                ? 'Currently we only deliver within the Sultanate of Oman.'
                : 'نقوم حاليًا بالتوصيل داخل سلطنة عمان فقط.'}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
