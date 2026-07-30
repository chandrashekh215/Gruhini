import React, { useEffect, useState } from 'react';
import { fetchApi } from '../lib/api';
import { Clock, PackageCheck, RefreshCw } from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetchApi('/view-order-user');
      if (res && res['Seller-Details']) {
        setOrders(res['Seller-Details']);
      } else if (Array.isArray(res)) {
        setOrders(res);
      }
    } catch (e) {
      console.warn('Failed to load user orders:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const cancelOrder = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      await fetchApi(`/cancel-order/${id}`, { method: 'POST' });
      await loadOrders();
    } catch (e: any) {
      alert(e.message || 'Failed to cancel order');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 pb-32">
      <div className="border-b border-white/10 pb-6 flex justify-between items-end">
        <div>
          <span className="text-coral font-bold text-xs uppercase tracking-[0.35em] block mb-2">ORDER HISTORY</span>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase">MY ORDERS</h1>
        </div>
        <button
          onClick={loadOrders}
          className="p-2.5 bg-surface-card hover:bg-white/10 text-neutral-300 hover:text-white rounded-xl border border-white/10 transition-all flex items-center space-x-2 text-xs font-bold uppercase tracking-wider"
        >
          <RefreshCw className="w-4 h-4 text-coral" />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-neutral-500 font-bold uppercase tracking-widest text-xs">
          Loading order history...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-surface-card rounded-[2.5rem] border border-white/10 space-y-3">
          <PackageCheck className="w-12 h-12 text-neutral-600 mx-auto" />
          <p className="text-white font-bold uppercase tracking-wider text-sm">No orders found yet</p>
          <p className="text-xs text-neutral-500">Your placed home-cooked meal orders will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-surface-card p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-all space-y-6">
              <div className="flex flex-wrap justify-between items-start border-b border-white/10 pb-4 gap-4">
                <div>
                  <span className="text-[10px] font-extrabold text-coral bg-coral/10 border border-coral/30 px-3 py-1 rounded-md uppercase tracking-wider">
                    Order #{order.id}
                  </span>
                  <span className="text-xs text-neutral-500 block mt-2 font-medium">
                    Placed on: {new Date(order.placedAt).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <span
                    className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border ${
                      order.orderStatus === 'DELIVERED'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : order.orderStatus === 'CANCELLED'
                        ? 'bg-red-500/10 text-red-400 border-red-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    STATUS: {order.orderStatus}
                  </span>

                  {order.orderStatus === 'PENDING' && (
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="text-xs font-bold text-red-400 hover:text-red-300 uppercase tracking-wider underline"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-white/5">
                {order.orderItems?.map((item: any, idx: number) => (
                  <div key={idx} className="py-4 flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-4">
                      {item.productImage && (
                        <img src={item.productImage} alt="" className="w-12 h-12 object-cover rounded-xl bg-neutral-900 grayscale hover:grayscale-0 transition-all duration-300" />
                      )}
                      <div>
                        <p className="font-bold text-white tracking-tight">{item.productName}</p>
                        <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-extrabold text-white">₹{item.priceAtOrderTime * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-white/10 text-sm font-bold text-white">
                <span className="text-xs uppercase tracking-widest text-neutral-500">Total Paid</span>
                <span className="text-2xl font-black text-coral">₹{order.orderValue}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
