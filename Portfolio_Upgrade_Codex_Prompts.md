# Portfolio upgrade — Codex prompts

Open your portfolio folder in VS Code. Make the reference screenshots and screen recordings available in that folder, preferably under `design-reference/`. Paste Prompt 1 into Codex. Prompts 2–4 are separate, optional image-generation prompts; use each independently.

The public Waiz Earn URL and real project media must come from you or your existing files. The implementation can proceed while missing assets are documented. Generated artwork must not be presented as a screenshot of a working project.

---

## Prompt 1 — Upgrade my existing portfolio in VS Code

You are working directly in my existing portfolio project. Act as an experienced frontend developer and visual designer. Inspect my files, improve the implementation, and verify the result in a browser when browser tools are available. Complete the work; do not stop after giving me a plan or isolated code snippets.

### 1. Understand the project before editing

Read the applicable AGENTS.md instructions and inspect the actual project structure, HTML, CSS, JavaScript, media, and any package configuration. Preserve unrelated work and existing user edits.

The portfolio files I originally supplied are:

- `index(3).html`
- `works(2).html`
- `about(2).html`
- `contact(2).html`
- `styles(1).css`

Their internal links currently expect ordinary names such as `index.html` and `styles.css`. Inspect the workspace to identify the authoritative versions. If necessary, normalize the filenames and update every affected reference together. Do not overwrite a newer canonical file with an older numbered duplicate or create competing versions of the site.

The current site uses plain HTML and CSS, with Home, Works, About, and Contact pages. Keep that approachable structure and add a small shared JavaScript file where needed. Retain working direct page URLs and browser Back/Forward behavior. Do not migrate this static project to React, Next.js, or a large build system solely for visual effects. If the workspace has already changed to a framework, follow its established architecture instead.

### 2. My identity and content

My name is Kevin Cloyd Divinagracia. Use Kevin Cloyd where a short display name fits better. I am based in the Philippines.

My portfolio focuses on:

1. Video editing.
2. Photoshoot and image editing.
3. Promo videos.
4. Waiz Earn, my AI-assisted web project.

For Waiz Earn, show these tools accurately:

| Tool | Role to display |
| --- | --- |
| Claude | AI-assisted development |
| Codex | AI-assisted development |
| VS Code | Code editor |
| Hostinger | Hosting |

Use natural, basic English. Favor actual media, recognizable icons, short labels, and concise sentences. Do not invent years of experience, clients, testimonials, certifications, user totals, earnings, awards, or skill percentages. Do not describe me as offering professional web development services just because Waiz Earn is a web project.

Do not add Editwata vlog, business strategy presentations, logo projects, or unrelated portfolio categories. Remove visible CLOYDEV/@cloydev branding. Keep genuine social URLs containing `cloydev` intact; removing display branding must not break my accounts.

Preserve contact details and social destinations from the actual files. The reviewed version contains `urcloyd@gmail.com`, `09817209882`, Facebook, Instagram, and GitHub. Use current workspace values if I have since updated them. Do not invent a LinkedIn account or other contact destination.

Use my real portrait if available, preserving my face and proportions. The original pages reference `profile.png`, which was missing from the supplied set. If it remains missing, use a clean KC initials treatment and document the asset needed. Do not use the reference site's person or invent a portrait of me.

### 3. Visual reference and design direction

Reference website: https://portfolio.brewedops.cloud/

Study the supplied screenshots and both recordings, including the mobile section. The screenshots are named:

- `Screenshot 2026-09-17 093651.png` — Home.
- `Screenshot 2026-09-17 093841.png` — About.
- `Screenshot 2026-09-17 093824.png` — Contact.

The recordings are `Screen Recording 2026-09-07 213830.mp4` and `Screen Recording 2026-09-17 093753.mp4`. The later recording shows the animated curved background and mobile layout. If you cannot inspect the live site or videos, say so and use the available screenshots and this brief. Do not pretend to have inspected unavailable references.

Create a cohesive interpretation of this visual style using my identity and work:

