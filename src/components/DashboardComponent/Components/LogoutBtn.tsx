'use client';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function LogoutBtn() {
  return (
    <div
      className="flex gap-2 items-center cursor-pointer"
      onClick={() => signOut()}>
      <LogOut /> Logout
    </div>
  );
}
