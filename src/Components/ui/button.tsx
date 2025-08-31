// components/DynamicButton.tsx
'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
type ButtonProps = {
  text: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
};

export default function Button({
  text,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  onClick,
}: ButtonProps) {
  // Variant styles
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-black',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };

  // Size styles
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 rounded-lg font-medium transition-all',
        variantClasses[variant],
        sizeClasses[size]
      )}>
      {icon && iconPosition === 'left' && <span>{icon}</span>}
      <span>{text}</span>
      {icon && iconPosition === 'right' && <span>{icon}</span>}
    </button>
  );
}
