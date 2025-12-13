import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('animate-pulse rounded-md bg-slate-200', className)}
      style={style}
      {...props}
    />
  )
);

Skeleton.displayName = 'Skeleton';

type Dimension = number | string | undefined;

const toCssUnit = (value: Dimension): string | undefined => {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return `${value}px`;
  return value;
};

export interface SkeletonRectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  width?: Dimension;
  height?: Dimension;
  rounded?: boolean;
}

export const SkeletonRect: React.FC<SkeletonRectProps> = ({
  width = '100%',
  height = 16,
  rounded = true,
  className,
  style,
  ...props
}) => (
  <Skeleton
    className={cn(rounded ? 'rounded-md' : '', className)}
    style={{
      ...style,
      width: toCssUnit(width),
      height: toCssUnit(height),
    }}
    {...props}
  />
);

export interface SkeletonCircleProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  size?: Dimension;
}

export const SkeletonCircle: React.FC<SkeletonCircleProps> = ({
  size = 40,
  className,
  style,
  ...props
}) => (
  <Skeleton
    className={cn('rounded-full', className)}
    style={{
      ...style,
      width: toCssUnit(size),
      height: toCssUnit(size),
    }}
    {...props}
  />
);

export interface SkeletonTextProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  lines?: number;
  gap?: number | string;
  lineHeight?: Dimension;
  lastLineWidth?: Dimension;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  gap = 8,
  lineHeight = 12,
  lastLineWidth = '60%',
  className,
  style,
  ...props
}) => {
  const lineArray = Array.from({ length: lines });

  return (
    <div
      className={cn('flex flex-col', className)}
      style={{ gap: toCssUnit(gap), ...style }}
      {...props}
    >
      {lineArray.map((_, index) => (
        <SkeletonRect
          key={index}
          height={toCssUnit(lineHeight)}
          width={
            index === lines - 1 && lines > 1
              ? toCssUnit(lastLineWidth)
              : '100%'
          }
        />
      ))}
    </div>
  );
};

export interface SkeletonButtonProps
  extends Omit<SkeletonRectProps, 'height' | 'rounded'> {
  height?: Dimension;
}

export const SkeletonButton: React.FC<SkeletonButtonProps> = ({
  height = 36,
  className,
  ...props
}) => (
  <SkeletonRect
    height={height}
    className={cn('rounded-lg', className)}
    {...props}
  />
);

