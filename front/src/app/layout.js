'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import './globals.css';

export default function RootLayout({ children }) {
  const pathname = usePathname();

 
  const esconderHeader = pathname === '/login';

  return (
    <html lang="pt-BR">
      <body>
        {}
        {!esconderHeader && <Header />}
        
        {children}
      </body>
    </html>
  );
}