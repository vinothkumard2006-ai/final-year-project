import { useState } from 'react';

const reportData = [
  { title: 'Executive Summary', type: 'PDF', size: '1.2 MB' },
  { title: 'Threat Trend Report', type: 'CSV', size: '320 KB' },
  { title: 'Incident Timeline', type: 'JSON', size: '180 KB' },
];

export default function Reports() {
  const [status, setStatus] = useState('Ready');

  const download = (item) => {
    const blob = new Blob([`Report: ${item.title}\nType: ${item.type}\nGenerated: ${new Date().toISOString()}`], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.title.toLowerCase().replace(/\s+/g, '_')}.${item.type.toLowerCase()}`;
    link.click();
    URL.revokeObjectURL(url);
    setStatus(`Downloaded ${item.title}`);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Reports</h3>
          <p className="mt-1 text-sm text-slate-400">Export incident, analytics, and security posture summaries.</p>
        </div>
        <div className="rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-sm text-teal-300">{status}</div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {reportData.map((item) => (
          <div key={item.title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="font-medium">{item.title}</p>
            <p className="mt-1 text-sm text-slate-400">{item.type} • {item.size}</p>
            <button onClick={() => download(item)} className="mt-3 rounded-lg bg-teal-600 px-3 py-2 text-sm text-white">Download</button>
          </div>
        ))}
      </div>
    </div>
  );
}
