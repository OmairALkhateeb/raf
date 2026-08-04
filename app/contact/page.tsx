'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const cx = 'max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16';
const inputClass = 'w-full h-11 px-4 border border-[#2D1F1F]/15 bg-[#FAF7F2] text-sm text-[#2D1F1F] placeholder-[#2D1F1F]/30 rounded-md focus:outline-none focus:border-[#C9A84C] transition-colors';
const labelClass = 'block text-[10px] font-black tracking-[0.2em] uppercase text-[#2D1F1F]/45 mb-2';

export default function ContactPage() {
  const { language, isRTL } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const infoCards = [
    { Icon: Phone, title: { en: 'Phone', ar: 'الهاتف' }, value: '+968 2412 3456' },
    { Icon: Mail, title: { en: 'Email', ar: 'البريد الإلكتروني' }, value: 'hello@raf.om' },
    { Icon: MapPin, title: { en: 'Address', ar: 'العنوان' }, value: language === 'en' ? 'Al Qurum, Muscat, Oman' : 'القرم، مسقط، عُمان' },
    { Icon: Clock, title: { en: 'Working Hours', ar: 'ساعات العمل' }, value: language === 'en' ? 'Sat - Thu, 9AM - 9PM' : 'السبت - الخميس، 9ص - 9م' },
  ];

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Page header */}
      <div className="border-b border-[#2D1F1F]/8 bg-white">
        <div className={`${cx} py-10 sm:py-14`}>
          <span className="block text-[10px] font-black tracking-[0.4em] uppercase text-[#C9A84C] mb-3">
            {language === 'en' ? "We're Here to Help" : 'نحن هنا للمساعدة'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#2D1F1F]">
            {language === 'en' ? 'Contact Us' : 'اتصل بنا'}
          </h1>
          <p className="text-sm text-[#2D1F1F]/45 mt-3 max-w-xl leading-relaxed">
            {language === 'en'
              ? "Questions about an order, a product, or anything else? Send us a message and we'll respond within one business day."
              : 'أسئلة حول طلب أو منتج أو أي شيء آخر؟ أرسل لنا رسالة وسنرد خلال يوم عمل واحد.'}
          </p>
        </div>
      </div>

      <div className={`${cx} py-10 sm:py-14`}>
        <div className="grid lg:grid-cols-[1fr_420px] gap-10 lg:gap-16">
          {/* Form */}
          <div className="border border-[#2D1F1F]/8 rounded-xl p-8">
            <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-[#2D1F1F]/50 mb-7">
              {language === 'en' ? 'Send a Message' : 'أرسل رسالة'}
            </h2>

            {submitted ? (
              <div className="text-center py-16">
                <CheckCircle2 size={40} strokeWidth={1.2} className="text-[#C9A84C] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#2D1F1F] mb-2">
                  {language === 'en' ? 'Message Sent' : 'تم إرسال الرسالة'}
                </h3>
                <p className="text-sm text-[#2D1F1F]/50 leading-relaxed max-w-sm mx-auto">
                  {language === 'en'
                    ? "Thank you for reaching out. Our team will get back to you shortly."
                    : 'شكرًا لتواصلك معنا. سيقوم فريقنا بالرد عليك قريبًا.'}
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
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>{language === 'en' ? 'Full Name' : 'الاسم الكامل'}</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => update('name', e.target.value)}
                      placeholder={language === 'en' ? 'Your name' : 'اسمك'}
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{language === 'en' ? 'Email Address' : 'البريد الإلكتروني'}</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => update('email', e.target.value)}
                      placeholder="you@example.com"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>{language === 'en' ? 'Subject' : 'الموضوع'}</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={e => update('subject', e.target.value)}
                    placeholder={language === 'en' ? 'How can we help?' : 'كيف يمكننا المساعدة؟'}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>{language === 'en' ? 'Message' : 'الرسالة'}</label>
                  <textarea
                    value={form.message}
                    onChange={e => update('message', e.target.value)}
                    rows={6}
                    placeholder={language === 'en' ? 'Write your message here...' : 'اكتب رسالتك هنا...'}
                    required
                    className={`w-full px-4 py-3 border border-[#2D1F1F]/15 bg-[#FAF7F2] text-sm text-[#2D1F1F] placeholder-[#2D1F1F]/30 rounded-md focus:outline-none focus:border-[#C9A84C] transition-colors resize-y min-h-[140px] ${
                      isRTL ? 'text-right' : 'text-left'
                    }`}
                  />
                </div>
                <button
                  type="submit"
                  className={`flex items-center justify-center gap-2.5 h-12 px-8 bg-[#2D1F1F] text-white text-[11px] font-black tracking-[0.25em] uppercase rounded-md hover:bg-[#C9A84C] transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <Send size={14} className={isRTL ? 'rtl-flip' : ''} />
                  {language === 'en' ? 'Send Message' : 'إرسال الرسالة'}
                </button>
              </form>
            )}
          </div>

          {/* Info cards */}
          <div className="space-y-5">
            {infoCards.map(({ Icon, title, value }, i) => (
              <div key={i} className={`border border-[#2D1F1F]/8 rounded-xl p-6 flex items-start gap-4 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                <div className="w-11 h-11 flex items-center justify-center bg-[#C9A84C]/10 rounded-md flex-shrink-0">
                  <Icon size={18} className="text-[#C9A84C]" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-[#2D1F1F]/45 mb-1">
                    {language === 'en' ? title.en : title.ar}
                  </h3>
                  <p className="text-sm font-bold text-[#2D1F1F]">{value}</p>
                </div>
              </div>
            ))}

            <div className="border border-[#2D1F1F]/8 rounded-xl overflow-hidden h-48 bg-[#FAF7F2] flex items-center justify-center">
              <div className="text-center">
                <MapPin size={24} className="text-[#C9A84C] mx-auto mb-2" />
                <p className="text-xs text-[#2D1F1F]/40">
                  {language === 'en' ? 'Al Qurum, Muscat, Oman' : 'القرم، مسقط، عُمان'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
