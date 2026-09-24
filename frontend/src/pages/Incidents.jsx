import { Link } from 'react-router-dom';
import { useLiveData } from '../context/LiveDataContext';

export default function Incidents() {
  const liveData = useLiveData();
  const incidents = liveData?.incidents || [];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Incidents</h3>
        <Link to="/" className="rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800">Back to company</Link>
      </div>
      <table className="mt-4 w-full text-sm">
        <thead className="text-left text-slate-400">
          <tr>
            <th className="py-2">ID</th>
            <th className="py-2">Type</th>
            <th className="py-2">Severity</th>
            <th className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident) => (
            <tr key={incident.id} className="border-t border-slate-800">
              <td className="py-2">{incident.id}</td>
              <td className="py-2">{incident.title}</td>
              <td className="py-2">{incident.severity}</td>
              <td className={`py-2 ${incident.status === 'OPEN' ? 'text-orange-300' : 'text-teal-300'}`}>{incident.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
