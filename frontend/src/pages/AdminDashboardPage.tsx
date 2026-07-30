import React, { useEffect, useState } from 'react';
import { fetchApi } from '../lib/api';
import { ShieldCheck } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [pendingProducts, setPendingProducts] = useState<any[]>([]);
  const [pendingSellers, setPendingSellers] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [allSellers, setAllSellers] = useState<any[]>([]);

  const loadAdminData = async () => {
    try {
      const pPending = await fetchApi('/admin/view-pending');
      setPendingProducts(pPending || []);

      const sPending = await fetchApi('/admin/pending-seller');
      setPendingSellers(sPending || []);

      const pAll = await fetchApi('/admin/products-viewAll');
      setAllProducts(pAll || []);

      const sAll = await fetchApi('/admin/Sellers-viewAll');
      setAllSellers(sAll || []);
    } catch (e) {
      console.warn('Admin portal fetch error:', e);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const approveProduct = async (id: number) => {
    try {
      await fetchApi('/admin/accept-item', {
        method: 'POST',
        body: JSON.stringify({ selectedProducts: [id] }),
      });
      loadAdminData();
    } catch (e: any) {
      alert(e.message || 'Failed to approve item');
    }
  };

  const rejectProduct = async (id: number) => {
    try {
      await fetchApi('/admin/reject-item', {
        method: 'POST',
        body: JSON.stringify({ selectedProducts: [id], message: 'Quality standard check failed' }),
      });
      loadAdminData();
    } catch (e: any) {
      alert(e.message || 'Failed to reject item');
    }
  };

  const approveSellerProfile = async (id: number) => {
    try {
      await fetchApi('/admin/approve-seller', {
        method: 'POST',
        body: JSON.stringify({ selectedProducts: [id] }),
      });
      loadAdminData();
    } catch (e: any) {
      alert(e.message || 'Failed to approve seller');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 pb-32">
      <div className="flex items-center space-x-4 border-b border-white/10 pb-6">
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div>
          <span className="text-coral font-bold text-xs uppercase tracking-[0.35em] block mb-1">PLATFORM GOVERNANCE</span>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase">ADMIN OVERSIGHT PORTAL</h1>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-card p-6 rounded-3xl border border-white/10 space-y-2">
          <span className="text-[10px] font-extrabold text-coral uppercase tracking-widest">Pending Dishes</span>
          <p className="text-4xl font-black text-white">{pendingProducts.length}</p>
        </div>
        <div className="bg-surface-card p-6 rounded-3xl border border-white/10 space-y-2">
          <span className="text-[10px] font-extrabold text-coral uppercase tracking-widest">Pending Chefs</span>
          <p className="text-4xl font-black text-white">{pendingSellers.length}</p>
        </div>
        <div className="bg-surface-card p-6 rounded-3xl border border-white/10 space-y-2">
          <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">Total Catalog Items</span>
          <p className="text-4xl font-black text-white">{allProducts.length}</p>
        </div>
        <div className="bg-surface-card p-6 rounded-3xl border border-white/10 space-y-2">
          <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">Registered Kitchens</span>
          <p className="text-4xl font-black text-white">{allSellers.length}</p>
        </div>
      </div>

      {/* Pending Products Approval Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight border-b border-white/10 pb-4">
          Pending Dish Approval Requests
        </h2>
        {pendingProducts.length === 0 ? (
          <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider italic">No pending dishes awaiting review.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pendingProducts.map((p) => (
              <div key={p.id} className="bg-surface-card p-6 rounded-3xl border border-white/10 hover:border-white/20 transition-all space-y-4">
                <img src={p.image} alt={p.name} className="w-full h-40 object-cover rounded-2xl bg-neutral-900 grayscale hover:grayscale-0 transition-all duration-300" />
                <h3 className="font-bold text-white text-lg tracking-tight">{p.name}</h3>
                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">{p.description}</p>
                <div className="flex justify-between items-center text-xs font-bold pt-4 border-t border-white/10">
                  <span className="text-white text-sm font-black">₹{p.price}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => approveProduct(p.id)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider shadow transition-all"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => rejectProduct(p.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider shadow transition-all"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Sellers Approval Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight border-b border-white/10 pb-4">
          Pending Home Chef Kitchen Approvals
        </h2>
        {pendingSellers.length === 0 ? (
          <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider italic">No pending seller applications.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pendingSellers.map((s) => (
              <div key={s.id} className="bg-surface-card p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-white text-lg tracking-tight">{s.businessName}</h3>
                  <p className="text-xs text-neutral-400 font-medium">Chef: {s.name} ({s.contact})</p>
                  <p className="text-xs text-neutral-500 mt-1">{s.Description}</p>
                </div>
                <button
                  onClick={() => approveSellerProfile(s.id)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold uppercase tracking-wider px-5 py-3 rounded-2xl shadow transition-all"
                >
                  Approve Kitchen
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
