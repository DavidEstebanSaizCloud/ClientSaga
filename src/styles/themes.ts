export interface ThemeColors {
  primary: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
  gray100: string;
  gray300: string;
  gray500: string;
  backgroundStart: string;
  backgroundEnd: string;
}

export interface ThemeDefinition {
  name: string;
  colors: ThemeColors;
}

export const THEME_PALETTES: ThemeDefinition[] = [
  {
    name: "Aurora",
    colors: {
      primary: "#2563eb",
      primaryDark: "#1d4ed8",
      secondary: "#0f172a",
      accent: "#f472b6",
      success: "#16a34a",
      warning: "#f97316",
      danger: "#dc2626",
      gray100: "#f8fafc",
      gray300: "#cbd5f5",
      gray500: "#64748b",
      backgroundStart: "#f8fafc",
      backgroundEnd: "#e2e8f0",
    },
  },
  {
    name: "Sunset",
    colors: {
      primary: "#fb7185",
      primaryDark: "#e11d48",
      secondary: "#4c0519",
      accent: "#facc15",
      success: "#22c55e",
      warning: "#f97316",
      danger: "#dc2626",
      gray100: "#fff7ed",
      gray300: "#fed7aa",
      gray500: "#9f1239",
      backgroundStart: "#fff7ed",
      backgroundEnd: "#ffe4e6",
    },
  },
  {
    name: "Emerald",
    colors: {
      primary: "#10b981",
      primaryDark: "#059669",
      secondary: "#064e3b",
      accent: "#fbbf24",
      success: "#34d399",
      warning: "#f97316",
      danger: "#b91c1c",
      gray100: "#ecfdf5",
      gray300: "#a7f3d0",
      gray500: "#065f46",
      backgroundStart: "#ecfdf5",
      backgroundEnd: "#d1fae5",
    },
  },
  {
    name: "Velvet",
    colors: {
      primary: "#a855f7",
      primaryDark: "#7c3aed",
      secondary: "#1f0a24",
      accent: "#f472b6",
      success: "#8b5cf6",
      warning: "#fb923c",
      danger: "#e11d48",
      gray100: "#faf5ff",
      gray300: "#e9d5ff",
      gray500: "#6b21a8",
      backgroundStart: "#fdf4ff",
      backgroundEnd: "#f5d0fe",
    },
  },
  {
    name: "Saffron",
    colors: {
      primary: "#f59e0b",
      primaryDark: "#d97706",
      secondary: "#451a03",
      accent: "#84cc16",
      success: "#22c55e",
      warning: "#f97316",
      danger: "#dc2626",
      gray100: "#fffbeb",
      gray300: "#fde68a",
      gray500: "#92400e",
      backgroundStart: "#fff7ed",
      backgroundEnd: "#fef3c7",
    },
  },
  {
    name: "Ocean",
    colors: {
      primary: "#0ea5e9",
      primaryDark: "#0369a1",
      secondary: "#082f49",
      accent: "#22d3ee",
      success: "#2dd4bf",
      warning: "#eab308",
      danger: "#be123c",
      gray100: "#e0f2fe",
      gray300: "#bae6fd",
      gray500: "#0f172a",
      backgroundStart: "#e0f2fe",
      backgroundEnd: "#bae6fd",
    },
  },
  {
    name: "Graphite",
    colors: {
      primary: "#475569",
      primaryDark: "#1e293b",
      secondary: "#0f172a",
      accent: "#14b8a6",
      success: "#22c55e",
      warning: "#f97316",
      danger: "#f43f5e",
      gray100: "#f1f5f9",
      gray300: "#cbd5f5",
      gray500: "#475569",
      backgroundStart: "#f8fafc",
      backgroundEnd: "#cbd5f5",
    },
  },
  {
    name: "Forest",
    colors: {
      primary: "#15803d",
      primaryDark: "#14532d",
      secondary: "#052e16",
      accent: "#f97316",
      success: "#22c55e",
      warning: "#facc15",
      danger: "#b91c1c",
      gray100: "#ecfccb",
      gray300: "#bbf7d0",
      gray500: "#14532d",
      backgroundStart: "#ecfccb",
      backgroundEnd: "#d9f99d",
    },
  },
  {
    name: "Rose",
    colors: {
      primary: "#e11d48",
      primaryDark: "#9f1239",
      secondary: "#4c0519",
      accent: "#f472b6",
      success: "#f97316",
      warning: "#fde047",
      danger: "#b91c1c",
      gray100: "#fff1f2",
      gray300: "#fecdd3",
      gray500: "#9f1239",
      backgroundStart: "#fff1f2",
      backgroundEnd: "#ffe4e6",
    },
  },
  {
    name: "Amethyst",
    colors: {
      primary: "#6366f1",
      primaryDark: "#4338ca",
      secondary: "#1e1b4b",
      accent: "#f472b6",
      success: "#22d3ee",
      warning: "#fbbf24",
      danger: "#dc2626",
      gray100: "#eef2ff",
      gray300: "#c7d2fe",
      gray500: "#312e81",
      backgroundStart: "#eef2ff",
      backgroundEnd: "#e0e7ff",
    },
  },
];
