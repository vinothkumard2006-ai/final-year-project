import { Link } from 'react-router-dom';
import { useLiveData } from '../context/LiveDataContext';

export default function Alerts() {
  const liveData = useLiveData();
  const alerts = liveData?.alerts || [];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Alerts</h3>
        <Link to="/" className="rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800">Back to company</Link>
      </div>
      <div className="mt-4 space-y-2 text-sm">
        {alerts.map((alert) => (
          <div key={alert.title} className={`rounded-lg border p-3 ${alert.severity === 'HIGH' ? 'border-red-500/30 bg-red-500/10' : 'border-amber-500/30 bg-amber-500/10'}`}>
            <p className="font-medium">{alert.title}</p>
            <p className="mt-1 text-slate-300">{alert.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
