import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchApi } from '../lib/api';
import { ChefHat, AlertCircle } from 'lucide-react';

export const SellerRegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('Narmadapuram');
  const [state, setState] = useState('Madhya Pradesh');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await fetchApi('/register-seller', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          phone,
          businessName,
          categories: ['THALI', 'SNACKS'],
          description,
          addressDto: {
            addressLine,
            pincode,
            city,
            state,
          },
        }),
      });
      alert('Seller onboarding application submitted successfully! Admin will review your profile.');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Failed to register seller profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-20 p-8 sm:p-12 bg-surface-card rounded-[2.5rem] border border-white/10 shadow-2xl space-y-8">
      <div className="text-center space-y-3">
        <div className="w-14 h-14 bg-coral/10 border border-coral/30 rounded-2xl flex items-center justify-center text-coral mx-auto shadow-lg shadow-coral/10">
          <ChefHat className="w-6 h-6 text-coral" />
        </div>
        <span className="text-coral font-bold text-[10px] uppercase tracking-[0.3em] block">CHEF ONBOARDING</span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">BECOME A HOME CHEF</h1>
        <p className="text-xs text-neutral-400">Share your authentic home-cooked meals with food lovers in your city</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center space-x-3 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs font-medium">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Chef Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:border-coral transition-colors"
              placeholder="Sunita Sharma"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Kitchen / Business Name</label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:border-coral transition-colors"
              placeholder="Sunita's Royal Kitchen"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:border-coral transition-colors"
              placeholder="chef@gmail.com"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Phone Number</label>
            <input
              type="text"
              required
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:border-coral transition-colors"
              placeholder="9876543210"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Kitchen Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:border-coral transition-colors"
            placeholder="Specializing in Malwa Thalis, fresh Halwa, and zero-oil evening snacks..."
          />
        </div>

        <div className="border-t border-white/10 pt-6 space-y-4">
          <h3 className="font-extrabold text-white text-xs uppercase tracking-widest">Kitchen Address Details</h3>
          <input
            type="text"
            required
            placeholder="Street Address / House No."
            value={addressLine}
            onChange={(e) => setAddressLine(e.target.value)}
            className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:border-coral transition-colors"
          />

          <div className="grid grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="px-4 py-3 bg-neutral-900 border border-white/10 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:border-coral transition-colors"
            />
            <input
              type="text"
              required
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="px-4 py-3 bg-neutral-900 border border-white/10 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:border-coral transition-colors"
            />
            <input
              type="text"
              required
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="px-4 py-3 bg-neutral-900 border border-white/10 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:border-coral transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-coral hover:bg-coral-hover text-white font-extrabold text-xs uppercase tracking-[0.2em] py-4 rounded-2xl shadow-xl shadow-coral/20 transition-all disabled:opacity-50 mt-4"
        >
          {loading ? 'Submitting Application...' : 'Register Kitchen'}
        </button>
      </form>
    </div>
  );
};
