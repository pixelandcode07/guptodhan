import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guptodhan Dashboard',
  description: 'Dashboard for Guptodhan project',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}