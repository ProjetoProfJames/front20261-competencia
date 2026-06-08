import '@/app/framework/global.css';
import Header from './framework/components/Header';

export const metadata = {
  title: "PIE Manager",
  description: "Controle de Projeto Integrador de Extensão",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
