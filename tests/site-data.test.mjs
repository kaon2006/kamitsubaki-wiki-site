import assert from 'node:assert/strict';
import test from 'node:test';

import {
  artistCategories,
  logEntries,
  navItems,
  projects,
} from '../src/data/siteData.mjs';

test('nav items point to the four primary page sections', () => {
  assert.deepEqual(
    navItems.map((item) => item.href),
    ['#about', '#database', '#projects', '#log'],
  );
});

test('artist database keeps the original four categories and key entities', () => {
  assert.deepEqual(
    artistCategories.map((category) => category.id),
    ['cat-vwp', 'cat-solo', 'cat-creator', 'cat-isotope'],
  );

  const vwp = artistCategories.find((category) => category.id === 'cat-vwp');
  assert.equal(vwp.title, '仮想世代の魔女達');
  assert.equal(vwp.items.length, 5);
  assert.deepEqual(vwp.items[0], {
    code: '01',
    name: '花谱',
    romanizedName: 'KAF',
    meta: 'DEBUT: 2018.10.18',
    statusLabel: 'STATUS',
    status: 'ACTIVE',
    image: 'https://placehold.co/1200x800/111/333?text=KAF',
  });
});

test('projects and log entries preserve the static page content', () => {
  assert.equal(projects.length, 3);
  assert.equal(projects[0].title, '神椿市建設中。');
  assert.equal(projects[1].title, 'SINSAEKAI STUDIO');
  assert.equal(projects[2].title, '魔女展');

  assert.deepEqual(
    logEntries.map((entry) => entry.date),
    ['2024.06.01', '2024.05.15', '2024.04.30'],
  );
});
