import React, { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const root = window.document.documentElement;

    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
    }
  }, [theme]);
  
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <div className="flex space-x-2">
      <button
        className={`p-2 rounded ${theme === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
        onClick={() => handleThemeChange('light')}
      >
        Light
      </button>
      <button
        className={`p-2 rounded ${theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
        onClick={() => handleThemeChange('dark')}
      >
        Dark
      </button>
    </div>
  );
};

export default ThemeToggle;
