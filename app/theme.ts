export type Theme = "dark" | "light";

export interface ThemeTokens {
  // Backgrounds
  bg: string;
  surface: string;
  surface2: string;
  surface3: string;
  headerBg: string;
  // Borders
  border: string;
  border2: string;
  // Text
  text: string;
  textdim: string;
  textfaint: string;
  // Blue accent
  blue: string;
  bluedim: string;
  blueglow: string;
  bluebg: string;
  blueBorder: string;
  blueSelected: string;
  // Lime CTA
  lime: string;
  limedark: string;
  limeglow: string;
  // Gold
  gold: string;
  // Success
  green: string;
  greenbg: string;
  greenglow: string;
  greenBorder: string;
  // Error
  red: string;
  redbg: string;
  redglow: string;
  redBorder: string;
  // Drag-drop
  drop: string;
  slotBg: string;
  slotOkBg: string;
  slotBadBg: string;
  // Body radial gradient overlay
  bgGradientColor: string;
}

export const darkTokens: ThemeTokens = {
  bg: "oklch(10% 0.014 295)",
  surface: "oklch(15% 0.018 295)",
  surface2: "oklch(20% 0.022 295)",
  surface3: "oklch(26% 0.026 295)",
  headerBg: "oklch(7% 0.009 295)",
  border: "oklch(30% 0.020 295)",
  border2: "oklch(38% 0.024 295)",
  text: "oklch(91% 0.007 295)",
  textdim: "oklch(56% 0.014 295)",
  textfaint: "oklch(38% 0.010 295)",
  blue: "oklch(57% 0.17 248)",
  bluedim: "oklch(40% 0.12 248)",
  blueglow: "oklch(57% 0.17 248 / 0.25)",
  bluebg: "oklch(18% 0.06 248)",
  blueBorder: "oklch(57% 0.17 248 / 0.40)",
  blueSelected: "oklch(65% 0.20 248)",
  lime: "oklch(86% 0.28 128)",
  limedark: "oklch(14% 0.07 128)",
  limeglow: "oklch(86% 0.28 128 / 0.35)",
  gold: "oklch(74% 0.15 82)",
  green: "oklch(58% 0.18 145)",
  greenbg: "oklch(17% 0.07 145)",
  greenglow: "oklch(58% 0.18 145 / 0.25)",
  greenBorder: "oklch(58% 0.18 145 / 0.40)",
  red: "oklch(54% 0.21 25)",
  redbg: "oklch(16% 0.08 25)",
  redglow: "oklch(54% 0.21 25 / 0.25)",
  redBorder: "oklch(54% 0.21 25 / 0.40)",
  drop: "oklch(22% 0.06 295)",
  slotBg: "oklch(12% 0.010 295)",
  slotOkBg: "oklch(14% 0.09 145)",
  slotBadBg: "oklch(13% 0.09 25)",
  bgGradientColor: "oklch(20% 0.07 295 / 0.55)",
};

export const lightTokens: ThemeTokens = {
  bg: "rgb(252 165 165 / 0.7)",
  surface: "oklch(98% 0.010 18)",
  surface2: "oklch(91% 0.026 18)",
  surface3: "oklch(86% 0.032 18)",
  headerBg: "oklch(92% 0.020 18)",
  border: "oklch(81% 0.028 18)",
  border2: "oklch(70% 0.032 18)",
  text: "oklch(15% 0.010 18)",
  textdim: "oklch(42% 0.012 18)",
  textfaint: "oklch(62% 0.012 18)",
  blue: "oklch(45% 0.18 248)",
  bluedim: "oklch(35% 0.14 248)",
  blueglow: "oklch(45% 0.18 248 / 0.25)",
  bluebg: "oklch(93% 0.05 248)",
  blueBorder: "oklch(45% 0.18 248 / 0.40)",
  blueSelected: "oklch(42% 0.18 248)",
  lime: "oklch(52% 0.22 128)",
  limedark: "oklch(96% 0.08 128)",
  limeglow: "oklch(52% 0.22 128 / 0.30)",
  gold: "oklch(58% 0.14 82)",
  green: "oklch(40% 0.17 145)",
  greenbg: "oklch(93% 0.06 145)",
  greenglow: "oklch(40% 0.17 145 / 0.20)",
  greenBorder: "oklch(40% 0.17 145 / 0.40)",
  red: "oklch(42% 0.20 25)",
  redbg: "oklch(95% 0.05 25)",
  redglow: "oklch(42% 0.20 25 / 0.20)",
  redBorder: "oklch(42% 0.20 25 / 0.40)",
  drop: "oklch(89% 0.06 248)",
  slotBg: "oklch(91% 0.020 18)",
  slotOkBg: "oklch(90% 0.05 145)",
  slotBadBg: "oklch(91% 0.04 25)",
  bgGradientColor: "oklch(88% 0.05 18 / 0.25)",
};

export const themes: Record<Theme, ThemeTokens> = {
  dark: darkTokens,
  light: lightTokens,
};

function toKebab(str: string): string {
  return str.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`);
}

/** Generates a CSS rule block from a token set. */
export function tokensToCSS(selector: string, tokens: ThemeTokens): string {
  const props = (Object.entries(tokens) as [string, string][])
    .map(([key, val]) => `  --${toKebab(key)}: ${val};`)
    .join("\n");
  return `${selector} {\n${props}\n}`;
}
