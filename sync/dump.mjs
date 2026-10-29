// Gỡ lỗi: mở web một CLB, lưu mọi phản hồi JSON (kèm URL) và chữ trên trang ra thư mục chỉ định.
// Chạy: node sync/dump.mjs <url> <thư-mục-ra>
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const [url, outDir] = process.argv.slice(2);
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ locale: "vi-VN", timezoneId: "Asia/Ho_Chi_Minh" });
  let i = 0;
  page.on("response", async res => {
    try {
      if (!(res.headers()["content-type"] || "").includes("json")) return;
      const body = await res.json();
      await writeFile(path.join(outDir, `${String(i++).padStart(2, "0")}.json`), JSON.stringify({ url: res.url(), body }, null, 1));
    } catch { /* bỏ qua */ }
  });
  try { await page.goto(url, { waitUntil: "networkidle", timeout: 45000 }); } catch { /* chậm */ }
  await page.waitForTimeout(3000);
  await writeFile(path.join(outDir, "page.txt"), await page.evaluate(() => document.body.innerText));
} finally {
  await browser.close();
}
