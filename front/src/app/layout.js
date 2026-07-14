import { Geist, Geist_Mono } from "next/font/google";
import "./global.css";

const sansFont = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const monoFont = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "PIE Manager",
  description: "Controle de Projeto Integrador de Extensão",
};

const RootLayout = ({ children }) => (
  <html lang="en">
    <body className={`${sansFont.variable} ${monoFont.variable}`}>{children}</body>
  </html>
);

export default RootLayout;
