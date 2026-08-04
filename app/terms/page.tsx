'use client';

import { FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const cx = 'max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16';

const SECTIONS = [
  {
    title: { en: 'Acceptance of Terms', ar: 'قبول الشروط' },
    body: {
      en: 'By accessing and using the RAF website, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services.',
      ar: 'من خلال الوصول إلى موقع رف واستخدامه، فإنك تقبل وتوافق على الالتزام بشروط الخدمة هذه. إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام موقعنا أو خدماتنا.',
    },
  },
  {
    title: { en: 'Products & Pricing', ar: 'المنتجات والأسعار' },
    body: {
      en: 'All products are subject to availability. We reserve the right to discontinue any product at any time. Prices for our products are subject to change without notice. We reserve the right to modify or refuse any order placed on our website.',
      ar: 'جميع المنتجات خاضعة للتوفر. نحتفظ بالحق في إيقاف أي منتج في أي وقت. أسعار منتجاتنا قابلة للتغيير دون إشعار مسبق. نحتفظ بالحق في تعديل أو رفض أي طلب يتم تقديمه على موقعنا.',
    },
  },
  {
    title: { en: 'Orders & Payment', ar: 'الطلبات والدفع' },
    body: {
      en: 'By placing an order, you confirm that all information provided is accurate and complete. We accept cash on delivery and major credit/debit cards. Payment must be received in full before an order is dispatched, except for cash on delivery orders.',
      ar: 'من خلال تقديم طلب، فإنك تؤكد أن جميع المعلومات المقدمة دقيقة وكاملة. نقبل الدفع عند الاستلام وبطاقات الائتمان/الخصم الرئيسية. يجب استلام الدفعة كاملة قبل شحن الطلب، باستثناء طلبات الدفع عند الاستلام.',
    },
  },
  {
    title: { en: 'Shipping & Returns', ar: 'الشحن والإرجاع' },
    body: {
      en: 'Shipping timeframes are estimates and not guaranteed. Please refer to our Shipping Information and Returns pages for detailed policies regarding delivery and eligibility for returns or exchanges.',
      ar: 'الأطر الزمنية للشحن تقديرية وغير مضمونة. يرجى الرجوع إلى صفحتي معلومات الشحن والإرجاع للاطلاع على السياسات التفصيلية المتعلقة بالتسليم وأهلية الإرجاع أو الاستبدال.',
    },
  },
  {
    title: { en: 'Intellectual Property', ar: 'الملكية الفكرية' },
    body: {
      en: 'All content on this website, including text, graphics, logos, images, and software, is the property of RAF or its content suppliers and is protected by international copyright laws.',
      ar: 'جميع المحتويات الموجودة على هذا الموقع، بما في ذلك النصوص والرسومات والشعارات والصور والبرامج، هي ملك لرف أو موردي المحتوى الخاصين بها ومحمية بموجب قوانين حقوق النشر الدولية.',
    },
  },
  {
    title: { en: 'Limitation of Liability', ar: 'حدود المسؤولية' },
    body: {
      en: 'RAF shall not be liable for any indirect, incidental, special, or consequential damages arising out of or related to the use of our website or products, to the fullest extent permitted by applicable law.',
      ar: 'لن تكون رف مسؤولة عن أي أضرار غير مباشرة أو عرضية أو خاصة أو تبعية تنشأ عن استخدام موقعنا أو منتجاتنا أو تتعلق به، إلى أقصى حد يسمح به القانون المعمول به.',
    },
  },
  {
    title: { en: 'Governing Law', ar: 'القانون الحاكم' },
    body: {
      en: 'These Terms of Service are governed by and construed in accordance with the laws of the Sultanate of Oman, and any disputes will be subject to the exclusive jurisdiction of the Omani courts.',
      ar: 'تخضع شروط الخدمة هذه وتُفسّر وفقًا لقوانين سلطنة عُمان، وتخضع أي نزاعات للاختصاص القضائي الحصري للمحاكم العُمانية.',
    },
  },
  {
    title: { en: 'Changes to Terms', ar: 'التغييرات على الشروط' },
    body: {
      en: 'We reserve the right to update these Terms of Service at any time. Continued use of the website after changes are posted constitutes your acceptance of the revised terms.',
      ar: 'نحتفظ بالحق في تحديث شروط الخدمة هذه في أي وقت. يُعد الاستمرار في استخدام الموقع بعد نشر التغييرات موافقة منك على الشروط المُعدّلة.',
    },
  },
];

export default function TermsPage() {
  const { language, isRTL } = useLanguage();

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Page header */}
      <div className="border-b border-[#2D1F1F]/8 bg-white">
        <div className={`${cx} py-10 sm:py-14`}>
          <span className="block text-[10px] font-black tracking-[0.4em] uppercase text-[#C9A84C] mb-3">
            {language === 'en' ? 'Legal' : 'قانوني'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#2D1F1F]">
            {language === 'en' ? 'Terms of Service' : 'شروط الخدمة'}
          </h1>
          <p className="text-sm text-[#2D1F1F]/45 mt-3">
            {language === 'en' ? 'Last updated: January 1, 2026' : 'آخر تحديث: 1 يناير 2026'}
          </p>
        </div>
      </div>

      <div className={`${cx} py-10 sm:py-14`}>
        <div className="grid lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16">
          {/* Intro card */}
          <div className="border border-[#2D1F1F]/8 rounded-xl p-8 bg-[#FAF7F2] h-fit sticky top-24">
            <div className="w-11 h-11 flex items-center justify-center bg-[#C9A84C]/10 rounded-md mb-4">
              <FileText size={18} className="text-[#C9A84C]" />
            </div>
            <h2 className="text-base font-bold text-[#2D1F1F] mb-3">
              {language === 'en' ? 'Please Read Carefully' : 'يرجى القراءة بعناية'}
            </h2>
            <p className="text-sm text-[#2D1F1F]/55 leading-relaxed">
              {language === 'en'
                ? 'These terms govern your use of the RAF website and outline the rules for orders, shipping, and content on our platform.'
                : 'تحكم هذه الشروط استخدامك لموقع رف وتوضح القواعد المتعلقة بالطلبات والشحن والمحتوى على منصتنا.'}
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {SECTIONS.map((section, i) => (
              <div key={i} className={i < SECTIONS.length - 1 ? 'pb-10 border-b border-[#2D1F1F]/8' : ''}>
                <h3 className="text-lg font-serif text-[#2D1F1F] mb-3">
                  {String(i + 1).padStart(2, '0')}. {language === 'en' ? section.title.en : section.title.ar}
                </h3>
                <p className="text-sm text-[#2D1F1F]/55 leading-relaxed">
                  {language === 'en' ? section.body.en : section.body.ar}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
