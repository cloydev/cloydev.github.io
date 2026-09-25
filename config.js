/*
 * Portfolio settings — the one place to change links, screenshots and media.
 * Loaded before script.js on every page. No keys or private URLs belong here.
 */

// Public Waiz Earn address. Leave it as "" to hide the live preview and link.
const WAIZ_EARN_URL = "https://waizearn.com/";

window.PORTFOLIO_CONFIG = Object.freeze({
  email: "urcloyd@gmail.com",
  timeZone: "Asia/Manila",

  projects: {
    waiz: {
      title: "Waiz Earn",
      label: "AI-assisted web project",
      url: WAIZ_EARN_URL,
      // Live mode renders the real site at these layout sizes, then scales it to fit.
      // Screenshot mode shows real captures at their own size.
      desktop: {
        width: 1440,
        height: 900,
        screenshot: "images/waiz-desktop.webp",
        shotWidth: 1901,
        shotHeight: 872
      },
      mobile: {
        width: 390,
        height: 844,
        screenshot: "images/waiz-mobile.webp",
        shotWidth: 483,
        shotHeight: 766
      }
    },

    /*
     * Add real samples here and they appear on the Works page automatically.
     * Video:  { type: "video", src: "videos/my-edit.mp4", poster: "images/my-edit.jpg", title: "Short edit" }
     * Photo:  { type: "image", src: "images/photo-1.jpg", alt: "Edited portrait in warm light" }
     */
    video: { title: "Video editing", media: [] },
    photo: { title: "Photoshoot editing", media: [] },
    promo: { title: "Promo videos", media: [] }
  }
});
