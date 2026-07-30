import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, ShieldCheck, Sparkles, ChefHat, ArrowRight, ArrowUpRight } from 'lucide-react';
import { getExploreProducts, Product } from '../lib/product.client';
import { useCart } from '../context/CartContext';

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    getExploreProducts().then(setProducts);
  }, []);

  const categories = [
    { name: 'Traditional Thali', id: 'THALI', icon: '🍲', desc: 'Complete homemade wholesome meals' },
    { name: 'Pure Sweets & Mithai', id: 'SWEETS', icon: '🍨', desc: 'Desi ghee authentic homemade sweets' },
    { name: 'Evening Snacks', id: 'SNACKS', icon: '☕', desc: 'Crispy, hot & hygienic tea-time snacks' },
    { name: 'Vrat Special', id: 'VRAT', icon: '🍇', desc: 'Satvik food for fasts and festivals' },
    { name: 'Handcrafted Treats', id: 'HANDCRAFTED_ITEMS', icon: '🎨', desc: 'Homemade pickles, papads & spices' },
  ];

  return (
    <div className="space-y-24 sm:space-y-32 pb-32">
      {/* Editorial Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center space-x-2 bg-coral/10 border border-coral/30 px-3.5 py-1.5 rounded-full text-[11px] font-bold text-coral uppercase tracking-[0.25em]">
              <Sparkles className="w-3.5 h-3.5 text-coral animate-pulse" />
              <span>Ghar Jaisa Khana, Ghar Ke Log</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5vw] font-black tracking-tighter text-white leading-[0.92] uppercase">
              TASTE AUTHENTIC <br />
              <span className="text-coral">HOME-COOKED</span> <br />
              MEALS NEAR YOU.
            </h1>

            <p className="text-sm sm:text-base text-neutral-400 max-w-xl leading-relaxed font-normal">
              Order fresh, hygienic, lovingly prepared meals made by verified home chefs in your neighborhood. Zero artificial additives, just pure taste of home.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/explore"
                className="group bg-coral hover:bg-coral-hover text-white font-extrabold text-xs uppercase tracking-[0.2em] px-8 py-4 rounded-2xl shadow-xl shadow-coral/20 transition-all duration-300 flex items-center space-x-3 transform hover:-translate-y-0.5"
              >
                <span>Explore Royal Menu</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/seller-register"
                className="bg-surface-card hover:bg-white/10 text-white font-bold text-xs uppercase tracking-[0.2em] px-8 py-4 rounded-2xl border border-white/15 transition-all flex items-center space-x-3"
              >
                <ChefHat className="w-4 h-4 text-coral" />
                <span>Join as Home Chef</span>
              </Link>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
              <div>
                <span className="text-3xl font-black tracking-tighter text-white">100%</span>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mt-1">
                  Homemade Fresh
                </span>
              </div>
              <div>
                <span className="text-3xl font-black tracking-tighter text-white">0%</span>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mt-1">
                  Preservatives
                </span>
              </div>
              <div>
                <span className="text-3xl font-black tracking-tighter text-coral">VERIFIED</span>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mt-1">
                  Hygiene Checked
                </span>
              </div>
            </div>
          </div>

          {/* Hero Featured Card with Grayscale Hover */}
          <div className="lg:col-span-5">
            <div className="group relative rounded-[2.5rem] overflow-hidden border border-white/15 bg-surface-card shadow-2xl transition-all duration-500">
              <div className="relative h-[420px] sm:h-[480px] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80"
                  alt="Special Royal Thali"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-8">
                  <div className="text-white space-y-2">
                    <span className="bg-coral text-white text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase inline-block shadow-md">
                      FEATURED DISH
                    </span>
                    <h3 className="text-2xl font-black tracking-tight">Special Royal North Indian Thali</h3>
                    <p className="text-xs text-neutral-400 font-medium">Prepared fresh by Sunita Sharma (Narmadapuram)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions — Dark 2-Card Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="border-b border-white/10 pb-6 flex justify-between items-end">
          <div>
            <span className="text-coral font-bold text-xs uppercase tracking-[0.3em] block mb-2">WHY GRUHINI</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
              PURE INGREDIENTS. HOMEMADE CARE.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-surface-card p-10 sm:p-12 rounded-[2.5rem] border border-white/10 hover:border-white/20 transition-all duration-300 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-coral/15 border border-coral/30 flex items-center justify-center text-coral">
              <ChefHat className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black tracking-tight text-white uppercase">Vetted Local Kitchens</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Every home chef undergoes personal hygiene inspection and food tasting verification before joining our neighborhood marketplace.
            </p>
          </div>

          <div className="bg-surface-card p-10 sm:p-12 rounded-[2.5rem] border border-white/10 hover:border-white/20 transition-all duration-300 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black tracking-tight text-white uppercase">OTP Verified Delivery</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Secure delivery pin protection ensures your meal is handed directly to you straight from the home chef’s kitchen.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-white/10 pb-6">
          <span className="text-coral font-bold text-xs uppercase tracking-[0.3em] block mb-2">CURATED SELECTION</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white uppercase">EXPLORE BY CATEGORY</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/explore?category=${cat.id}`}
              className="group bg-surface-card p-6 rounded-3xl border border-white/10 hover:border-coral/50 transition-all duration-300 text-center space-y-3 hover:-translate-y-1"
            >
              <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                {cat.icon}
              </div>
              <h3 className="font-bold text-white text-sm group-hover:text-coral transition-colors uppercase tracking-wider">
                {cat.name}
              </h3>
              <p className="text-[11px] text-neutral-500 font-medium">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Editorial Featured Dishes (Asymmetric offset Grid pattern) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex justify-between items-end border-b border-white/10 pb-6">
          <div>
            <span className="text-coral font-bold text-xs uppercase tracking-[0.3em] block mb-2">FRESH TODAY</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white uppercase">FEATURED DISHES</h2>
          </div>
          <Link
            to="/explore"
            className="text-xs font-bold uppercase tracking-[0.2em] text-coral hover:text-white flex items-center space-x-2 transition-colors"
          >
            <span>View All Menu</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 bg-surface-card rounded-3xl border border-white/10">
            <p className="text-neutral-500 text-xs uppercase tracking-widest font-bold">Loading home-cooked catalog...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 8).map((product, idx) => (
              <div
                key={product.id}
                className={`group bg-surface-card rounded-3xl border border-white/10 hover:border-white/25 transition-all duration-500 overflow-hidden flex flex-col justify-between ${
                  idx % 2 === 1 ? 'lg:mt-8' : ''
                }`}
              >
                <div>
                  <div className="relative h-56 overflow-hidden bg-neutral-900">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                    {product.verified && (
                      <span className="absolute top-4 left-4 bg-emerald-500/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md flex items-center space-x-1 uppercase tracking-wider">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    )}
                    <span className="absolute top-4 right-4 bg-black/80 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1 border border-white/10">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>{product.rating || 4.5}</span>
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-coral bg-coral/10 px-2.5 py-1 rounded-md inline-block">
                      {product.categories}
                    </span>
                    <h3 className="font-bold text-white text-lg line-clamp-1 group-hover:text-coral transition-colors tracking-tight">
                      {product.name}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">{product.description}</p>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between border-t border-white/5 mt-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 block">PRICE</span>
                    <span className="text-xl font-extrabold text-white">₹{product.price}</span>
                  </div>

                  <button
                    onClick={() => addToCart(product.id)}
                    className="bg-coral hover:bg-coral-hover text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-lg shadow-coral/20 transition-all flex items-center space-x-1.5"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
