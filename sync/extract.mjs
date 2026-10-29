// Hàm thuần: rút số entry từ dữ liệu trang CLB và ghép vào giải trong schedule.js.
// Tách riêng để test được mà không cần mở trình duyệt.

const NAME_KEYS = ["TenGD", "tenGD", "TourName", "tourName", "TenGiai", "tenGiai", "name", "Name", "title", "Title"];
const ENTRY_KEYS = ["TotalEntry", "totalEntry", "TotalEntries", "totalEntries", "Entries", "entries", "Entry", "entry", "TotalPlayer", "totalPlayer", "TongEntry", "tongEntry"];
const START_KEYS = ["ThoiGianBD", "ngayGioBD", "NgayGioBD", "startAt", "StartAt", "startTime", "StartTime", "start_time"];

// Chỉ nhận số nguyên không âm (số hoặc chuỗi toàn chữ số)
const toCount = v => typeof v === "number" ? (Number.isSafeInteger(v) && v >= 0 ? v : null)
  : typeof v === "string" && /^\d{1,6}$/.test(v.trim()) ? Number(v) : null;
const pick = (o, keys) => { for (const k of keys) if (o[k] !== undefined && o[k] !== null && o[k] !== "") return o[k]; return undefined; };

/** Duyệt mọi object trong JSON, lấy những object có cả tên giải và số entry. */
export function fromJson(json) {
  const out = [];
  const walk = v => {
    if (Array.isArray(v)) { v.forEach(walk); return; }
    if (!v || typeof v !== "object") return;
    const name = pick(v, NAME_KEYS), n = toCount(pick(v, ENTRY_KEYS));
    if (typeof name === "string" && name.trim() && n !== null) {
      out.push({ name: name.trim(), n, start: pick(v, START_KEYS) ?? null });
      return; // đã nhận là một giải: không duyệt object con để tránh đếm trùng
    }
    Object.values(v).forEach(walk);
  };
  walk(json);
  return out;
}

/**
 * Thẻ "LIVE NOW" trên royal-poker.com: tên giải, rồi "PLAYERS" và "còn lại/tổng".
 * Lấy số sau dấu "/" làm tổng entry.
 */
export function fromRoyalText(text) {
  const out = [];
  const lines = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  let from = 0; // chỉ tìm tên trong phần sau thẻ trước, tránh lấy nhầm tên thẻ khác
  for (let i = 0; i < lines.length; i++) {
    if (!/^players$/i.test(lines[i])) continue;
    const lo = Math.max(from, i - 12);
    from = i + 2;
    const m = /^(\d+)\s*\/\s*(\d+)$/.exec(lines[i + 1] || "");
    if (!m) continue;
    // Tên giải nằm phía trên, ngay trước dòng mức blind / BREAK
    let name = null;
    for (let j = i - 1; j >= lo; j--) {
      if (/^(break|level|next level|running|live now|view details|view schedule|reg closes in|buy-in|prize pool|avg stack|players|scheduled|\d|[\d\s:]+$)/i.test(lines[j])) continue;
      if (/\d+\/\d+\/\d+/.test(lines[j])) continue;
      if (/^\d{1,2}\s+[a-z]{3}\s*\|/i.test(lines[j])) break;
      name = lines[j];
      break;
    }
    if (name) out.push({ name, n: Number(m[2]), start: null });
  }
  return out;
}

/**
 * "2026-10-29T20:00:17" (giờ Hà Nội, không múi giờ) -> mốc tuyệt đối.
 * Có múi giờ ("...Z" của Royal, "...+00:00" của Beesky) thì đọc đúng múi giờ đó.
 */
export function parseStart(s, HNP) {
  if (!s || typeof s !== "string") return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(s);
  if (!m) return null;
  if (/(Z|[+-]\d{2}:?\d{2})$/.test(s.trim())) { const t = Date.parse(s); return Number.isFinite(t) ? t : null; }
  return Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) - HNP.VN;
}

/**
 * Ghép số entry đọc được vào giải của một CLB trong ngày `md`.
 * Cùng tên trong ngày thì chọn giải có giờ bắt đầu gần nhất.
 * Trả về {id: n}; bỏ qua mục không ghép được (trả kèm trong `unmatched`).
 */
export function match(found, tours, club, md, HNP) {
  const pool = tours.filter(t => t.club === club && t.md === md);
  const result = {}, unmatched = [];
  for (const f of found) {
    const key = HNP.normName(f.name);
    if (!key) continue;
    let cands = pool.filter(t => HNP.normName(t.name) === key);
    // Ghép gần đúng (tên bị cắt đuôi): chỉ khi đủ dài và chỉ có đúng một giải khớp
    if (!cands.length && key.length >= 8) {
      const loose = pool.filter(t => { const k = HNP.normName(t.name); return k.length >= 8 && (k.startsWith(key) || key.startsWith(k)); });
      if (loose.length === 1) cands = loose;
    }
    if (!cands.length) { unmatched.push(f.name); continue; }
    const st = parseStart(f.start, HNP);
    // Trùng tên mà không biết giờ bắt đầu thì không đoán
    if (st === null && cands.length > 1) { unmatched.push(f.name); continue; }
    cands.sort((a, b) => st === null ? a.startTs - b.startTs : Math.abs(a.startTs - st) - Math.abs(b.startTs - st));
    const t = cands[0];
    if (st !== null && Math.abs(t.startTs - st) > 3 * HNP.HOUR) { unmatched.push(f.name); continue; }
    // Nhiều nguồn cho cùng giải: giữ số lớn nhất (entry chỉ tăng)
    result[t.id] = Math.max(result[t.id] ?? 0, f.n);
  }
  return { result, unmatched };
}
