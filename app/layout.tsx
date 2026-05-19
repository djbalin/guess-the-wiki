import { Barlow_Condensed, Spectral, DM_Sans } from "next/font/google";
import "./globals.css";
import LanguageContextProvider from "@/contexts/LanguageContext";
import { ThemeContextProvider } from "@/contexts/ThemeContext";
import { Analytics } from "@vercel/analytics/react";
import { darkTokens, lightTokens, tokensToCSS } from "./theme";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import { getBaseUrl } from "@/lib/is_dev";

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

export const metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: "Guess the Wiki",
  description: "Match Wikipedia article titles to their snippets!",
};

// Generate CSS from theme.ts — single source of truth for all color tokens
const themeCSS = [
  tokensToCSS(":root, [data-theme='dark']", lightTokens),
  tokensToCSS("[data-theme='light']", lightTokens),
].join("\n\n");

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
        {/* <script dangerouslySetInnerHTML={{ __html: initThemeScript }} /> */}
      </head>
      <body>
        <ClerkProvider>
          <ThemeContextProvider>
            <LanguageContextProvider>
              <Header />
              <div style={{ minHeight: "100vh" }}>{children}</div>
            </LanguageContextProvider>
          </ThemeContextProvider>
          <Analytics />
        </ClerkProvider>
      </body>
    </html>
  );
}
