import { Link } from 'react-router-dom';
import { useLiveData } from '../context/LiveDataContext';
import { AnimatePresence, motion } from 'framer-motion';

export default function LiveMonitor() {
  const liveData = useLiveData();
  const rows = (liveData?.flows || []).slice(0, 6);
  const last = liveData?.lastUpdated;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Live Traffic Stream</h3>
          <p className="mt-2 text-sm text-slate-400">Streaming flow data from the monitoring backend and refreshing automatically.</p>
        </div>
        <Link to="/" className="rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800">Back to company</Link>
      </div>
      <div className="mt-2 text-xs text-slate-400">Last update: {last}</div>
      <div className="mt-4 space-y-2">
        <AnimatePresence initial={false} mode="popLayout">
          {rows.map((row, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.24 }}
              key={`${row.source_ip}-${row.destination_ip}-${index}`}
              className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm"
            >
              <span>{row.source_ip} → {row.destination_ip}</span>
              <span className="text-slate-400">{row.protocol}</span>
              <span>{row.packet_count} pkts / {row.byte_count} B</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
