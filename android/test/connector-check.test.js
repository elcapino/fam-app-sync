/**
 * Connector rows must not claim healthy unless a check succeeded.
 * With no native bridge, every connector shows the no-key warning.
 *
 * Run: node android/test/connector-check.test.js
 */
const http = require("http");
const path = require("path");
const fs = require("fs");
const puppeteer = require("/tmp/hmk-test/node_modules/puppeteer-core");

const ROOT = path.resolve(__dirname, "../app/src/main/assets");
const FONTS = path.resolve(__dirname, "../../dash/fonts");
const fails = [];

function ok(name, cond, extra) {
  const line = (cond ? "PASS " : "FAIL ") + name + (extra ? " — " + extra : "");
  console.log(line);
  if (!cond) fails.push(line);
}

function serve() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = decodeURIComponent(req.url.split("?")[0]);
      const file = url.startsWith("/fonts/")
        ? path.join(FONTS, url.slice("/fonts/".length))
        : path.join(ROOT, url === "/" ? "command.html" : url);
      if (!file.startsWith(ROOT) && !file.startsWith(FONTS)) { res.writeHead(403); res.end(); return; }
      fs.readFile(file, (err, buf) => {
        if (err) { res.writeHead(404); res.end(); return; }
        res.writeHead(200); res.end(buf);
      });
    });
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

(async () => {
  const server = await serve();
  const browser = await puppeteer.launch({ executablePath: "/usr/local/bin/google-chrome", headless: "new", args: ["--no-sandbox"] });
  const views = [[360, 800], [390, 844], [412, 915], [720, 1600], [1080, 2400]];
  const tabs = [["home", null], ["projects", "projects"], ["ideas", "ideas"], ["tools", "more"]];
  for (const [w, h] of views) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
    await page.goto("http://127.0.0.1:" + server.address().port + "/command.html?open=0", { waitUntil: "networkidle0" });
    for (const [name, tab] of tabs) {
      if (tab) await page.click('footer button[data-tab="' + tab + '"]');
      await new Promise((r) => setTimeout(r, 200));
      const fit = await page.evaluate(() => {
        const main = document.getElementById("pages");
        const boxed = [...document.querySelectorAll(".trow,.prow")].filter((el) => {
          const bg = getComputedStyle(el).backgroundColor;
          return bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent";
        }).length;
        return { main: main.scrollHeight - main.clientHeight, doc: document.documentElement.scrollHeight - window.innerHeight, boxed };
      });
      ok(w + "x" + h + " " + name + " fits", fit.main <= 2 && fit.doc <= 2 && fit.boxed === 0, JSON.stringify(fit));
    }
    const bright = await page.$eval('[data-connector="brightdata"]', (el) => el.innerText.replace(/\s+/g, " "));
    ok("Bright Data is not marked healthy", bright.includes("لا مفتاح") && !bright.includes("سليم"), bright);
    const headers = await page.evaluate(() => {
      const off = getComputedStyle(document.querySelector(".seg button:not(.on)"));
      const on = getComputedStyle(document.querySelector(".seg button.on"));
      const d = getComputedStyle(document.querySelector(".band .display"));
      return { off: off.color, on: on.color, title: d.color, offOpacity: off.opacity, onOpacity: on.opacity };
    });
    ok("segment header is fully legible", headers.off === "rgb(255, 255, 255)" && headers.on === "rgb(241, 211, 122)" && headers.title === "rgb(255, 255, 255)" && headers.offOpacity === "1", JSON.stringify(headers));
    await page.close();
  }
  const uae = await browser.newPage();
  await uae.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await uae.goto("http://127.0.0.1:" + server.address().port + "/command.html?open=0&theme=uae&lang=en", { waitUntil: "networkidle0" });
  await uae.click('footer button[data-tab="more"]');
  const uaeHead = await uae.evaluate(() => {
    const s = getComputedStyle(document.querySelector(".seg button"));
    const on = getComputedStyle(document.querySelector(".seg button.on"));
    return { seg: s.color, on: on.color, line: on.borderBottomColor, opacity: s.opacity };
  });
  ok("UAE segment header is solid white", uaeHead.seg === "rgb(255, 255, 255)" && uaeHead.on === "rgb(255, 255, 255)" && uaeHead.opacity === "1", JSON.stringify(uaeHead));
  const en = await uae.$eval('[data-connector="brightdata"]', (el) => el.innerText.replace(/\s+/g, " "));
  ok("English Bright Data warns", en.includes("No key") && !en.includes("Healthy"), en);
  await browser.close();
  server.close();
  if (fails.length) process.exit(1);
})().catch((e) => { console.error(e); process.exit(1); });
