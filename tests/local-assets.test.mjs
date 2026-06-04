import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('layout does not depend on Tailwind CDN at runtime', async () => {
  const layout = await readFile(new URL('../src/layouts/BaseLayout.astro', import.meta.url), 'utf8');

  assert.equal(layout.includes('cdn.tailwindcss.com'), false);
  assert.equal(layout.includes('tailwind.config'), false);
});
