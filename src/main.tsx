import React from 'react'
import ReactDOM from 'react-dom/client'
import { NextUIProvider } from '@nextui-org/react';
import App from './App.tsx'
import './index.css'

const originalWarn = console.warn;

console.warn = (...args) => {
  const isAccessibilityWarning = args.some(
    arg =>
      typeof arg === "string" &&
      arg.includes(
        "An aria-label or aria-labelledby prop is required for accessibility."
      )
  );

  if (!isAccessibilityWarning) {
    originalWarn(...args);
  }
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NextUIProvider>
      <App />
    </NextUIProvider>
  </React.StrictMode>,
)
