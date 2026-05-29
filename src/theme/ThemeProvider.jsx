
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { THEMES } from "./themes";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState("mrok");

  const theme = useMemo(() => {
    return THEMES[themeName] || THEMES.mrok;
  }, [themeName]);

  useEffect(() => {
    const root = document.documentElement;

    Object.entries(theme).forEach(([key, value]) => {
      if (typeof value === "string") {
        root.style.setProperty(`--${key}`, value);
      }
    });
  }, [theme]);

  return (
    <ThemeContext.Provider value={{
      theme,
      themeName,
      setThemeName
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
