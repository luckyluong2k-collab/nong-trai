# Hướng dẫn chạy prototype

## Yêu cầu

- Godot Engine 4.6 hoặc phiên bản Godot 4 mới hơn.
- Windows 10/11, macOS hoặc Linux.

## Chạy game

1. Tải hoặc clone repository.
2. Mở Godot.
3. Chọn **Import** và trỏ đến file `project.godot`.
4. Mở project rồi nhấn **F6/F5** hoặc nút Play.
5. Tại màn hình đầu, nhấn **Enter**.

## Điều khiển

| Phím | Chức năng |
|---|---|
| WASD / phím mũi tên | Di chuyển |
| 1 | Chọn cuốc |
| 2 | Chọn hạt giống |
| 3 | Chọn bình tưới |
| 4 | Chọn cần câu |
| Space | Dùng công cụ đang chọn |
| E | Tương tác, mua hạt, bán hàng hoặc ngủ |
| N | Sang ngày mới |
| F5 | Lưu game |
| F9 | Tải game |

## Vòng chơi hiện có

1. Chọn cuốc và cuốc ô đất.
2. Chọn hạt giống và gieo.
3. Chọn bình tưới và tưới cây.
4. Nhấn `N` để sang ngày mới; cây được tưới sẽ lớn thêm.
5. Khi cây chín, đứng gần và nhấn `Space` để thu hoạch.
6. Đứng sát ao, chọn cần câu và nhấn `Space` để câu cá.
7. Mang cá và nông sản đến thùng **BÁN**, nhấn `E` để nhận xu.
8. Gặp Bác Tư và nhấn `E` để mua thêm hạt giống.

## Phạm vi prototype

Đồ họa hiện được vẽ trực tiếp bằng GDScript để repository không phụ thuộc asset ngoài. Bước tiếp theo là thay bằng sprite pixel nguyên bản, thêm animation, âm thanh, bản đồ lớn và hệ thống nhiệm vụ.
