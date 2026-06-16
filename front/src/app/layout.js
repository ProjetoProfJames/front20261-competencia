import { Geist, Geist_Mono } from "next/font/google";
import Menu from "@/components/Menu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "PIE Manager",
  description: "Controle de Projeto Integrador de Extensão",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`} style={{ margin: 0 }}>
        
        <Menu />
        
        <main style={{ padding: "20px" }}>
          {children}
        </main>
      </body>
    </html>
  );
}