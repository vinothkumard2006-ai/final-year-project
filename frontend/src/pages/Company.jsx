import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLiveData } from '../context/LiveDataContext';

const statCards = [
  { label: 'Network Health', key: 'network_health' },
  { label: 'Active Devices', key: 'active_devices' },
  { label: 'Open Threats', key: 'active_threats' },
  { label: 'Risk Score', key: 'risk_score' },
];

export default function Company() {
  const liveData = useLiveData();
  const data = liveData?.company || {};
  const status = liveData?.lastUpdated ? 'Live telemetry' : 'Offline demo mode';

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(22,160,133,0.24),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(231,111,81,0.18),_transparent_24%),#0b1120] text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col px-6 py-8 lg:px-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/60 px-5 py-4 backdrop-blur">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-teal-300">{data.company_name}</p>
            <h1 className="text-2xl font-semibold">{data.industry}</h1>
          </div>
          <div className="rounded-full border border-teal-400/40 bg-teal-500/10 px-3 py-1 text-sm text-teal-300">
            {status}
          </div>
        </header>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid gap-6 rounded-3xl border border-teal-500/30 bg-slate-900/80 p-6 shadow-2xl shadow-teal-950/30 lg:grid-cols-[1.2fr_0.8fr]"
        >
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-teal-300">Demo Company</p>
            <h2 className="mt-3 text-4xl font-semibold">Secure operations for a modern digital business.</h2>
            <p className="mt-4 max-w-2xl text-lg text-slate-400">
              This sample company page blends animated visuals with live network monitoring data, showing how telemetry can be surfaced for executives and operations teams.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/login?redirect=/live" className="rounded-full bg-teal-600 px-4 py-2 font-medium text-white">Open live console</Link>
              <Link to="/dashboard" className="rounded-full border border-slate-700 px-4 py-2 font-medium text-slate-200">View dashboard</Link>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
            <p className="text-sm text-slate-400">Live pulse</p>
            <div className="mt-4 space-y-3">
              {statCards.map((item) => (
                <div key={item.label} className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>{item.label}</span>
                    <span className="text-teal-300">Live</span>
                  </div>
                  <p className="mt-2 text-2xl font-semibold text-white">{data[item.key]}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Company overview</h3>
              <span className="text-sm text-teal-300">{data.uptime}</span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-400">Location</p>
                <p className="mt-1 font-medium">{data.location}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-400">Coverage</p>
                <p className="mt-1 font-medium">{data.coverage}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-400">Open alerts</p>
                <p className="mt-1 font-medium">{data.alerts}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-400">Status</p>
                <p className="mt-1 font-medium">{data.status}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <h3 className="text-lg font-semibold">How the feed works</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li>• The page polls the monitoring API every few seconds.</li>
              <li>• The backend returns company and telemetry summary data.</li>
              <li>• The UI animates and updates cards without reloading the page.</li>
              <li>• The dashboard uses the same data stream for a real-time feel.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
