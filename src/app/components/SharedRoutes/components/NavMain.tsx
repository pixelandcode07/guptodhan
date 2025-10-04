import { Handbag, Heart, LogOut, Menu, User } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import LogInRegister from '../../LogInAndRegister/LogIn_Register';
import SearchBar from './SearchBar';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function NavMain() {
  const { data: session, status } = useSession();
  console.log('Navuser is', session);
  const user = session?.user;

  return (
    <div className="bg-[#0097E9] md:bg-[#FFFFFF] text-black max-w-[89vw] m-auto  flex justify-between items-center py-5 md:py-5 px-1 md:px-10 border-2 md:border-0">
      <div>
        <div className="flex lg:block items-center">
          <button
            // onClick={openMenu}
            className="block lg:hidden ml-3">
            <Menu />
          </button>
          <Link href={'/'} className="logo hidden md:block">
            <Image src="/img/logo.png" width={130} height={44} alt="logo" />
          </Link>
          <Link href={'/'} className="logo md:hidden">
            <Image src="/white-logo.png" width={130} height={44} alt="logo" />
          </Link>
        </div>
        {/* Search functionality for mobile view */}
        <div className="search flex lg:hidden items-center justify-center w-full  my-5 relative">
          <SearchBar />
        </div>
      </div>
      {/* Search functionality for Laptop view */}
      <div className="search hidden lg:flex items-center justify-center w-full max-w-md mx-auto relative">
        <SearchBar />
      </div>

      <div className="hidden md:flex">
        <Dialog>
          <ul className="flex gap-4 text-base">
            <li className="flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer">
              <Heart />
              <span className="text-[#00005E] text-[12px]"> Whishlist</span>
            </li>
            <li className="flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer">
              <Handbag />
              <span className="text-[#00005E] text-[12px]"> Cart</span>
            </li>

            {session ? (
              <>
                <li className="flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer">
                  <Link
                    href={'/home/UserProfile'}
                    className="flex flex-col justify-center items-center">
                    {user?.image ? (
                      <Image
                        src={user.image}
                        width={24}
                        height={24}
                        alt={user?.name ?? 'Profile picture'}
                        className="rounded-full"
                      />
                    ) : (
                      <User />
                    )}
                    <span className="text-[#00005E] text-[12px]">Profile</span>
                  </Link>
                </li>
                <li
                  onClick={() => signOut()}
                  className="flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer">
                  <LogOut />
                  <span className="text-[#00005E] text-[12px]">Log out</span>
                </li>
              </>
            ) : (
              <DialogTrigger>
                <li className="flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer">
                  <User />
                  <span className="text-[#00005E] text-[12px]">
                    Login /Register
                  </span>
                </li>
              </DialogTrigger>
            )}
          </ul>
          {/* Login page */}
          <LogInRegister />
        </Dialog>
      </div>
    </div>
  );
}
