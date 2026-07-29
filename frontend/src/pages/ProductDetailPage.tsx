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
    return <div className="text-center py-16">Loading product details...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="relative h-96 md:h-full bg-slate-100">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          {product.verified && (
            <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Home Chef</span>
            </span>
          )}
        </div>

        <div className="p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full uppercase">
              {product.categories}
            </span>

            <h1 className="text-3xl font-extrabold text-slate-900">{product.name}</h1>

            <div className="flex items-center space-x-3 text-sm">
              <span className="flex items-center space-x-1 bg-slate-900 text-white px-2.5 py-1 rounded-md font-bold">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>{product.rating || 4.5}</span>
              </span>
              <span className="text-slate-500 font-medium">In Stock: {product.stock} units</span>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed">{product.description}</p>

            <div className="flex items-center space-x-2 text-xs font-semibold text-amber-800 bg-amber-50 p-3 rounded-xl">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Estimated Delivery: {product.deliveryTime}</span>
            </div>
          </div>

          <div className="pt-6 border-t flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Price</span>
              <span className="text-3xl font-extrabold text-slate-900">₹{product.price}</span>
            </div>

            <button
              onClick={() => addToCart(product.id)}
              className="gradient-saffron text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:opacity-95 transition-opacity flex items-center space-x-2"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
