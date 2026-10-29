// Chạy: node --test sync/
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const ctx = {}; ctx.globalThis = ctx;
vm.runInNewContext(readFileSync(new URL("../icm.js", import.meta.url), "utf8"), ctx);
const { icm, chipChop, parseMoney } = ctx.HNPICM;
const close = (a, b, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} != ${b}`);

test("ICM 3 người, ví dụ kinh điển 50/30/20", () => {
  // Stack 5000/3000/2000, giải 50/30/20 (tính tay): 38.393 / 32.75 / 28.857
  const e = icm([5000, 3000, 2000], [50, 30, 20]);
  close(e[0], 25 + 30 * (0.3 * 5 / 7 + 0.2 * 5 / 8) + 20 * (1 - 0.5 - (0.3 * 5 / 7 + 0.2 * 5 / 8)));
  close(e[1], 32.75);
  close(e[2], 10 + 30 * (0.2 + 0.3 * 2 / 7) + 20 * (1 - 0.2 - (0.2 + 0.3 * 2 / 7)));
  close(e.reduce((a, b) => a + b, 0), 100);
});

test("ICM: stack bằng nhau thì chia đều; ít giải hơn số người vẫn đúng tổng", () => {
  icm([1, 1, 1, 1], [40, 30, 20, 10]).forEach(v => close(v, 25));
  const e = icm([4, 3, 2, 1], [70, 30]);
  close(e.reduce((a, b) => a + b, 0), 100);
  assert.ok(e[0] > e[1] && e[1] > e[2] && e[2] > e[3]);
});

test("ICM 2 người = chia theo chip phần chênh", () => {
  const e = icm([3, 1], [100, 60]);
  close(e[0], 60 + 40 * 0.75);
  close(e[1], 60 + 40 * 0.25);
});

test("Chip chop: tiền hạng cuối + phần dư theo chip", () => {
  const c = chipChop([5000, 3000, 2000], [50, 30, 20]);
  close(c[0], 20 + 40 * 0.5);
  close(c[2], 20 + 40 * 0.2);
});

test("parseMoney đọc các cách viết tiền thường gặp", () => {
  assert.equal(parseMoney("50M"), 50e6);
  assert.equal(parseMoney("25tr"), 25e6);
  assert.equal(parseMoney("12,5 triệu"), 12.5e6);
  assert.equal(parseMoney("800k"), 8e5);
  assert.equal(parseMoney("1.2 tỷ"), 1.2e9);
  assert.equal(parseMoney("25.000.000"), 25e6);
  assert.equal(parseMoney("350000"), 350000);
  assert.equal(parseMoney(""), null);
  assert.equal(parseMoney("abc"), null);
  assert.equal(parseMoney("1.2.3m"), null);
});
