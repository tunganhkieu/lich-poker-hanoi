// Chạy: node --test sync/
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { fromJson, fromRoyalText, match } from "./extract.mjs";

const ctx = {}; ctx.globalThis = ctx;
vm.runInNewContext(readFileSync(new URL("../schedule.js", import.meta.url), "utf8"), ctx);
const HNP = ctx.HNP, tours = HNP.buildTours();

// Mẫu thật từ arenapoker.vn ngày 29/10 (get-listhomnay), đổi số entry để test
const arenaList = {"data":[{"ID":315114,"TotalEntry":7,"GTDEntry":10,"TenGD":"ARENA NIGHT (25% ITM)","ThoiGianBD":"2026-10-29T20:00:17"},{"ID":315112,"TotalEntry":31,"GTDEntry":30,"TenGD":"THE GLADIATOR DASH (25%ITM)","ThoiGianBD":"2026-10-29T17:00:05"},{"ID":315219,"TotalEntry":12,"GTDEntry":null,"TenGD":"SATELLITE FOR THE GLADIATOR DASH","ThoiGianBD":"2026-10-29T15:30:16"}],"status":2000};
const arenaDetail = {"data":{"id":315114,"tenGD":"ARENA NIGHT (25% ITM)","totalEntry":8,"ngayGioBD":"2026-10-29T20:00:17"},"status":2000};

test("fromJson lấy tên + entry ở cả hai kiểu khóa", () => {
  const f = [...fromJson(arenaList), ...fromJson(arenaDetail)];
  assert.equal(f.length, 4);
  assert.deepEqual(f[0], { name: "ARENA NIGHT (25% ITM)", n: 7, start: "2026-10-29T20:00:17" });
  assert.equal(f[3].n, 8);
});

test("match ghép đúng giải Arena, bất kể viết hoa và khoảng trắng trong (25%ITM)", () => {
  const { result, unmatched } = match([...fromJson(arenaList), ...fromJson(arenaDetail)], tours, "arena", "10-29", HNP);
  assert.deepEqual(unmatched, []);
  assert.equal(result["arena-10-29-2000-arena-night-25-itm"], 8); // giữ số lớn nhất
  assert.equal(result["arena-10-29-1700-the-gladiator-dash-25-itm"], 31);
  assert.equal(result["arena-10-29-1530-satellite-for-the-gladiator-dash"], 12);
});

test("match không ghép sang ngày khác", () => {
  const { result, unmatched } = match(fromJson(arenaList), tours, "arena", "10-30", HNP);
  assert.deepEqual(result, {});
  assert.equal(unmatched.length, 3);
});

test("match chọn giải cùng tên gần giờ bắt đầu nhất (Grand Loyal Flash)", () => {
  const { result } = match([{ name: "THE FLASH 2", n: 20, start: "2026-10-29T13:00:00" }], tours, "gl", "10-29", HNP);
  assert.deepEqual(Object.keys(result), ["gl-10-29-1300-the-flash-2"]);
});

test("fromRoyalText đọc thẻ LIVE NOW và bỏ tiền tố R -", () => {
  const text = "Royal Poker Tour\nLIVE NOW\n1\nView schedule\n29 OCT | 11:00 AM\nR - THURSDAY DUKE\nLEVEL 6\n300/600/600\n09\n:\n56\nNEXT LEVEL\n400/800/800\nPLAYERS\n85/120\nREG CLOSES IN\n02:19:57";
  const f = fromRoyalText(text);
  assert.deepEqual(f, [{ name: "R - THURSDAY DUKE", n: 120, start: null }]);
  const { result } = match(f, tours, "royal", "10-29", HNP);
  assert.equal(result["royal-10-29-1100-r-thursday-duke"], 120);
});

test("fromJson không đếm trùng object con và bỏ số không hợp lệ", () => {
  const f = fromJson({ data: [{ TenGD: "HYPER CLASH", TotalEntry: 5, detail: { tenGD: "HYPER CLASH", totalEntry: 5 } }, { name: "X", entries: true }, { name: "Y", entries: 2.5 }] });
  assert.deepEqual(f, [{ name: "HYPER CLASH", n: 5, start: null }]);
});

test("match không đoán khi trùng tên mà thiếu giờ bắt đầu", () => {
  const { result, unmatched } = match([{ name: "Deepstack Turbo", n: 50, start: null }], tours, "gl", "10-29", HNP);
  assert.deepEqual(result, { "gl-10-29-1500-deepstack-turbo": 50 }); // chỉ 1 giải tên này trong ngày nên vẫn ghép
  const two = match([{ name: "Speed I (25% ITM)", n: 9, start: null }], [...tours, { ...tours.find(t => t.id === "royal-10-29-1030-r-speed-i-25-itm"), id: "dup", startTs: 0 }], "royal", "10-29", HNP);
  assert.deepEqual(two.result, {});
  assert.equal(two.unmatched.length, 1);
});

test("match đọc giờ UTC của Royal (startTime có Z) và không ghép giải cùng tên ngày khác", () => {
  const found = fromJson({ data: [
    { name: "R - SPEED I (25% ITM)", totalEntry: 16, startTime: "2026-10-29T03:30:00.000Z" },
    { name: "R - SPEED I (25% ITM)", totalEntry: 40, startTime: "2026-10-28T03:30:00.000Z" },
  ] });
  const { result } = match(found, tours, "royal", "10-29", HNP);
  assert.deepEqual(result, { "royal-10-29-1030-r-speed-i-25-itm": 16 });
});

test("Center: chữ in đậm Unicode và đuôi GTD vẫn ghép đúng", () => {
  const found = fromJson({ data: [
    { TenGD: " \u{1D402}\u{1D404}\u{1D40D}\u{1D413}\u{1D404}\u{1D411}-\u{1D40F} \u{1D406}\u{1D411}\u{1D404}\u{1D404}\u{1D40D} \u{1D406}\u{1D404}\u{1D402}\u{1D40A}\u{1D40E} – \u{1D406}\u{1D413}\u{1D403} \u{1D7CF}\u{1D7CE}\u{1D7CE} \u{1D404}\u{1D40D}\u{1D413}\u{1D411}\u{1D408}\u{1D404}\u{1D412}", TotalEntry: 90, ThoiGianBD: "2026-10-29T11:00:12" },
    { TenGD: "CenterP Daily - GTD 100 Entries", TotalEntry: 53, ThoiGianBD: "2026-10-29T15:00:01" },
    { TenGD: " MINI HIGHROLLER - GTD 30 ENTRIES", TotalEntry: 4, ThoiGianBD: "2026-10-29T17:00:01" },
    { tour_name: "x", TenGD: "LIVE TRAKER", TotalEntry: 0, start_at: "2026-10-29T02:25:22+00:00" },
  ] });
  const { result, unmatched } = match(found, tours, "center", "10-29", HNP);
  assert.deepEqual(result, {
    "center-10-29-1100-center-p-green-gecko": 90,
    "center-10-29-1500-centerp-daily": 53,
    "center-10-29-1700-mini-highroller": 4,
  });
  assert.deepEqual(unmatched, ["LIVE TRAKER"]);
});

test("fromRoyalText tách đúng tên khi có hai thẻ LIVE", () => {
  const text = "LIVE NOW\n2\n29 OCT | 10:30 AM\nR - SPEED I (25% ITM)\nBREAK 1\n300/500/500\nPLAYERS\n20/31\nREG CLOSES IN\n00:10:00\nVIEW DETAILS\nPLAYERS\n12/14";
  assert.deepEqual(fromRoyalText(text), [{ name: "R - SPEED I (25% ITM)", n: 31, start: null }]);
});
