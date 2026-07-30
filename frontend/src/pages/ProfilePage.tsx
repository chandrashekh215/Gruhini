import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../lib/api';
import { User, MapPin, Camera } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-extrabold text-slate-900">User Profile</h1>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-6">
        <div className="relative w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden border-2 border-amber-500">
          {user?.profileImageUrl ? (
            <img src={user.profileImageUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <User className="w-10 h-10 text-amber-700" />
          )}
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900">{user?.name || 'Gruhini Customer'}</h2>
          <p className="text-sm text-slate-500">{user?.email}</p>
          <p className="text-xs text-slate-400">Contact: {user?.contact || 'Not set'}</p>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="text-xs"
            />
            {file && (
              <button
                onClick={handleUploadPic}
                className="bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded"
              >
                Upload Photo
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-amber-600" />
          <span>Add New Delivery Address</span>
        </h3>

        <form onSubmit={handleAddAddress} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <input
            type="text"
            required
            placeholder="Address Line"
            value={addressLine}
            onChange={(e) => setAddressLine(e.target.value)}
            className="px-3 py-2 bg-slate-50 border rounded-lg sm:col-span-2"
          />
          <input
            type="text"
            required
            placeholder="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="px-3 py-2 bg-slate-50 border rounded-lg"
          />
          <input
            type="text"
            required
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="px-3 py-2 bg-slate-50 border rounded-lg"
          />
          <input
            type="text"
            required
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="px-3 py-2 bg-slate-50 border rounded-lg sm:col-span-2"
          />
          <button
            type="submit"
            className="gradient-saffron text-white font-bold py-2 rounded-lg shadow sm:col-span-2"
          >
            Save Address
          </button>
        </form>
      </div>
    </div>
  );
};
