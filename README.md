# Keyon Portfolio Website

Static portfolio site built with HTML, CSS, and vanilla JavaScript. No build step is required: open `index.html` in a browser, or serve the project root with any static server.

## Where To Edit

| Need to change | File |
| --- | --- |
| Home page content and featured-work order | `index.html` |
| Portfolio card content and links | `pages/portfolio.html` |
| About page content | `pages/about.html` |
| Shared site layout, navigation, cards, theme, and responsive rules | `css/style.css` |
| Shared case-study layout and breakpoints | `css/case-study.css` |
| Case-study copy and image assignments | `pages/code-clash.html`, `pages/monthly-reports.html`, `pages/tasky.html` |
| Home interactions, carousel, theme toggle, and mobile navigation | `js/script.js` |
| Page-to-page fade transition | `js/page-navigation.js` |
| Case-study scroll rail and in-page navigation | `js/case-study.js` |

## Editing Notes

- Keep visual assets in `assets/images/`. Case-study images live in project folders such as `assets/images/tasky/`.
- Use the existing `width` and `height` values on images when replacing an asset. They prevent layout shifting while images load.
- `css/style.css` is intentionally ordered by site area, then by responsive breakpoints. Add a new rule to the closest existing section instead of appending it at the end.
- `css/case-study.css` has three layers: shared layout, project-specific overrides, and responsive rules. Project-only adjustments should use a page class such as `.tasky-case`.
- `js/script.js` is defensive: each feature checks whether its required markup exists. Keep that pattern when adding new behavior so pages without that component continue to work.
- The browser theme preference is stored under `siteDarkMode`. The intro animation uses session and local storage keys beginning with `startupIntro`.

## Case Study Structure

Each case-study page follows the same section IDs: `intro`, `overview`, `problem`, `process`, and `outcome`. The right-side rail in the case-study layout uses those IDs, so retain them when changing copy or moving content.

## Verification

After edits, open the affected page and check desktop and mobile widths. For markup and CSS whitespace problems, run:

```powershell
git diff --check
```
