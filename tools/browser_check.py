"""Browser checks for the static portfolio; requires Python Playwright.

Run: python tools/browser_check.py --all
Start the site separately: python -m http.server 8765 --bind 127.0.0.1
Screenshots and a JSON report are written under artifacts/browser-check/.
"""

import argparse
import json
from pathlib import Path

from playwright.sync_api import sync_playwright


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-url", default="http://127.0.0.1:8765")
    parser.add_argument("--page", default="index.html")
    parser.add_argument("--width", type=int, default=1366)
    parser.add_argument("--height", type=int, default=768)
    parser.add_argument("--all", action="store_true")
    parser.add_argument("--theme", choices=["light", "dark"], default="light")
    parser.add_argument("--output", default="artifacts/browser-check")
    parser.add_argument("--text-scale", type=float, default=1)
    args = parser.parse_args()
    output = Path(args.output)
    output.mkdir(parents=True, exist_ok=True)
    pages = ["index.html", "works.html", "about.html", "contact.html"] if args.all else [args.page]
    sizes = [(1366, 768), (1440, 900), (1920, 1080), (360, 800), (390, 844), (430, 932), (390, 568)] if args.all else [(args.width, args.height)]
    reports = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        context = browser.new_context(reduced_motion="reduce")
        context.add_init_script(f"localStorage.setItem('portfolio.theme', '{args.theme}');")
        for file in pages:
            for width, height in sizes:
                page = context.new_page()
                page.set_viewport_size({"width": width, "height": height})
                errors = []
                console_errors = []
                failed = []
                page.on("pageerror", lambda error: errors.append(str(error)))
                page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)
                page.on("response", lambda response: failed.append({"status": response.status, "url": response.url}) if response.status >= 400 else None)
                page.on("requestfailed", lambda request: failed.append({"url": request.url, "failure": request.failure}))
                page.goto(f"{args.base_url.rstrip('/')}/{file}", wait_until="networkidle")
                if args.text_scale != 1:
                    page.evaluate("scale => document.documentElement.style.fontSize = `${scale * 100}%`", args.text_scale)
                page.wait_for_timeout(150)
                report = page.evaluate("""() => {
                    const doc = document.documentElement;
                    const main = document.querySelector('main');
                    const duplicateIds = [...document.querySelectorAll('[id]')].map(el => el.id).filter((id, i, ids) => ids.indexOf(id) !== i);
                    const images = [...document.images].filter(image => image.getAttribute('src') && (!image.complete || image.naturalWidth === 0)).map(image => image.getAttribute('src'));
                    const activeLinks = [...document.querySelectorAll('a[aria-current="page"]')].map(link => ({text: link.innerText.trim(), href: link.getAttribute('href')}));
                    const overflow = [...document.querySelectorAll('main *')].filter(el => {
                        const r = el.getBoundingClientRect();
                        const css = getComputedStyle(el);
                        return r.width && r.height && css.position !== 'absolute' && (r.right > innerWidth + 1 || r.left < -1);
                    }).slice(0, 10).map(el => ({tag: el.tagName, class: el.className?.baseVal ?? el.className, text: el.innerText?.slice(0, 100)}));
                    return {
                        title: document.title, viewport: [innerWidth, innerHeight], document: [doc.scrollWidth, doc.scrollHeight],
                        horizontalOverflow: doc.scrollWidth > innerWidth + 1,
                        verticalOverflow: doc.scrollHeight > innerHeight + 1,
                        mainBottom: main?.getBoundingClientRect().bottom,
                        headingCount: document.querySelectorAll('h1').length,
                        activeLinks, duplicateIds, missingImages: images, overflow,
                        theme: doc.dataset.theme
                    };
                }""")
                name = f"{Path(file).stem}-{width}x{height}-{args.theme}"
                if args.text_scale != 1:
                    name += f"-text{args.text_scale}"
                page.screenshot(path=str(output / f"{name}.png"), full_page=True)
                report.update({"page": file, "errors": errors, "consoleErrors": console_errors, "failedRequests": failed, "screenshot": str(output / f"{name}.png")})
                reports.append(report)
                print(json.dumps(report), flush=True)
                page.close()
        browser.close()
    (output / "report.json").write_text(json.dumps(reports, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
