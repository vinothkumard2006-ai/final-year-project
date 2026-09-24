import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const LiveDataContext = createContext(null);

export function LiveDataProvider({ children }) {
  const [snapshot, setSnapshot] = useState({
    dashboard: {
      network_health: 94,
      active_devices: 3,
      active_threats: 2,
      bandwidth_usage: 1280,
      risk_score: 65.7,
    },
    company: {
      company_name: 'Northstar Labs',
      industry: 'Fintech Infrastructure & Cybersecurity',
      location: 'Austin, Texas',
      coverage: '24/7 Global Edge Network',
      uptime: '99.98% uptime',
      alerts: 7,
      status: 'Monitoring healthy',
      network_health: 94,
      active_devices: 3,
      active_threats: 2,
      risk_score: 65.7,
    },
    alerts: [],
    incidents: [],
    threats: [],
    flows: [],
    devices: [],
    lastUpdated: new Date().toLocaleTimeString(),
  });

  useEffect(() => {
    let active = true;
    let ws;

    const load = async () => {
      try {
        const [dashboardRes, companyRes, alertsRes, incidentsRes, threatsRes, flowsRes, devicesRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/dashboard'),
          axios.get('http://127.0.0.1:8000/api/company'),
          axios.get('http://127.0.0.1:8000/api/alerts'),
          axios.get('http://127.0.0.1:8000/api/incidents'),
          axios.get('http://127.0.0.1:8000/api/threats'),
          axios.get('http://127.0.0.1:8000/api/flows'),
          axios.get('http://127.0.0.1:8000/api/devices'),
        ]);

        if (!active) return;

        setSnapshot({
          dashboard: dashboardRes.data,
          company: companyRes.data,
          alerts: alertsRes.data,
          incidents: incidentsRes.data,
          threats: threatsRes.data,
          flows: flowsRes.data,
          devices: devicesRes.data,
          lastUpdated: new Date().toLocaleTimeString(),
        });
      } catch {
        if (active) {
          setSnapshot((current) => ({ ...current, lastUpdated: new Date().toLocaleTimeString() }));
        }
      }
    };
    load();
    const interval = setInterval(load, 4000);

    // open websocket for live updates
    try {
      ws = new WebSocket('ws://127.0.0.1:8000/api/ws/live');
      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          if (msg.type === 'flow') {
            setSnapshot((cur) => ({
              ...cur,
              flows: [msg.flow, ...(cur.flows || [])].slice(0, 50),
              lastUpdated: new Date().toLocaleTimeString(),
            }));
          } else if (msg.type === 'device_added') {
            setSnapshot((cur) => ({
              ...cur,
              devices: [msg.device, ...(cur.devices || [])],
              lastUpdated: new Date().toLocaleTimeString(),
            }));
          } else if (msg.type === 'alert') {
            setSnapshot((cur) => ({
              ...cur,
              alerts: [msg.alert, ...(cur.alerts || [])].slice(0, 50),
              company: {
                ...cur.company,
                alerts: (cur.company?.alerts || 0) + 1,
              },
              lastUpdated: new Date().toLocaleTimeString(),
            }));
          } else if (msg.type === 'incident') {
            setSnapshot((cur) => ({
              ...cur,
              incidents: [msg.incident, ...(cur.incidents || [])].slice(0, 50),
              lastUpdated: new Date().toLocaleTimeString(),
            }));
          } else if (msg.type === 'threat') {
            setSnapshot((cur) => ({
              ...cur,
              threats: [msg.threat, ...(cur.threats || [])].slice(0, 50),
              dashboard: {
                ...cur.dashboard,
                active_threats: (cur.dashboard?.active_threats || 0) + 1,
              },
              company: {
                ...cur.company,
                active_threats: (cur.company?.active_threats || 0) + 1,
              },
              lastUpdated: new Date().toLocaleTimeString(),
            }));
          }
        } catch (e) {
          // ignore
        }
      };
      ws.onclose = () => {
        ws = null;
      };
    } catch (e) {
      // ignore websocket errors in dev
    }
    return () => {
      active = false;
      clearInterval(interval);
      if (ws) try { ws.close(); } catch (e) {}
    };
  }, []);

  const value = useMemo(() => snapshot, [snapshot]);

  return <LiveDataContext.Provider value={value}>{children}</LiveDataContext.Provider>;
}

export function useLiveData() {
  return useContext(LiveDataContext);
}
