/**
 * Layout harness only. It does not decrypt dash.enc.json, does not write a feed,
 * and does not publish the site. Statuses exercised here are empty-record gaps.
 */
import {spawn, spawnSync} from 'node:child_process';
import {existsSync, mkdirSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';

if(!existsSync('/tmp/hmk-test/node_modules/puppeteer-core')){
  mkdirSync('/tmp/hmk-test', {recursive: true});
  const inst = spawnSync('npm', ['install', '--silent', 'puppeteer-core@24'], {cwd: '/tmp/hmk-test', encoding: 'utf8'});
  if(inst.status !== 0){
    console.error(inst.stdout + inst.stderr);
    process.exit(1);
  }
}

const dash = dirname(dirname(fileURLToPath(import.meta.url)));
const shots = '/tmp/hmk-harness-shots';
mkdirSync(shots, {recursive: true});
const require = createRequire('/tmp/hmk-test/package.json');
const puppeteer = require('puppeteer-core');

const server = spawn('python3', ['-m', 'http.server', '8765', '--bind', '127.0.0.1'], {cwd: dash, stdio: 'ignore'});
await new Promise(r => setTimeout(r, 400));

const browser = await puppeteer.launch({
  executablePath: '/usr/local/bin/google-chrome',
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
});

const viewports = [[360, 800], [390, 844], [1280, 800]];
const failures = [];

function gapFeed(){
  return {
    built: 'HARNESS — not the encrypted feed',
    waiting: [],
    docs: [],
    dailyBrief: {},
    kpi: {projects: []},
    apps: [],
    marketReference: {signals: []},
    ideasReference: {ideas: []},
    hq: {rooms: [], agents: [], skills: [], ceo_id: 'ceo', brief: {your_part: [], needs_you: []}, meeting: {broke: [], wins: []}}
  };
}

async function metrics(page){
  return page.evaluate(() => {
    const pick = sel => {
      const el = document.querySelector(sel);
      if(!el) return null;
      const s = getComputedStyle(el);
      return {
        sel,
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight,
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
        overflowY: s.overflowY,
        overflowX: s.overflowX
      };
    };
    return ['body', '#app', '#pages', '.pg', '#nav', 'footer'].map(pick);
  });
}

function assertFit(label, rows){
  for(const row of rows){
    if(!row) continue;
    if(row.scrollHeight > row.clientHeight + 2 || row.scrollWidth > row.clientWidth + 2){
      failures.push(`${label} ${row.sel} scrolls ${row.scrollWidth}x${row.scrollHeight} in ${row.clientWidth}x${row.clientHeight} (${row.overflowX}/${row.overflowY})`);
    }
  }
}

try{
  const page = await browser.newPage();
  for(const [width, height] of viewports){
    await page.setViewport({width, height, deviceScaleFactor: 1});
    await page.goto('http://127.0.0.1:8765/index.html', {waitUntil: 'networkidle0'});
    await page.evaluate(feed => hmkPreviewFeed(feed), gapFeed());
    await page.waitForSelector('body.command21 .cmd-heading');
    assertFit(`sum ${width}x${height}`, await metrics(page));
    const homePages = await page.evaluate(async () => {
      const seen = [];
      for(let i = 0; i < 8; i++){
        const pg = document.querySelector('.pg');
        seen.push(pg ? pg.innerText : '');
        if(pg && (pg.scrollHeight > pg.clientHeight + 2 || pg.scrollWidth > pg.clientWidth + 2)) return {error: 'home page overflow', seen};
        const next = [...document.querySelectorAll('.pg > .cmd-pager button')].pop();
        if(!next || next.disabled) break;
        next.click();
      }
      return {seen};
    });
    if(homePages.error) failures.push(`sum ${width}x${height} ${homePages.error}`);
    const homeFlat = (homePages.seen || []).join('\n');
    if(!homeFlat.includes('قراراتك') || !homeFlat.includes(gapFeed().built)) failures.push(`sum ${width}x${height} home pages dropped a section`);
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    if(bg !== 'rgb(16, 12, 23)') failures.push(`sum ${width}x${height} background ${bg}`);
    const shellText = await page.evaluate(() => document.body.innerText);
    if(!shellText.includes('غير مؤكد')) failures.push(`sum ${width}x${height} missing unverified label`);
    if(width === 360) await page.screenshot({path: join(shots, 'harness-sum-360.png')});
    if(width === 1280) await page.screenshot({path: join(shots, 'harness-sum-1280.png')});

    const nav = await page.$$('#nav button');
    for(const button of nav){
      const name = await button.evaluate(el => el.innerText.replace(/\s+/g, ' ').trim());
      await button.click();
      await new Promise(r => setTimeout(r, 80));
      assertFit(`nav ${name} ${width}x${height}`, await metrics(page));
    }

    await page.evaluate(() => goPage(PAGES.indexOf('market')));
    await new Promise(r => setTimeout(r, 50));
    assertFit(`market ${width}x${height}`, await metrics(page));

    await page.evaluate(() => goPage(PAGES.indexOf('ai')));
    const long = 'START ' + Array.from({length: 80}, (_, i) => `سطر ${i} نص طويل للتحقق من الصفحات.`).join('\n') + ' ENDMARKER';
    const joined = await page.evaluate(async text => {
      nsOpen('harness-long', text);
      const chunks = [];
      for(let i = 0; i < 40; i++){
        const copy = document.querySelector('.ns-copy');
        if(copy) chunks.push(copy.textContent);
        const next = document.querySelector('.ns-pager button[aria-label="Next"]');
        const box = document.querySelector('.pg');
        if(box && (box.scrollHeight > box.clientHeight + 2 || box.scrollWidth > box.clientWidth + 2)){
          return {error: 'detail overflow', chunks};
        }
        if(!next || next.disabled) break;
        next.click();
      }
      return {chunks, pages: document.querySelector('.ns-pager span')?.textContent || ''};
    }, long);
    if(joined.error) failures.push(`detail ${width}x${height} ${joined.error}`);
    const flat = (joined.chunks || []).join('\n');
    if(!flat.includes('START') || !flat.includes('ENDMARKER')){
      failures.push(`detail ${width}x${height} dropped long text pages=${joined.pages} chunks=${(joined.chunks || []).length}`);
    }
    if((joined.chunks || []).length < 2) failures.push(`detail ${width}x${height} expected multiple pages`);
    assertFit(`detail ${width}x${height}`, await metrics(page));
    if(width === 390) await page.screenshot({path: join(shots, 'harness-detail-390.png')});

    await page.evaluate(() => goPage(PAGES.indexOf('hq')));
    await new Promise(r => setTimeout(r, 200));
    assertFit(`hq shell ${width}x${height}`, await metrics(page));
  }
}finally{
  await browser.close();
  server.kill();
}

if(failures.length){
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('HARNESS_OK viewports 360x800 390x844 1280x800');
console.log('encrypted feed was not decrypted; shots are an empty-record layout harness, not the owner HQ capture');
