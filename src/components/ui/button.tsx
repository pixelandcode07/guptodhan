import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
        BlueBtn: 'bg-[#0097E9] text-white hover:bg-[#2e7ce4] cursor-pointer',
        // #0097E9 #2e7ce4
        GrayBtn: 'bg-[#17263A] text-white hover:bg-[#17263A] cursor-pointer',
        FooterBtn: 'bg-black text-white hover:bg-black cursor-pointer',
        HomeBtns: 'bg-white hover:bg-white text-[#0084CB] hover:text-[#0084CB] rounded-sm cursor-pointer',
        EditBtn: 'bg-yellow-400 text-black hover:bg-yellow-300 cursor-pointer',
        DeleteBtn: 'bg-red-700 text-white hover:bg-red-700 cursor-pointer',
        HomeBuy: 'bg-[#3D85C6] text-white text-base font-medium hover:bg-[#3D85C6] cursor-pointer',
        HomeDoante: 'bg-[#21BF73] text-white text-base font-medium hover:bg-[#21BF73] cursor-pointer',
        HomeServices: 'bg-[#1414FF] text-white text-base font-medium hover:bg-[#1414FF] cursor-pointer',
        VisitWeb: 'bg-[#132843] text-white text-base font-medium hover:bg-[#132843] cursor-pointer',
        GreenBtn: 'inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-600 text-white font-semibold shadow cursor-pointer',
        VendorStoreBtn: 'w-full bg-gradient-to-r from-[#0097E9] to-[#00008B] hover:from-[#00008B] hover:to-[#0097E9] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer',
      FooterSubscribeBtn: 'font-bold flex items-center gap-2 bg-blue-900 hover:bg-blue-400 transition-colors uppercase text-xs md:text-sm text-white whitespace-nowrap cursor-pointer'
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        // xxl: 'h-20 rounded-md px-10 has-[>svg]:px-6',
        xxl: 'h-[50px] w-[143px] rounded-md p-[16px] has-[>svg]:px-6',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
