import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, Star, ShieldCheck, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { getExploreProducts, Product } from '../lib/product.client';
import { useCart } from '../context/CartContext';

export const ExplorePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();

  useEffect(() => {
    getExploreProducts().then(setProducts);
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'ALL' || p.categories === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 pb-32">
      {/* Header Section */}
      <div className="border-b border-white/10 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-coral font-bold text-xs uppercase tracking-[0.35em] block mb-2">EDITORIAL CATALOG</span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-white uppercase">THE ROYAL MENU</h1>
        </div>
        <p className="text-neutral-400 text-xs sm:text-sm max-w-md">
          Browse authentic, handcrafted home-cooked delicacies freshly prepared by neighborhood chefs.
        </p>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-center bg-surface-card p-4 sm:p-6 rounded-3xl border border-white/10">
        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search dishes (e.g. Thali, Suji Cake, Halwa)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-neutral-900 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-coral transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-2.5 w-full lg:w-auto">
          {['ALL', 'THALI', 'SWEETS', 'SNACKS', 'VRAT', 'HANDCRAFTED_ITEMS'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-[11px] font-extrabold uppercase tracking-wider transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-coral text-white shadow-lg shadow-coral/20 border border-coral'
                  : 'bg-neutral-900 text-neutral-400 border border-white/10 hover:text-white hover:border-white/25'
              }`}
            >
              {cat === 'HANDCRAFTED_ITEMS' ? 'HANDCRAFTED' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Asymmetric Gallery Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-surface-card rounded-3xl border border-white/10 space-y-3">
          <Filter className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
          <p className="text-neutral-300 font-bold uppercase tracking-wider text-sm">No dishes found matching criteria</p>
          <p className="text-xs text-neutral-500">Try clearing filters or search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, idx) => (
            <div
              key={product.id}
              className={`group bg-surface-card rounded-[2.5rem] border border-white/10 hover:border-white/25 transition-all duration-500 overflow-hidden flex flex-col justify-between ${
                idx % 2 === 1 ? 'md:mt-12' : ''
              }`}
            >
              <div>
                <div className="relative h-64 overflow-hidden bg-neutral-900">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                  />

                  {product.verified && (
                    <span className="absolute top-4 left-4 bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified Chef</span>
                    </span>
                  )}

                  <span className="absolute top-4 right-4 bg-black/80 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-xl flex items-center space-x-1 border border-white/10">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{product.rating || 4.5}</span>
                  </span>

                  <Link
                    to={`/products/${product.id}`}
                    className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-xl hover:scale-110"
                    title="View Dish Details"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </Link>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-coral bg-coral/10 px-2.5 py-1 rounded-md">
                      {product.categories}
                    </span>
                    <span className="text-[11px] font-medium text-neutral-400">
                      ⏱ {product.deliveryTime}
                    </span>
                  </div>

                  <Link to={`/products/${product.id}`}>
                    <h3 className="font-bold text-white text-xl line-clamp-1 group-hover:text-coral transition-colors tracking-tight">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">{product.description}</p>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between border-t border-white/5 mt-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 block">PRICE</span>
                  <span className="text-2xl font-black text-white">₹{product.price}</span>
                </div>

                <button
                  onClick={() => addToCart(product.id)}
                  className="bg-coral hover:bg-coral-hover text-white text-xs font-extrabold uppercase tracking-wider px-5 py-3 rounded-2xl shadow-lg shadow-coral/20 transition-all flex items-center space-x-2 transform hover:-translate-y-0.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
