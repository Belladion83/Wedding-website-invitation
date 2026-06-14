WEDDING INVITATION CMS V1.1 - Phú Quí & Ánh Nguyệt

1) Deploy nhanh lên GitHub Pages
- Giải nén file ZIP.
- Vào repo GitHub: Belladion83/Wedding-website-invitation
- Xóa / ghi đè các file cũ.
- Upload TOÀN BỘ file và thư mục bên trong thư mục wedding_invitation_phuqui_anhnguyet_cms_v1 lên root repo.
- Bật Settings -> Pages -> Deploy from branch -> main -> /(root).
- Link thiệp: https://belladion83.github.io/Wedding-website-invitation/
- Link admin: https://belladion83.github.io/Wedding-website-invitation/admin.html

2) Admin mặc định
- Mật khẩu mặc định: 29062026
- Có thể đổi trong Admin -> Thiết lập -> Mật khẩu admin.

3) Những gì Admin chỉnh được
- Tên cô dâu/chú rể, ngày báo hỷ, maps, story.
- Thông tin nhà trai/nhà gái.
- Thông tin nhà hàng/sảnh/giờ tiệc.
- Ảnh bìa, ảnh vỏ thiệp, ảnh cô dâu/chú rể, ảnh nền cảm ơn.
- Album ảnh cưới.
- QR và thông tin ngân hàng cô dâu/chú rể.
- Danh sách khách mời và link riêng từng khách.
- Xem RSVP và xuất CSV.

4) Lưu ý quan trọng về chỉnh sửa Admin
- Nút "Lưu bản nháp" lưu trên trình duyệt hiện tại để preview nhanh.
- Muốn thay đổi có hiệu lực cho mọi khách truy cập, cần cấu hình Google Apps Script trong file google-apps-script.gs.
- Sau khi có Web App URL, dán vào Admin -> Thiết lập -> Google Apps Script Web App URL rồi dùng "Lưu lên Google Sheet".

5) Link riêng từng khách
- Vào Admin -> Khách mời.
- Nhập mỗi dòng: Guest ID, Tên khách, Nhóm khách
Ví dụ:
A001, Anh Nguyễn Văn A, Chú rể
A002, Chị Trần Thị B, Cô dâu
- Bấm "Tạo & copy link mời".

6) Google Sheet / Apps Script
- Tạo Google Sheet mới.
- Extensions -> Apps Script.
- Dán nội dung file google-apps-script.gs.
- Deploy -> New deployment -> Web app.
- Execute as: Me.
- Who has access: Anyone.
- Copy Web App URL và dán vào Admin.



V1.3 visual sync: cập nhật giao diện để bám sát mockup dài màu kem/vàng, hero dạng ảnh vòm + text, card mềm, event layout truyền thống tinh chỉnh.
