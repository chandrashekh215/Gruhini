import React, { useEffect, useState } from 'react';
import { fetchApi } from '../lib/api';
import { ShieldCheck, CheckCircle2, XCircle, Users, Package } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="flex items-center space-x-3 border-b pb-4">
        <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Admin Quality & Oversight Portal</h1>
          <p className="text-slate-600 text-sm">Approve home chef kitchens, dishes, and oversee platform catalog</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-amber-600 uppercase">Pending Dishes</span>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">{pendingProducts.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-amber-600 uppercase">Pending Chefs</span>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">{pendingSellers.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Total Catalog Items</span>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">{allProducts.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Registered Kitchens</span>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">{allSellers.length}</p>
        </div>
      </div>

      {/* Pending Products Approval Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Pending Dish Approval Requests</h2>
        {pendingProducts.length === 0 ? (
          <p className="text-sm text-slate-500 italic">No pending dishes awaiting review.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingProducts.map((p) => (
              <div key={p.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <img src={p.image} alt={p.name} className="w-full h-36 object-cover rounded-lg bg-slate-100" />
                <h3 className="font-bold text-slate-900">{p.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{p.description}</p>
                <div className="flex justify-between items-center text-xs font-bold pt-2 border-t">
                  <span>Price: ₹{p.price}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => approveProduct(p.id)}
                      className="bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => rejectProduct(p.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
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
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Pending Home Chef Kitchen Approvals</h2>
        {pendingSellers.length === 0 ? (
          <p className="text-sm text-slate-500 italic">No pending seller applications.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingSellers.map((s) => (
              <div key={s.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-900">{s.businessName}</h3>
                  <p className="text-xs text-slate-500">Chef: {s.name} ({s.contact})</p>
                  <p className="text-xs text-slate-400 mt-1">{s.Description}</p>
                </div>
                <button
                  onClick={() => approveSellerProfile(s.id)}
                  className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-700"
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
