import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchApi } from '../lib/api';
import { UserPlus, AlertCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await fetchApi('/register', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          contact,
          password,
        }),
      });
      alert('Registration successful! Please sign in with your credentials.');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-20 p-8 sm:p-10 bg-surface-card rounded-[2.5rem] border border-white/10 shadow-2xl space-y-8">
      <div className="text-center space-y-3">
        <div className="w-14 h-14 bg-coral/10 border border-coral/30 rounded-2xl flex items-center justify-center text-coral mx-auto shadow-lg shadow-coral/10">
          <UserPlus className="w-6 h-6 text-coral" />
        </div>
        <span className="text-coral font-bold text-[10px] uppercase tracking-[0.3em] block">JOIN THE COMMUNITY</span>
        <h1 className="text-3xl font-black tracking-tight text-white uppercase">CREATE ACCOUNT</h1>
        <p className="text-xs text-neutral-400">Join Gruhini for home-cooked food delivery</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center space-x-3 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3.5 bg-neutral-900 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-coral transition-colors"
            placeholder="Sunita Sharma"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3.5 bg-neutral-900 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-coral transition-colors"
            placeholder="sunita@gmail.com"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Mobile Contact (10 digits)</label>
          <input
            type="text"
            required
            maxLength={10}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full px-4 py-3.5 bg-neutral-900 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-coral transition-colors"
            placeholder="9876543210"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3.5 bg-neutral-900 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-coral transition-colors"
            placeholder="At least 6 characters"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-coral hover:bg-coral-hover text-white font-extrabold text-xs uppercase tracking-[0.2em] py-4 rounded-2xl shadow-xl shadow-coral/20 transition-all disabled:opacity-50"
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      <div className="text-center text-xs text-neutral-400 pt-4 border-t border-white/5">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-coral hover:underline uppercase tracking-wider">
          Sign In
        </Link>
      </div>
    </div>
  );
};
