import { AnimatePresence, motion } from 'framer-motion';
import { useLiveData } from '../context/LiveDataContext';

export default function Devices() {
  const liveData = useLiveData();
  const devices = (liveData?.devices && liveData.devices.length > 0)
    ? liveData.devices
    : [
        { ip: '192.168.1.10', mac: 'AA:BB:CC:01', status: 'Active', risk: 'Low' },
        { ip: '192.168.1.44', mac: 'AA:BB:CC:44', status: 'Suspicious', risk: 'High' },
        { ip: '192.168.1.12', mac: 'AA:BB:CC:12', status: 'Active', risk: 'Medium' },
      ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
      <h3 className="text-lg font-semibold">Discovered Devices</h3>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <AnimatePresence initial={false} mode="popLayout">
          {devices.map((device) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 6, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              key={device.ip}
              className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm hover:shadow-lg"
              whileHover={{ scale: 1.02 }}
            >
              <p className="font-medium">{device.ip}</p>
              <p className="text-slate-400">MAC {device.mac}</p>
              <p className="mt-2 text-slate-300">Status: {device.status}</p>
              <p className="text-slate-300">Risk: {device.risk}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
