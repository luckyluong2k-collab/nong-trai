# Ứng Dụng Tình Yêu "Gnoul & Minyu - Our Love Journey" 💕

Ứng dụng web tình yêu được thiết kế độc quyền dành riêng cho cặp đôi **Gnoul** và **Minyu**, lấy mốc thời gian bắt đầu yêu từ ngày **04/04/2026** (Dương lịch). Ứng dụng được tối ưu hóa đặc biệt cho màn hình điện thoại (Mobile First), hiệu ứng chuyển động mượt mà, đầy đủ các tính năng của cặp đôi yêu nhau.

---

## 🌟 Các Tính Năng Nổi Bật

1. **Đếm Ngày Yêu Thời Gian Thực (04/04/2026)**:
   - Đếm tổng số ngày bên nhau, giờ, phút, giây nhảy thời gian thực.
   - Trái tim nhịp đập trung tâm tương tác âm thanh & hiệu ứng.
   - Cột mốc tình yêu tự động tính toán (100 ngày, 200 ngày, 1 năm, 500 ngày...) kèm thanh % tiến trình.
   - Câu châm ngôn tình yêu ngọt ngào mỗi ngày.

2. **Tiện Ích Mobile Màn Hình Nhỏ (Phone Widgets)**:
   - **Widget Locket (Ảnh chụp mới nhất)**: Mô phỏng tiện ích Locket trên màn hình iPhone, hiển thị ảnh mới nhất đối phương vừa chụp gửi kèm lời nhắn và thời gian. Có nút chụp/tải ảnh ngay và album xem lại tất cả ảnh đã gửi.
   - **Widget Tâm Trạng (Mood Sync)**: Đồng bộ tâm trạng giữa Gnoul và Minyu (*Yêu bạn đời, Nhớ đối phương, Thèm trà sữa, Buồn ngủ rùi, Cần cái ôm...*).
   - **Widget Pin (Battery Sync)**: Hiển thị % pin thực tế của máy.
   - **Widget Ghi Chú Tình Yêu (Love Sticky Note)**: Giấy nhớ dán màn hình với lời dặn dò dễ thương.

3. **Trò Chuyện Đôi & Gửi Ảnh (Couple Chat)**:
   - Giao diện bong bóng chat tinh tế chuẩn điện thoại.
   - Gửi tin nhắn văn bản, sticker tình yêu gửi nhanh (*"Em nhớ anh", "Anh yêu em", "Đi uống trà sữa"...*).
   - Tải ảnh hoặc chụp ảnh trực tiếp từ camera, nén ảnh tự động, xem ảnh phóng to toàn màn hình (Lightbox).
   - Nút chuyển đổi vai trò linh hoạt (`Gnoul 🤴 ⇄ Minyu 👸`) để trải nghiệm dễ dàng trên 1 thiết bị trước khi đồng bộ 2 máy.

4. **Trò Chơi Cặp Đôi (Couple Games)**:
   - **Cờ Caro Tình Yêu (Tic-Tac-Toe)**: Quân cờ Trái tim xanh (Gnoul 💙) vs Trái tim hồng (Minyu 💖), kèm **Vòng quay hình phạt ngọt ngào** khi thua (*Hôn 10 cái, Mua trà sữa, Gửi ảnh dìm, Nghe lời 1 ngày...*).
   - **Vòng Quay Hẹn Hò (Love Wheel)**: Quay ngẫu nhiên chọn hoạt động hẹn hò lãng mạn (*Xem phim, Ăn vặt, Nấu ăn, Lượn phố...*).
   - **Trắc Nghiệm Thấu Hiểu (Couple Quiz)**: Bộ câu hỏi kiểm tra mức độ hiểu nhau giữa Gnoul & Minyu.

5. **Dòng Thời Gian Kỷ Niệm (Timeline)**:
   - Lưu trữ các ngày kỷ niệm đặc biệt, những buổi hẹn đầu tiên và thêm ghi chú mới bất cứ lúc nào.

6. **Nhạc Nền & Hiệu Ứng Chuyển Động**:
   - Nhạc nền Piano Lofi ngọt ngào tự tạo bằng Web Audio API (chạy offline 100%, không lo lỗi link ngoài).
   - Cho phép nhập link bài hát MP3 yêu thích của 2 bạn.
   - Đĩa than xoay tròn khi phát nhạc.
   - Mưa hạt tim bồng bềnh nền canvas và chùm tim nổ tung khi chạm tay vào màn hình.

---

## 🚀 Hướng Dẫn Chạy Thử Ngay Bây Giờ

Bạn có thể mở trực tiếp file `index.html` bằng bất kỳ trình duyệt nào trên máy tính hoặc điện thoại:
- Trên máy tính: Ứng dụng sẽ hiển thị trong khung viền iPhone 16 Pro thời thượng.
- Trên điện thoại: Giao diện sẽ tự động vừa khít 100% toàn màn hình điện thoại mượt mà như app native.

---

## ☁️ Hướng Dẫn Đẩy Lên Firebase (Hosting & Realtime Database)

Khi bạn muốn đưa lên mạng để cả Gnoul và Minyu cùng truy cập từ 2 điện thoại riêng biệt và nhắn tin real-time:

### Bước 1: Tạo Project Firebase miễn phí
1. Truy cập [Firebase Console](https://console.firebase.google.com/) và đăng nhập bằng tài khoản Google.
2. Bấm **Add project** -> Đặt tên (ví dụ: `gnoul-minyu-love`) -> Bấm Tiếp tục cho đến khi tạo xong.

### Bước 2: Tạo Realtime Database
1. Trong menu bên trái, chọn **Build** -> **Realtime Database** -> Bấm **Create Database**.
2. Chọn vị trí (ví dụ `Singapore` hoặc `United States`).
3. Ở bước Security Rules, chọn **Start in test mode** (chế độ thử nghiệm để 2 máy đọc ghi dữ liệu tự do) -> Bấm **Enable**.
4. Tab **Rules**, đảm bảo rules như sau:
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```

### Bước 3: Lấy Thông Tin Cấu Hình (Firebase Config)
1. Bấm vào biểu tượng bánh răng ⚙️ (Project Settings) -> Cuộn xuống mục **Your apps**.
2. Bấm vào icon Web `</>` -> Đặt nickname app rồi bấm **Register app**.
3. Bạn sẽ nhận được đoạn mã chứa:
   - `apiKey`
   - `authDomain`
   - `databaseURL` (hoặc lấy từ tab Realtime Database)
   - `projectId`
4. Mở ứng dụng -> Vào tab **Cài Đặt** (⚙️) -> Dán các thông tin này vào mục **Kết Nối Firebase** -> Bấm **Lưu & Kết Nối Ngay**.

### Bước 4: Đẩy Lên Firebase Hosting (Miễn Phí Vĩnh Viễn)
Mở terminal trong thư mục `gnoul-minyu-love-app`:
```bash
# 1. Cài đặt Firebase CLI (nếu chưa có)
npm install -g firebase-tools

# 2. Đăng nhập
firebase login

# 3. Khởi tạo hosting
firebase init hosting
# - Chọn 'Use an existing project' -> chọn project của bạn
# - Public directory: gõ dấu chấm '.' (thư mục hiện tại)
# - Configure as a single-page app: No
# - Overwrite index.html: No

# 4. Triển khai
firebase deploy --only hosting
```
Sau lệnh này, bạn sẽ nhận được đường link web (ví dụ: `https://gnoul-minyu-love.web.app`), chỉ cần gửi link cho Minyu là cả hai có thể cài ra màn hình chính điện thoại và dùng mỗi ngày! 💕
