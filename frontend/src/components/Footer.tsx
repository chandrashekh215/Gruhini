import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">GRUHINI</h3>
          <p className="text-xs text-amber-500 font-semibold uppercase tracking-wider mb-4">
            Ghar Jaisa Khana, Ghar Ke Log
          </p>
          <p className="text-sm text-slate-400">
            Connecting passionate home chefs with food lovers craving authentic, healthy, handcrafted meals.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/explore" className="hover:text-amber-400">Royal Menu</a></li>
            <li><a href="/seller-register" className="hover:text-amber-400">Register as Chef</a></li>
            <li><a href="/orders" className="hover:text-amber-400">Track Orders</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Categories</h4>
          <ul className="space-y-2 text-sm">
            <li><span className="hover:text-amber-400">Traditional Thali</span></li>
            <li><span className="hover:text-amber-400">Pure Sweets & Mithai</span></li>
            <li><span className="hover:text-amber-400">Evening Snacks</span></li>
            <li><span className="hover:text-amber-400">Vrat Special Food</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Narmadapuram Hub</h4>
          <p className="text-sm text-slate-400">
            Serving local vendors and home chefs across Narmadapuram (Hoshangabad), Madhya Pradesh 🇮🇳
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
        <p>© 2026 Gruhini Marketplace. All rights reserved.</p>
        <p className="flex items-center space-x-1 mt-2 sm:mt-0">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>for Home Chefs in India</span>
        </p>
      </div>
    </footer>
  );
};
