import Menu from "@/components/Menu";
import "./global.css";

export const metadata = {
  title: "PIE Manager",
  description: "Controle de Projeto Integrador de Extensao",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Menu />
        <main className="page-shell">
          {children}
        </main>
      </body>
    </html>
  );
}
