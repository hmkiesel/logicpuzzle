const WHITE = "#FFFFFF";
const BLACK = "#000000";
const LIGHT_GRAY = "#DDDDDD";
const DARK_GRAY = "#111111";

const ThemeLight = {
  background: LIGHT_GRAY,
  body: BLACK
};

const ThemeDark = {
  background: DARK_GRAY,
  body: WHITE
};

/*const MODE = {
  LIGHT: 0,
  DARK: 1
};*/

const Theme = mode => (mode === "dark" ? ThemeDark : ThemeLight); // MODE.DARK ? ThemeDark : ThemeLight);

export { Theme };
