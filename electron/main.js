'use strict';

const { app, BrowserWindow, Tray, Menu, nativeImage, shell } = require('electron');
const http = require('http');
const fs   = require('fs');
const path = require('path');

// ── Resolve bundled assets ────────────────────────────────────────
// Works both during development (repo root) and after electron-builder
// packages the app (resources/app or resources/app.asar).
const root      = path.join(__dirname, '..');
const indexPath = path.join(root, 'index.html');
const iconPath  = path.join(root, 'assets', 'icon.png');

const PORT = 3474; // fixed internal port; unlikely to clash
const HOST = '127.0.0.1';

// ── Embedded HTTP server ──────────────────────────────────────────
const fileCache = new Map();

function readCached(filePath) {
  if (!fileCache.has(filePath)) {
    fileCache.set(filePath, fs.readFileSync(filePath));
  }
  return fileCache.get(filePath);
}

function startServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const urlPath = (req.url || '/').split('?')[0];

      if (urlPath === '/' || urlPath === '/index.html') {
        res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
        res.end(readCached(indexPath));
        return;
      }

      const safePath = path.normalize(urlPath).replace(/^\.\.(\/|\\)/, '');
      const filePath = path.join(root, safePath);

      if (
        !filePath.startsWith(root) ||
        !fs.existsSync(filePath) ||
        fs.statSync(filePath).isDirectory()
      ) {
        res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
        res.end('Not found');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const ct = ext === '.css'  ? 'text/css'
        : ext === '.js'          ? 'application/javascript'
        : ext === '.json'        ? 'application/json'
        : ext === '.svg'         ? 'image/svg+xml'
        : ext === '.png'         ? 'image/png'
        : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg'
        : 'application/octet-stream';

      res.writeHead(200, { 'content-type': ct });
      res.end(readCached(filePath));
    });

    server.listen(PORT, HOST, () => resolve(server));
    server.on('error', reject);
  });
}

// ── Electron app ──────────────────────────────────────────────────
let win  = null;
let tray = null;

function createWindow() {
  const icon = nativeImage.createFromPath(iconPath);

  win = new BrowserWindow({
    width:  1024,
    height: 768,
    title:  'AskForKris90',
    icon,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadURL(`http://${HOST}:${PORT}`);

  // Open external links in the system browser, not in the app window
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith(`http://${HOST}:${PORT}`)) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  win.on('closed', () => { win = null; });
}

function createTray() {
  const icon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
  tray = new Tray(icon);
  tray.setToolTip('AskForKris90 Website');

  const menu = Menu.buildFromTemplate([
    { label: 'Open',   click: () => { if (win) win.focus(); else createWindow(); } },
    { type:  'separator' },
    { label: 'Quit',   click: () => app.quit() },
  ]);
  tray.setContextMenu(menu);
  tray.on('click', () => { if (win) win.focus(); else createWindow(); });
}

app.whenReady().then(async () => {
  if (!fs.existsSync(indexPath)) {
    // Graceful error dialog instead of a crash
    const { dialog } = require('electron');
    dialog.showErrorBox(
      'Missing file',
      `index.html not found at:\n${indexPath}\n\nPlease reinstall the application.`,
    );
    app.quit();
    return;
  }

  await startServer();
  createWindow();
  createTray();

  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

// Keep the app alive when all windows are closed (tray still visible)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // On Windows/Linux, stay in the tray rather than quitting completely.
    // The user can quit via the tray context menu.
  }
});
