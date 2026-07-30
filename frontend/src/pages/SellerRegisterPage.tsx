import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchApi } from '../lib/api';
import { ChefHat, AlertCircle, CheckCircle2 } from 'lucide-react';

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
    <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-2xl border border-slate-200 shadow-xl space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 gradient-saffron rounded-full flex items-center justify-center text-white mx-auto shadow-md">
          <ChefHat className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Become a Gruhini Home Chef</h1>
        <p className="text-xs text-slate-500">
          Share your authentic home-cooked meals with food lovers in your city
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-center space-x-2 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Chef Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
              placeholder="Sunita Sharma"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Kitchen / Business Name</label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
              placeholder="Sunita's Royal Kitchen"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
              placeholder="chef@gmail.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
            <input
              type="text"
              required
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
              placeholder="9876543210"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Kitchen Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
            placeholder="Specializing in Malwa Thalis, fresh Halwa, and zero-oil evening snacks..."
          />
        </div>

        <div className="border-t pt-4 space-y-3">
          <h3 className="font-bold text-slate-900 text-xs uppercase">Kitchen Address Details</h3>
          <input
            type="text"
            required
            placeholder="Street Address / House No."
            value={addressLine}
            onChange={(e) => setAddressLine(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
          />

          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              required
              placeholder="Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
            />
            <input
              type="text"
              required
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
            />
            <input
              type="text"
              required
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full gradient-saffron text-white font-bold py-3 rounded-xl shadow-lg hover:opacity-95 transition-opacity disabled:opacity-50 text-sm mt-4"
        >
          {loading ? 'Submitting Application...' : 'Register Kitchen'}
        </button>
      </form>
    </div>
  );
};
