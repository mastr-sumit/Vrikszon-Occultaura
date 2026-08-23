import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vrikszon Occultaura | Numbers Change • Energy Transforms • Life Elevates",
  description:
    "Premium Numerology & Vastu guidance with Vrikszon Occultaura. Numbers Change • Energy Transforms • Life Elevates through personalized consultation.",
};

const themeInitScript = `
  (function() {
    try {
      var isAdmin = window.location.pathname.indexOf('/admin') === 0;
      var saved = localStorage.getItem('vo_admin_theme');
      var theme = isAdmin && saved === 'light' ? 'light' : 'dark';
      if (theme === 'light') {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.style.colorScheme = 'light';
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.style.colorScheme = 'dark';
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          <CartProvider>
            <AppShell>{children}</AppShell>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}