- Warm ivory page background.
- Large, thin, gently moving curved outlines behind the content.
- Deep navy headings, muted blue-gray body text, and restrained orange accents.
- Large rounded outer panels with a subtle white-to-pale-blue gradient.
- Smaller ivory/white cards inside those panels, with thin borders and soft shadows.
- A balanced grid of cards with different widths, precise alignment, and generous internal spacing.
- Clear typography, simple outline icons, pill-shaped actions, and tasteful project imagery.

Suggested starting palette, adjustable for contrast and visual matching:

- Background: `#F4F4ED`.
- Cards: `#FCFCF8`.
- Navy: `#0B1E3F`.
- Muted text: `#647089`.
- Orange accent: `#FF7A16`.
- Pale blue: `#D5E2FF`.
- Borders: `#DCE0E5`.

Define shared CSS variables for colors, spacing, typography, radii, shadows, and motion. Use roughly 28–36px outer panel corners and 18–24px inner card corners, adjusted to the viewport. Keep a single consistent type system with a good local/system fallback. Avoid a long loading sequence, excessive glass blur, neon effects, and decorative clutter.

The reference contains another person's services, badges, testimonials, tools, and chatbot. They are visual references, not my content or required features. Keep my four-page scope.

### 4. Essential layout rule: no long scrolling portfolio

I want clients to understand each page immediately without scrolling through a long website.

At normal text size, design Home, Works, About, and Contact to fit within the visible screen at these representative sizes:

- Desktop: 1366×768, 1440×900, and 1920×1080.
- Mobile: 360×800, 390×844, and 430×932.

Use concise content, height-aware layouts, tabs, project selectors, and modal previews. Do not build a long landing page, full-screen scroll-snap sections, or a stack of oversized sections. Do not hide essential content with unconditional `overflow: hidden`, fixed-height clipping, or unreadably small type.

Use `100dvh` where suitable, account for safe-area insets and navigation height, and use correct flex/grid sizing such as `min-height: 0`. Respond to viewport height as well as width. Aim for comfortable 15–16px body text and usable 44px touch targets; small metadata can be smaller.

Desktop: use a restrained fixed sidebar, approximately 240–320px wide depending on the screen, and a main area with balanced outer padding.

Mobile: replace the sidebar with a compact identity header and a floating bottom navigation containing Home, Works, About, and Contact. Give Contact an orange emphasis. Keep labels visible and reserve space so the navigation never covers content.

On mobile, use a compact selected-project card or a horizontal carousel with buttons and a position indicator. Swiping can be supported but must not be the only way to navigate. Keep essential information visible without swiping.

On exceptionally short screens, landscape phones, enlarged text, browser zoom, or when the software keyboard opens, allow necessary vertical access instead of clipping content. This is an accessibility fallback, not the default page design. The embedded Waiz Earn website may scroll inside its own preview; the surrounding portfolio should remain in place.

### 5. Page composition and text limits

HOME

- Small identity header and one strong heading of roughly 5–9 words.
- One introductory sentence of about 15–25 words.
- A prominent Waiz Earn card with a real desktop/mobile preview composition and a clear “Preview project” action.
- Compact cards or selector items for Video Editing, Photoshoot Editing, and Promo Video.
- A small About entry and an obvious contact action.
- A compact tooling row only where meaningful; identify Claude, Codex, VS Code, and Hostinger as the Waiz Earn stack. Do not present categories such as “Video Editing” as software tools.
- Avoid repeating the same introduction, services list, and contact pitch in several cards.

WORKS

- Present the four real work categories with strong visual hierarchy.
- Use a compact 2×2 layout on roomy desktop screens or one large selected project beside a concise selector if that fits better.
- On mobile, use a single selected project with clear previous/next or category controls.
- Each project needs a title, a short description, its real media when available, and one meaningful action.
- Use a shared project viewer for video playback, image galleries, and Waiz Earn's device preview.
- Show before/after controls only when matching original and edited photos really exist.
- Use native video controls. No autoplay with sound, fake play buttons, or decorative media controls that do nothing.

ABOUT

- A short introduction, one real photo or initials treatment, and three or four compact capability rows.
- Keep the main biography around 40–60 words or less.
- Suggested rows: Video Editing, Photo Editing, Promo Videos, and AI-assisted Projects.
- An expanded biography can be available on demand if useful, but the default page should fit the screen.
- Use real facts only, with no ratings or invented professional credentials.

