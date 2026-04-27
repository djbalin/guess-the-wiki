import { Barlow_Condensed, Spectral, DM_Sans } from "next/font/google";
import "./globals.css";
import LanguageContextProvider from "@/contexts/LanguageContext";
import { ThemeContextProvider } from "@/contexts/ThemeContext";
import { Analytics } from "@vercel/analytics/react";
import { darkTokens, lightTokens, tokensToCSS } from "./theme";

const barlowCondensed = Barlow_Condensed({
  weight: ["700", "900"],
  subsets: ["latin"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const spectral = Spectral({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-spectral",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Guess the Wiki",
  description: "Match Wikipedia article titles to their snippets!",
};

// Generate CSS from theme.ts — single source of truth for all color tokens
const themeCSS = [
  tokensToCSS(":root, [data-theme='dark']", darkTokens),
  tokensToCSS("[data-theme='light']", lightTokens),
].join("\n\n");

// Inline script that runs before React hydration to avoid flash of wrong theme
const initThemeScript = `(function(){try{var t=localStorage.getItem('gtw-theme')||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${barlowCondensed.variable} ${spectral.variable} ${dmSans.variable}`}
      style={{ fontFamily: "var(--font-dm-sans), system-ui, sans-serif" }}
    >
      <head>
        {/* Inject theme CSS generated from theme.ts */}
        <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
        {/* Set data-theme before React hydrates to prevent flash */}
        <script dangerouslySetInnerHTML={{ __html: initThemeScript }} />
      </head>
      <body>
        <ThemeContextProvider>
          <LanguageContextProvider>{children}</LanguageContextProvider>
        </ThemeContextProvider>
        <Analytics />
      </body>
    </html>
  );
}
