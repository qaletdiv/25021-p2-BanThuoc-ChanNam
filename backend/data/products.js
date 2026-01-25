// backend/data/products.js
export const products = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    description: "Thuốc giảm đau, hạ sốt hiệu quả.",
    category: "Thuốc cảm cúm & Sốt",
    categoryId: 1,
    image: "/images/products/med001.jpg",
    images: ["/images/products/med001-1.jpg", "/images/products/med001-2.jfif"],
    manufacturer: "Dược phẩm ABC",
    ingredients: "Paracetamol 500mg",
    usage: "Giảm đau, hạ sốt.",
    type: "khongkedon",
    units: [
      { name: "Vỉ 10 viên", price: 50000 },
      { name: "Hộp 10 vỉ", price: 480000 }
    ]
  },
  // --- Sửa các sản phẩm còn lại ---
  {
    id: 2,
    name: "Vitamin C 1000mg",
    category: "Vitamin & Khoáng chất",
    categoryId: 2,
    image: "/images/products/med002.jpg",
    images: ["/images/products/med002.jpg"], // ← Thêm mảng images
    manufacturer: "Công ty TNHH Dinh Dưỡng XYZ",
    ingredients: "Vitamin C (L-Ascorbic Acid) 1000mg",
    usage: "Tăng cường sức đề kháng, chống oxy hóa, hỗ trợ làm đẹp da.",
    description: "Tăng cường sức đề kháng, chống oxy hóa, hỗ trợ làm đẹp da.",
    type: "khongkedon",
    units: [
      { name: "Chai 30 viên", price: 120000 },
      { name: "Hộp 60 viên", price: 230000 }
    ]
  },
  {
    id: 3,
    name: "Men vi sinh Đại Bắc (Probiotics)",
    category: "Hỗ trợ tiêu hóa",
    categoryId: 3,
    image: "/images/products/med003.jpg",
    images: ["/images/products/med003.jpg"], // ← Thêm mảng images
    manufacturer: "Công ty Cổ phần Dược phẩm Đại Bắc",
    ingredients: "Lactobacillus acidophilus, Bifidobacterium bifidum, Enterococcus faecium, Bacillus subtilis.",
    usage: "Hỗ trợ tiêu hóa, cải thiện hệ vi sinh đường ruột, giảm đầy bụng khó tiêu.",
    description: "Hỗ trợ tiêu hóa, cải thiện hệ vi sinh đường ruột, giảm đầy bụng khó tiêu.",
    type: "khongkedon",
    units: [
      { name: "Hộp 10 gói", price: 85000 },
      { name: "Hộp 30 gói", price: 240000 }
    ]
  },
  // ... làm tương tự cho id=4 đến id=12
  {
    id: 12,
    name: "Amoxicillin 500mg",
    category: "Thuốc cảm cúm & Sốt",
    categoryId: 1,
    image: "/images/products/med012.jpg",
    images: ["/images/products/med012.jpg"], // ← Thêm mảng images
    manufacturer: "Stada",
    ingredients: "Amoxicillin 500mg",
    usage: "Kháng sinh điều trị nhiễm khuẩn.",
    description: "Kháng sinh phổ rộng điều trị các bệnh nhiễm khuẩn đường hô hấp.",
    type: "kedon",
    units: [
      { "name": "Hộp 12 viên", "price": 75000 },
      { "name": "Hộp 24 viên", "price": 140000 }
    ]
  }
];