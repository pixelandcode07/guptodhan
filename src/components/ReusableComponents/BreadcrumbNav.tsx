'use client';

import { routeConfig } from '@/config/routeconfig';
import { usePathname } from 'next/navigation';

export default function BreadcrumbNav() {
  const pathname = usePathname();
  const config = routeConfig[pathname];

  const breadcrumb = config
    ? config.breadcrumb
    : formatTitle(pathname.split('/').filter(Boolean).join(' '));
  const title = config ? config.title : breadcrumb;

  return (
    <div className="flex items-center">
      <div className="header-breadcumb">
        <h6 className="header-pretitle flex text-blue-100 justify-center items-center text-sm text-muted-foreground">
          Pages →
          <i className="dripicons-arrow-thin-right inline-block mx-1"></i>
          {breadcrumb}
        </h6>
        <h2 className="header-title text-xl font-semibold">{title}</h2>
      </div>
    </div>
  );
}

function formatTitle(str: string) {
  return str
    .split(/[-_/]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
