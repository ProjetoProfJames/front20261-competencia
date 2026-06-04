import { Geist, Geist_Mono } from "next/font/google";
import Menu from "@/components/Menu/index";
import "./global.css";

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Menu />
        {children}
      </body>
    </html>
  );
}