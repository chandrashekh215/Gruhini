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
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-8">
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="text-coral font-bold text-xs uppercase tracking-[0.35em]">ORDER CONFIRMED</span>
          <h1 className="text-4xl font-black text-white uppercase tracking-tight">Order Placed Successfully!</h1>
          <p className="text-neutral-400 text-sm">
            Your order reference is <b className="text-white">#{orderResult.id}</b>. We sent a delivery verification OTP to your email.
          </p>
        </div>

        <div className="bg-surface-card border border-white/10 p-6 rounded-3xl text-left text-sm space-y-3">
          <p className="font-extrabold text-coral uppercase tracking-wider text-xs">Delivery Information</p>
          <div className="flex justify-between border-b border-white/5 pb-2 text-neutral-300">
            <span>Estimated Delivery:</span>
            <span className="font-bold text-white">{orderResult.deliveryTime}</span>
          </div>
          <div className="flex justify-between text-neutral-300">
            <span>Total Amount Paid:</span>
            <span className="font-bold text-white text-lg">₹{orderResult.orderValue}</span>
          </div>
        </div>

        <div className="flex justify-center space-x-4 pt-4">
          <button
            onClick={() => navigate('/orders')}
            className="bg-coral hover:bg-coral-hover text-white font-extrabold text-xs uppercase tracking-[0.2em] px-8 py-4 rounded-2xl shadow-xl shadow-coral/20 transition-all"
          >
            Track Active Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 pb-32">
      <div className="border-b border-white/10 pb-6">
        <span className="text-coral font-bold text-xs uppercase tracking-[0.35em] block mb-2">CHECKOUT</span>
        <h1 className="text-4xl font-black tracking-tighter text-white uppercase">YOUR CART</h1>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center space-x-3 text-xs">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-surface-card rounded-[2.5rem] border border-white/10 space-y-6">
          <ShoppingBag className="w-14 h-14 text-neutral-600 mx-auto" />
          <div className="space-y-1">
            <p className="text-white font-bold text-lg uppercase tracking-wider">Your cart is currently empty</p>
            <p className="text-xs text-neutral-500">Explore authentic home-cooked delicacies from local chefs.</p>
          </div>
          <button
            onClick={() => navigate('/explore')}
            className="bg-coral hover:bg-coral-hover text-white font-extrabold text-xs uppercase tracking-[0.2em] px-8 py-4 rounded-2xl shadow-xl shadow-coral/20 transition-all"
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
                className="bg-surface-card p-6 rounded-3xl border border-white/10 hover:border-white/20 transition-all flex items-center justify-between"
              >
                <div className="flex items-center space-x-5">
                  <img
                    src={item.image}
                    alt={item.productname}
                    className="w-20 h-20 object-cover rounded-2xl bg-neutral-900 grayscale hover:grayscale-0 transition-all duration-300"
                  />
                  <div className="space-y-1">
                    <h3 className="font-bold text-white text-base tracking-tight">{item.productname}</h3>
                    <p className="text-xs text-neutral-400">By {item.chefname}</p>
                    <span className="text-xs font-semibold text-coral block">
                      ₹{item.price} × {item.quantity}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <span className="font-black text-white text-xl">
                    ₹{item.price * item.quantity}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.productid)}
                    className="p-2.5 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Summary */}
          <div className="bg-surface-card p-8 rounded-[2.5rem] border border-white/10 space-y-8 h-fit">
            <h2 className="text-xl font-black text-white uppercase tracking-tight border-b border-white/10 pb-4">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs font-medium text-neutral-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-white">₹{cartTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="text-emerald-400 font-bold uppercase tracking-wider">FREE</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-white/10 font-black text-white text-lg">
                <span>Total Amount</span>
                <span className="text-coral">₹{cartTotal}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full bg-coral hover:bg-coral-hover text-white font-extrabold text-xs uppercase tracking-[0.2em] py-4 rounded-2xl shadow-xl shadow-coral/20 transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
            >
              <span>{loading ? 'Processing Order...' : 'Confirm & Place Order'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
