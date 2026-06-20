HUONG DAN DONG BO DU LIEU CHO TAT CA THIET BI - V1.9

Vấn đề trước đây:
- Lưu bản nháp và một số ảnh được lưu bằng localStorage/dataURL nên chỉ có hiệu lực trên đúng trình duyệt/thiết bị đang chỉnh.

Bản v1.9 sửa theo hướng:
- Lưu bản nháp: chỉ dùng để preview trên thiết bị hiện tại.
- Lưu đồng bộ: gửi dữ liệu thật lên Google Sheet.
- Ảnh chọn từ Admin: nếu đã cấu hình Google Apps Script URL, ảnh sẽ được upload lên Google Drive và lấy URL công khai để mọi thiết bị đều thấy.
- RSVP: lưu về Google Sheet.

CÁC BƯỚC CẤU HÌNH 1 LẦN:

1. Tạo Google Sheet mới.
2. Vào Extensions -> Apps Script.
3. Xóa code mặc định và dán toàn bộ nội dung file google-apps-script.gs.
4. Bấm Deploy -> New deployment -> Web app.
5. Execute as: Me.
6. Who has access: Anyone.
7. Copy Web App URL.
8. Dán URL này vào tab Thiết lập trong Admin.
9. Bấm Lưu đồng bộ để tạo config trên Google Sheet.
10. Quan trọng: để tất cả thiết bị đều tự đọc cloud config, cần cấu hình URL này vào file js/config.js:

   googleAppsScriptUrl: 'DAN_WEB_APP_URL_CUA_BAN_VAO_DAY',

   Sau đó upload lại js/config.js lên GitHub.

Nếu muốn, bạn gửi Web App URL cho tôi, tôi sẽ cập nhật vào source giúp bạn trong phiên bản tiếp theo.

LƯU Ý VỀ HÌNH ẢNH:
- Sau khi có Google Apps Script URL, hãy upload ảnh bằng Admin để ảnh được đưa lên Google Drive.
- Không nên dùng data:image/... cho bản chính thức vì dữ liệu ảnh quá lớn và chỉ phù hợp preview local.

LINK KIỂM TRA SAU KHI DEPLOY:
- Thiệp: index.html?v=19
- Admin: admin.html?v=19


V1.10: Web App URL da duoc gan san: https://script.google.com/macros/s/AKfycbxEytWyacmGPXntktLmicqxBmNtch2EER4OjKHDY06A/exec
