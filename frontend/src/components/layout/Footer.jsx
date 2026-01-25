// src/components/layout/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <div className="text-xl font-bold mb-4">PharmaHub</div>
            <p className="text-gray-400">
              Nhà thuốc trực tuyến uy tín, cung cấp thuốc chất lượng cao và dịch vụ tư vấn chuyên nghiệp.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Về chúng tôi</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Điều khoản sử dụng</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Hướng dẫn mua hàng</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Thông tin liên hệ</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Hotline: 1900 1234</li>
              <li>Email: info@pharmahub.vn</li>
              <li>Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</li>
              <li>Giờ làm việc: 5:00 ~ 22:00 mỗi ngày</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
          &copy; 2025 PharmaHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}