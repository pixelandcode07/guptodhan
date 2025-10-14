'use client';

import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
}

export default function PageHeader({
  title,
  buttonLabel,
  onButtonClick,
}: PageHeaderProps) {
  // default click handler if none is provided
  const handleClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      console.log(`${buttonLabel || 'Button'} clicked`);
    }
  };

  return (
    <div className="flex justify-between items-center gap-4 mb-6 border-b border-gray-300 pb-2 px-4 md:px-0">
      <h1 className="text-base md:text-2xl lg:text-3xl font-medium text-[#00005E]">{title}</h1>
      {buttonLabel && (
        <Button variant={'HomeBtns'} onClick={handleClick} className='md:border md:border-[#0084CB]'>
          {buttonLabel} <span className='md:hidden'> <ChevronRight /></span>
        </Button>
      )}
    </div>
  );
}
