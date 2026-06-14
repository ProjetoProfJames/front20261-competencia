'use client'; // Necessário para usar o usePathname

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import './globals.css';

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Define se o Header deve ser escondido (adicione outras rotas aqui se precisar, ex: '/cadastro')
  const esconderHeader = pathname === '/login';

  return (
    <html lang="pt-BR">
      <body>
        {/* Se NÃO for para esconder o header, ele renderiza aqui */}
        {!esconderHeader && <Header />}
        
        {children}
      </body>
    </html>
  );
}