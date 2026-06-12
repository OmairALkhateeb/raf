'use client';

import Link from 'next/link';

interface LogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ variant = 'dark', size = 'md' }: LogoProps) {
  const sizes = { sm: 32, md: 44, lg: 60 };
  const h = sizes[size];

  return (
    <Link href="/" className="flex items-center gap-2 select-none group">
      <svg
        width={h * 1.8}
        height={h}
        viewBox="0 0 110 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 group-hover:scale-105"
      >
        {/* Background rectangle */}
        <rect width="110" height="60" rx="4" fill={variant === 'dark' ? '#2D1F1F' : '#FAF7F2'} />

        {/* Arabic letter ر (Ra) - stylized */}
        <path
          d="M72 42 C72 42 80 42 85 36 C87 33 87 28 84 26 C81 24 77 25 76 28 C75 30 76 33 79 34"
          stroke={variant === 'dark' ? '#FAF7F2' : '#2D1F1F'}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Arabic ف (Fa) simplified */}
        <path
          d="M55 30 C55 30 60 26 65 28 C68 29 69 32 67 35 C65 38 60 38 58 36"
          stroke={variant === 'dark' ? '#FAF7F2' : '#2D1F1F'}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <circle
          cx="62"
          cy="24"
          r="2"
          fill={variant === 'dark' ? '#FAF7F2' : '#2D1F1F'}
        />
        {/* Baseline connector */}
        <line
          x1="55"
          y1="42"
          x2="88"
          y2="42"
          stroke={variant === 'dark' ? '#FAF7F2' : '#2D1F1F'}
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Gold divider line */}
        <line
          x1="46"
          y1="12"
          x2="46"
          y2="48"
          stroke="#C9A84C"
          strokeWidth="1.5"
          opacity="0.8"
        />

        {/* RAF text in gold */}
        <text
          x="8"
          y="34"
          fontFamily="'Playfair Display', Georgia, serif"
          fontSize="18"
          fontWeight="700"
          letterSpacing="3"
          fill="#C9A84C"
        >
          RAF
        </text>

        {/* Decorative dots */}
        <circle cx="8" cy="46" r="1.5" fill="#C9A84C" opacity="0.6" />
        <circle cx="36" cy="46" r="1.5" fill="#C9A84C" opacity="0.6" />
      </svg>
    </Link>
  );
}
