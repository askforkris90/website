# @askforkris90/website

Run the website locally via `npx`.

## Usage

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
