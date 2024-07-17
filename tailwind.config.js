/** @type {import('tailwindcss').Config} */

const {nextui} = require("@nextui-org/react");

export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend:{},
  },
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: '#773DBD',
            background: '#ECECEC',
            onBackground: '#ECECEC',
            black: '#000000',
            white: '#ffffff',
            text: '#121212',
          },
        },
        dark: {
          colors: {
            primary: '#773DBD',
            background: '#121212',
            onBackground: '#27272a',
            black: '#000000',
            white: '#ffffff',
            text: '#ffffff',
          },
        },
      },
    }),
  ],
}
