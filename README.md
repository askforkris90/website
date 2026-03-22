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

## Notes
- `npx @askforkris90/website` serves the bundled `index.html` included in the package — no local files needed.
- This package ships your static site files and a tiny Node HTTP server.
