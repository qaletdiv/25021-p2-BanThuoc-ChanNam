export const orders = [
  {
    id: "DH001",
    userId: 1,
    items: [
      { 
        productId: 1, 
        productName: "Panadol Extra",
        unit: "Vỉ 10 viên", 
        quantity: 2, 
        price: 50000,
        image: "images/products/med007.jpg"
      },
      { 
        productId: 2, 
        productName: "Vitamin C 1000mg",
        unit: "Chai 30 viên", 
        quantity: 1, 
        price: 120000,
        image: "images/products/med002.jpg"
      }
    ],
    subtotal: 220000,
    shippingCost: 15000,
    discount: 10000,
    totalPrice: 225000,
    recipientName: "Nguyễn Văn A",
    phone: "0912345678",
    address: "123 Đường ABC, Phường XYZ, Quận 1, TP. HCM",
    paymentMethod: "cod", // "cod" hoặc "bank_transfer"
    status: "shipping", // "pending", "processing", "shipping", "delivered", "cancelled"
    createdAt: "2024-05-20T10:30:00"
  },
  {
    id: "DH002",
    userId: 1,
    items: [
      { 
        productId: 3, 
        productName: "Bổ sung Canxi",
        unit: "Hộp 60 viên", 
        quantity: 1, 
        price: 180000,
        image: "images/products/med003.jpg"
      },
      { 
        productId: 4, 
        productName: "Omega-3",
        unit: "Lọ 100 viên", 
        quantity: 1, 
        price: 250000,
        image: "images/products/med004.jfif"
      }
    ],
    subtotal: 430000,
    shippingCost: 20000,
    discount: 0,
    totalPrice: 450000,
    recipientName: "Nguyễn Văn A",
    phone: "0912345678",
    address: "123 Đường ABC, Phường XYZ, Quận 1, TP. HCM",
    paymentMethod: "bank_transfer",
    status: "delivered",
    createdAt: "2024-05-15T14:20:00"
  },
  {
    id: "DH003",
    userId: 1,
    items: [
      { 
        productId: 5, 
        productName: "Thuốc ho Prospan",
        unit: "Chai 100ml", 
        quantity: 1, 
        price: 95000,
        image: "images/products/med005.jfif"
      }
    ],
    subtotal: 95000,
    shippingCost: 15000,
    discount: 5000,
    totalPrice: 105000,
    recipientName: "Nguyễn Thị B",
    phone: "0987654321",
    address: "456 Đường DEF, Phường UVW, Quận 2, TP. HCM",
    paymentMethod: "cod",
    status: "pending",
    createdAt: "2024-05-25T09:15:00"
  },
  {
    id: "DH004",
    userId: 1,
    items: [
      { 
        productId: 1, 
        productName: "Panadol Extra",
        unit: "Vỉ 10 viên", 
        quantity: 3, 
        price: 50000,
        image: "images/products/med007.jpg"
      }
    ],
    subtotal: 150000,
    shippingCost: 15000,
    discount: 0,
    totalPrice: 165000,
    recipientName: "Trần Văn C",
    phone: "0933445566",
    address: "789 Đường GHI, Phường KLM, Quận 3, TP. HCM",
    paymentMethod: "cod",
    status: "processing",
    createdAt: "2024-05-22T16:45:00"
  },
  {
    id: "DH005",
    userId: 1,
    items: [
      { 
        productId: 6, 
        productName: "Men tiêu hóa",
        unit: "Hộp 20 gói", 
        quantity: 2, 
        price: 80000,
        image: "images/products/med010.jpg"
      },
      { 
        productId: 7, 
        productName: "Dầu gió",
        unit: "Chai 10ml", 
        quantity: 1, 
        price: 35000,
        image: "images/products/med011.png"
      }
    ],
    subtotal: 195000,
    shippingCost: 15000,
    discount: 15000,
    totalPrice: 195000,
    recipientName: "Nguyễn Văn A",
    phone: "0912345678",
    address: "123 Đường ABC, Phường XYZ, Quận 1, TP. HCM",
    paymentMethod: "bank_transfer",
    status: "cancelled",
    createdAt: "2024-05-18T11:00:00"
  }
];