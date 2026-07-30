import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, UtensilsCrossed, LogOut, Store, ShieldCheck, Heart } from 'lucide-react';
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
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-amber-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-full gradient-saffron flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">GRUHINI</span>
              <span className="block text-[10px] font-medium text-amber-600 tracking-wide uppercase">
                Ghar Jaisa Khana
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-700">
            <Link to="/explore" className="hover:text-amber-600 transition-colors">
              Royal Menu
            </Link>
            <Link to="/orders" className="hover:text-amber-600 transition-colors">
              My Orders
            </Link>
            <Link to="/seller-register" className="flex items-center space-x-1 text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-full border border-amber-200 transition-all">
              <Store className="w-4 h-4" />
              <span>Become a Home Chef</span>
            </Link>
            <Link to="/seller-dashboard" className="hover:text-amber-600 transition-colors">
              Chef Portal
            </Link>
            <Link to="/admin" className="hover:text-amber-600 transition-colors flex items-center space-x-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Admin</span>
            </Link>
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-slate-700 hover:text-amber-600 transition-colors">
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 gradient-saffron text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link to="/profile" className="flex items-center space-x-2 text-sm font-semibold text-slate-800 hover:text-amber-600">
                  <User className="w-5 h-5 text-amber-600" />
                  <span className="hidden sm:inline">{user?.name || user?.email || 'Profile'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-slate-500 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-amber-600 px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold gradient-saffron text-white px-4 py-2 rounded-lg shadow-sm hover:opacity-95 transition-opacity"
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
