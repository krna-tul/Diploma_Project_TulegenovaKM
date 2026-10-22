import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../src/prototype/', import.meta.url));
function javascriptFiles(directory) {
  return readdirSync(directory, {
    withFileTypes: true,
  }).flatMap((entry) =>
    entry.isDirectory()
      ? javascriptFiles(path.join(directory, entry.name))
      : entry.name.endsWith('.js')
        ? [path.join(directory, entry.name)]
        : [],
  );
}
test('domain and application layers do not depend on browser APIs or outer layers', () => {
  for (const layer of ['domain', 'application'])
    for (const file of javascriptFiles(path.join(root, layer))) {
      const source = readFileSync(file, 'utf8');
      assert.ok(
        !/\b(?:document|window|localStorage|fetch)\s*[.(]/.test(source),
        `${file}: browser dependency`,
      );
      for (const [, relative] of source.matchAll(/from\s+['"]([^'"]+)['"]/g)) {
        const target = path.resolve(path.dirname(file), relative);
        assert.ok(
          !/\/(?:presentation|infrastructure)\//.test(target),
          `${file} imports outer layer ${relative}`,
        );
        if (layer === 'domain')
          assert.ok(!target.includes('/application/'), `${file} imports application`);
      }
    }
});
test('all relative JavaScript module imports resolve', () => {
  const available = new Set(javascriptFiles(root));
  for (const file of available) {
    const source = readFileSync(file, 'utf8');
    for (const [, relative] of source.matchAll(/(?:from\s+|import\s*)['"](\.[^'"]+)['"]/g))
      assert.ok(
        available.has(path.resolve(path.dirname(file), relative)),
        `${file}: unresolved ${relative}`,
      );
  }
});