CONTACT

- A clear short heading and recognizable email/social contact actions.
- Keep the two-panel visual idea from the reference: a compact navy information/FAQ panel beside a light contact panel.
- Limit FAQs to two or three short, useful questions; use an accordion or a compact selector so they do not create page overflow.
- Prioritize working direct email, Facebook, Instagram, and any existing phone action.
- If a message form is retained, use Name, Email, and Message only unless a fourth field is genuinely necessary. Connect it to an existing configured backend if one exists.
- Without a real backend, use an honestly labeled “Open email app” flow or direct email action. It must not claim “Message sent.” If preparing an email, encode the subject/body correctly and include a copy-email fallback.
- Never put private API keys in frontend code. Do not add a paid contact service, account registration, or external data collection without my instruction.

### 6. Required Waiz Earn preview inside my portfolio

Make Waiz Earn a real interactive portfolio feature. Clicking its main preview action must open an in-page modal/project viewer, not immediately send the visitor to another website.

The viewer must include:

- “Waiz Earn” and a short “AI-assisted web project” label.
- Compact Claude, Codex, VS Code, and Hostinger tool chips.
- Clearly labeled Desktop and Mobile controls, with the selected mode apparent visually and accessibly.
- A device/browser frame, a close button, and “Open website” as a separate secondary action.
- A useful loading state, a screenshot option, and a clear unavailable state.

Desktop mode must render the website at an actual desktop layout width, for example 1440×900. Mobile mode must use an actual narrow layout viewport, for example 390×844. Scale the complete device stage to fit the available viewer space while preserving its aspect ratio. Merely stretching the same screenshot or changing the frame decoration is not a responsive website preview.

Use real desktop and mobile captures for screenshot mode. If permitted and available, capture the public site at both viewport sizes. Do not render a narrow iframe and label it Desktop. Recalculate fit on viewport changes and keep controls outside the scaled stage so they stay readable and tappable.

Resolve the public project URL from my existing files or a URL I provide. Keep it in one obvious configuration value such as `WAIZ_EARN_URL`. If no verified URL is available, leave that value empty, finish screenshot/gallery mode with any real supplied assets, and document the single missing URL. Do not guess a domain or a private dashboard address.

For live mode, use an iframe only if the public website permits it. Verify embedding in a browser when possible; HTTP frame restrictions and authentication can prevent it. Do not bypass `X-Frame-Options` or CSP, proxy around restrictions, or weaken another site's security settings.

Do not assume an iframe's load event proves successful rendering: cross-origin failures are not reliably detectable from the parent. Keep an explicit “View screenshots” option and an “Open website” action available. Use truthful wording such as “Preview unavailable” only when failure is established; otherwise provide “Having trouble? View screenshots or open the website.” Avoid an endless spinner or a false success state.

Only create/load the live iframe after the visitor requests it. Give it an accessible title and a considered permissions policy. Do not grant top-level navigation, camera, microphone, or unrelated permissions. Do not automatically log in, enter credentials, display private account data, or perform account actions. Stop video playback and unload unnecessary live media when the viewer closes.

Support Escape to close when focus is in the portfolio, a persistent close button, sensible initial focus, and focus restoration to the opening control. Do not trap a visitor inside the embedded page; an always-accessible outer close control matters because keyboard events inside a cross-origin iframe do not reach the parent normally.

### 7. Icons, backgrounds, images, and motion

Replace placeholder letters such as “f”, “ig”, and “gh”, and unrelated Unicode navigation symbols, with a consistent SVG icon treatment. Use Lucide for interface icons, or another equally coherent lightweight set already installed. Use recognizable official brand assets for brands where available, with text labels as the fallback; Lucide is not a source of every brand logo.

Icons must support understanding, not replace every label. Keep decorative SVGs out of the accessibility tree and give icon-only controls accessible names. Prefer local SVG assets or a small selection of bundled icons; do not ship a whole icon library unnecessarily. Preserve required license notices.

