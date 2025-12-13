import { usePathname } from 'next/navigation';

export const useIsActive = () => {
  const pathname = usePathname() ?? '';
  
  return (href: string) => {
    if (href === '#' || !pathname) return false;
    const [path] = href.split('?');
    // Exact match or nested route (e.g., /general/view/all/product/123 should match /general/view/all/product)
    return pathname === path || pathname.startsWith(path + '/');
  };
};

