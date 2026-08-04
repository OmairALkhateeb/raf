'use client';

import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const cx = 'max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16';

const SECTIONS = [
  {
    title: { en: 'Information We Collect', ar: 'المعلومات التي نجمعها' },
    body: {
      en: 'We collect information you provide directly to us, such as your name, email address, phone number, and shipping address when you create an account, place an order, or contact customer service. We also automatically collect certain information about your device and how you interact with our site, including IP address, browser type, and pages viewed.',
      ar: 'نقوم بجمع المعلومات التي تقدمها لنا مباشرة، مثل اسمك وبريدك الإلكتروني ورقم هاتفك وعنوان الشحن عند إنشاء حساب أو تقديم طلب أو التواصل مع خدمة العملاء. كما نجمع تلقائيًا معلومات معينة عن جهازك وكيفية تفاعلك مع موقعنا، بما في ذلك عنوان IP ونوع المتصفح والصفحات التي تمت مشاهدتها.',
    },
  },
  {
    title: { en: 'How We Use Your Information', ar: 'كيف نستخدم معلوماتك' },
    body: {
      en: 'We use the information we collect to process and fulfill your orders, communicate with you about your account and purchases, improve our products and services, and send you marketing communications when you have opted in to receive them.',
      ar: 'نستخدم المعلومات التي نجمعها لمعالجة طلباتك وتنفيذها، والتواصل معك بشأن حسابك ومشترياتك، وتحسين منتجاتنا وخدماتنا، وإرسال رسائل تسويقية لك عند موافقتك على استلامها.',
    },
  },
  {
    title: { en: 'Sharing Your Information', ar: 'مشاركة معلوماتك' },
    body: {
      en: 'We do not sell your personal information. We may share your information with trusted third-party service providers who assist us in operating our website, conducting our business, or servicing you, such as shipping couriers and payment processors, subject to confidentiality obligations.',
      ar: 'نحن لا نبيع معلوماتك الشخصية. قد نشارك معلوماتك مع مزودي خدمة موثوقين يساعدوننا في تشغيل موقعنا أو إدارة أعمالنا أو خدمتك، مثل شركات الشحن ومعالجات الدفع، وذلك وفقًا لالتزامات السرية.',
    },
  },
  {
    title: { en: 'Data Security', ar: 'أمان البيانات' },
    body: {
      en: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Payment information is encrypted using industry-standard protocols.',
      ar: 'نطبق تدابير تقنية وتنظيمية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التعديل أو الإفصاح أو الإتلاف. يتم تشفير معلومات الدفع باستخدام بروتوكولات معيارية في هذا المجال.',
    },
  },
  {
    title: { en: 'Cookies', ar: 'ملفات تعريف الارتباط' },
    body: {
      en: 'We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors are coming from. You can control cookies through your browser settings.',
      ar: 'نستخدم ملفات تعريف الارتباط وتقنيات تتبع مماثلة لتحسين تجربة التصفح وتحليل حركة المرور على الموقع وفهم مصادر زوارنا. يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات متصفحك.',
    },
  },
  {
    title: { en: 'Your Rights', ar: 'حقوقك' },
    body: {
      en: 'You have the right to access, correct, or delete your personal information at any time by visiting your account settings or contacting our customer service team. You may also opt out of marketing communications at any time.',
      ar: 'لديك الحق في الوصول إلى معلوماتك الشخصية أو تصحيحها أو حذفها في أي وقت من خلال زيارة إعدادات حسابك أو التواصل مع فريق خدمة العملاء. يمكنك أيضًا إلغاء الاشتراك في الرسائل التسويقية في أي وقت.',
    },
  },
  {
    title: { en: 'Changes to This Policy', ar: 'التغييرات على هذه السياسة' },
    body: {
      en: 'We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page with an updated revision date.',
      ar: 'قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنقوم بإخطارك بأي تغييرات جوهرية عن طريق نشر السياسة الجديدة في هذه الصفحة مع تاريخ مراجعة محدث.',
    },
  },
];

export default function PrivacyPage() {
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
            {language === 'en' ? 'Privacy Policy' : 'سياسة الخصوصية'}
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
              <ShieldCheck size={18} className="text-[#C9A84C]" />
            </div>
            <h2 className="text-base font-bold text-[#2D1F1F] mb-3">
              {language === 'en' ? 'Your Privacy Matters' : 'خصوصيتك تهمنا'}
            </h2>
            <p className="text-sm text-[#2D1F1F]/55 leading-relaxed">
              {language === 'en'
                ? 'This policy explains how RAF collects, uses, and protects your personal information when you use our website and services.'
                : 'توضح هذه السياسة كيفية جمع رف لمعلوماتك الشخصية واستخدامها وحمايتها عند استخدامك لموقعنا وخدماتنا.'}
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
