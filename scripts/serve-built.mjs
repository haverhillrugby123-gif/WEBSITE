import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve(process.env.PREVIEW_DIR || 'dist');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.json': 'application/json' };
http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (!url.pathname.startsWith('/WEBSITE/')) { res.writeHead(404).end(); return; }
    let file = path.resolve(root, decodeURIComponent(url.pathname.slice('/WEBSITE/'.length)) || 'index.html');
    if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    let status = 200;
    try { if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html'); await stat(file); }
    catch { file = path.join(root, '404.html'); status = 404; }
    res.writeHead(status, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(await readFile(file));
  } catch { res.writeHead(400).end(); }
}).listen(4173, '127.0.0.1', () => console.log('Built preview: http://127.0.0.1:4173/WEBSITE/'));
