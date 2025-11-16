import { THEME_PALETTES, type ThemeColors, type ThemeDefinition } from "./themes";

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

export function applyTheme(theme: ThemeDefinition) {
  if (typeof document === "undefined") {
    return theme;
  }

  const root = document.documentElement;

  (Object.keys(COLOR_VARIABLES) as Array<keyof ThemeColors>).forEach((key) => {
    root.style.setProperty(COLOR_VARIABLES[key], theme.colors[key]);
  });

  root.dataset.theme = theme.name;
  return theme;
}

export function pickRandomTheme(): ThemeDefinition {
  const index = Math.floor(Math.random() * THEME_PALETTES.length);
  return THEME_PALETTES[index];
}

export function initializeRandomTheme() {
  const theme = pickRandomTheme();
  return applyTheme(theme);
}
