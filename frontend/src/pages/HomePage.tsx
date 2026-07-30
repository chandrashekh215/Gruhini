import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, ShieldCheck, Heart, Sparkles, ChefHat, ArrowRight } from 'lucide-react';
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
    { name: 'Evening Snacks', id: 'SNACKS', icon: 'SAMOSA', desc: 'Crispy, hot & hygienic tea-time snacks' },
    { name: 'Vrat Special', id: 'VRAT', icon: '🍇', desc: 'Satvik food for fasts and festivals' },
    { name: 'Handcrafted Treats', id: 'HANDCRAFTED_ITEMS', icon: '🎨', desc: 'Homemade pickles, papads & spices' },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/60 py-20 px-4 sm:px-6 lg:px-8 border-b border-amber-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full text-xs font-bold text-amber-800 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Ghar Jaisa Khana, Ghar Ke Log</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Taste Authentic <span className="text-amber-600">Home-Cooked</span> Meals from Local Chefs
            </h1>

            <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
              Order fresh, hygienic, lovingly prepared meals made by verified home chefs in your neighborhood. No artificial additives, just pure taste of home.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/explore"
                className="gradient-saffron text-white font-bold px-7 py-3.5 rounded-xl shadow-lg hover:opacity-95 transition-all flex items-center space-x-2"
              >
                <span>Explore Royal Menu</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/seller-register"
                className="bg-white text-slate-800 font-bold px-7 py-3.5 rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-all flex items-center space-x-2"
              >
                <ChefHat className="w-5 h-5 text-amber-600" />
                <span>Join as Home Chef</span>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-amber-200/60">
              <div>
                <span className="text-2xl font-bold text-slate-900">100%</span>
                <span className="block text-xs text-slate-500 font-medium">Homemade & Fresh</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900">0%</span>
                <span className="block text-xs text-slate-500 font-medium">Preservatives</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900">Verified</span>
                <span className="block text-xs text-slate-500 font-medium">Hygiene Standards</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto max-w-md rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&auto=format&fit=crop&q=80"
                alt="Delicious Home Thali"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-white space-y-1">
                  <span className="bg-amber-500 text-slate-900 text-xs font-bold px-2.5 py-0.5 rounded-md uppercase">
                    Bestseller
                  </span>
                  <h3 className="text-xl font-bold">Special Royal North Indian Thali</h3>
                  <p className="text-xs text-slate-300">Prepared fresh by Sunita Sharma (Narmadapuram)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900">Explore by Category</h2>
          <p className="text-slate-600 text-sm">Handcrafted delicacies cooked with love and traditional recipes</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/explore?category=${cat.id}`}
              className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-amber-300 transition-all text-center space-y-3 group"
            >
              <div className="text-4xl group-hover:scale-110 transition-transform duration-200">
                {cat.icon}
              </div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-500">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex justify-between items-end border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Featured Home-Cooked Dishes</h2>
            <p className="text-xs text-slate-500 mt-1">Freshly prepared & approved by Gruhini quality team</p>
          </div>
          <Link to="/explore" className="text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center space-x-1">
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500">Loading home-cooked dishes...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.verified && (
                      <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified Chef</span>
                      </span>
                    )}
                    <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-2 py-0.5 rounded-md flex items-center space-x-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>{product.rating || 4.5}</span>
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-slate-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{product.description}</p>
                    <div className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded inline-block">
                      ⏱ Delivery: {product.deliveryTime}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-50 mt-2">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Price</span>
                    <span className="text-lg font-bold text-slate-900">₹{product.price}</span>
                  </div>

                  <button
                    onClick={() => addToCart(product.id)}
                    className="gradient-saffron text-white text-xs font-bold px-4 py-2 rounded-lg shadow hover:opacity-95 transition-opacity flex items-center space-x-1"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
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
