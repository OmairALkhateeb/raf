'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useApp } from '@/contexts/AppContext';

const cx = 'max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16';
const inputClass = 'w-full h-12 border border-[#2D1F1F]/15 bg-[#FAF7F2] text-sm text-[#2D1F1F] placeholder-[#2D1F1F]/30 rounded-md focus:outline-none focus:border-[#C9A84C] transition-colors';
const labelClass = 'block text-[10px] font-black tracking-[0.2em] uppercase text-[#2D1F1F]/45 mb-2';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { language, isRTL } = useLanguage();
  const { showToast } = useApp();

  const tr = (en: string, ar: string) => (language === 'ar' ? ar : en);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      showToast(tr('Welcome back!', 'مرحباً بعودتك!'), 'success');
      router.push('/account');
    } else {
      showToast(tr('Something went wrong. Please try again.', 'حدث خطأ ما. يرجى المحاولة مرة أخرى.'), 'error');
    }
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Page header */}
      <div className="border-b border-[#2D1F1F]/8 bg-white">
        <div className={`${cx} py-10 sm:py-14`}>
          <span className="block text-[10px] font-black tracking-[0.4em] uppercase text-[#C9A84C] mb-3">
            {tr('Welcome Back', 'مرحباً بعودتك')}
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#2D1F1F]">{tr('Sign In', 'تسجيل الدخول')}</h1>
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
            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div className="mb-5">
                <label htmlFor="login-email" className={labelClass}>{tr('Email Address', 'البريد الإلكتروني')}</label>
                <div className="relative">
                  <Mail size={16} className={`absolute top-1/2 -translate-y-1/2 text-[#2D1F1F]/30 pointer-events-none ${isRTL ? 'right-4' : 'left-4'}`} />
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={`${inputClass} ${isRTL ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4'}`}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-3">
                <div className={`flex items-center justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <label htmlFor="login-password" className={`${labelClass} mb-0`}>{tr('Password', 'كلمة المرور')}</label>
                  <button
                    type="button"
                    onClick={() => showToast(tr('Password reset is coming soon', 'استعادة كلمة المرور قريباً'), 'info')}
                    className="text-[10px] font-bold tracking-wide text-[#C9A84C] hover:text-[#2D1F1F] transition-colors"
                  >
                    {tr('Forgot password?', 'نسيت كلمة المرور؟')}
                  </button>
                </div>
                <div className="relative">
                  <Lock size={16} className={`absolute top-1/2 -translate-y-1/2 text-[#2D1F1F]/30 pointer-events-none ${isRTL ? 'right-4' : 'left-4'}`} />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
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
              </div>

              {/* Remember me */}
              <label className={`flex items-center gap-2.5 mb-7 cursor-pointer select-none ${isRTL ? 'flex-row-reverse' : ''}`}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="accent-[#C9A84C] w-4 h-4"
                />
                <span className="text-sm text-[#2D1F1F]/60">{tr('Remember me', 'تذكرني')}</span>
              </label>

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
                    {tr('Sign In', 'تسجيل الدخول')}
                    <ArrowRight size={14} className={isRTL ? 'rtl-flip' : ''} />
                  </>
                )}
              </motion.button>
            </form>

            <div className={`flex items-center gap-2 mt-6 text-[11px] text-[#2D1F1F]/35 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <ShieldCheck size={13} className="text-[#C9A84C] flex-shrink-0" />
              {tr('Your information is kept private and secure.', 'معلوماتك محفوظة وآمنة.')}
            </div>

            <div className="flex items-center gap-3 my-7">
              <div className="flex-1 h-px bg-[#2D1F1F]/8" />
              <span className="text-[10px] font-black tracking-[0.15em] uppercase text-[#2D1F1F]/30">{tr('or', 'أو')}</span>
              <div className="flex-1 h-px bg-[#2D1F1F]/8" />
            </div>

            <p className="text-center text-sm text-[#2D1F1F]/55">
              {tr("Don't have an account?", 'ليس لديك حساب؟')}{' '}
              <Link href="/register" className="font-bold text-[#C9A84C] hover:text-[#2D1F1F] transition-colors">
                {tr('Create one', 'إنشاء حساب')}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
