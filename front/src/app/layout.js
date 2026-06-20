import { DM_Sans, Space_Mono } from 'next/font/google';
import './global.css';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm', display: 'swap' });
const spaceMono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-mono-var', display: 'swap' });

export const metadata = {
  title: 'PIE Manager',
  description: 'Sistema de Gestão de Projetos Integradores',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${dmSans.variable} ${spaceMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
