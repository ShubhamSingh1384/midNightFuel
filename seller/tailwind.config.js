/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'
export default {
  content: ["./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        mylight: {      // Custom theme name
          "primary": "#A3D9FF",    // You can customize your colors here
          "secondary": "#F3F4F6",  // Adjust other properties if needed
          "accent": "#FF6347",
          "neutral": "#3D4451",
          "base-100": "#ffffff",   // Base color for light theme
        },
      },
      "light",   // You can add the built-in "light" theme as well
    ],
    darkTheme: "light",  // Set the default theme to light
  },
}

