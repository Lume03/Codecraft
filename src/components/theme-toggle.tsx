'use client';

import { useEffect, useState } from 'react';
import { Switch } from './ui/switch';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = (checked: boolean) => {
    if (checked) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    setIsDarkMode(checked);
  };

  return (
    <div className="flex items-center gap-2">
      <Sun className="h-5 w-5" />
      <Switch checked={isDarkMode} onCheckedChange={toggleTheme} />
      <Moon className="h-5 w-5" />
    </div>
  );
}
