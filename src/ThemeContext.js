import React from "react";
import { ThemeProvider as EmotionThemeProvider } from "emotion-theming";
import theme from "./Theme.js";

const defaultContextData = {
  dark: false,
  toggle: () => {}
};

const ThemeContext = React.createContext(defaultContextData);
const useTheme = () => React.useContext(ThemeContext);

const useEffectDarkMode = () => {
  const [themeState, setThemeState] = React.useState({
    dark: false,
    hasThemeLoaded: false
  });
  React.useEffect(() => {
    const isDark = localStorage.getItem("dark") === "true"; //if doesn't work, try: JSON.stringify(true);
    setThemeState({
      ...themeState,
      dark: isDark,
      hasThemeLoaded: true
    });
  }, []);

  return [themeState, setThemeState];
};

const ThemeProvider = ({ children }) => {
  const [themeState, setThemeState] = useEffectDarkMode();

  if (!themeState.hasThemeLoaded) {
    return <div />;
  }

  const toggle = () => {
    console.log(themeState);
    const dark = !themeState.dark;
    localStorage.setItem("dark", JSON.stringify(dark));
    setThemeState({ ...themeState, dark });
  };

  const computedTheme = themeState.dark ? theme("dark") : theme("light");
  return (
    <EmotionThemeProvider theme={computedTheme}>
      <ThemeContext.Provider
        value={{
          dark: themeState.dark,
          toggle
        }}
      >
        {children}
      </ThemeContext.Provider>
    </EmotionThemeProvider>
  );
};

export { ThemeProvider, useTheme };
