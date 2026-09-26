export const SPLASH_SEEN_KEY = "splash-seen";

/** Inline <head> script: skip the splash after the first page of a session, before first paint. */
export const splashScript = `try{if(sessionStorage.getItem("${SPLASH_SEEN_KEY}"))document.documentElement.dataset.splash="off"}catch(e){}`;
