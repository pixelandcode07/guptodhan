import { Send } from 'lucide-react';
import Link from 'next/link';
import BreadcrumbNav from '../ReusableComponents/BreadcrumbNav';
import { Button } from '../ui/button';
import { SidebarTrigger } from '../ui/sidebar';
import UserDropdown from './Components/UserDropdown';

export default function DashNavbar() {

  return (
    <nav className="flex justify-between p-4 items-center border-[#e3e8f3] border-b-[1px]">
      {/* Left side */}
      <div className="flex justify-center items-center gap-2">
        <SidebarTrigger />
        <BreadcrumbNav />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5">
        <div className="block">
          <Button variant={'VisitWeb'}>
            <Send className="mr-1" />
            <Link href={'/'}>Visit Website</Link>
          </Button>
        </div>

        {/* User Dropdown */}
        <UserDropdown />
      </div>
    </nav>
  );
}
