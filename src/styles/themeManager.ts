import { THEME_PALETTES, type ThemeColors, type ThemeDefinition } from "./themes";

let cachedTheme: ThemeDefinition | undefined;

const COLOR_VARIABLES: Record<keyof ThemeColors, string> = {
  primary: "--color-primary",
  primaryDark: "--color-primary-dark",
  secondary: "--color-secondary",
  accent: "--color-accent",
  success: "--color-success",
  warning: "--color-warning",
  danger: "--color-danger",
  gray100: "--color-gray-100",
  gray300: "--color-gray-300",
  gray500: "--color-gray-500",
  backgroundStart: "--color-background-start",
  backgroundEnd: "--color-background-end",
};
const FONT_FAMILY_VARIABLE = "--font-family-base";

export function applyTheme(theme: ThemeDefinition) {
  if (typeof document === "undefined") {
    return theme;
  }

  const root = document.documentElement;

  (Object.keys(COLOR_VARIABLES) as Array<keyof ThemeColors>).forEach((key) => {
    root.style.setProperty(COLOR_VARIABLES[key], theme.colors[key]);
  });
  root.style.setProperty(FONT_FAMILY_VARIABLE, theme.fontFamily);

  root.dataset["theme"] = theme.name;
  return theme;
}

export function pickRandomTheme(): ThemeDefinition {
  const index = Math.floor(Math.random() * THEME_PALETTES.length);
  return THEME_PALETTES[index]!;
}

export function initializeRandomTheme() {
  const deterministicHost = getDeterministicHostKey();
  const theme =
    cachedTheme ??
    (deterministicHost ? pickThemeFromHost(deterministicHost) : pickRandomTheme());

  cachedTheme = theme;
  return applyTheme(theme);
}

function getDeterministicHostKey(): string | undefined {
  if (typeof window === "undefined" || !window.location) {
    return undefined;
  }

  const { hostname, port } = window.location;
  if (!hostname) {
    return undefined;
  }

  const normalizedHost = hostname.trim().toLowerCase();
  return port ? `${normalizedHost}:${port}` : normalizedHost;
}

function pickThemeFromHost(hostKey: string): ThemeDefinition {
  const hash = hashString(hostKey);
  const index = Math.abs(hash) % THEME_PALETTES.length;
  return THEME_PALETTES[index]!;
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    const charCode = value.charCodeAt(i);
    hash = (hash << 5) - hash + charCode;
    hash |= 0;
  }

  return hash;
}
