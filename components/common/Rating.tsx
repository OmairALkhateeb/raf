import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  count?: number;
  size?: number;
  showCount?: boolean;
  className?: string;
}

export default function Rating({ value, count, size = 14, showCount = true, className = '' }: RatingProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            size={size}
            className={star <= Math.round(value) ? 'text-[#C9A84C] fill-[#C9A84C]' : 'text-gray-300 fill-gray-300'}
          />
        ))}
      </div>
      {showCount && count !== undefined && (
        <span className="text-xs text-gray-500">({count})</span>
      )}
    </div>
  );
}
