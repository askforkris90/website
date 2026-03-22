# @askforkris90/website

Run the website locally — as a CLI command via `npx`, or as a native **desktop app** with an icon you can double-click.

## Desktop App

The desktop app wraps the website in an [Electron](https://www.electronjs.org/) window with a system-tray icon.

### Prerequisites

- [Node.js](https://nodejs.org/) **18 or later** — verify with `node -v`
- [Git](https://git-scm.com/downloads)

### Run from source

```bash
git clone https://github.com/askforkris90/website.git
cd website
npm install
npm run app        # opens the desktop window
```

> **Windows (Git Bash / PowerShell / cmd):** the same commands work; make sure you `cd` into
> the `website` folder that was created by `git clone` before running `npm install`.

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

## Troubleshooting

### `npm error enoent Could not read package.json`

You are in the wrong directory, or you cloned the repository and the default branch
(`main`) does not yet contain a `package.json` (it will once this feature branch is merged).

**Fix:** always `cd` into the `website` folder right after cloning:

```bash
git clone https://github.com/askforkris90/website.git
cd website          # <-- do not skip this step
npm install
```

If you still see the error, verify you are in the correct directory:

```bash
# should print package.json
ls package.json      # macOS / Linux / Git Bash
dir package.json     # Windows cmd / PowerShell
```

---

### `Error: Cannot find module 'electron'`

`electron` is a dev-dependency and is only installed when you run a plain `npm install`
(not `npm install --production`).

**Fix:**

```bash
npm install          # installs all dependencies including devDependencies
npm run app
```

If you have the environment variable `NODE_ENV=production` set, unset it first:

```bash
# Git Bash / macOS / Linux
unset NODE_ENV
npm install

# Windows PowerShell
Remove-Item Env:\NODE_ENV
npm install

# Windows cmd
set NODE_ENV=
npm install
```

---

### Connecting your local clone to GitHub (`git remote`)

After cloning, the `origin` remote is already configured automatically.
Verify it with:

```bash
git remote -v
# origin  https://github.com/askforkris90/website.git (fetch)
# origin  https://github.com/askforkris90/website.git (push)
```

If you created a local repo manually (not via `git clone`) and need to add the remote:

```bash
git remote add origin https://github.com/askforkris90/website.git
git fetch origin
```

---

## Notes
- `npx @askforkris90/website` serves the bundled `index.html` included in the package — no local files needed.
- This package ships your static site files and a tiny Node HTTP server.
