import { Inter, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const InterFont = Inter({
  variable: "--font-inter",
  subsets: ['latin', 'cyrillic'],
});

const IBMFont = IBM_Plex_Sans({
  variable: "--font-IBM",
  subsets: ['latin', 'cyrillic'],
});

export const metadata = {
  title: "Лабораторные Кирюшки",
  description: "Интеллектуальная собственность Энгельгардта Кирилла",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${InterFont.variable} ${IBMFont.variable}`}>
        {children}
      </body>
    </html>
  );
}
