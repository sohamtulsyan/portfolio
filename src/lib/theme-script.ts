export const THEME_KEY = "theme";

/**
 * Runs in <head> before first paint so the page never flashes the wrong
 * scheme: a stored choice wins, otherwise the system preference.
 */
export const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}document.documentElement.dataset.theme=t}catch(e){}})();`;
