'use client';

import { useEffect } from "react";
import Link from "next/link";
import { useNotFound } from "@/contexts/NotFoundContext";
import Image from "next/image";

export default function NotFound() {
  const { setIsNotFound } = useNotFound();

  // When this page mounts, hide Navbar/Footer
  useEffect(() => {
    setIsNotFound(true);
    return () => setIsNotFound(false); // reset when leaving
  }, [setIsNotFound]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      {/* 404 Image */}
      <div className="relative w-64 h-64 mb-8">
        <Image
          src="/img/error-page.png"
          alt="404 - Page not found"
          fill
          className="object-contain drop-shadow-lg"
          priority
        />
      </div>
      {/* <h1 className="text-5xl font-bold mb-4">404 - Page Not Found</h1> */}
      <p className="text-lg mb-6">Oops! The page you’re looking for doesn’t exist.</p>
      <Link href="/" className="text-blue-600 hover:underline">
        Go back to Home
      </Link>
    </div>
  );
}
