import type { Metadata } from 'next';
import { Manrope, Inter } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Admin Panel | DentFlow',
  description: 'Multi-tenant administration dashboard for DentFlow',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="bg-surface text-text-primary font-inter antialiased min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
