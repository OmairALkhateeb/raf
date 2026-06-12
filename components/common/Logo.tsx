'use client';

import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
}

// logo.png is 640x378 (aspect ~1.69)
const ASPECT = 640 / 378;

export default function Logo({ variant = 'dark', size = 'md' }: LogoProps) {
  const sizes = { sm: 30, md: 42, lg: 56 };
  const h = sizes[size];
  const w = Math.round(h * ASPECT);

  return (
    <Link href="/" className="flex items-center select-none group">
      <span
        className={`inline-flex items-center transition-transform duration-300 group-hover:scale-105 ${
          variant === 'light' ? 'bg-cream rounded-md px-2.5 py-1.5' : ''
        }`}
      >
        <Image
          src="/images/logo.png"
          alt="RAF — رف"
          width={w}
          height={h}
          priority
          className="object-contain"
          style={{ height: h, width: 'auto' }}
        />
      </span>
    </Link>
  );
}
