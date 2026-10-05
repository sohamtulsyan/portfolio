/**
 * Contract every theme fulfils. theme.css holds every value; this object
 * carries the few things that must be known in JavaScript.
 */
export interface ThemeDefinition {
  name: string;
  /** Browser UI colour (address bar on mobile) per colour scheme. Must be literal colours. */
  themeColor: { dark: string; light: string };
}
