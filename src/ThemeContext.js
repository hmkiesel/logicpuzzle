import React from "react";
import { ThemeProvider as EmotionThemeProvider } from "emotion-theming";
import theme from "./Theme";

const defaultContextData = {
  dark: false,
  toggle: () => {}
};

const themeContext = React.createContext(defaultContextData);
const useTheme = () => {
  React.useContext(themeContext);
};

const useEffectDarkMode = () => {
  const [themeState, setThemeState] = React.useState({
    dark: false,
    hasThemeLoaded: false
  });
  React.useEffect(() => {
    const isDark = false; // localStorage.getItem("dark") === "true"; //if doesn't work, try: JSON.stringify(true);
    setThemeState({
      ...themeState,
      dark: isDark,
      hasThemeLoaded: true
    });
  }, [themeState]);

  return [themeState, setThemeState];
};

const ThemeProvider = ({ children }) => {
  const [ThemeState, SetThemeState] = useEffectDarkMode();

  if (!ThemeState.hasThemeLoaded) {
    return <div />;
  }

  const toggle = () => {
    const dark = !ThemeState.dark;
    localStorage.setItem("dark", JSON.stringify(dark));
    SetThemeState({ ...ThemeState, dark });
  };

  const computedTheme = ThemeState.dark ? theme("dark") : theme("dark");

  return (
    <EmotionThemeProvider Theme={computedTheme}>
      <themeContext.Provider
        value={{
          dark: ThemeState.dark,
          toggle
        }}
      >
        {children}
      </themeContext.Provider>
    </EmotionThemeProvider>
  );
};

export { ThemeProvider, useTheme as UseTheme };
