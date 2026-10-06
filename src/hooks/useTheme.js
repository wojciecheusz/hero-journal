import { useState, useEffect } from 'react';
import { THEMES, PALETTES, THEME_MIGRATION } from '../theme/themes';
import { applyThemeVars } from '../utils/themeUtils';
import { load, save } from '../utils/storage';

/**
 * Zarządza stanem motywu kolorystycznego.
 * Aplikuje zmienne CSS przy każdej zmianie i persystuje wybór w localStorage.
 */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = load("hj_theme", "arcane");
    /* Usunięty motyw → najbliższy z pozostałych (P32) */
    const s = THEME_MIGRATION[saved] || saved;
    const name = PALETTES.includes(s) ? s : "arcane";
    applyThemeVars(THEMES[name] || THEMES.arcane);
    return name;
  });

  useEffect(() => {
    applyThemeVars(THEMES[theme] || THEMES.arcane);
    save("hj_theme", theme);
  }, [theme]);

  return { theme, setTheme };
}
