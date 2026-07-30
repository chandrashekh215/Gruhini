import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, UtensilsCrossed, LogOut, Store, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logoutUser } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#050505]/80 border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-2xl bg-coral flex items-center justify-center text-white shadow-lg shadow-coral/20 group-hover:scale-105 transition-transform duration-300">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tighter text-[#ebebeb] block uppercase">GRUHINI</span>
              <span className="block text-[9px] font-bold text-coral tracking-[0.25em] uppercase">
                Ghar Jaisa Khana
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">
            <Link to="/explore" className="hover:text-white transition-colors duration-200">
              Menu
            </Link>
            <Link to="/orders" className="hover:text-white transition-colors duration-200">
              Orders
            </Link>
            <Link
              to="/seller-register"
              className="flex items-center space-x-1.5 text-coral hover:text-white bg-coral/10 hover:bg-coral/20 px-3.5 py-1.5 rounded-full border border-coral/30 transition-all"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Join Chef Community</span>
            </Link>
            <Link to="/seller-dashboard" className="hover:text-white transition-colors duration-200">
              Chef Portal
            </Link>
            <Link to="/admin" className="hover:text-white transition-colors duration-200 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin</span>
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-5">
            <Link
              to="/cart"
              className="relative p-2.5 text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-coral text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-xs font-bold text-neutral-200 hover:text-coral transition-colors px-3 py-2 bg-neutral-900 border border-white/10 rounded-xl"
                >
                  <User className="w-4 h-4 text-coral" />
                  <span className="hidden sm:inline tracking-wider uppercase">{user?.name || user?.email || 'Profile'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2.5 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-300 hover:text-white px-3 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-bold uppercase tracking-[0.2em] bg-coral hover:bg-coral-hover text-white px-5 py-2.5 rounded-xl shadow-lg shadow-coral/20 transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
