'use client';

import React from 'react';
import Link from 'next/link';

const ErrorPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2 text-gray-800">
        Page Not Found
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        Oops! The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
        Go Back Home
      </Link>
    </div>
  );
};

export default ErrorPage;
