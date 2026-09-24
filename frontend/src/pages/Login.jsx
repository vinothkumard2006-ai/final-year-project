import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: 'admin', password: 'admin123' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectQuery = new URLSearchParams(location.search).get('redirect');
  const redirectState = location.state?.from?.pathname;
  const redirectTo = redirectQuery || redirectState || '/dashboard';
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/auth/login', form);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      onLogin();
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(22,160,133,0.18),_#0b1120)] px-4">
      <div className="w-full max-w-md rounded-2xl border border-teal-500/30 bg-slate-900/90 p-8 shadow-2xl shadow-teal-950/40">
        <h1 className="text-2xl font-semibold">Secure Network Access</h1>
        <p className="mt-2 text-sm text-slate-400">Sign in to the Intelligent Network Monitoring Platform</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            type="password"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {error ? <p className="text-sm text-rose-400">{error}</p> : null}
          <button className="w-full rounded-lg bg-teal-600 px-3 py-2 font-medium text-white" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-xs text-slate-500">Demo credentials: admin / admin123</p>
      </div>
    </div>
  );
}
