import { fileURLToPath } from 'node:url';
import { createStaticServer } from './lib/static-server.mjs';
const documentRoot = fileURLToPath(new URL('../src/prototype', import.meta.url));
const port = Number(process.env.PORT || 4173);
createStaticServer(documentRoot).listen(port, '127.0.0.1', () =>
  console.log(`Local: http://127.0.0.1:${port}`),
);
