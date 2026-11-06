import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const repo = join(root, '..');
const v21 = readFileSync(join(root, 'v21.css'), 'utf8');
const v19css = readFileSync(join(root, 'v19.css'), 'utf8');
const v19js = readFileSync(join(root, 'v19.js'), 'utf8');
const v21js = readFileSync(join(root, 'v21.js'), 'utf8');
const index = readFileSync(join(root, 'index.html'), 'utf8');

function lum(hex){
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}
function contrast(a, b){
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

test('command21 shell is dark purple, gold, and gray', () => {
  assert.match(v21, /\.command21\{[^}]*--bg:#100c17/);
  assert.match(v21, /--tx:#f7f4fb/);
  assert.match(v21, /--gold:#d4af37/);
  for(const banned of ['#f4efdf', '#fffcf3', '#fffaf0', '#f8f4e8', '#247253', '#00843D', '#C8102E', '#e1eadc', '#e9efdf', '#236348', '#256544']){
    assert.equal(v21.toLowerCase().includes(banned.toLowerCase()), false, banned);
  }
  assert.ok(contrast('#f7f4fb', '#100c17') >= 7);
  assert.ok(contrast('#f7f4fb', '#291c3a') >= 7);
  assert.ok(contrast('#d7cce4', '#291c3a') >= 4.5);
  assert.ok(contrast('#e8c86d', '#291c3a') >= 4.5);
  assert.ok(contrast('#160b27', '#d4af37') >= 4.5);
});

test('dash shell chrome is not the beige or green command skin', () => {
  assert.equal(/#00843D|#C8102E|#f4efdf|#247253/i.test(v19css), false);
  assert.match(v19css, /border-top:3px solid #d4af37/);
  assert.match(v19css, /html,body,#app,#pages,\.pg,footer,#nav\{overflow:hidden!important/);
  assert.equal(index.includes('body[data-page=market] .pg{overflow-y:auto'), false);
  assert.match(index, /body\[data-page=market\] \.pg\{overflow:hidden/);
});

test('long text is paged forward and operations facts are not deleted', () => {
  assert.match(v19js, /function v19Chunk/);
  assert.equal(v19js.includes('start=chars.length'), false);
  assert.match(v19js, /start=next/);
  assert.equal(v19js.includes("querySelector('.v19-fact:last-child').remove()"), false);
  assert.match(v19js, /NS_TEXT=v19Flat\(value\)\.join\('\\n'\)/);
  assert.match(v21js, /النص الكامل/);
  assert.match(v21js, /function c21Pack/);
  assert.match(v21js, /data-tl-nav/);
  assert.equal(v21js.includes('.slice(0,6)'), false);
});

test('this workspace has no projects_catalog.py to edit', () => {
  assert.equal(existsSync(join(repo, 'projects_catalog.py')), false);
});

test('viewport harness', () => {
  const run = spawnSync(process.execPath, [join(root, 'tests', 'viewport-harness.mjs')], {
    cwd: repo,
    encoding: 'utf8',
    timeout: 120000
  });
  if(run.status !== 0){
    assert.fail((run.stdout || '') + (run.stderr || '') + '\nexit ' + run.status);
  }
  assert.match(run.stdout, /HARNESS_OK/);
  assert.match(run.stdout, /encrypted feed was not decrypted/);
});
