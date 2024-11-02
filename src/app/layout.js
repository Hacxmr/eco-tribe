// src/app/layout.js
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({ 
  subsets: ["latin"],
  weight: ['400', '700'], // Add any weights you need
  variable: '--font-nunito', // This creates a CSS variable
});

export const metadata = {
  title: "EcoVibe Tribe",
  description: "Generated by ExploreX",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={nunito.variable}>
      <body className={nunito.className}>{children}</body>
    </html>
  );
}