HƯỚNG DẪN ĐỒNG BỘ THẬT CHO MỌI THIẾT BỊ - v1.11

Vấn đề bản cũ:
- Nếu chỉ dùng localStorage, mỗi trình duyệt/thiết bị có một dữ liệu riêng.
- Bản v1.11 đã sửa: trang thiệp public sẽ ưu tiên đọc dữ liệu từ Google Apps Script/Google Sheet và bỏ qua dữ liệu local từng thiết bị.

BẮT BUỘC: CẬP NHẬT GOOGLE APPS SCRIPT
1. Mở Google Apps Script của bạn.
2. Xóa code cũ trong Code.gs.
3. Dán toàn bộ nội dung file google-apps-script.gs của bản v1.11.
4. Bấm Save.
5. Chọn Deploy -> Manage deployments.
6. Bấm Edit deployment (biểu tượng bút chì) hoặc New deployment.
7. Chọn Web app.
8. Execute as: Me.
9. Who has access: Anyone.
10. Deploy.
11. Copy Web app URL dạng:
   https://script.google.com/macros/s/AKfycb.../exec

LƯU Ý QUAN TRỌNG:
- URL dạng /home/projects/.../edit KHÔNG dùng được cho website.
- Mã Deployment ID riêng lẻ cũng chưa đủ nếu copy thiếu ký tự. Cần full Web app URL kết thúc bằng /exec.
- Sau khi update code Apps Script, bắt buộc bấm Deploy lại để web app chạy code mới.

CÁCH KIỂM TRA:
1. Mở link Web app URL + ?action=ping trên trình duyệt.
   Ví dụ: https://script.google.com/macros/s/AKfycb.../exec?action=ping
2. Nếu đúng, bạn sẽ thấy JSON có ok:true.
3. Vào admin.html?v=111, chỉnh một nội dung nhỏ, bấm Lưu đồng bộ.
4. Mở index.html?v=111 bằng trình duyệt ẩn danh hoặc điện thoại khác.
5. Nếu thấy thay đổi là đồng bộ đã thành công.

NÚT TRONG ADMIN:
- Lưu bản nháp: chỉ lưu trên thiết bị hiện tại, không ảnh hưởng khách mời.
- Lưu đồng bộ: lưu thật lên Google Sheet/Drive, mọi thiết bị sẽ thấy sau khi tải lại trang.


V1.12 note: Ảnh upload lên Google Drive sẽ được chuyển sang link thumbnail public (drive.google.com/thumbnail?id=...&sz=w2000) để hiển thị ổn định trên thẻ img và background của thiệp. Sau khi upload ảnh trong Admin, bấm Lưu đồng bộ để cập nhật cho tất cả thiết bị.
