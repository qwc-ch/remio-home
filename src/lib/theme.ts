export const THEME_KEY = "theme";

export type Theme = "light" | "dark";

export const getSystemTheme = (): Theme =>
  window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

export const getStoredTheme = (): Theme | null => {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === "dark" || value === "light" ? value : null;
  } catch {
    return null;
  }
};

export const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
    root.setAttribute("data-theme", "dark");
  } else {
    root.classList.remove("dark");
    root.setAttribute("data-theme", "light");
  }
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch { /* ignore */ }
};

export const setTheme = (theme: Theme) => applyTheme(theme);

export const initTheme = (theme?: string) => {
  if (theme === "light" || theme === "dark") {
    applyTheme(theme);
    return theme;
  }
  const stored = getStoredTheme() || getSystemTheme();
  applyTheme(stored);
  return stored;
};