Build the curved background and simple icon backplates with CSS/SVG. Keep the curves thin and low contrast, with perhaps two or three slow-moving elements. Avoid a WebGL/Three.js dependency for this effect; the portfolio must remain visible when graphics acceleration is unavailable.

Use short hover transitions around 160–220ms, modest card lifts, and restrained panel transitions around 220–320ms. Animate opacity and transforms where possible. Keep layout stable. Do not require waiting for an entrance animation before clicking a control.

Respect `prefers-reduced-motion`: stop decorative drifting, disable cursor-follow/tilt/parallax effects, and keep transitions minimal. Pause unnecessary activity when the page is hidden. Any optional cursor ring must preserve the normal cursor and be disabled for touch and reduced motion. Omit it if it makes the interface less reliable.

Add a small light/dark theme toggle only if you can finish both themes consistently. Start with the reference's light theme, preserve the visitor's explicit preference, and maintain readable contrast. This is secondary to completing the required pages and preview.

Use generated imagery only for optional decorative artwork. Use authentic screenshots, photos, and video thumbnails for actual work. Keep main navigation, precise symbols, text, tool logos, and responsive backgrounds in code/vector assets. Missing images must have a deliberate fallback rather than a broken image box. Do not display developer instructions such as “insert image here” to clients.

### 8. Research and implementation quality

You may browse for appropriate component patterns and technical documentation. Prefer official sources and reusable, licensed assets. Useful starting points:

- Lucide: https://lucide.dev/guide/
- Native dialog: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog
- Iframe behavior: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe
- Embedding restrictions: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors
- Reduced motion: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion
- Optional vanilla JavaScript animation: https://motion.dev/docs/quick-start

Prefer CSS transitions and native browser features for this project. Use an animation dependency only when it adds something clearly useful, and pin its version. Do not copy a framework-specific component into a plain HTML project without adapting it properly. Do not depend on remote scripts just to display essential navigation or content.

Keep the existing site easy to edit and deploy as static files. Use a shared stylesheet and a small shared script for common behavior. Avoid fragile runtime HTML fetching for the sidebar. Put editable project data, URLs, preview paths, and media in one understandable configuration location where practical. Validate configured external URLs before activating them.

Use semantic HTML, one appropriate main heading per page, descriptive page titles, meaningful image alternatives, visible keyboard focus, properly labeled controls, and clear selected states. For dialogs, prefer native `<dialog>` with `showModal()` and correct labeling. Keep form status messages accessible and honest.

No placeholder links that jump to the top, dead buttons, accidental horizontal page overflow, duplicate IDs, missing local assets, or raw development text in the visible interface. Do not add analytics, advertising, a chatbot, visitor counters, notifications, or unrelated features to create the appearance of complexity.

### 9. Verify the actual result

Run the site locally using the project's established workflow or a simple static server. If browser tools are available, inspect screenshots of all four pages at 1366×768 and 390×844, then check layout at the other target sizes. Check a short phone viewport and enlarged text to verify that the fallback keeps content accessible. Do not claim a browser check if you could not run it.

Verify behavior, not just appearance:

1. All four pages are reachable from desktop and mobile navigation, with the correct active item and working direct URLs.
2. Each main page fits the specified normal viewports without requiring vertical page scrolling and without clipped content or tiny text.
3. Waiz Earn opens inside the portfolio, switches between genuine desktop/mobile layout widths or correctly labeled captures, scales to fit, and closes reliably.
4. Screenshot mode still works when live embedding is unavailable. Missing URL/media states are intentional and truthful.
5. Galleries and videos work only with real assets; videos stop when their viewer closes.
6. Contact actions work, and any form accurately describes what happens to the message.
7. Keyboard navigation, focus return, reduced motion, and any implemented theme toggle work.
8. Check for console errors, missing assets, layout overflow, and noticeable shifts as images load.

Use focused automated checks only where they protect real behavior, such as navigation or preview mode switching. Do not build a large test suite just to restate CSS values. Fix concrete problems found during verification before finishing.

### 10. Finish the implementation

