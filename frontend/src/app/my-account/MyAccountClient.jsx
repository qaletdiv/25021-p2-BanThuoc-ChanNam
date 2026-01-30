// frontend/src/app/my-account/MyAccountClient.jsx
'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { authFetch } from '@/lib/auth';

export default function MyAccountClient({ user, orders, addresses: initialAddresses }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [addresses, setAddresses] = useState(initialAddresses);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(null);
  const [newAddress, setNewAddress] = useState({
    recipientName: '',
    recipientPhone: '',
    fullAddress: '',
    isDefault: false
  });
  const [editAddress, setEditAddress] = useState({
    recipientName: '',
    recipientPhone: '',
    fullAddress: '',
    isDefault: false
  });
  const [formErrors, setFormErrors] = useState({});

  // State cho chỉnh sửa profile
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone
  });
  const [profileErrors, setProfileErrors] = useState({});

  const getStatusText = useCallback((status) => {
    const map = {
      pending: 'Đang chờ',
      processing: 'Đang xử lý',
      shipping: 'Đang giao',
      delivered: 'Đã giao',
      cancelled: 'Đã hủy'
    };
    return map[status] || status;
  }, []);

  const getStatusColor = useCallback((status) => {
    const map = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipping: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return map[status] || 'bg-gray-100 text-gray-800';
  }, []);

  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  }, []);

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  }, []);

  const validateAddress = useCallback((address) => {
    const errors = {};
    if (!address.recipientName.trim()) errors.recipientName = 'Vui lòng nhập họ tên người nhận';
    if (!address.recipientPhone.trim()) errors.recipientPhone = 'Vui lòng nhập số điện thoại';
    else if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(address.recipientPhone)) errors.recipientPhone = 'Số điện thoại không hợp lệ';
    if (!address.fullAddress.trim()) errors.fullAddress = 'Vui lòng nhập địa chỉ đầy đủ';
    return errors;
  }, []);

  const validateProfile = useCallback(() => {
    const errors = {};
    if (!profileData.name.trim()) errors.name = 'Vui lòng nhập họ tên';
    if (!profileData.email.trim()) errors.email = 'Vui lòng nhập email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) errors.email = 'Email không hợp lệ';
    if (!profileData.phone.trim()) errors.phone = 'Vui lòng nhập số điện thoại';
    else if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(profileData.phone)) errors.phone = 'Số điện thoại không hợp lệ';
    return errors;
  }, [profileData]);

  const handleNewAddressChange = useCallback((field, value) => {
    setNewAddress(prev => ({
      ...prev,
      [field]: value
    }));
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [formErrors]);

  const handleEditAddressChange = useCallback((field, value) => {
    setEditAddress(prev => ({
      ...prev,
      [field]: value
    }));
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [formErrors]);

  const handleProfileChange = useCallback((field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
    if (profileErrors[field]) {
      setProfileErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [profileErrors]);

  const handleAddAddress = useCallback(async () => {
    const errors = validateAddress(newAddress);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const res = await authFetch('http://localhost:4000/api/addresses', {
        method: 'POST',
        body: JSON.stringify(newAddress)
      });

      if (res.ok) {
        const addedAddress = await res.json();
        setAddresses(prev => [...prev, addedAddress]);
        setNewAddress({
          recipientName: '',
          recipientPhone: '',
          fullAddress: '',
          isDefault: false
        });
        setShowAddForm(false);
        setFormErrors({});
      } else {
        const error = await res.json();
        alert(error.message || 'Không thể thêm địa chỉ');
      }
    } catch (err) {
      alert('Lỗi kết nối server');
    }
  }, [newAddress, validateAddress]);

  const handleEditAddress = useCallback(async (addressId) => {
    const errors = validateAddress(editAddress);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const res = await authFetch(`http://localhost:4000/api/addresses/${addressId}`, {
        method: 'PUT',
        body: JSON.stringify(editAddress)
      });

      if (res.ok) {
        const updatedAddress = await res.json();
        setAddresses(prev =>
          prev.map(addr => addr.id === addressId ? updatedAddress : addr)
        );
        setShowEditForm(null);
        setFormErrors({});
      } else {
        const error = await res.json();
        alert(error.message || 'Không thể cập nhật địa chỉ');
      }
    } catch (err) {
      alert('Lỗi kết nối server');
    }
  }, [editAddress, validateAddress]);

  const handleSaveProfile = useCallback(async () => {
    const errors = validateProfile();
    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      return;
    }

    try {
      // Gọi API cập nhật profile (giả lập nếu backend chưa có)
      const res = await authFetch('http://localhost:4000/api/users/' + user.id, {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });

      if (res.ok) {
        alert('Cập nhật thông tin thành công!');
        setEditingProfile(false);
      } else {
        const error = await res.json();
        alert(error.message || 'Không thể cập nhật thông tin');
      }
    } catch (err) {
      alert('Lỗi kết nối server');
    }
  }, [profileData, validateProfile, user.id]);

  const handleSetDefault = useCallback(async (addressId) => {
    try {
      const res = await authFetch(`http://localhost:4000/api/addresses/${addressId}`, {
        method: 'PUT',
        body: JSON.stringify({ isDefault: true })
      });

      if (res.ok) {
        const updatedAddress = await res.json();
        setAddresses(prev =>
          prev.map(addr => ({
            ...addr,
            isDefault: addr.id === addressId
          }))
        );
      }
    } catch (err) {
      alert('Lỗi khi cập nhật địa chỉ mặc định');
    }
  }, []);

  const handleDelete = useCallback(async (addressId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;

    try {
      const res = await authFetch(`http://localhost:4000/api/addresses/${addressId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setAddresses(prev => prev.filter(addr => addr.id !== addressId));
      } else {
        alert('Không thể xóa địa chỉ');
      }
    } catch (err) {
      alert('Lỗi kết nối server');
    }
  }, []);

  const openEditForm = useCallback((address) => {
    setEditAddress({
      recipientName: address.recipientName,
      recipientPhone: address.recipientPhone,
      fullAddress: address.fullAddress,
      isDefault: address.isDefault
    });
    setShowEditForm(address.id);
  }, []);

  const ProfileTab = useCallback(() => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Thông tin cá nhân</h3>
          <button
            onClick={() => {
              if (editingProfile) {
                handleSaveProfile();
              } else {
                setEditingProfile(true);
              }
            }}
            className={`px-4 py-2 rounded-lg ${
              editingProfile 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {editingProfile ? 'Lưu' : 'Sửa'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Họ và tên</label>
            {editingProfile ? (
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
                className={`w-full p-3 border rounded-lg ${profileErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Nhập họ tên"
              />
            ) : (
              <p className="font-medium">{profileData.name}</p>
            )}
            {profileErrors.name && <p className="text-red-500 text-sm mt-1">{profileErrors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            {editingProfile ? (
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                className={`w-full p-3 border rounded-lg ${profileErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Nhập email"
              />
            ) : (
              <p className="font-medium">{profileData.email}</p>
            )}
            {profileErrors.email && <p className="text-red-500 text-sm mt-1">{profileErrors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Số điện thoại</label>
            {editingProfile ? (
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => handleProfileChange('phone', e.target.value)}
                className={`w-full p-3 border rounded-lg ${profileErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Nhập số điện thoại"
              />
            ) : (
              <p className="font-medium">{profileData.phone}</p>
            )}
            {profileErrors.phone && <p className="text-red-500 text-sm mt-1">{profileErrors.phone}</p>}
          </div>
        </div>
      </div>
    </div>
  ), [editingProfile, profileData, profileErrors, handleProfileChange, handleSaveProfile]);

  const OrdersTab = useCallback(() => (
    <div className="space-y-6">
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn hàng</h3>
          <p className="text-gray-500 mb-4">Bạn chưa có đơn hàng nào trong lịch sử mua hàng</p>
          <Link href="/products" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Mua sắm ngay
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn hàng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">{formatCurrency(order.totalPrice)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  ), [orders, formatDate, getStatusColor, getStatusText, formatCurrency]);

  const AddressItem = useCallback(({ address, index }) => {
    const isEditing = showEditForm === address.id;
    
    return (
      <div key={address.id} className={`border rounded-lg p-4 ${address.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
        {isEditing ? (
          <div className="space-y-4">
            <h4 className="text-lg font-bold">Sửa địa chỉ</h4>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Họ tên người nhận *</label>
              <input
                type="text"
                value={editAddress.recipientName}
                onChange={(e) => handleEditAddressChange('recipientName', e.target.value)}
                className={`w-full p-2 border rounded ${formErrors.recipientName ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Nhập họ tên người nhận"
              />
              {formErrors.recipientName && <p className="text-red-500 text-sm mt-1">{formErrors.recipientName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Số điện thoại *</label>
              <input
                type="tel"
                value={editAddress.recipientPhone}
                onChange={(e) => handleEditAddressChange('recipientPhone', e.target.value)}
                className={`w-full p-2 border rounded ${formErrors.recipientPhone ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Nhập số điện thoại"
              />
              {formErrors.recipientPhone && <p className="text-red-500 text-sm mt-1">{formErrors.recipientPhone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Địa chỉ đầy đủ *</label>
              <textarea
                value={editAddress.fullAddress}
                onChange={(e) => handleEditAddressChange('fullAddress', e.target.value)}
                rows="2"
                className={`w-full p-2 border rounded ${formErrors.fullAddress ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Nhập địa chỉ đầy đủ"
              ></textarea>
              {formErrors.fullAddress && <p className="text-red-500 text-sm mt-1">{formErrors.fullAddress}</p>}
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id={`editIsDefault-${address.id}`}
                checked={editAddress.isDefault}
                onChange={(e) => handleEditAddressChange('isDefault', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor={`editIsDefault-${address.id}`} className="text-sm font-medium text-gray-600">
                Đặt làm địa chỉ mặc định
              </label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditAddress(address.id)}
                className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 text-sm"
              >
                Lưu
              </button>
              <button
                onClick={() => setShowEditForm(null)}
                className="bg-gray-300 text-gray-700 px-4 py-1 rounded hover:bg-gray-400 text-sm"
              >
                Hủy
              </button>
            </div>
          </div>
        ) : (
          <>
            {address.isDefault && (
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs mb-2">
                Mặc định
              </span>
            )}
            <p className="font-medium">{address.recipientName}</p>
            <p className="text-gray-600">{address.recipientPhone}</p>
            <p className="text-gray-600 mt-1">{address.fullAddress}</p>
            <div className="flex gap-2 mt-3">
              {!address.isDefault && (
                <button 
                  onClick={() => handleSetDefault(address.id)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Đặt mặc định
                </button>
              )}
              <button 
                onClick={() => openEditForm(address)}
                className="text-gray-600 hover:text-gray-800 text-sm"
              >
                Sửa
              </button>
              <button 
                onClick={() => handleDelete(address.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Xóa
              </button>
            </div>
          </>
        )}
      </div>
    );
  }, [showEditForm, editAddress, formErrors, handleEditAddressChange, handleEditAddress, handleSetDefault, openEditForm, handleDelete]);

  const AddressesTab = useCallback(() => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Danh sách địa chỉ</h3>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {showAddForm ? 'Hủy' : 'Thêm địa chỉ mới'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h4 className="text-lg font-bold mb-4">Thêm địa chỉ mới</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Họ tên người nhận *</label>
              <input
                type="text"
                value={newAddress.recipientName}
                onChange={(e) => handleNewAddressChange('recipientName', e.target.value)}
                className={`w-full p-3 border rounded-lg ${formErrors.recipientName ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Nhập họ tên người nhận"
              />
              {formErrors.recipientName && <p className="text-red-500 text-sm mt-1">{formErrors.recipientName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Số điện thoại *</label>
              <input
                type="tel"
                value={newAddress.recipientPhone}
                onChange={(e) => handleNewAddressChange('recipientPhone', e.target.value)}
                className={`w-full p-3 border rounded-lg ${formErrors.recipientPhone ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Nhập số điện thoại"
              />
              {formErrors.recipientPhone && <p className="text-red-500 text-sm mt-1">{formErrors.recipientPhone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Địa chỉ đầy đủ *</label>
              <textarea
                value={newAddress.fullAddress}
                onChange={(e) => handleNewAddressChange('fullAddress', e.target.value)}
                rows="3"
                className={`w-full p-3 border rounded-lg ${formErrors.fullAddress ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Nhập địa chỉ đầy đủ"
              ></textarea>
              {formErrors.fullAddress && <p className="text-red-500 text-sm mt-1">{formErrors.fullAddress}</p>}
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="addIsDefault"
                checked={newAddress.isDefault}
                onChange={(e) => handleNewAddressChange('isDefault', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="addIsDefault" className="text-sm font-medium text-gray-600">
                Đặt làm địa chỉ mặc định
              </label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddAddress}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Lưu địa chỉ
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có địa chỉ</h3>
          <p className="text-gray-500 mb-4">Bạn chưa có địa chỉ nào trong danh sách</p>
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Thêm địa chỉ mới
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address, index) => (
            <AddressItem key={address.id} address={address} index={index} />
          ))}
        </div>
      )}
    </div>
  ), [addresses, showAddForm, newAddress, formErrors, handleNewAddressChange, handleAddAddress, AddressItem]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Tài khoản của tôi</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">{user.name.charAt(0)}</span>
              </div>
              <div>
                <p className="font-bold">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'profile' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                }`}
              >
                Thông tin cá nhân
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'addresses' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                }`}
              >
                Sổ Địa chỉ ({addresses.length})
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'orders' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                }`}
              >
                Lịch sử đặt hàng ({orders.length})
              </button>

            </nav>
          </div>
        </div>

        <div className="lg:w-3/4">
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'addresses' && <AddressesTab />}
        </div>
      </div>
    </div>
  );
}