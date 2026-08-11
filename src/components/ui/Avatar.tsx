import React from 'react';
import { Check } from 'lucide-react';

interface AvatarProps {
  src: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  hasStory?: boolean;
  storyViewed?: boolean;
  isVerified?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'User avatar',
  size = 'md',
  hasStory = false,
  storyViewed = false,
  isVerified = false,
  onClick,
  className = '',
}) => {
  const sizeMap = {
    xs: 'w-7 h-7 text-xs',
    sm: 'w-9 h-9 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-xl',
  };

  const storyBorder = hasStory
    ? storyViewed
      ? 'p-[2px] bg-slate-300 dark:bg-slate-700'
      : 'p-[2px] bg-gradient-to-tr from-amber-500 via-rose-500 to-amber-300'
    : '';

  return (
    <div
      onClick={onClick}
      className={`relative inline-block flex-shrink-0 ${onClick ? 'cursor-pointer hover:opacity-95' : ''} ${className}`}
    >
      <div className={`rounded-full overflow-hidden ${storyBorder}`}>
        <img
          src={src}
          alt={alt}
          className={`${sizeMap[size]} object-cover rounded-full bg-slate-200 dark:bg-slate-800`}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400';
          }}
        />
      </div>
      {isVerified && (
        <span
          className="absolute -bottom-0.5 -right-0.5 bg-amber-500 text-slate-950 p-0.5 rounded-full border-2 border-white dark:border-slate-900 shadow-sm flex items-center justify-center"
          title="Verified Creator"
        >
          <Check className="w-2.5 h-2.5 stroke-[3]" />
        </span>
      )}
    </div>
  );
};
