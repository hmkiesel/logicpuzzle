import React from "react";
import { ThemeProvider as EmotionThemeProvider } from "emotion-theming";
import Theme from "./Theme";

const DefaultContextData = {
  dark: false,
  toggle: () => {}
};

const ThemeContext = React.createContext(DefaultContextData);
const UseTheme = () => {
  React.useContext(ThemeContext);
};

const useEffectDarkMode = () => {
  const [ThemeState, SetThemeState] = React.useState({
    dark: false,
    hasThemeLoaded: false
  });
  React.useEffect(() => {
    const isDark = localStorage.getItem("dark") === "true"; //if doesn't work, try: JSON.stringify(true);
    SetThemeState({
      ...ThemeState,
      dark: isDark,
      hasThemeLoaded: true
    });
  }, [ThemeState]);

  return [ThemeState, SetThemeState];
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

  const computedTheme = ThemeState.dark ? Theme("dark") : Theme("dark");

  return (
    <EmotionThemeProvider Theme={computedTheme}>
      <ThemeContext.Provider
        value={{
          dark: ThemeState.dark,
          toggle
        }}
      >
        {children}
      </ThemeContext.Provider>
    </EmotionThemeProvider>
  );
};

export { ThemeProvider, UseTheme };
