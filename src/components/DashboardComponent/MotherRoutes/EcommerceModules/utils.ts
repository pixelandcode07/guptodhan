import { usePathname } from 'next/navigation';

export const useIsActive = () => {
  const pathname = usePathname();
  
  return (href: string) => {
    const [path] = href.split('?');
    return pathname === path;
  };
};

