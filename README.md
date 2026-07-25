# Ôn thi trắc nghiệm PRM393

Website ôn luyện trắc nghiệm cá nhân cho môn PRM393 (Mobile Programming — Flutter/Dart), 416 câu hỏi trải đều 11 module + 1 đề mẫu gốc. Chạy hoàn toàn phía client, không cần backend, tiến trình học được lưu qua `localStorage`.

## Chạy local

Yêu cầu [Node.js](https://nodejs.org/) bản 18 trở lên.

```bash
npm install
npm run dev
```

Mở trình duyệt tại địa chỉ hiện ra trong terminal (mặc định `http://localhost:5173`).

## Build production

```bash
npm run build
npm run preview   # xem thử bản build
```

Kết quả nằm trong thư mục `dist/`.

## Tính năng

- **Bộ lọc**: chọn Module (12 lựa chọn) và Dạng câu (Which/What, Why, Bổ sung, Đề mẫu gốc), kết hợp được với nhau.
- **2 chế độ học**: Quiz (chọn đáp án, phản hồi đúng/sai ngay, có giải thích) và Flashcard (lật thẻ xem đáp án).
- **Xáo trộn** thứ tự câu hỏi, bật/tắt được.
- **Lưu tiến trình** qua `localStorage`: tổng số câu đã luyện, % đúng, danh sách câu từng làm sai, streak ngày học liên tiếp.
- **Ôn lại câu sai**: luyện riêng các câu đã từng trả lời sai.
- **Phím tắt**: `1`-`4` hoặc `A`-`D` để chọn đáp án, `Enter`/`→` để qua câu tiếp theo.
- Giao diện responsive từ 375px trở lên.

## Deploy miễn phí

### Vercel

1. Đẩy code lên một repo GitHub.
2. Vào [vercel.com](https://vercel.com) → **Add New Project** → chọn repo.
3. Vercel tự nhận diện Vite, giữ mặc định:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Nhấn **Deploy**.

### Netlify

1. Đẩy code lên GitHub (hoặc kéo-thả thư mục `dist` sau khi build vào [app.netlify.com/drop](https://app.netlify.com/drop) để deploy nhanh không cần Git).
2. Nếu deploy qua Git: **Add new site → Import an existing project**, chọn repo, cấu hình:
   - Build command: `npm run build`
   - Publish directory: `dist`

### GitHub Pages

1. Cài `gh-pages`: `npm install -D gh-pages`
2. Thêm vào `package.json`:
   ```json
   "homepage": "https://<username>.github.io/<repo>",
   "scripts": { "deploy": "vite build && gh-pages -d dist" }
   ```
3. Thêm `base: '/<repo>/'` vào `vite.config.ts`.
4. Chạy `npm run deploy`.

## Cấu trúc dự án

```
src/
├── App.tsx                # UI chính, điều phối phiên học
├── types.ts                # Kiểu dữ liệu câu hỏi & tiến trình
├── data/quiz_data.json     # 416 câu hỏi (đã chuẩn hóa UTF-8)
├── lib/
│   ├── quiz.ts              # Lọc, xáo trộn, danh sách module
│   └── storage.ts           # Đọc/ghi localStorage
├── hooks/useProgress.ts    # Hook quản lý tiến trình học
└── components/
    ├── Filters.tsx
    ├── QuizCard.tsx
    ├── FlashCard.tsx
    ├── ProgressBar.tsx
    └── ScoreSummary.tsx
```

## Ghi chú dữ liệu

File `quiz_data.json` gốc gặp lỗi encoding (UTF-8 bị giải mã nhầm thành Windows-1252) khiến toàn bộ phần tiếng Việt bị biến dạng. Dữ liệu trong repo này đã được khôi phục lại chính xác qua phân tích byte-level; một số câu trong đề gốc thiếu đáp án B/C/D (lỗi có sẵn từ nguồn) — ứng dụng xử lý an toàn bằng cách chỉ hiển thị các đáp án thực sự tồn tại.