Make reasonable reversible design decisions and continue without asking me to approve every spacing, icon, or color choice. If an external credential, public URL, or media asset is missing, complete everything that does not depend on it and clearly identify the remaining item. Do not fabricate the missing content.

Deliver the implemented files, a brief summary of what changed, how to run the site, checks actually performed, and any unresolved external setup. Include a short README identifying where to change project links, screenshots, videos, and my profile photo. Add a compact asset list only if assets are missing.

Keep all changes local for review. Do not publish the site, push to a remote repository, change hosting settings, or submit contact forms as part of this task.

The finished result should feel cohesive, calm, polished, responsive, and easy to understand: a concise visual portfolio with real working interactions and Waiz Earn as a strong featured project.

---

## Prompt 2 — Optional abstract background artwork

Create one subtle abstract background image for a professional personal portfolio. Landscape 16:9 composition, ideally 3840×2160 or the highest supported resolution.

Use a warm ivory base close to #F4F4ED, with a very soft pale-blue wash close to #D5E2FF concentrated near the right edge. Add two or three enormous, extremely thin looping curves in muted blue-gray, extending beyond the edges of the image. The lines should feel calm and architectural, with low contrast and generous open space. Keep the center and upper-left especially quiet for website content. No dense pattern, strong vignette, obvious grain, glow, or dramatic shadows.

The mood is modern, precise, understated, and welcoming. This is a background asset only: no text, typography, letters, logos, people, icons, screenshots, devices, buttons, cards, UI, watermarks, or mock website layout. Do not include orange focal objects. Return one clean image, not a collage or several variations.

Integration note for the developer: this optional bitmap can be a low-contrast static fallback or panel texture. Build animated outline curves in CSS/SVG rather than moving a large background image. Do not use a raster image for the whole website layout.

---

## Prompt 3 — Optional creative editing illustration

Create one premium decorative illustration for the About card of Kevin Cloyd's personal portfolio. Square 1:1 composition, high resolution, with a genuinely transparent background and clean alpha edges.

Show a compact, carefully arranged still life of creative editing tools: an unbranded camera, two overlapping blank photo prints, a small play-button tile, and a short abstract editing timeline made from a few rounded blocks. Use a refined soft 3D style with matte ceramic-like surfaces, gentle bevels, and realistic but restrained depth. Use mostly warm ivory #F4F4ED and pale blue #D5E2FF, with navy #0B1E3F details and one small orange #FF7A16 accent. Light the objects softly from the upper left.

Keep the silhouette readable at small card sizes. Use four main objects at most, a balanced lower-center composition, and comfortable transparent margins. Avoid a cluttered pile of objects. Use a minimal soft contact shadow with transparency, no solid background plane.

No people, faces, hands, words, letters, numbers, logos, brand marks, fabricated project screenshots, watermarks, glowing effects, or simulated transparency checkerboards. Do not create a whole website, icon sheet, collage, or device mockup. Return one transparent PNG illustration.

---

## Prompt 4 — Optional decorative icon-card asset

Run this prompt once per asset. Replace the chosen subject with exactly one of the following: a camera for Photoshoot Editing; a film strip with a play symbol for Video Editing; a clapperboard for Promo Video; an unbranded browser window with one small abstract sparkle for an AI-assisted web project.

Create a single isolated decorative icon illustration of [CHOSEN SUBJECT]. Square 1:1 canvas, high resolution, genuinely transparent PNG background. Use a simple rounded silhouette and refined matte 3D surfaces. The object should sit just above a small pale-blue rounded tile with a soft ivory rim, with the area outside the object and tile fully transparent. Maintain comfortable equal margins.

Use ivory #F4F4ED, pale blue #D5E2FF, navy #0B1E3F, and a tiny orange #FF7A16 accent. Use soft upper-left lighting and a minimal shadow. Keep the object bold and readable when reduced to a small portfolio card. Match this exact angle, palette, material, and lighting across separate generations.

No text, letters, numbers, trademarks, company logos, random details, watermarks, solid square backdrop, or fake checkerboard transparency. Return only one subject in one image, not an icon sheet.

These assets are optional card decoration. Functional interface icons and Claude/Codex/VS Code/Hostinger branding should remain accurate vector assets or readable text labels.
