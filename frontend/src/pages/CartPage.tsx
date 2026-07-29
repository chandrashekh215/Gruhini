import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { fetchApi } from '../lib/api';

export const CartPage: React.FC = () => {
  const { cartItems, cartTotal, removeFromCart, refreshCart } = useCart();
  const [addressId, setAddressId] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchApi('/place-order', {
        method: 'POST',
        body: JSON.stringify({ addressId }),
      });
      setOrderResult(res);
      await refreshCart();
    } catch (e: any) {
      setError(e.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (orderResult) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Order Placed Successfully!</h1>
        <p className="text-slate-600 text-sm">
          Your order ID is <b>#{orderResult.id}</b>. We sent a verification OTP to your email.
        </p>

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-left text-sm space-y-2">
          <p className="font-bold text-amber-900">Delivery Information:</p>
          <p className="text-amber-800">Estimated Delivery: {orderResult.deliveryTime}</p>
          <p className="text-amber-800">Total Amount: ₹{orderResult.orderValue}</p>
        </div>

        <div className="flex justify-center space-x-4 pt-4">
          <button
            onClick={() => navigate('/orders')}
            className="gradient-saffron text-white font-bold px-6 py-2.5 rounded-xl shadow hover:opacity-95"
          >
            Track My Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <h1 className="text-3xl font-extrabold text-slate-900">Your Cart</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center space-x-2 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-4">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-slate-600 font-semibold text-lg">Your cart is currently empty</p>
          <button
            onClick={() => navigate('/explore')}
            className="gradient-saffron text-white font-bold px-6 py-2.5 rounded-xl shadow"
          >
            Explore Royal Menu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.productid}
                className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.productname}
                    className="w-16 h-16 object-cover rounded-lg bg-slate-100"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900">{item.productname}</h3>
                    <p className="text-xs text-slate-500">By {item.chefname}</p>
                    <span className="text-xs font-semibold text-amber-600">
                      ₹{item.price} × {item.quantity}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="font-bold text-slate-900 text-lg">
                    ₹{item.price * item.quantity}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.productid)}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Summary */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 h-fit">
            <h2 className="text-lg font-bold text-slate-900 border-b pb-3">Order Summary</h2>

            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between pt-2 border-t font-bold text-slate-900 text-base">
                <span>Total Amount</span>
                <span>₹{cartTotal}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full gradient-saffron text-white font-bold py-3 rounded-xl shadow-lg hover:opacity-95 transition-opacity flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Processing...' : 'Confirm & Place Order'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
