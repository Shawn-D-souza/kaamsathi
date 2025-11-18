import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#005A9C',
        'brand-orange': '#FF6700',
        'brand-text': '#212121',
        'brand-bg': '#FFFFFF',
      },
    },
  },
  plugins: [],
};
export default config;