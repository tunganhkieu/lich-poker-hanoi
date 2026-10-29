# Lịch Poker Hà Nội

Trang gộp lịch giải của 6 CLB poker Hà Nội, có cảnh báo Overlay. Số entry được tự cập nhật 15 phút/lần từ 10:00 đến 00:45 bằng GitHub Actions, không tốn credit Claude.

## Các file

| File | Vai trò |
|---|---|
| `index.html` | Trang web. Tự tải `entries.json` mỗi phút. |
| `schedule.js` | Lịch giải (mảng `RAW`). Sửa file này khi có lịch tuần mới. |
| `entries.json` | Số entry thật, do script ghi. Đừng sửa tay. |
| `sync/sync.mjs` | Script mở web từng CLB bằng Chromium, đọc dữ liệu trang tự tải về, ghép vào giải. |
| `sync/extract.mjs` | Hàm rút số entry và ghép tên giải (có test). |
| `.github/workflows/sync.yml` | Lịch chạy 15 phút/lần. |

## Cài lên GitHub (làm 1 lần, khoảng 10 phút)

1. Tạo repo mới trên GitHub, để **Public**. Repo public thì GitHub Actions miễn phí không giới hạn phút. Repo private chỉ được 2.000 phút/tháng, không đủ cho 60 lượt/ngày.
2. Đẩy toàn bộ thư mục `poker-lich` lên repo đó, đặt các file này ở **gốc repo**.
3. Vào **Settings → Pages**, chọn Source là `Deploy from a branch`, branch `main`, thư mục `/ (root)`. Trang sẽ có địa chỉ dạng `https://<tên-github>.github.io/<tên-repo>/`.
4. Vào **Settings → Actions → General → Workflow permissions**, chọn `Read and write permissions` để script lưu được `entries.json`.
5. Vào tab **Actions**, chọn workflow `Cap nhat entry`, bấm **Run workflow** để chạy thử lần đầu. Xem log từng CLB: `found` là số giải đọc được, `matched` là số giải ghép được với lịch.

Lưu ý: GitHub có thể chạy trễ vài phút so với lịch vào giờ cao điểm.

## Chạy thử trên máy

```bash
npm install
npx playwright install chromium
npm test
npm run sync
```

Sau đó mở trang qua một server tĩnh, ví dụ `npx serve .`. Mở file trực tiếp bằng `file://` thì trình duyệt không cho tải `entries.json`.

## CLB nào có số entry

| CLB | Nguồn entry | Khi nào có |
|---|---|---|
| Arena | Dữ liệu trang chủ (nền Beesky) | Cả ngày, kể cả trước giờ chơi |
| Center Poker | Như Arena (nền Beesky) | Khi có giải trong ngày |
| Royal | Thẻ LIVE NOW trên trang chủ | Khi giải đang chạy |
| Grand Loyal | Trang `/tracker` | Khi giải đang chạy (chưa kiểm được định dạng lúc có giải chạy) |
| Quads, VPL | Không thấy công khai | Không có |

Nếu log báo `unmatched` cho một CLB, nghĩa là tên giải trên web khác tên trong `schedule.js`. Sửa tên trong `schedule.js` cho khớp.

## Cập nhật lịch tuần mới

Mở `schedule.js`, thay các dòng trong `RAW`. Mỗi dòng có dạng:

```
["MM-DD", "giờ bắt đầu", "tên giải", buy-in (nghìn đ), GTD (nghìn đ, hoặc "N vé", hoặc null), "giờ đóng reg" hoặc null, số entry GTD CLB công bố (không bắt buộc)]
```

Đổi cả `YEAR` nếu sang năm mới.
