import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import { useLiveData } from '../context/LiveDataContext';

export default function Topology() {
  const liveData = useLiveData();
  const devices = liveData?.devices || [];

  const nodes = useMemo(() => devices.map((device, index) => ({
    id: String(device.id),
    position: { x: 120 + (index % 2) * 260, y: 80 + Math.floor(index / 2) * 180 },
    data: { label: `${device.ip}\n${device.status}` },
    style: {
      background: device.status === 'ALERT' ? '#7f1d1d' : '#0f172a',
      color: '#fff',
      border: device.status === 'ALERT' ? '1px solid #f87171' : '1px solid #22d3ee',
      padding: 8,
      minWidth: 150,
      borderRadius: 10,
    },
  })), [devices]);

  const edges = useMemo(() => devices.slice(1).map((device, index) => ({
    id: `e${index + 1}`,
    source: String(devices[0].id),
    target: String(device.id),
  })), [devices]);

  return (
    <div className="h-[70vh] rounded-2xl border border-slate-800 bg-slate-900/80 p-2">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
