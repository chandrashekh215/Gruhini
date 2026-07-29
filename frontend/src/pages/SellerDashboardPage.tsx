import React, { useEffect, useState } from 'react';
import { fetchApi } from '../lib/api';
import { PlusCircle, Package, Check, X, ShieldAlert, KeyRound, Image as ImageIcon } from 'lucide-react';

export const SellerDashboardPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'add'>('products');

  // Add Product Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('THALI');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('10');
  const [deliveryTime, setDeliveryTime] = useState('30-45 mins');
  const [imageFile, setImageFile] = useState<File | null>(null);

  // OTP verification state
  const [verifyOrderId, setVerifyOrderId] = useState<number | null>(null);
  const [otpInput, setOtpInput] = useState('');

  const loadSellerData = async () => {
    try {
      const pRes = await fetchApi('/seller/get-All-products');
      setProducts(pRes || []);

      const oRes = await fetchApi('/seller/view-order-seller');
      if (oRes && oRes['User details']) {
        setOrders(oRes['User details']);
      }
    } catch (e) {
      console.warn('Failed to load seller portal data:', e);
    }
  };

  useEffect(() => {
    loadSellerData();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append(
        'data',
        JSON.stringify({
          name,
          price: Number(price),
          category,
          description,
          stock: Number(stock),
          deliveryTime,
        })
      );
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await fetchApi('/seller/add-product', {
        method: 'POST',
        body: formData,
      });

      alert('Dish submitted for approval!');
      setName('');
      setPrice('');
      setDescription('');
      setImageFile(null);
      setActiveTab('products');
      loadSellerData();
    } catch (err: any) {
      alert(err.message || 'Failed to add product');
    }
  };

  const acceptOrder = async (orderId: number) => {
    try {
      await fetchApi('/seller/accept-order', {
        method: 'POST',
        body: JSON.stringify([orderId]),
      });
      loadSellerData();
    } catch (e: any) {
      alert(e.message || 'Failed to accept order');
    }
  };

  const rejectOrder = async (orderId: number) => {
    try {
      await fetchApi('/seller/reject-order', {
        method: 'POST',
        body: JSON.stringify([orderId]),
      });
      loadSellerData();
    } catch (e: any) {
      alert(e.message || 'Failed to reject order');
    }
  };

  const verifyOtp = async (orderId: number) => {
    try {
      const res = await fetchApi(`/seller/verify-otp?orderId=${orderId}&otp=${otpInput}`, {
        method: 'POST',
      });
      alert(res);
      setVerifyOrderId(null);
      setOtpInput('');
      loadSellerData();
    } catch (e: any) {
      alert(e.message || 'Verification failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Home Chef Portal</h1>
          <p className="text-slate-600 text-sm mt-1">Manage kitchen menu, orders, and delivery OTP verification</p>
        </div>

        <div className="flex space-x-2 bg-slate-100 p-1.5 rounded-xl border">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'products' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            My Menu ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'orders' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Received Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'add' ? 'gradient-saffron text-white shadow-sm' : 'text-slate-600'
            }`}
          >
            + Add New Dish
          </button>
        </div>
      </div>

      {activeTab === 'products' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <img src={p.image} alt={p.name} className="w-full h-40 object-cover rounded-lg bg-slate-100" />
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900">{p.name}</h3>
                  <p className="text-xs text-slate-500 font-semibold">₹{p.price} • Stock: {p.stock}</p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    p.status === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : p.status === 'REJECTED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-900">Order #{o.id}</span>
                  <span className="text-xs text-slate-500 block">Customer: {o.userDetails?.name} ({o.userDetails?.contact})</span>
                </div>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded">
                  {o.orderStatus}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t text-sm font-bold">
                <span>Value: ₹{o.orderValue}</span>
                <div className="flex space-x-2">
                  {o.orderStatus === 'PENDING' && (
                    <>
                      <button
                        onClick={() => acceptOrder(o.id)}
                        className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-700"
                      >
                        Accept Order
                      </button>
                      <button
                        onClick={() => rejectOrder(o.id)}
                        className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-700"
                      >
                        Reject Order
                      </button>
                    </>
                  )}

                  {o.orderStatus === 'ACCEPTED' && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={verifyOrderId === o.id ? otpInput : ''}
                        onChange={(e) => {
                          setVerifyOrderId(o.id);
                          setOtpInput(e.target.value);
                        }}
                        className="px-2 py-1 bg-slate-50 border text-xs rounded w-32"
                      />
                      <button
                        onClick={() => verifyOtp(o.id)}
                        className="bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-amber-700"
                      >
                        Verify Delivery
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'add' && (
        <form onSubmit={handleAddProduct} className="max-w-xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-lg space-y-4 text-sm">
          <h2 className="text-xl font-bold text-slate-900 border-b pb-2">Add New Homemade Dish</h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Dish Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border rounded-lg"
              placeholder="Suji Cake / Royal Thali"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Price (₹)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border rounded-lg"
                placeholder="150"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border rounded-lg"
              >
                <option value="THALI">Traditional Thali</option>
                <option value="SWEETS">Sweets & Mithai</option>
                <option value="SNACKS">Evening Snacks</option>
                <option value="VRAT">Vrat Special</option>
                <option value="HANDCRAFTED_ITEMS">Handcrafted Items</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border rounded-lg"
              placeholder="Fresh semolina suji cake made with desi ghee and dry fruits..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Dish Image (Cloudinary Multipart Upload)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs"
            />
          </div>

          <button
            type="submit"
            className="w-full gradient-saffron text-white font-bold py-2.5 rounded-xl shadow hover:opacity-95"
          >
            Submit Dish for Approval
          </button>
        </form>
      )}
    </div>
  );
};
