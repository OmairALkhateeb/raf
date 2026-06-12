'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  crumbs: Crumb[];
}

export default function Breadcrumb({ crumbs }: BreadcrumbProps) {
  const { isRTL } = useLanguage();

  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500 flex-wrap">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && (
            <ChevronRight
              size={14}
              className={`text-gray-400 ${isRTL ? 'rtl-flip' : ''}`}
            />
          )}
          {crumb.href ? (
            <Link
              href={crumb.href}
              className="hover:text-[#C9A84C] transition-colors duration-200"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="text-[#2D1F1F] font-medium">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
