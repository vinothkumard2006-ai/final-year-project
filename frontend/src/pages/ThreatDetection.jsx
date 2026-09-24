import { Link } from 'react-router-dom';
import { useLiveData } from '../context/LiveDataContext';

export default function ThreatDetection() {
  const liveData = useLiveData();
  const threats = liveData?.threats || [];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Threat Detection</h3>
          <p className="mt-2 text-sm text-slate-400">Detection logic is driven by backend threat records and refreshed continuously.</p>
        </div>
        <Link to="/" className="rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800">Back to company</Link>
      </div>
      <div className="mt-4 space-y-3">
        {threats.map((threat) => (
          <div key={threat.source_ip} className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm">
            <div className="flex items-center justify-between">
              <p className="font-medium text-amber-300">{threat.description}</p>
              <span className="text-slate-300">{threat.severity}</span>
            </div>
            <p className="mt-1 text-slate-300">Source {threat.source_ip} • Score {threat.score}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
