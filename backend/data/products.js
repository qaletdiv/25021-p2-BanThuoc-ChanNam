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
  {
    id: 2,
    name: "Vitamin C 1000mg",
    price: 120000,
    category: "Vitamin & Khoáng chất",
    categoryId: 2,
    image: "images/products/med002.jpg",
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
    price: 85000,
    category: "Hỗ trợ tiêu hóa",
    categoryId: 3,
    image: "images/products/med003.jpg",
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
  {
    id: 4,
    name: "Thuốc nhỏ mắt Tobrex",
    price: 65000,
    category: "Chăm sóc cá nhân",
    categoryId: 4, 
    image: "images/products/med004.jfif",
    manufacturer: "GlaxoSmithKline",
    ingredients: "Tobramycin 0.3% (3mg/g)",
    usage: "Điều trị các bệnh về mắt do vi khuẩn gây ra như viêm kết mạc, loét giác mạc.",
    description: "Điều trị các bệnh về mắt do vi khuẩn gây ra như viêm kết mạc, loét giác mạc.",
    type: "kedon",
    units: [
      { name: "Ống 5ml", price: 65000 }
    ]
  },
  {
    id: 5,
    name: "Omega 3 Total",
    price: 350000,
    category: "Thực phẩm chức năng",
    categoryId: 5,
    image: "images/products/med005.jfif",
    manufacturer: "Công ty TNHH Một Thành Viên Dược Phẩm Omega",
    ingredients: "Omega-3 (EPA và DHA) từ dầu cá.",
    usage: "Hỗ trợ tim mạch, não bộ và thị lực. Giàu EPA và DHA.",
    description: "Hỗ trợ tim mạch, não bộ và thị lực. Giàu EPA và DHA.",
    type: "khongkedon",
    units: [
      { name: "Chai 30 viên", price: 350000 },
      { name: "Hộp 90 viên", price: 990000 }
    ]
  },
  {
    id: 6,
    name: "Thuốc ho Bảo Thanh",
    price: 75000,
    category: "Thuốc cảm cúm & Sốt",
    categoryId: 1,
    image: "images/products/med006.jfif",
    manufacturer: "Công ty Cổ phần Dược phẩm Yên Bái",
    ingredients: "Vỏ rễ cây rẻ quạt, lá thường sơn, lá tía tô, gừng, đường phèn, chất bảo quản (E211).",
    usage: "Giúp long đờm, giảm ho, thanh nhiệt, giải độc.",
    description: "Giúp long đờm, giảm ho, thanh nhiệt, giải độc.",
    type: "khongkedon",
    units: [
      { name: "Chai 100ml", price: 75000 },
      { name: "Hộp 2 chai", price: 140000 }
    ]
  },
  {
    "id": 7,
    "name": "Panadol Extra",
    "price": 65000,
    "category": "Thuốc cảm cúm & Sốt",
    "categoryId": 1,
    "image": "images/products/med007.jpg",
    "manufacturer": "GlaxoSmithKline",
    "ingredients": "Paracetamol 500mg, Caffeine 65mg",
    "usage": "Giảm đau đầu, đau cơ, hạ sốt.",
    "description": "Thuốc giảm đau, hạ sốt với công thức kết hợp Paracetamol và Caffeine.",
    "type": "khongkedon",
    "units": [
      { "name": "Vỉ 10 viên", "price": 65000 },
      { "name": "Hộp 5 vỉ", "price": 300000 }
    ]
  },
  {
    "id": 8,
    "name": "Vitamin D3 2000IU",
    "price": 95000,
    "category": "Vitamin & Khoáng chất",
    "categoryId": 2,
    "image": "images/products/med008.jpg",
    "manufacturer": "Nature's Bounty",
    "ingredients": "Vitamin D3 2000IU",
    "usage": "Bổ sung Vitamin D3, hỗ trợ hấp thu canxi, tốt cho xương.",
    "description": "Viên nang mềm bổ sung Vitamin D3 hàm lượng cao cho người thiếu vitamin D.",
    "type": "khongkedon",
    "units": [
      { "name": "Lọ 60 viên", "price": 95000 },
      { "name": "Lọ 120 viên", "price": 170000 }
    ]
  },
  {
    "id": 9,
    "name": "Smecta",
    "price": 45000,
    "category": "Hỗ trợ tiêu hóa",
    "categoryId": 3,
    "image": "images/products/med009.jpg",
    "manufacturer": "Ipsen Pharma",
    "ingredients": "Diosmectite 3g",
    "usage": "Điều trị tiêu chảy cấp và mãn tính.",
    "description": "Thuốc điều trị tiêu chảy, giúp bảo vệ niêm mạc đường tiêu hóa.",
    "type": "khongkedon",
    "units": [
      { "name": "Gói 3g x 12 gói", "price": 45000 },
      { "name": "Gói 3g x 30 gói", "price": 100000 }
    ]
  },
  {
    "id": 10,
    "name": "Coversyl 5mg",
    "price": 85000,
    "category": "Tim mạch",
    "categoryId": 4,
    "image": "images/products/med010.jpg",
    "manufacturer": "Servier",
    "ingredients": "Perindopril 5mg",
    "usage": "Điều trị tăng huyết áp, suy tim.",
    "description": "Thuốc ức chế men chuyển điều trị các bệnh lý tim mạch.",
    "type": "kedon",
    "units": [
      { "name": "Hộp 30 viên", "price": 85000 },
      { "name": "Hộp 90 viên", "price": 230000 }
    ]
  },
  {
    "id": 11,
    "name": "Glucosamine 1500mg",
    "price": 250000,
    "category": "Thực phẩm chức năng",
    "categoryId": 5,
    "image": "images/products/med011.png",
    "manufacturer": "Kirkland",
    "ingredients": "Glucosamine Sulfate 1500mg",
    "usage": "Hỗ trợ sức khỏe xương khớp, giảm thoái hóa khớp.",
    "description": "Bổ sung Glucosamine duy trì sụn khớp khỏe mạnh, giảm đau khớp.",
    "type": "khongkedon",
    "units": [
      { "name": "Lọ 120 viên", "price": 250000 },
      { "name": "Lọ 240 viên", "price": 450000 }
    ]
  },
  {
    "id": 12,
    "name": "Amoxicillin 500mg",
    "price": 75000,
    "category": "Thuốc cảm cúm & Sốt",
    "categoryId": 1,
    "image": "images/products/med012.jpg",
    "manufacturer": "Stada",
    "ingredients": "Amoxicillin 500mg",
    "usage": "Kháng sinh điều trị nhiễm khuẩn.",
    "description": "Kháng sinh phổ rộng điều trị các bệnh nhiễm khuẩn đường hô hấp.",
    "type": "kedon",
    "units": [
      { "name": "Hộp 12 viên", "price": 75000 },
      { "name": "Hộp 24 viên", "price": 140000 }
    ]
  }
];