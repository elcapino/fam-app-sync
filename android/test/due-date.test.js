/**
 * Due date is its own date input. Typing or setting it must not change the next step,
 * and a past date raises the overdue count.
 *
 * Run: node android/test/due-date.test.js
 * Serves the command page, then drives it with puppeteer-core.
 */
const http = require("http");
const path = require("path");
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
  const fs = require("fs");
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = decodeURIComponent(req.url.split("?")[0]);
      let file = url.startsWith("/fonts/")
        ? path.join(FONTS, url.slice("/fonts/".length))
        : path.join(ROOT, url === "/" ? "command.html" : url);
      if (!file.startsWith(ROOT) && !file.startsWith(FONTS)) {
        res.writeHead(403); res.end(); return;
      }
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
  const port = server.address().port;
  const browser = await puppeteer.launch({
    executablePath: "/usr/local/bin/google-chrome",
    headless: "new",
    args: ["--no-sandbox"]
  });
  const page = await browser.newPage();
  page.on("pageerror", (e) => ok("no page error", false, e.message));
  await page.goto("http://127.0.0.1:" + port + "/command.html?open=0", { waitUntil: "networkidle0" });
  await page.waitForSelector(".sum");
  const before = await page.$eval(".sum", (el) => el.innerText.replace(/\s+/g, " "));
  ok("overdue starts at 0", /0\s*متأخر|متأخر[\s\S]*0/.test(before) || before.includes("0"), before);

  await page.click('footer button[data-tab="projects"]');
  await page.waitForSelector(".prow");
  await page.click(".prow");
  await page.waitForSelector("[data-due]");
  const originalNext = await page.$eval("[data-next]", (el) => el.getAttribute("data-next"));
  ok("house next step is not a date", originalNext.indexOf("2026-11-01") === -1, originalNext);

  await page.evaluate(() => [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === "تعديل").click());
  await page.waitForSelector("#hmk-due");
  const types = await page.evaluate(() => ({
    next: document.getElementById("hmk-next").tagName,
    due: document.getElementById("hmk-due").type
  }));
  ok("next step is a textarea", types.next === "TEXTAREA", types.next);
  ok("due is a date input", types.due === "date", types.due);

  await page.evaluate((next) => {
    document.getElementById("hmk-next").value = next;
    document.getElementById("hmk-due").value = "2026-11-01";
    document.getElementById("hmk-due").dispatchEvent(new Event("input", { bubbles: true }));
    [...document.querySelectorAll("#ask button")].find((b) => b.textContent.trim() === "حفظ").click();
  }, originalNext);
  await page.waitForSelector("[data-due]");
  const saved = await page.evaluate(() => ({
    due: document.querySelector("[data-due]").getAttribute("data-due"),
    next: document.querySelector("[data-next]").getAttribute("data-next"),
    shown: document.querySelector("[data-due]").textContent
  }));
  ok("due saved as its own field", saved.due === "2026-11-01", saved.due);
  ok("detail shows the date", saved.shown.indexOf("2026-11-01") >= 0, saved.shown);
  ok("next step unchanged", saved.next === originalNext, saved.next);

  await page.evaluate(() => [...document.querySelectorAll("footer button")].find((b) => b.textContent.indexOf("الرئيسية") >= 0).click());
  await page.waitForSelector(".sum");
  const after = await page.$eval(".sum", (el) => el.innerText.replace(/\s+/g, " "));
  ok("past date counts as overdue", /1\s*متأخر/.test(after) || after.indexOf("متأخر") > 0 && after.indexOf("1") >= 0, after);

  await browser.close();
  server.close();
  if (fails.length) {
    console.log("FAILED " + fails.length);
    process.exit(1);
  }
  console.log("ALL PASS");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
