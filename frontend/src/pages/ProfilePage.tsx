import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../lib/api';
import { User, MapPin } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [addressLine, setAddressLine] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/add-address', {
        method: 'PATCH',
        body: JSON.stringify({ addressLine, pincode, city, state }),
      });
      alert('Address added successfully!');
      setAddressLine('');
      setPincode('');
      setCity('');
      setState('');
      refreshUser();
    } catch (err: any) {
      alert(err.message || 'Failed to add address');
    }
  };

  const handleUploadPic = async () => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      await fetchApi('/image-upload', {
        method: 'PATCH',
        body: formData,
      });
      alert('Profile picture updated successfully!');
      refreshUser();
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12 pb-32">
      <div className="border-b border-white/10 pb-6">
        <span className="text-coral font-bold text-xs uppercase tracking-[0.35em] block mb-2">ACCOUNT DETAILS</span>
        <h1 className="text-4xl font-black tracking-tighter text-white uppercase">USER PROFILE</h1>
      </div>

      <div className="bg-surface-card p-8 sm:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
        <div className="relative w-24 h-24 rounded-3xl bg-neutral-900 flex items-center justify-center overflow-hidden border border-white/15 flex-shrink-0">
          {user?.profileImageUrl ? (
            <img src={user.profileImageUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <User className="w-10 h-10 text-coral" />
          )}
        </div>

        <div className="space-y-2 text-center sm:text-left flex-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-coral bg-coral/10 border border-coral/30 px-3 py-1 rounded-md inline-block">
            {user?.roles?.join(', ') || 'ROLE_USER'}
          </span>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">{user?.name || 'Gruhini Customer'}</h2>
          <p className="text-xs text-neutral-400 font-medium">{user?.email}</p>
          <p className="text-xs text-neutral-500 font-medium">Contact: {user?.contact || 'Not set'}</p>

          <div className="flex flex-wrap items-center gap-3 pt-4 justify-center sm:justify-start">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="text-xs text-neutral-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-white/10 file:text-white hover:file:bg-white/20"
            />
            {file && (
              <button
                onClick={handleUploadPic}
                className="bg-coral hover:bg-coral-hover text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl shadow-lg transition-all"
              >
                Upload Photo
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-surface-card p-8 sm:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-6">
        <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center space-x-3 border-b border-white/10 pb-4">
          <MapPin className="w-5 h-5 text-coral" />
          <span>Add New Delivery Address</span>
        </h3>

        <form onSubmit={handleAddAddress} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
          <input
            type="text"
            required
            placeholder="Address Line"
            value={addressLine}
            onChange={(e) => setAddressLine(e.target.value)}
            className="px-4 py-3.5 bg-neutral-900 border border-white/10 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:border-coral transition-colors sm:col-span-2"
          />
          <input
            type="text"
            required
            placeholder="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="px-4 py-3.5 bg-neutral-900 border border-white/10 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:border-coral transition-colors"
          />
          <input
            type="text"
            required
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="px-4 py-3.5 bg-neutral-900 border border-white/10 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:border-coral transition-colors"
          />
          <input
            type="text"
            required
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="px-4 py-3.5 bg-neutral-900 border border-white/10 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:border-coral transition-colors sm:col-span-2"
          />
          <button
            type="submit"
            className="w-full bg-coral hover:bg-coral-hover text-white font-extrabold text-xs uppercase tracking-[0.2em] py-4 rounded-2xl shadow-xl shadow-coral/20 transition-all sm:col-span-2 mt-2"
          >
            Save Address
          </button>
        </form>
      </div>
    </div>
  );
};
