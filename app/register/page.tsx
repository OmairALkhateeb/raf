'use client';

import { useState, FormEvent, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User as UserIcon, Mail, Lock, Phone, Eye, EyeOff, ArrowRight, Loader2, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useApp } from '@/contexts/AppContext';

const cx = 'max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16';
const inputClass = 'w-full h-12 border border-[#2D1F1F]/15 bg-[#FAF7F2] text-sm text-[#2D1F1F] placeholder-[#2D1F1F]/30 rounded-md focus:outline-none focus:border-[#C9A84C] transition-colors';
const labelClass = 'block text-[10px] font-black tracking-[0.2em] uppercase text-[#2D1F1F]/45 mb-2';

interface FormState {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

function getPasswordStrength(password: string): 0 | 1 | 2 | 3 {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) score++;
  if (password.length >= 10 && /[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 3) as 0 | 1 | 2 | 3;
}

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { language, isRTL } = useLanguage();
  const { showToast } = useApp();

  const tr = (en: string, ar: string) => (language === 'ar' ? ar : en);

  const [form, setForm] = useState<FormState>({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (field: keyof FormState, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const strength = useMemo(() => getPasswordStrength(form.password), [form.password]);
  const strengthLabel = [
    tr('Too weak', 'ضعيفة جداً'),
    tr('Weak', 'ضعيفة'),
    tr('Good', 'جيدة'),
    tr('Strong', 'قوية'),
  ][strength];
  const strengthColor = ['bg-red-400', 'bg-amber-400', 'bg-[#C9A84C]', 'bg-emerald-500'][strength];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const result = await register({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
    });
    setIsSubmitting(false);

    if (result.success) {
      showToast(tr('Account created — welcome to RAF!', 'تم إنشاء الحساب — أهلاً بك في RAF!'), 'success');
      router.push('/account');
    } else {
      showToast(tr('Something went wrong. Please try again.', 'حدث خطأ ما. يرجى المحاولة مرة أخرى.'), 'error');
    }
  };

  const fieldIconCls = `absolute top-1/2 -translate-y-1/2 text-[#2D1F1F]/30 pointer-events-none ${isRTL ? 'right-4' : 'left-4'}`;
  const fieldPad = isRTL ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4';

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Page header */}
      <div className="border-b border-[#2D1F1F]/8 bg-white">
        <div className={`${cx} py-10 sm:py-14`}>
          <span className="block text-[10px] font-black tracking-[0.4em] uppercase text-[#C9A84C] mb-3">
            {tr('Join RAF', 'انضم إلى RAF')}
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#2D1F1F]">{tr('Create Account', 'إنشاء حساب')}</h1>
        </div>
      </div>

      <div className={`${cx} py-14 sm:py-20`}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-md mx-auto"
        >
          <div className="border border-[#2D1F1F]/8 rounded-xl p-8 sm:p-10">
            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="mb-5">
                <label htmlFor="reg-name" className={labelClass}>{tr('Full Name', 'الاسم الكامل')}</label>
                <div className="relative">
                  <UserIcon size={16} className={fieldIconCls} />
                  <input
                    id="reg-name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={e => update('name', e.target.value)}
                    placeholder={tr('Mohammed Al-Rashidi', 'محمد الراشدي')}
                    className={`${inputClass} ${fieldPad}`}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-5">
                <label htmlFor="reg-email" className={labelClass}>{tr('Email Address', 'البريد الإلكتروني')}</label>
                <div className="relative">
                  <Mail size={16} className={fieldIconCls} />
                  <input
                    id="reg-email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={e => update('email', e.target.value)}
                    placeholder="you@example.com"
                    className={`${inputClass} ${fieldPad}`}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="mb-5">
                <label htmlFor="reg-phone" className={labelClass}>{tr('Phone Number', 'رقم الهاتف')}</label>
                <div className="relative">
                  <Phone size={16} className={fieldIconCls} />
                  <input
                    id="reg-phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={e => update('phone', e.target.value)}
                    placeholder="+968 9123 4567"
                    className={`${inputClass} ${fieldPad}`}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-2">
                <label htmlFor="reg-password" className={labelClass}>{tr('Password', 'كلمة المرور')}</label>
                <div className="relative">
                  <Lock size={16} className={fieldIconCls} />
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={e => update('password', e.target.value)}
                    placeholder="••••••••"
                    className={`${inputClass} ${isRTL ? 'pr-11 pl-11 text-right' : 'pl-11 pr-11'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className={`absolute top-1/2 -translate-y-1/2 text-[#2D1F1F]/40 hover:text-[#C9A84C] transition-colors ${isRTL ? 'left-4' : 'right-4'}`}
                    aria-label={showPassword ? tr('Hide password', 'إخفاء كلمة المرور') : tr('Show password', 'إظهار كلمة المرور')}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {form.password && (
                  <div className="mt-2.5">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-md transition-colors ${i < strength ? strengthColor : 'bg-[#2D1F1F]/8'}`} />
                      ))}
                    </div>
                    <p className="mt-1.5 text-[11px] text-[#2D1F1F]/40">{strengthLabel}</p>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div className="mb-6">
                <label htmlFor="reg-confirm-password" className={labelClass}>{tr('Confirm Password', 'تأكيد كلمة المرور')}</label>
                <div className="relative">
                  <Lock size={16} className={fieldIconCls} />
                  <input
                    id="reg-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={e => update('confirmPassword', e.target.value)}
                    placeholder="••••••••"
                    className={`${inputClass} ${isRTL ? 'pr-11 pl-11 text-right' : 'pl-11 pr-11'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(s => !s)}
                    className={`absolute top-1/2 -translate-y-1/2 text-[#2D1F1F]/40 hover:text-[#C9A84C] transition-colors ${isRTL ? 'left-4' : 'right-4'}`}
                    aria-label={showConfirmPassword ? tr('Hide password', 'إخفاء كلمة المرور') : tr('Show password', 'إظهار كلمة المرور')}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  {form.confirmPassword && form.confirmPassword === form.password && (
                    <Check size={16} className={`absolute top-1/2 -translate-y-1/2 text-emerald-500 ${isRTL ? 'left-11' : 'right-11'}`} />
                  )}
                </div>
              </div>

              {/* Terms */}
              <div className="mb-7">
                <label className={`flex items-start gap-2.5 cursor-pointer select-none ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={e => setAcceptTerms(e.target.checked)}
                    className="accent-[#C9A84C] w-4 h-4 mt-0.5 flex-shrink-0"
                  />
                  <span className={`text-sm text-[#2D1F1F]/60 leading-relaxed ${isRTL ? 'text-right' : ''}`}>
                    {tr('I agree to the ', 'أوافق على ')}
                    <span className="font-bold text-[#2D1F1F] hover:text-[#C9A84C] transition-colors">
                      {tr('Terms of Service', 'شروط الخدمة')}
                    </span>
                    {tr(' and ', ' و')}
                    <span className="font-bold text-[#2D1F1F] hover:text-[#C9A84C] transition-colors">
                      {tr('Privacy Policy', 'سياسة الخصوصية')}
                    </span>
                  </span>
                </label>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-[#2D1F1F] text-white text-[11px] font-black tracking-[0.25em] uppercase rounded-md hover:bg-[#C9A84C] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    {tr('Create Account', 'إنشاء حساب')}
                    <ArrowRight size={14} className={isRTL ? 'rtl-flip' : ''} />
                  </>
                )}
              </motion.button>
            </form>

            <div className="flex items-center gap-3 my-7">
              <div className="flex-1 h-px bg-[#2D1F1F]/8" />
              <span className="text-[10px] font-black tracking-[0.15em] uppercase text-[#2D1F1F]/30">{tr('or', 'أو')}</span>
              <div className="flex-1 h-px bg-[#2D1F1F]/8" />
            </div>

            <p className="text-center text-sm text-[#2D1F1F]/55">
              {tr('Already have an account?', 'لديك حساب بالفعل؟')}{' '}
              <Link href="/login" className="font-bold text-[#C9A84C] hover:text-[#2D1F1F] transition-colors">
                {tr('Sign in', 'تسجيل الدخول')}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
