import Menu from "@/components/Menu";
import "./global.css";

export const metadata = {
  description: "Controle de Projeto Integrador de Extensao",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Menu />
        {children}
      </body>
    </html>
  );
}
