import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, ShoppingBag, Clock, User, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const FloatingBottomNav: React.FC = () => {
  const location = useLocation();
  const { cartCount } = useCart();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-3 py-2 rounded-full glass-pill flex items-center space-x-2 sm:space-x-4 shadow-2xl transition-all duration-300 border border-white/15">
      <Link
        to="/"
        className={`p-2.5 rounded-full transition-all ${
          isActive('/') ? 'bg-white/15 text-coral' : 'text-neutral-400 hover:text-white'
        }`}
        title="Home"
      >
        <Home className="w-4 h-4" />
      </Link>

      <Link
        to="/explore"
        className={`p-2.5 rounded-full transition-all ${
          isActive('/explore') ? 'bg-white/15 text-coral' : 'text-neutral-400 hover:text-white'
        }`}
        title="Explore Menu"
      >
        <Compass className="w-4 h-4" />
      </Link>

      <Link
        to="/orders"
        className={`p-2.5 rounded-full transition-all ${
          isActive('/orders') ? 'bg-white/15 text-coral' : 'text-neutral-400 hover:text-white'
        }`}
        title="My Orders"
      >
        <Clock className="w-4 h-4" />
      </Link>

      <Link
        to="/profile"
        className={`p-2.5 rounded-full transition-all ${
          isActive('/profile') ? 'bg-white/15 text-coral' : 'text-neutral-400 hover:text-white'
        }`}
        title="Profile"
      >
        <User className="w-4 h-4" />
      </Link>

      <div className="w-px h-6 bg-white/10 mx-1" />

      <Link
        to="/cart"
        className="flex items-center space-x-2 bg-coral hover:bg-coral-hover text-white text-xs font-extrabold uppercase tracking-wider px-4 py-2 rounded-full shadow-lg shadow-coral/30 transition-all hover:scale-105"
      >
        <ShoppingBag className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Order Now</span>
        {cartCount > 0 && (
          <span className="bg-black/30 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black">
            {cartCount}
          </span>
        )}
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
};
