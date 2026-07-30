import React from 'react';
import { Heart, Instagram, Twitter, Facebook, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050505] text-[#ebebeb] pt-24 pb-32 border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Oversized Statement Headline */}
        <div className="border-b border-white/10 pb-16">
          <span className="text-coral font-bold text-xs uppercase tracking-[0.35em] block mb-4">
            HOMEMADE CULINARY REVOLUTION
          </span>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter text-white max-w-3xl leading-[0.95]">
              CRAVING HOMEMADE? <br />
              <span className="text-neutral-500">ORDER TODAY.</span>
            </h2>
            <Link
              to="/explore"
              className="group inline-flex items-center space-x-3 bg-white hover:bg-coral text-black hover:text-white font-bold text-xs uppercase tracking-[0.2em] px-8 py-5 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 shadow-2xl"
            >
              <span>Explore Royal Menu</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-xs">
          <div className="space-y-4">
            <h3 className="text-lg font-black tracking-tighter text-white">GRUHINI.</h3>
            <p className="text-neutral-400 leading-relaxed">
              Connecting local home chefs with food lovers craving authentic, healthy, handcrafted meals.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-[0.25em] text-[10px] text-coral">Quick Navigation</h4>
            <ul className="space-y-2.5 font-medium text-neutral-400">
              <li><Link to="/explore" className="hover:text-white transition-colors">Royal Menu</Link></li>
              <li><Link to="/seller-register" className="hover:text-white transition-colors">Join Chef Community</Link></li>
              <li><Link to="/orders" className="hover:text-white transition-colors">Track Active Orders</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">Customer Profile</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-[0.25em] text-[10px] text-coral">Curated Categories</h4>
            <ul className="space-y-2.5 font-medium text-neutral-400">
              <li className="hover:text-white transition-colors cursor-pointer">Traditional Thalis</li>
              <li className="hover:text-white transition-colors cursor-pointer">Pure Sweets & Mithai</li>
              <li className="hover:text-white transition-colors cursor-pointer">Evening Snacks</li>
              <li className="hover:text-white transition-colors cursor-pointer">Vrat Special Delicacies</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-white uppercase tracking-[0.25em] text-[10px] text-coral">Connect With Us</h4>
            <div className="flex space-x-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all transform hover:-translate-y-1"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all transform hover:-translate-y-1"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all transform hover:-translate-y-1"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-[11px] font-medium text-neutral-500 gap-4">
          <p>© 2026 GRUHINI Marketplace. All rights reserved.</p>
          <p className="flex items-center space-x-1.5">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-coral fill-coral animate-pulse" />
            <span>for Home Chefs across India</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
