import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
};
export function createStaticServer(documentRoot) {
  return http.createServer(async (request, response) => {
    try {
      const requestedPath = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      const relativePath = requestedPath === '/' ? '/index.html' : requestedPath;
      const absolutePath = path.resolve(documentRoot, '.' + relativePath);
      const contentType = contentTypes[path.extname(absolutePath)];
      if (!absolutePath.startsWith(documentRoot + path.sep) || !contentType) {
        response.writeHead(404);
        response.end('Not found');
        return;
      }
      const content = await readFile(absolutePath);
      response.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      });
      response.end(content);
    } catch {
      response.writeHead(404);
      response.end('Not found');
    }
  });
}
