// Tính ICM (Malmuth-Harville) và chip chop khi deal giải. Dùng chung cho trang và test.
(function (g) {

/**
 * Giá trị ICM của từng người: xác suất về từng hạng tỉ lệ với stack,
 * người về nhất bị loại rồi tính tiếp cho hạng sau.
 * stacks: số chip (> 0); prizes: tiền thưởng hạng 1, 2, ... (thiếu thì coi là 0).
 */
function icm(stacks, prizes) {
  const n = stacks.length;
  const P = Math.min(n, prizes.length);
  const memo = new Map();
  // rec(mask): phần tiền thưởng từ hạng (n - số người còn lại) trở đi, chia cho những người trong mask
  const rec = mask => {
    const place = n - popcount(mask);
    if (place >= P) return null;
    if (memo.has(mask)) return memo.get(mask);
    let total = 0;
    for (let i = 0; i < n; i++) if (mask & (1 << i)) total += stacks[i];
    const res = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      if (!(mask & (1 << i))) continue;
      const p = stacks[i] / total;
      res[i] += p * prizes[place];
      const sub = rec(mask & ~(1 << i));
      if (sub) for (let j = 0; j < n; j++) res[j] += p * sub[j];
    }
    memo.set(mask, res);
    return res;
  };
  return rec((1 << n) - 1) || new Array(n).fill(0);
}
const popcount = m => { let c = 0; while (m) { m &= m - 1; c++; } return c; };

/** Chip chop: ai cũng nhận tiền hạng cuối đang còn, phần dư chia theo tỉ lệ chip. */
function chipChop(stacks, prizes) {
  const n = stacks.length;
  const total = stacks.reduce((a, b) => a + b, 0);
  const paid = prizes.slice(0, n);
  const floor = paid.length >= n ? paid[n - 1] : 0;
  const rest = paid.reduce((a, b) => a + b, 0) - floor * n;
  return stacks.map(s => floor + rest * s / total);
}

/**
 * "50M", "25tr", "800k", "1,5 tỷ", "25.000.000" -> số đồng. Không hiểu thì trả về null.
 * Có đơn vị thì dấu , hoặc . là phần thập phân; không có đơn vị thì là dấu ngăn hàng nghìn.
 */
function parseMoney(str) {
  const s = String(str ?? "").toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/\s+/g, "");
  const m = /^(\d[\d.,]*)(k|ng|nghin|m|tr|trieu|cu|b|ty)?$/.exec(s);
  if (!m) return null;
  const unit = { k: 1e3, ng: 1e3, nghin: 1e3, m: 1e6, tr: 1e6, trieu: 1e6, cu: 1e6, b: 1e9, ty: 1e9 }[m[2]] || 1;
  let num;
  if (unit === 1) num = Number(m[1].replace(/[.,]/g, ""));
  else {
    if ((m[1].match(/[.,]/g) || []).length > 1) return null;
    num = Number(m[1].replace(",", "."));
  }
  return Number.isFinite(num) ? Math.round(num * unit) : null;
}

g.HNPICM = { icm, chipChop, parseMoney };
})(typeof window !== "undefined" ? window : globalThis);
