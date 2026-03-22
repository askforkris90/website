# @askforkris90/website

Run the website locally — as a CLI command via `npx`, or as a native **desktop app** with an icon you can double-click.

## Desktop App

The desktop app wraps the website in an [Electron](https://www.electronjs.org/) window with a system-tray icon.

### Run from source

```bash
git clone https://github.com/askforkris90/website.git
cd website
npm install
npm run app        # opens the desktop window
```

### Build an installer / executable

```bash
npm install
npm run dist       # creates platform installer in dist/
```

| Platform | Output |
|----------|--------|
| Windows  | `dist/AskForKris90 Website Setup *.exe` (NSIS installer) |
| macOS    | `dist/AskForKris90 Website-*.dmg` |
| Linux    | `dist/AskForKris90 Website-*.AppImage` |

The **GitHub Actions** workflow (`.github/workflows/desktop.yml`) builds all three platforms automatically when you push a `v*` tag or trigger it manually.

### App icon

The icon lives at `assets/icon.png` (256×256 PNG).  
Replace it with your own artwork and rebuild to customise the desktop icon.

---

## CLI (npx)

```bash
# serve on http://127.0.0.1:3000
npx @askforkris90/website

# choose a port
npx @askforkris90/website --port 8080

# open browser
npx @askforkris90/website --open

# bind to all interfaces (useful for Docker/VM/LAN testing)
npx @askforkris90/website --host 0.0.0.0 --port 3000
```

## Publishing to npm

To make the package available via `npx @askforkris90/website`:

1. Add your npm token as a repository secret named `NPM_TOKEN` (Settings → Secrets → Actions).
2. Publish via either method:
   - **Push a version tag** — the included GitHub Actions workflow (`.github/workflows/publish.yml`) will run `npm publish --access public` automatically:
     ```bash
     # example: bump to 0.1.0 and publish
     git tag v0.1.0
     git push origin v0.1.0
     ```
   - **Manual trigger** — go to Actions → "Publish to npm" → "Run workflow" in the GitHub UI (no tag needed).

Or publish manually from your machine:
```bash
npm login
npm publish --access public
```

## Notes
- `npx @askforkris90/website` serves the bundled `index.html` included in the package — no local files needed.
- This package ships your static site files and a tiny Node HTTP server.
