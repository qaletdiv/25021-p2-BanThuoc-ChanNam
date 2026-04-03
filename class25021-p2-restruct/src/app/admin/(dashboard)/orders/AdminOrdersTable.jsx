// AdminOrdersTable - Client Component for interactive admin features
'use client';

import React, { useState, useTransition } from 'react';
import { updateOrderStatusAction } from '@/actions/orders';

export default function AdminOrdersTable({ initialOrders }) {
  const [orders, setOrders] = useState(initialOrders);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const itemsPerPage = 10;

  const getStatusText = (status) => {
    const map = {
      pending: 'Chờ xác nhận',
      processing: 'Đang xử lý',
      shipping: 'Đang giao hàng',
      delivered: 'Đã giao',
      cancelled: 'Đã hủy'
    };
    return map[status] || status;
  };

  const getStatusColor = (status) => {
    const map = {
      pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border border-blue-200',
      shipping: 'bg-purple-100 text-purple-800 border border-purple-200',
      delivered: 'bg-green-100 text-green-800 border border-green-200',
      cancelled: 'bg-red-100 text-red-800 border border-red-200'
    };
    return map[status] || 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.recipientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone?.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.paymentMethod === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleUpdateStatus = (orderId, newStatus) => {
    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, newStatus);
      if (result.success && result.order) {
        setOrders(prev => prev.map(order =>
          order.id === orderId ? result.order : order
        ));
      } else {
        alert(result.message || 'Cập nhật trạng thái thất bại');
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="border-b">
        <div className="px-6 py-4">
          <h2 className="text-xl font-bold text-gray-800">Danh sách đơn hàng</h2>
          <p className="text-gray-600 mt-1">Quản lý và cập nhật trạng thái đơn hàng</p>
        </div>
      </div>

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="text-blue-600 font-bold text-2xl">{filteredOrders.length}</div>
            <div className="text-blue-800 font-medium">Tổng đơn hàng</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <div className="text-yellow-600 font-bold text-2xl">
              {filteredOrders.filter(o => o.status === 'pending').length}
            </div>
            <div className="text-yellow-800 font-medium">Chờ xác nhận</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <div className="text-purple-600 font-bold text-2xl">
              {filteredOrders.filter(o => o.status === 'shipping').length}
            </div>
            <div className="text-purple-800 font-medium">Đang giao</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <div className="text-green-600 font-bold text-2xl">
              {filteredOrders.filter(o => o.status === 'delivered').length}
            </div>
            <div className="text-green-800 font-medium">Đã giao</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn, tên, SĐT..."
            className="p-3 border border-gray-300 rounded-lg"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <select
            className="p-3 border border-gray-300 rounded-lg"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="processing">Đang xử lý</option>
            <option value="shipping">Đang giao hàng</option>
            <option value="delivered">Đã giao</option>
            <option value="cancelled">Đã hủy</option>
          </select>
          <select
            className="p-3 border border-gray-300 rounded-lg"
            value={paymentFilter}
            onChange={(e) => {
              setPaymentFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Tất cả phương thức</option>
            <option value="cod">COD</option>
            <option value="bank_transfer">Chuyển khoản</option>
          </select>
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setPaymentFilter('all');
              setCurrentPage(1);
            }}
            className="p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Xóa bộ lọc
          </button>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Mã đơn</th>
                <th className="px-4 py-3 text-left">Khách hàng</th>
                <th className="px-4 py-3 text-left">SĐT</th>
                <th className="px-4 py-3 text-left">Tổng tiền</th>
                <th className="px-4 py-3 text-left">PT thanh toán</th>
                <th className="px-4 py-3 text-left">Trạng thái</th>
                <th className="px-4 py-3 text-left">Ngày đặt</th>
                <th className="px-4 py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-4 font-medium text-blue-600">#{order.id}</td>
                    <td className="px-4 py-4">{order.recipientName || 'Không có'}</td>
                    <td className="px-4 py-4">{order.phone || 'Không có'}</td>
                    <td className="px-4 py-4 text-green-600 font-medium">{formatCurrency(order.totalPrice)}</td>
                    <td className="px-4 py-4">
                      {order.paymentMethod === 'cod' ? (
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-sm">COD</span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Chuyển khoản</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(order.status || 'pending')}`}>
                        {getStatusText(order.status || 'pending')}
                      </span>
                    </td>
                    <td className="px-4 py-4">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                        className={`px-4 py-1.5 rounded text-sm font-medium ${
                          expandedOrderId === order.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-100 text-blue-600'
                        }`}
                      >
                        {expandedOrderId === order.id ? 'Đóng' : 'Chi tiết'}
                      </button>
                    </td>
                  </tr>
                  {expandedOrderId === order.id && (
                    <tr className="bg-gray-50">
                      <td colSpan="8" className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="bg-white p-4 rounded-lg border">
                            <h4 className="font-bold mb-3">Thông tin khách hàng</h4>
                            <div className="space-y-2">
                              <p><span className="text-gray-600">Họ tên:</span> {order.recipientName}</p>
                              <p><span className="text-gray-600">SĐT:</span> {order.phone}</p>
                              <p><span className="text-gray-600">Email:</span> {order.user?.email}</p>
                            </div>
                          </div>
                          <div className="bg-white p-4 rounded-lg border">
                            <h4 className="font-bold mb-3">Thông tin giao hàng</h4>
                            <div className="space-y-2">
                              <p><span className="text-gray-600">Địa chỉ:</span> {order.address}</p>
                              <p><span className="text-gray-600">Ghi chú:</span> {order.note || 'Không có'}</p>
                            </div>
                          </div>
                          <div className="bg-white p-4 rounded-lg border">
                            <h4 className="font-bold mb-3">Cập nhật trạng thái</h4>
                            <select
                              value={order.status || 'pending'}
                              onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                              disabled={isPending}
                              className="w-full p-2 border rounded-lg"
                            >
                              <option value="pending">Chờ xác nhận</option>
                              <option value="processing">Đang xử lý</option>
                              <option value="shipping">Đang giao hàng</option>
                              <option value="delivered">Đã giao</option>
                              <option value="cancelled">Đã hủy</option>
                            </select>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {paginatedOrders.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                    Không tìm thấy đơn hàng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border rounded disabled:opacity-50"
            >
              ←
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 border rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border rounded disabled:opacity-50"
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
