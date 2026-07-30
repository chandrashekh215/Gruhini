import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetchApi('/logins', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (res.token) {
        loginUser(res.token);
        navigate('/');
      } else {
        throw new Error('Token not received');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-20 p-8 sm:p-10 bg-surface-card rounded-[2.5rem] border border-white/10 shadow-2xl space-y-8">
      <div className="text-center space-y-3">
        <div className="w-14 h-14 bg-coral/10 border border-coral/30 rounded-2xl flex items-center justify-center text-coral mx-auto shadow-lg shadow-coral/10">
          <LogIn className="w-6 h-6 text-coral" />
        </div>
        <span className="text-coral font-bold text-[10px] uppercase tracking-[0.3em] block">WELCOME BACK</span>
        <h1 className="text-3xl font-black tracking-tight text-white uppercase">SIGN IN</h1>
        <p className="text-xs text-neutral-400">Access your orders, cart, and chef dashboard</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center space-x-3 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3.5 bg-neutral-900 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-coral transition-colors"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3.5 bg-neutral-900 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-coral transition-colors"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-coral hover:bg-coral-hover text-white font-extrabold text-xs uppercase tracking-[0.2em] py-4 rounded-2xl shadow-xl shadow-coral/20 transition-all disabled:opacity-50"
        >
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>

      <div className="text-center text-xs text-neutral-400 pt-4 border-t border-white/5">
        Don't have an account?{' '}
        <Link to="/register" className="font-bold text-coral hover:underline uppercase tracking-wider">
          Register here
        </Link>
      </div>
    </div>
  );
};
