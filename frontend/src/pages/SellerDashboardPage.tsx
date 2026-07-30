import React, { useEffect, useState } from 'react';
import { fetchApi } from '../lib/api';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 pb-32">
      <div className="border-b border-white/10 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-coral font-bold text-xs uppercase tracking-[0.35em] block mb-2">MANAGEMENT PORTAL</span>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase">HOME CHEF PORTAL</h1>
        </div>

        <div className="flex space-x-2 bg-surface-card p-2 rounded-2xl border border-white/10">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'products' ? 'bg-white text-black shadow-lg' : 'text-neutral-400 hover:text-white'
            }`}
          >
            My Menu ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'orders' ? 'bg-white text-black shadow-lg' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Received Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'add' ? 'bg-coral text-white shadow-lg shadow-coral/20' : 'text-neutral-400 hover:text-white'
            }`}
          >
            + Add New Dish
          </button>
        </div>
      </div>

      {activeTab === 'products' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((p) => (
            <div key={p.id} className="bg-surface-card p-6 rounded-3xl border border-white/10 hover:border-white/20 transition-all space-y-4">
              <img src={p.image} alt={p.name} className="w-full h-44 object-cover rounded-2xl bg-neutral-900 grayscale hover:grayscale-0 transition-all duration-300" />
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-white text-lg tracking-tight">{p.name}</h3>
                  <p className="text-xs text-neutral-400 font-medium">₹{p.price} • Stock: {p.stock} units</p>
                </div>
                <span
                  className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border ${
                    p.status === 'APPROVED'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : p.status === 'REJECTED'
                      ? 'bg-red-500/10 text-red-400 border-red-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
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
        <div className="space-y-6">
          {orders.map((o) => (
            <div key={o.id} className="bg-surface-card p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-all space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                  <span className="font-black text-white text-lg tracking-tight">Order #{o.id}</span>
                  <span className="text-xs text-neutral-400 block font-medium mt-1">
                    Customer: {o.userDetails?.name} ({o.userDetails?.contact})
                  </span>
                </div>
                <span className="text-xs font-bold text-coral bg-coral/10 border border-coral/30 px-3 py-1 rounded-md uppercase tracking-wider">
                  {o.orderStatus}
                </span>
              </div>

              <div className="flex flex-wrap justify-between items-center pt-4 border-t border-white/10 text-sm font-bold text-white gap-4">
                <span className="text-xl font-black">Value: ₹{o.orderValue}</span>
                <div className="flex flex-wrap items-center gap-3">
                  {o.orderStatus === 'PENDING' && (
                    <>
                      <button
                        onClick={() => acceptOrder(o.id)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold uppercase tracking-wider px-4 py-2.5 rounded-xl shadow transition-all"
                      >
                        Accept Order
                      </button>
                      <button
                        onClick={() => rejectOrder(o.id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs font-extrabold uppercase tracking-wider px-4 py-2.5 rounded-xl shadow transition-all"
                      >
                        Reject Order
                      </button>
                    </>
                  )}

                  {o.orderStatus === 'ACCEPTED' && (
                    <div className="flex items-center space-x-3">
                      <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={verifyOrderId === o.id ? otpInput : ''}
                        onChange={(e) => {
                          setVerifyOrderId(o.id);
                          setOtpInput(e.target.value);
                        }}
                        className="px-3 py-2 bg-neutral-900 border border-white/10 text-white text-xs rounded-xl w-36 focus:outline-none focus:border-coral"
                      />
                      <button
                        onClick={() => verifyOtp(o.id)}
                        className="bg-coral hover:bg-coral-hover text-white text-xs font-extrabold uppercase tracking-wider px-4 py-2.5 rounded-xl shadow transition-all"
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
        <form onSubmit={handleAddProduct} className="max-w-2xl mx-auto bg-surface-card p-8 sm:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-6 text-xs font-medium">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight border-b border-white/10 pb-4">
            Add New Homemade Dish
          </h2>

          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Dish Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:border-coral transition-colors"
              placeholder="Suji Cake / Royal Thali"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Price (₹)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:border-coral transition-colors"
                placeholder="150"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-coral transition-colors"
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
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:border-coral transition-colors"
              placeholder="Fresh semolina suji cake made with desi ghee and dry fruits..."
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Dish Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-2xl text-white text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-coral file:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-coral hover:bg-coral-hover text-white font-extrabold text-xs uppercase tracking-[0.2em] py-4 rounded-2xl shadow-xl shadow-coral/20 transition-all mt-4"
          >
            Submit Dish for Approval
          </button>
        </form>
      )}
    </div>
  );
};
