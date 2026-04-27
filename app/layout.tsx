import { Barlow_Condensed, Spectral, DM_Sans } from "next/font/google";
import "./globals.css";
import LanguageContextProvider from "@/contexts/LanguageContext";
import { Analytics } from "@vercel/analytics/react";

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
      <body>
        <LanguageContextProvider>{children}</LanguageContextProvider>
        <Analytics />
      </body>
    </html>
  );
}
