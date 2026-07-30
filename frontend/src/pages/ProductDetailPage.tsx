import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSingleProduct, Product } from '../lib/product.client';
import { useCart } from '../context/CartContext';
import { ShieldCheck, Star, ShoppingBag, Clock } from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      getSingleProduct(Number(id)).then(setProduct);
    }
  }, [id]);

  if (!product) {
    return (
      <div className="text-center py-24 text-neutral-500 font-bold uppercase tracking-widest text-xs">
        Loading dish details...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 pb-32">
      <div className="bg-surface-card rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2">
        <div className="group relative h-96 md:h-full bg-neutral-900 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
          />
          {product.verified && (
            <span className="absolute top-6 left-6 bg-emerald-500/90 backdrop-blur-md text-white text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center space-x-1.5 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Home Chef</span>
            </span>
          )}
        </div>

        <div className="p-8 sm:p-12 space-y-8 flex flex-col justify-between">
          <div className="space-y-6">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-coral bg-coral/10 border border-coral/30 px-3 py-1 rounded-md inline-block">
              {product.categories}
            </span>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center space-x-4 text-xs font-bold">
              <span className="flex items-center space-x-1 bg-white/10 text-white px-3 py-1 rounded-lg border border-white/10">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>{product.rating || 4.5}</span>
              </span>
              <span className="text-neutral-400 tracking-wider uppercase">In Stock: {product.stock} units</span>
            </div>

            <p className="text-neutral-300 text-sm leading-relaxed font-normal">{product.description}</p>

            <div className="flex items-center space-x-2 text-xs font-bold text-coral bg-coral/10 border border-coral/20 p-4 rounded-2xl">
              <Clock className="w-4 h-4 text-coral" />
              <span className="uppercase tracking-wider">Estimated Delivery: {product.deliveryTime}</span>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 block">PRICE</span>
              <span className="text-3xl font-black text-white">₹{product.price}</span>
            </div>

            <button
              onClick={() => addToCart(product.id)}
              className="bg-coral hover:bg-coral-hover text-white font-extrabold text-xs uppercase tracking-wider px-8 py-4 rounded-2xl shadow-xl shadow-coral/20 transition-all flex items-center space-x-2.5 transform hover:-translate-y-0.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
