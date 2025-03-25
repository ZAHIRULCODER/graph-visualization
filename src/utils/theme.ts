/**
 * Detect if the user prefers dark mode
 * @returns True if dark mode is preferred, false otherwise
 */
export const prefersDarkMode = (): boolean => {
  // Check if we're in a browser environment
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return false; // Default to light mode if not in browser or matchMedia not available
};

/**
 * Apply dark mode to the document
 * @param isDarkMode Whether to enable dark mode
 */
export const applyDarkMode = (isDarkMode: boolean): void => {
  if (isDarkMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

/**
 * Get theme-based color
 * @param lightColor Color for light mode
 * @param darkColor Color for dark mode
 * @param isDarkMode Whether dark mode is enabled
 * @returns The appropriate color based on the theme
 */
export const getThemeColor = (
  lightColor: string,
  darkColor: string,
  isDarkMode: boolean
): string => {
  return isDarkMode ? darkColor : lightColor;
};
