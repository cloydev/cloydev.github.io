# Kevin Cloyd — Creative Portfolio

A four-page static site (Home, Works, About, Contact). Plain HTML, CSS and
JavaScript. There is no build step and nothing to install.

## Run it

- **Quickest:** double-click `index.html`.
- **Recommended (closer to the real site):** in VS Code, install the *Live Server*
  extension, right-click `index.html`, then choose **Open with Live Server**.
  Page-to-page fade transitions and the Waiz Earn live preview behave best over
  `http://`.

To publish, upload the whole folder to Hostinger as-is. Keep the folder
structure the same.

## Where to change things

| What | Where |
| --- | --- |
| Waiz Earn address | `config.js` → `WAIZ_EARN_URL`. Leave it `""` to hide the live preview and the "Open website" buttons. |
| Waiz Earn screenshots | `images/waiz-desktop.webp` (1901 × 872) and `images/waiz-mobile.webp` (483 × 766). If you use a different size, update `shotWidth` and `shotHeight` in `config.js`. |
| Video, photo and promo samples | `config.js` → `projects.video.media`, `projects.photo.media`, `projects.promo.media`. Put the files in `videos/` or `images/` and list them (examples are in the file). Once listed, they appear on the Works page with a player or gallery. |
| Profile photo | `images/profile-720.webp` (large) and `images/profile-240.webp` (small). The original is `images/profile.png`. Any square photo works. A transparent background looks best, because the dark theme lights it with the lamp. |
| Email | `config.js` → `email`, plus the `mailto:` links in the four HTML files. |
| Phone, Facebook, Instagram, GitHub | The links in each HTML file (search for `tel:`, `facebook.com`, `instagram.com`, `github.com`). |
| Colors, spacing, fonts | `styles.css`, section **01. Design tokens** (light theme first, then `[data-theme="dark"]`). |

The sidebar, mobile header and bottom menu are repeated in each HTML file so the
site works without a server. If you change one of them, change it in all four.

## The lamp (theme switch)

Pull the cord on the hanging lamp (in the sidebar on desktop, or in the top-right
corner on phones). You can drag it or just click or tap it. It also works with
Tab plus Enter or Space.

- **Daylight** is the light theme and the default.
- **Lamplight** is the dark theme. The bulb flickers on and the new theme spreads
  out from the lamp.
- The visitor's choice is saved for their next visit.
- A quiet click sound plays only when someone pulls the cord.
- With "reduce motion" turned on, the switch is instant and nothing swings or
  drifts.

The lamp code is in `script.js` (`createLamp`). The styles are in `styles.css`,
section **06. Lamp theme switch**.

## Missing assets

The site is complete without these. It shows illustrations and a **"Samples on
request"** label instead of empty boxes.

- `videos/…mp4` for a video editing sample.
- Two or more edited photos for **Photoshoot editing**.
- `videos/…mp4` for a promo video sample.

Add a poster image for each video if you can, and a captions track if the video
has speech.

## Notes

- **Contact form:** it opens a draft in the visitor's email app. It never claims
  a message was sent. No form service, account or API key is used.
- **Waiz Earn live preview:** it loads only when the visitor presses **Live site**.
  It renders the real site at 1440 × 900 (desktop) or 390 × 844 (mobile), then
  scales it to fit. It runs in a sandbox: the site can't navigate the portfolio
  page or use the camera or microphone.
- **Old helper scripts:**
  - `tools/render_pages.py` is an older page generator. Running it would
    overwrite these pages with a previous design, so don't run it unless you
    mean to.
  - `tools/browser_check.py` needs Python and Playwright, which aren't installed
    on this computer.
- **Licenses:**
  - The fonts are Manrope and Instrument Serif (SIL Open Font License, in
    `assets/fonts/`).
  - The interface icons are from Lucide (ISC, in `assets/icons/`).
  - The Claude, OpenAI (Codex), VS Code and Hostinger marks come from Simple
    Icons. They only identify the tools used to build Waiz Earn.
