export default function Settings() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
      <h3 className="text-lg font-semibold">Settings</h3>
      <div className="mt-4 space-y-3 text-sm">
        <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">Retention: raw metadata retained for 2 days.</div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">Aggregation: minute-level summaries kept for 14 days.</div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">Demo mode active with generated traffic.</div>
      </div>
    </div>
  );
}
