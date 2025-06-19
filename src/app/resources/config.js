const baseURL = "alexyroman.com";

const routes = {
  "/": true,
  "/about": true,
  "/work": true,
  "/privacy-policy": true,
  "/legal-notice": true,
  "/cookie-policy": true,
  "/blog": true,
  "/gallery": false,
};

// Enable password protection on selected routes
// Set password in the .env file, refer to .env.example
const protectedRoutes = {
  "/work/automate-design-handovers-with-a-figma-to-code-pipeline": true,
};

import { Geist } from "next/font/google";
import { Geist_Mono } from "next/font/google";

const primaryFont = Geist({
  variable: "--font-primary",
  subsets: ["latin"],
  display: "swap",
});

const monoFont = Geist_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  display: "swap",
});

const font = {
  primary: primaryFont,
  secondary: primaryFont,
  tertiary: primaryFont,
  code: monoFont,
};

const style = {
  theme: "dark", // theme is not necessary when using ThemeProvider (default)
  neutral: "custom", // sand | gray | slate | custom
  brand: "custom", // blue | indigo | violet | magenta | pink | red | orange | yellow | moss | green | emerald | aqua | cyan | custom
  accent: "custom", // blue | indigo | violet | magenta | pink | red | orange | yellow | moss | green | emerald | aqua | cyan | custom
  solid: "contrast", // color | contrast
  solidStyle: "flat", // flat | plastic
  border: "playful", // rounded | playful | conservative
  surface: "translucent", // filled | translucent
  transition: "all", // all | micro | macro
  scaling: "100" // 90 | 95 | 100 | 105 | 110
};

// Gulf Oil Inspired Color Palette
// Based on the iconic Gulf Oil branding: light blue, orange, and neutral tones
// Primary colors: Gulf Blue (#6AC5F4) and Gulf Orange (#FF7403)
const customColors = {
  brand: {
    // Gulf Blue palette (light blue as primary brand color)
    100: "#0A1419",   // Very dark blue-gray
    200: "#142832",   // Dark blue-gray
    300: "#1E3C4B",   // Medium dark blue
    400: "#285064",   // Medium blue
    500: "#32647D",   // Medium light blue
    600: "#6AC5F4",   // Gulf Light Blue (primary)
    700: "#87D1F6",   // Lighter blue
    800: "#A4DDF8",   // Very light blue
    900: "#C1E9FA",   // Pale blue
    1000: "#DEF5FC",  // Very pale blue
    1100: "#EEFAFD",  // Near white blue
    1200: "#F7FCFE",  // Almost white
    // Alpha variants of Gulf Blue
    "600-10": "#6AC5F41A", // 10% opacity
    "600-30": "#6AC5F44D", // 30% opacity  
    "600-50": "#6AC5F480", // 50% opacity
  },
  accent: {
    // Gulf Orange palette (orange as accent color)
    100: "#1A0C02",   // Very dark orange-brown
    200: "#331804",   // Dark orange-brown
    300: "#4D2406",   // Medium dark orange
    400: "#663008",   // Medium orange-brown
    500: "#B85A06",   // Medium orange
    600: "#FF7403",   // Gulf Orange (primary)
    700: "#FF8F33",   // Lighter orange
    800: "#FFAA63",   // Light orange
    900: "#FFC593",   // Pale orange
    1000: "#FFE0C3",  // Very pale orange
    1100: "#FFF0E1",  // Near white orange
    1200: "#FFF8F0",  // Almost white
    "600-10": "#FF74031A", // 10% opacity
    "600-30": "#FF74034D", // 30% opacity
    "600-50": "#FF740380", // 50% opacity
  },
  neutral: {
    // Clean neutral grays (inspired by Gulf's clean aesthetic)
    100: "#0F0F0F",   // Very dark gray
    200: "#1E1E1E",   // Dark gray
    300: "#2D2D2D",   // Medium dark gray
    400: "#3C3C3C",   // Medium gray
    500: "#5A5A5A",   // Medium light gray
    600: "#787878",   // Light gray
    700: "#969696",   // Lighter gray
    800: "#B4B4B4",   // Very light gray
    900: "#D2D2D2",   // Pale gray
    1000: "#E6E6E6",  // Very pale gray
    1100: "#F0F0F0",  // Near white
    1200: "#F8F8F8",  // Almost white
    "600-10": "#7878781A", // 10% opacity
    "600-30": "#7878784D", // 30% opacity
    "600-50": "#78787880", // 50% opacity
  }
};

const effects = {
  mask: {
    cursor: false,
    x: 50,
    y: 0,
    radius: 100,
  },
  gradient: {
    display: false,
    opacity: 100,
    x: 50,
    y: 60,
    width: 100,
    height: 50,
    tilt: 0,
    colorStart: "accent-background-strong",
    colorEnd: "page-background",
  },
  dots: {
    display: true,
    opacity: 40,
    size: "2",
    color: "brand-background-strong",
  },
  grid: {
    display: false,
    opacity: 100,
    color: "neutral-alpha-medium",
    width: "0.25rem",
    height: "0.25rem",
  },
  lines: {
    display: false,
    opacity: 100,
    color: "neutral-alpha-weak",
    size: "16",
    thickness: 1,
    angle: 45,
  },
};

const display = {
  location: true,
  time: true,
  themeSwitcher: true
};

const mailchimp = {
  action: "https://url/subscribe/post?parameters",
  effects: {
    mask: {
      cursor: true,
      x: 50,
      y: 0,
      radius: 100,
    },
    gradient: {
      display: true,
      opacity: 90,
      x: 50,
      y: 0,
      width: 50,
      height: 50,
      tilt: 0,
      colorStart: "accent-background-strong",
      colorEnd: "static-transparent",
    },
    dots: {
      display: true,
      opacity: 20,
      size: "2",
      color: "brand-on-background-weak",
    },
    grid: {
      display: false,
      opacity: 100,
      color: "neutral-alpha-medium",
      width: "0.25rem",
      height: "0.25rem",
    },
    lines: {
      display: false,
      opacity: 100,
      color: "neutral-alpha-medium",
      size: "16",
      thickness: 1,
      angle: 90,
    },
  },
};

export { routes, protectedRoutes, effects, style, display, mailchimp, baseURL, font, customColors };
