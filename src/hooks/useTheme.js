import { useState, useEffect } from 'react';
import { THEMES, PALETTES } from '../theme/themes';
import { applyThemeVars } from '../utils/themeUtils';
import { load, save } from '../utils/storage';

/**
 * Zarządza stanem motywu kolorystycznego.
 * Aplikuje zmienne CSS przy każdej zmianie i persystuje wybór w localStorage.
 */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const s = load("hj_theme", "pergamin");
    const name = PALETTES.includes(s) ? s : "pergamin";
    applyThemeVars(THEMES[name] || THEMES.pergamin);
    return name;
  });

  useEffect(() => {
    applyThemeVars(THEMES[theme] || THEMES.pergamin);
    save("hj_theme", theme);
  }, [theme]);

  return { theme, setTheme };
}
