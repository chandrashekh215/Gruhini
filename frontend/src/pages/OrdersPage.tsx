import React, { useEffect, useState } from 'react';
import { fetchApi } from '../lib/api';
import { Clock, PackageCheck, AlertCircle, RefreshCw } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">My Orders</h1>
          <p className="text-slate-600 text-sm mt-1">Track your active home-cooked food orders and history</p>
        </div>
        <button
          onClick={loadOrders}
          className="p-2 text-slate-600 hover:text-amber-600 flex items-center space-x-1 text-sm font-semibold"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <PackageCheck className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-600 font-semibold">No orders found yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap justify-between items-start border-b pb-4 gap-2">
                <div>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
                    Order #{order.id}
                  </span>
                  <span className="text-xs text-slate-400 block mt-1">
                    Placed on: {new Date(order.placedAt).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      order.orderStatus === 'DELIVERED'
                        ? 'bg-emerald-100 text-emerald-700'
                        : order.orderStatus === 'CANCELLED'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    STATUS: {order.orderStatus}
                  </span>

                  {order.orderStatus === 'PENDING' && (
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="text-xs font-bold text-red-600 hover:underline"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-100">
                {order.orderItems?.map((item: any, idx: number) => (
                  <div key={idx} className="py-3 flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-3">
                      {item.productImage && (
                        <img src={item.productImage} alt="" className="w-10 h-10 object-cover rounded bg-slate-100" />
                      )}
                      <div>
                        <p className="font-semibold text-slate-900">{item.productName}</p>
                        <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">₹{item.priceAtOrderTime * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-3 border-t text-sm font-bold text-slate-900">
                <span>Total Paid</span>
                <span className="text-lg">₹{order.orderValue}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
