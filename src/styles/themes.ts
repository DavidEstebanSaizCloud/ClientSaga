import clearvisionLogo from "../assets/logos/clearvision.png";
import dreamSleepLogo from "../assets/logos/dreamSleep.png";
import ecoMugLogo from "../assets/logos/ecoMug.png";
import kitcheniqueLogo from "../assets/logos/kitchenique.png";
import maplewoodLogo from "../assets/logos/maplewood.png";
import petPalsLogo from "../assets/logos/petPals.png";
import pureAromaLogo from "../assets/logos/pure_aroma.png";
import strideStepLogo from "../assets/logos/stride_step.png";
import submmitTentsLogo from "../assets/logos/submmit_tents.png";
import swiftChargeLogo from "../assets/logos/swiftCharge.png";

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

export interface LayoutPalette {
  backgroundStart: string;
  backgroundEnd: string;
  headerBg: string;
  headerBorder: string;
  contentBg: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  surfaceShadow: string;
}

export interface ThemeDefinition {
  name: string;
  companyName: string;
  fontFamily: string;
  logo: {
    src: string;
    alt: string;
  };
  colors: ThemeColors;
  layout: LayoutPalette;
}

export const THEME_PALETTES: ThemeDefinition[] = [
  {
    name: "ClearVision",
    companyName: "ClearVision Analytics",
    fontFamily: "\"Inter\", system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
    logo: {
      src: clearvisionLogo,
      alt: "ClearVision logo",
    },
    colors: {
      primary: "#2563eb",
      primaryDark: "#1d4ed8",
      secondary: "#10244c",
      accent: "#2563eb",
      success: "#16a34a",
      warning: "#f97316",
      danger: "#dc2626",
      gray100: "#f8fafc",
      gray300: "#cbd5f5",
      gray500: "#1c2a44",
      backgroundStart: "#f0f6ff",
      backgroundEnd: "#d9e8ff",
    },
    layout: {
      backgroundStart: "#f0f6ff",
      backgroundEnd: "#d9e8ff",
      headerBg: "#ffffff",
      headerBorder: "#d3e0ff",
      contentBg: "#f9fbff",
      textPrimary: "#10244c",
      textSecondary: "#1c2a44",
      accent: "#2563eb",
      surfaceShadow: "0 10px 30px rgba(47, 85, 150, 0.18)",
    },
  },
  {
    name: "DreamSleep",
    companyName: "DreamSleep Labs",
    fontFamily: "\"Playfair Display\", \"Times New Roman\", serif",
    logo: {
      src: dreamSleepLogo,
      alt: "DreamSleep logo",
    },
    colors: {
      primary: "#c026d3",
      primaryDark: "#86198f",
      secondary: "#3a103f",
      accent: "#c026d3",
      success: "#8b5cf6",
      warning: "#fb923c",
      danger: "#db2777",
      gray100: "#fceff9",
      gray300: "#f5d2f4",
      gray500: "#4f1c52",
      backgroundStart: "#fceff9",
      backgroundEnd: "#f5d2f4",
    },
    layout: {
      backgroundStart: "#fceff9",
      backgroundEnd: "#f5d2f4",
      headerBg: "#fff4fb",
      headerBorder: "#f3c6ec",
      contentBg: "#fff7fd",
      textPrimary: "#3a103f",
      textSecondary: "#4f1c52",
      accent: "#c026d3",
      surfaceShadow: "0 12px 34px rgba(122, 31, 145, 0.22)",
    },
  },
  {
    name: "EcoMug",
    companyName: "EcoMug Studio",
    fontFamily: "\"Nunito\", \"Segoe UI\", system-ui, sans-serif",
    logo: {
      src: ecoMugLogo,
      alt: "EcoMug logo",
    },
    colors: {
      primary: "#0f9d58",
      primaryDark: "#0a6d3f",
      secondary: "#1c3b2c",
      accent: "#0f9d58",
      success: "#34d399",
      warning: "#fbbf24",
      danger: "#b91c1c",
      gray100: "#eef8f2",
      gray300: "#d5f1e0",
      gray500: "#294534",
      backgroundStart: "#eef8f2",
      backgroundEnd: "#d5f1e0",
    },
    layout: {
      backgroundStart: "#eef8f2",
      backgroundEnd: "#d5f1e0",
      headerBg: "#f8fff8",
      headerBorder: "#c8e7d4",
      contentBg: "#ffffff",
      textPrimary: "#1c3b2c",
      textSecondary: "#294534",
      accent: "#0f9d58",
      surfaceShadow: "0 12px 32px rgba(15, 157, 88, 0.15)",
    },
  },
  {
    name: "Kitchenique",
    companyName: "Kitchenique Brands",
    fontFamily: "\"Poppins\", \"Segoe UI\", system-ui, sans-serif",
    logo: {
      src: kitcheniqueLogo,
      alt: "Kitchenique logo",
    },
    colors: {
      primary: "#f97316",
      primaryDark: "#c2410c",
      secondary: "#5f2b00",
      accent: "#f97316",
      success: "#22c55e",
      warning: "#fbbf24",
      danger: "#dc2626",
      gray100: "#fff4ea",
      gray300: "#ffd7b8",
      gray500: "#71360a",
      backgroundStart: "#fff4ea",
      backgroundEnd: "#ffd7b8",
    },
    layout: {
      backgroundStart: "#fff4ea",
      backgroundEnd: "#ffd7b8",
      headerBg: "#fff7f0",
      headerBorder: "#ffd4b3",
      contentBg: "#fffdfb",
      textPrimary: "#5f2b00",
      textSecondary: "#71360a",
      accent: "#f97316",
      surfaceShadow: "0 10px 28px rgba(179, 81, 7, 0.25)",
    },
  },
  {
    name: "Maplewood",
    companyName: "Maplewood Workshop",
    fontFamily: "\"Merriweather\", \"Times New Roman\", serif",
    logo: {
      src: maplewoodLogo,
      alt: "Maplewood logo",
    },
    colors: {
      primary: "#b45309",
      primaryDark: "#92400e",
      secondary: "#3f2a1f",
      accent: "#b45309",
      success: "#22c55e",
      warning: "#f97316",
      danger: "#dc2626",
      gray100: "#f9f4ef",
      gray300: "#efd9c2",
      gray500: "#4f3627",
      backgroundStart: "#f9f4ef",
      backgroundEnd: "#efd9c2",
    },
    layout: {
      backgroundStart: "#f9f4ef",
      backgroundEnd: "#efd9c2",
      headerBg: "#fff8f0",
      headerBorder: "#e4cbb1",
      contentBg: "#fffdf9",
      textPrimary: "#3f2a1f",
      textSecondary: "#4f3627",
      accent: "#b45309",
      surfaceShadow: "0 14px 34px rgba(79, 54, 39, 0.2)",
    },
  },
  {
    name: "PetPals",
    companyName: "PetPals Network",
    fontFamily: "\"Quicksand\", \"Segoe UI\", system-ui, sans-serif",
    logo: {
      src: petPalsLogo,
      alt: "PetPals logo",
    },
    colors: {
      primary: "#0284c7",
      primaryDark: "#0369a1",
      secondary: "#0d3554",
      accent: "#0284c7",
      success: "#22c55e",
      warning: "#fbbf24",
      danger: "#dc2626",
      gray100: "#e8f5ff",
      gray300: "#c0e2ff",
      gray500: "#173c59",
      backgroundStart: "#e8f5ff",
      backgroundEnd: "#c0e2ff",
    },
    layout: {
      backgroundStart: "#e8f5ff",
      backgroundEnd: "#c0e2ff",
      headerBg: "#f1f8ff",
      headerBorder: "#b5d7ff",
      contentBg: "#ffffff",
      textPrimary: "#0d3554",
      textSecondary: "#173c59",
      accent: "#0284c7",
      surfaceShadow: "0 12px 32px rgba(8, 80, 140, 0.2)",
    },
  },
  {
    name: "PureAroma",
    companyName: "Pure Aroma Co.",
    fontFamily: "\"Cormorant Garamond\", Georgia, serif",
    logo: {
      src: pureAromaLogo,
      alt: "Pure Aroma logo",
    },
    colors: {
      primary: "#9333ea",
      primaryDark: "#7e22ce",
      secondary: "#351a47",
      accent: "#9333ea",
      success: "#22d3ee",
      warning: "#fbbf24",
      danger: "#db2777",
      gray100: "#f9f1ff",
      gray300: "#ead8ff",
      gray500: "#462456",
      backgroundStart: "#f9f1ff",
      backgroundEnd: "#ead8ff",
    },
    layout: {
      backgroundStart: "#f9f1ff",
      backgroundEnd: "#ead8ff",
      headerBg: "#ffffff",
      headerBorder: "#e0c0ff",
      contentBg: "#fcf7ff",
      textPrimary: "#351a47",
      textSecondary: "#462456",
      accent: "#9333ea",
      surfaceShadow: "0 14px 34px rgba(81, 32, 115, 0.22)",
    },
  },
  {
    name: "StrideStep",
    companyName: "StrideStep Apparel",
    fontFamily: "\"Fira Sans\", \"Segoe UI\", system-ui, sans-serif",
    logo: {
      src: strideStepLogo,
      alt: "StrideStep logo",
    },
    colors: {
      primary: "#3b82f6",
      primaryDark: "#1d4ed8",
      secondary: "#0f1f38",
      accent: "#3b82f6",
      success: "#22c55e",
      warning: "#fbbf24",
      danger: "#dc2626",
      gray100: "#f0f7ff",
      gray300: "#d0e8ff",
      gray500: "#1a2a44",
      backgroundStart: "#f0f7ff",
      backgroundEnd: "#d0e8ff",
    },
    layout: {
      backgroundStart: "#f0f7ff",
      backgroundEnd: "#d0e8ff",
      headerBg: "#f7fbff",
      headerBorder: "#c3dcff",
      contentBg: "#ffffff",
      textPrimary: "#0f1f38",
      textSecondary: "#1a2a44",
      accent: "#3b82f6",
      surfaceShadow: "0 12px 36px rgba(15, 31, 56, 0.18)",
    },
  },
  {
    name: "SubmmitTents",
    companyName: "Submmit Tents Co.",
    fontFamily: "\"Barlow\", \"Segoe UI\", system-ui, sans-serif",
    logo: {
      src: submmitTentsLogo,
      alt: "Submmit Tents logo",
    },
    colors: {
      primary: "#0ea5e9",
      primaryDark: "#0369a1",
      secondary: "#0b2c33",
      accent: "#0ea5e9",
      success: "#22c55e",
      warning: "#facc15",
      danger: "#b91c1c",
      gray100: "#eef7fa",
      gray300: "#c7e7ef",
      gray500: "#103741",
      backgroundStart: "#eef7fa",
      backgroundEnd: "#c7e7ef",
    },
    layout: {
      backgroundStart: "#eef7fa",
      backgroundEnd: "#c7e7ef",
      headerBg: "#f8fdff",
      headerBorder: "#c1e0ea",
      contentBg: "#ffffff",
      textPrimary: "#0b2c33",
      textSecondary: "#103741",
      accent: "#0ea5e9",
      surfaceShadow: "0 12px 30px rgba(9, 67, 97, 0.18)",
    },
  },
  {
    name: "SwiftCharge",
    companyName: "SwiftCharge Energy",
    fontFamily: "\"Space Grotesk\", \"Segoe UI\", system-ui, sans-serif",
    logo: {
      src: swiftChargeLogo,
      alt: "SwiftCharge logo",
    },
    colors: {
      primary: "#2563eb",
      primaryDark: "#1d4ed8",
      secondary: "#081930",
      accent: "#2563eb",
      success: "#22d3ee",
      warning: "#fbbf24",
      danger: "#dc2626",
      gray100: "#f3f8ff",
      gray300: "#cde4ff",
      gray500: "#142847",
      backgroundStart: "#f3f8ff",
      backgroundEnd: "#cde4ff",
    },
    layout: {
      backgroundStart: "#f3f8ff",
      backgroundEnd: "#cde4ff",
      headerBg: "#f2f7ff",
      headerBorder: "#c5ddff",
      contentBg: "#ffffff",
      textPrimary: "#081930",
      textSecondary: "#142847",
      accent: "#2563eb",
      surfaceShadow: "0 12px 34px rgba(8, 25, 48, 0.22)",
    },
  },
];
