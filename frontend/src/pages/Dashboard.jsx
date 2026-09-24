import { Link } from 'react-router-dom';
import { useLiveData } from '../context/LiveDataContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const liveData = useLiveData();
  const dashboard = liveData?.dashboard || {};

  const cards = [
    { title: 'Network Health', value: `${dashboard.network_health ?? 94}%`, detail: 'Stable', className: 'text-teal-400' },
    { title: 'Active Devices', value: `${dashboard.active_devices ?? 3}`, detail: 'Live', className: 'text-teal-400' },
    { title: 'Active Threats', value: `${dashboard.active_threats ?? 2}`, detail: 'Monitored', className: 'text-red-400' },
    { title: 'Risk Score', value: `${dashboard.risk_score ?? 65.7}/100`, detail: 'Elevated', className: 'text-orange-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-4 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-3">
        <div>
          <h3 className="font-semibold">Live console</h3>
          <p className="text-sm text-slate-400">Updated at {liveData?.lastUpdated}</p>
        </div>
        <Link to="/" className="rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800">Back to company</Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AnimatePresence initial={false} mode="popLayout">
          {cards.map((card) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              key={card.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-sm text-slate-400">{card.title}</p>
              <p className="mt-2 text-3xl font-semibold">{card.value}</p>
              <p className={`mt-2 text-sm ${card.className}`}>{card.detail}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <h3 className="font-semibold">Bandwidth Usage</h3>
          <p className="mt-2 text-sm text-slate-400">Current aggregate throughput</p>
          <div className="mt-4 h-40 rounded-xl bg-gradient-to-r from-teal-600 to-slate-800" />
          <p className="mt-3 text-sm text-teal-300">{dashboard.bandwidth_usage ?? 1280} Mbps</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <h3 className="font-semibold">Recent Signals</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>• Port sweep activity from 192.168.1.44</li>
            <li>• Unusual DNS fanout from printer-02</li>
            <li>• Elevated bandwidth towards cloud backup</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
