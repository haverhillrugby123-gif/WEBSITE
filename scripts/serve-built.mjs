import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { buildProfile } from './build-profile.mjs';
const profile = buildProfile(process.argv.slice(2));
const root = path.resolve(process.env.PREVIEW_DIR || profile.directory);
// Reproduce the prepared host's global headers so root browser checks exercise
// its actual policy. GitHub Pages previews do not serve this _headers file.
const globalHeaders = {};
if (profile.root) {
  const headerFile = await readFile(path.join(root, '_headers'), 'utf8');
  const block = headerFile.match(/^\/\*\r?\n((?:[ \t]+[^\r\n]+\r?\n)+)/);
  if (!block) throw new Error('Root preview global header block missing');
  for (const line of block[1].trim().split(/\r?\n/)) {
    const colon = line.indexOf(':');
    if (colon < 1) throw new Error('Invalid root preview header');
    globalHeaders[line.slice(0, colon).trim()] = line.slice(colon + 1).trim();
  }
}
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.json': 'application/json', '.vtt': 'text/vtt; charset=utf-8', '.mp4': 'video/mp4', '.pdf': 'application/pdf' };
http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (!url.pathname.startsWith(profile.basePath)) { res.writeHead(404).end(); return; }
    let file = path.resolve(root, decodeURIComponent(url.pathname.slice(profile.basePath.length)) || 'index.html');
    if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    let status = 200;
    try { if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html'); await stat(file); }
    catch { file = path.join(root, '404.html'); status = 404; }
    res.writeHead(status, { ...globalHeaders, 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(await readFile(file));
  } catch { res.writeHead(400).end(); }
}).listen(4173, '127.0.0.1', () => console.log(`Built preview: http://127.0.0.1:4173${profile.basePath}`));
