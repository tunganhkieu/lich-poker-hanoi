// Đồng bộ số entry: mở web từng CLB bằng trình duyệt thật (Playwright), đọc dữ liệu
// trang tự tải về, ghép vào giải trong schedule.js rồi ghi ra entries.json.
// Chạy: node sync/sync.mjs   (cần: npm i && npx playwright install chromium)

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import vm from "node:vm";
import { chromium } from "playwright";
import { fromJson, fromRoyalText, match, parseStart } from "./extract.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "entries.json");

// Trang cần mở cho từng CLB. text: true = đọc thêm chữ trên trang (Royal không trả JSON).
const SITES = [
  { club: "arena",  url: "https://arenapoker.vn/" },
  { club: "center", url: "https://centerpoker.vn/" },
  { club: "royal",  url: "https://royal-poker.com/en", text: true },
  { club: "gl",     url: "https://grandloyal.vn/tracker" },
  { club: "quads",  url: "https://quadspoker.vn/" },
  { club: "vpl",    url: "https://vietnampokerleague.com/" },
];
const KEEP_DAYS = 2;

async function loadSchedule() {
  const ctx = {};
  ctx.globalThis = ctx;
  vm.runInNewContext(await readFile(path.join(ROOT, "schedule.js"), "utf8"), ctx);
  return ctx.HNP;
}

async function readSite(browser, site) {
  const page = await browser.newPage({ locale: "vi-VN", timezoneId: "Asia/Ho_Chi_Minh" });
  const jsons = [];
  try {
  page.on("response", async res => {
    try {
      if (!(res.headers()["content-type"] || "").includes("json")) return;
      jsons.push(await res.json());
    } catch { /* bỏ qua phản hồi không đọc được */ }
  });
  try {
    await page.goto(site.url, { waitUntil: "networkidle", timeout: 45000 });
  } catch { /* trang chậm: vẫn dùng phần đã tải */ }
  await page.waitForTimeout(3000);
  const found = jsons.flatMap(fromJson);
  if (site.text) found.push(...fromRoyalText(await page.evaluate(() => document.body.innerText).catch(() => "")));
  return found;
  } finally {
    await page.close().catch(() => {});
  }
}

async function main() {
  const HNP = await loadSchedule();
  const tours = HNP.buildTours();
  const now = Date.now();
  const today = HNP.vnParts(now).md;
  // Trước 3h sáng ghép cả lịch hôm qua (giải đêm đóng reg ~0h40) lẫn hôm nay
  const days = HNP.vnParts(now).h < 3 ? [HNP.vnParts(now - 24 * HNP.HOUR).md, today] : [today];

  let prev = { entries: {} };
  try { prev = JSON.parse(await readFile(OUT, "utf8")); } catch { /* lần chạy đầu */ }
  const entries = {};
  for (const [id, v] of Object.entries(prev.entries || {})) if (now - v.at < KEEP_DAYS * 24 * HNP.HOUR) entries[id] = v;

  const browser = await chromium.launch();
  const log = {};
  try {
  for (const site of SITES) {
    try {
      const found = await readSite(browser, site);
      const result = {};
      // Ghép ngày trước rồi mới tới ngày sau; mục đã ghép không được ghép lần nữa
      let left = found;
      for (const day of days) {
        const r = match(left, tours, site.club, day, HNP);
        Object.assign(result, r.result);
        left = left.filter(f => r.unmatched.includes(f.name));
      }
      // Chỉ báo mục chưa ghép thuộc những ngày đang xét (Royal trả cả lịch sử nhiều ngày)
      const unmatched = left.filter(f => { const st = parseStart(f.start, HNP); return st === null || days.includes(HNP.vnParts(st).md); }).map(f => f.name);
      for (const [id, n] of Object.entries(result)) entries[id] = { n, at: now };
      log[site.club] = { found: found.length, matched: Object.keys(result).length, unmatched: [...new Set(unmatched)].slice(0, 10) };
    } catch (e) {
      log[site.club] = { error: String(e.message || e) };
    }
    console.log(site.club, JSON.stringify(log[site.club]));
  }
  } finally {
    await browser.close();
  }

  await writeFile(OUT, JSON.stringify({ updatedAt: now, days, entries, log }, null, 1) + "\n");
  console.log(`Đã ghi ${Object.keys(entries).length} giải vào entries.json`);
}

main().catch(e => { console.error(e); process.exit(1); });
