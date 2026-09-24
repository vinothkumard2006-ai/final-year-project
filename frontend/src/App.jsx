import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useLiveData } from './context/LiveDataContext';
import { motion } from 'framer-motion';
import Dashboard from './pages/Dashboard';
import LiveMonitor from './pages/LiveMonitor';
import Devices from './pages/Devices';
import Topology from './pages/Topology';
import ThreatDetection from './pages/ThreatDetection';
import Alerts from './pages/Alerts';
import Incidents from './pages/Incidents';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Company from './pages/Company';
import { LiveDataProvider } from './context/LiveDataContext';

function ProtectedRoute({ children }) {
  const isAuthenticated = Boolean(localStorage.getItem('token'));
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

const navItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Live Monitor', path: '/live' },
  { name: 'Devices', path: '/devices' },
  { name: 'Topology', path: '/topology' },
  { name: 'Threat Detection', path: '/threats' },
  { name: 'Alerts', path: '/alerts' },
  { name: 'Incidents', path: '/incidents' },
  { name: 'Reports', path: '/reports' },
  { name: 'Settings', path: '/settings' },
];

function AppShell({ children }) {
  const location = useLocation();
  const liveData = useLiveData();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside className="w-64 border-r border-slate-800 bg-slate-900/80 p-5">
          <div className="mb-8">
            <h1 className="text-xl font-semibold">Network Guardian</h1>
            <p className="text-sm text-slate-400">Explainable AI Monitoring</p>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block rounded-lg px-3 py-2 text-sm transition ${location.pathname === item.path ? 'bg-teal-600 text-white' : 'text-slate-300 hover:bg-teal-950/40'}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3">
            <div>
              <p className="text-sm text-teal-300">DEMO DATA</p>
              <h2 className="text-xl font-semibold">Intelligent Network Monitoring Platform</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-sm text-teal-300">
                {liveData.lastUpdated}
              </div>
              <div className="rounded-full border border-orange-500/40 bg-orange-500/10 px-3 py-1 text-sm text-orange-300">
                Low-memory optimized
              </div>
              <button onClick={handleLogout} className="rounded-lg border border-slate-700 px-3 py-1 text-sm hover:bg-slate-800">
                Logout
              </button>
            </div>
          </div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function AppRoutes() {
  const [auth, setAuth] = useState(() => Boolean(localStorage.getItem('token')));

  useEffect(() => {
    const syncAuth = () => setAuth(Boolean(localStorage.getItem('token')));
    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Company />} />
      <Route
        path="/login"
        element={
          auth ? <Navigate to="/dashboard" replace /> : <Login onLogin={() => setAuth(true)} />
        }
      />
      <Route path="/dashboard" element={<ProtectedRoute><AppShell><Dashboard /></AppShell></ProtectedRoute>} />
      <Route path="/live" element={<ProtectedRoute><AppShell><LiveMonitor /></AppShell></ProtectedRoute>} />
      <Route path="/devices" element={<ProtectedRoute><AppShell><Devices /></AppShell></ProtectedRoute>} />
      <Route path="/topology" element={<ProtectedRoute><AppShell><Topology /></AppShell></ProtectedRoute>} />
      <Route path="/threats" element={<ProtectedRoute><AppShell><ThreatDetection /></AppShell></ProtectedRoute>} />
      <Route path="/alerts" element={<ProtectedRoute><AppShell><Alerts /></AppShell></ProtectedRoute>} />
      <Route path="/incidents" element={<ProtectedRoute><AppShell><Incidents /></AppShell></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><AppShell><Reports /></AppShell></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><AppShell><Settings /></AppShell></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <LiveDataProvider>
      <AppRoutes />
    </LiveDataProvider>
  );
}
