# Mud Engineer Tools (PWA)

Mud-engineering tools for the rig — ticket audit & generation, graph files, tour handover, pit-room calculators, salt tables and well geometry.
Installable on a phone and **fully usable offline**. Everything runs in the browser; no file is uploaded anywhere.

## Deploy on GitHub Pages
1. Create a new GitHub repository and push these files to the `main` branch.
2. In the repo go to **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The workflow in `.github/workflows/pages.yml` runs on every push. It downloads the three libraries into `vendor/`, stamps the cache version and publishes the site.
4. Open `https://<your-user>.github.io/<repo>/` on your phone **once while online**, then use *Add to Home Screen* (iOS Safari: Share → Add to Home Screen; Android Chrome: menu → Install app). After that it opens and works with no connection.

### Alternative: deploy from branch (no Actions)
Run `bash scripts/fetch-libs.sh` locally, commit the generated `vendor/` folder, then choose **Settings → Pages → Deploy from a branch → main / (root)**. (The cache version in `sw.js` will stay `__BUILD__`; edit that string to e.g. `v2` whenever you want to force clients to refresh.)

## How offline works
- `sw.js` pre-caches the app, icons and the libraries in `vendor/` on first visit and serves them cache-first afterwards, refreshing in the background. A new deploy changes the cache name, so phones pick up updates on the next open (close and reopen the app once).
- `index.html` loads libraries from `vendor/` first and only falls back to the CDN if a local copy is missing.
- Your Well geometry entries are stored in the browser (`localStorage`).

## Files
| File | Purpose |
|---|---|
| `index.html` | The whole app |
| `manifest.webmanifest` | PWA metadata (name, icons, colours) |
| `sw.js` | Service worker (offline cache) |
| `icons/` | App icons (192, 512, maskable, Apple touch, SVG favicon) |
| `scripts/fetch-libs.sh` | Downloads SheetJS, ExcelJS and JSZip into `vendor/` |
| `.github/workflows/pages.yml` | Builds and deploys to GitHub Pages |
| `.nojekyll` | Tells Pages to serve files as-is |

Mud engineering tools by Mohsen Velayati Rad.
