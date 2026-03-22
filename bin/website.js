#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

function parseArgs(argv) {
  const args = { port: 3000, host: '127.0.0.1', open: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--open') args.open = true;
    else if ((a === '--port' || a === '-p') && argv[i+1]) {
      args.port = Number(argv[++i]);
    } else if (a.startsWith('--port=')) {
      args.port = Number(a.split('=')[1]);
    } else if (a === '--host' && argv[i+1]) {
      args.host = argv[++i];
    } else if (a.startsWith('--host=')) {
      args.host = a.split('=')[1];
    } else if (a === '--help' || a === '-h') {
      args.help = true;
    }
  }
  return args;
}

function usage() {
  console.log(`\nUsage:\n  npx @askforkris90/website [--port 3000] [--host 127.0.0.1] [--open]\n\nOptions:\n  -p, --port   Port to listen on (default 3000)\n  --host       Host to bind (default 127.0.0.1)\n  --open       Open the browser\n  -h, --help   Show help\n`);
}

function openBrowser(url) {
  const platform = process.platform;
  let cmd;
  let args = [];

  if (platform === 'darwin') {
    cmd = 'open';
    args = [url];
  } else if (platform === 'win32') {
    cmd = 'cmd';
    args = ['/c', 'start', '', url];
  } else {
    cmd = 'xdg-open';
    args = [url];
  }

  const child = spawn(cmd, args, { stdio: 'ignore', detached: true });
  child.unref();
}

const args = parseArgs(process.argv);
if (args.help) {
  usage();
  process.exit(0);
}

if (!Number.isFinite(args.port) || args.port <= 0) {
  console.error('Invalid port');
  process.exit(1);
}

const root = path.join(__dirname, '..');
const indexPath = path.join(root, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('index.html not found. The package may be missing files — try reinstalling.');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  const urlPath = (req.url || '/').split('?')[0];
  if (urlPath === '/' || urlPath === '/index.html') {
    const html = fs.readFileSync(indexPath);
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(html);
    return;
  }

  // Basic static file support in case you add assets later
  const safePath = path.normalize(urlPath).replace(/^\.\.(\/|\\)/, '');
  const filePath = path.join(root, safePath);

  if (!filePath.startsWith(root) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Not found');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const ct = ext === '.css' ? 'text/css'
    : ext === '.js' ? 'application/javascript'
    : ext === '.json' ? 'application/json'
    : ext === '.svg' ? 'image/svg+xml'
    : ext === '.png' ? 'image/png'
    : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg'
    : 'application/octet-stream';

  const data = fs.readFileSync(filePath);
  res.writeHead(200, { 'content-type': ct });
  res.end(data);
});

server.listen(args.port, args.host, () => {
  const url = `http://${args.host}:${args.port}`;
  console.log(`Serving ${indexPath}`);
  console.log(`Listening on ${url}`);
  console.log('Press Ctrl+C to stop.');
  if (args.open) openBrowser(url);
});
