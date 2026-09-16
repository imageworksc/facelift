# Homepage Facelift — ImageWorks Creative

Landing page for the Homepage Facelift service, published with GitHub Pages at
<https://imageworksc.github.io/facelift/>.

Built on the same design system as the Branding & Graphic Design page
(<https://imageworksc.github.io/branding-page/>): same tokens, type scale,
2px corners, card recipe, bands, hero ground and closing CTA band.

## Files

- `index.html` — the page. No build step.
- `styles.css` — the shared system first, then this page's own block. Plus
  Jakarta Sans (variable, 300–800) is embedded as a data URI so the page has
  no external requests.
- `script.js` — the entrance reveal only (IntersectionObserver), loaded with
  `defer`.

## Publishing

GitHub Pages serves the `main` branch from the repository root. Pushing to
`main` redeploys the page.
