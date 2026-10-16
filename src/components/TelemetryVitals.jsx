import React, { useState, useEffect } from 'react';
import { 
  Battery, 
  BatteryCharging, 
  Cpu, 
  HardDrive, 
  Database, 
  Wifi, 
  Radio, 
  Thermometer, 
  Zap, 
  ArrowDownUp,
  Activity,
  Monitor
} from 'lucide-react';

export default function TelemetryVitals({ device }) {
  if (!device) return null;

  const battery = device.battery || { level: 80, isCharging: false, temperature: 30, health: 'Good', voltage: 4000, chargeType: 'Discharging' };
  const hardware = device.hardware || { cpuLoad: 25, cpuCores: 8, cpuChipset: 'Processor', ramTotal: 8, ramUsed: 4, storageTotal: 128, storageUsed: 64, cpuTemp: 35 };
  const connectivity = device.connectivity || { downloadSpeed: 45, uploadSpeed: 15, wifiSsid: 'Wi-Fi', ipAddress: '192.168.1.1' };

  // Real-time simulated micro-oscillations for live telemetry chart
  const [cpuHistory, setCpuHistory] = useState([28, 32, 30, 35, 34, 38, 31, hardware.cpuLoad || 25]);
  const [downloadThroughput, setDownloadThroughput] = useState(connectivity.downloadSpeed || 45);
  const [uploadThroughput, setUploadThroughput] = useState(connectivity.uploadSpeed || 15);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuate CPU slightly to feel genuinely alive
      setCpuHistory(prev => {
        const last = prev[prev.length - 1];
        const next = Math.max(10, Math.min(95, last + (Math.floor(Math.random() * 9) - 4)));
        return [...prev.slice(1), next];
      });

      // Fluctuate bandwidth
      setDownloadThroughput(prev => +(Math.max(1.0, prev + (Math.random() * 4 - 2)).toFixed(1)));
      setUploadThroughput(prev => +(Math.max(0.5, prev + (Math.random() * 2 - 1)).toFixed(1)));
    }, 2000);

    return () => clearInterval(interval);
  }, [hardware.cpuLoad]);

  const currentCpu = cpuHistory[cpuHistory.length - 1];
  const ramPercent = Math.round((hardware.ramUsed / hardware.ramTotal) * 100);
  const storagePercent = Math.round((hardware.storageUsed / hardware.storageTotal) * 100);

  // SVG sparkline path calculation
  const sparkWidth = 140;
  const sparkHeight = 36;
  const minVal = 0;
  const maxVal = 100;
  const points = cpuHistory.map((val, idx) => {
    const x = (idx / (cpuHistory.length - 1)) * sparkWidth;
    const y = sparkHeight - ((val - minVal) / (maxVal - minVal)) * sparkHeight;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="telemetry-grid">
      {/* 1. BATTERY VITAL */}
      <div className="vital-card">
        <div className="vital-top">
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            STATUS BATERAI
          </span>
          <div 
            className="vital-icon-box" 
            style={{ 
              background: battery.level <= 20 
                ? 'rgba(244, 63, 94, 0.15)' 
                : battery.isCharging 
                ? 'rgba(16, 185, 129, 0.15)' 
                : 'rgba(99, 102, 241, 0.15)',
              color: battery.level <= 20 
                ? 'var(--accent-rose)' 
                : battery.isCharging 
                ? 'var(--accent-emerald)' 
                : 'var(--accent-indigo)'
            }}
          >
            {battery.isCharging ? <BatteryCharging size={20} /> : <Battery size={20} />}
          </div>
        </div>

        <div className="vital-value-row">
          <span className="vital-large-val" style={{ color: battery.level <= 20 ? 'var(--accent-rose)' : '#fff' }}>
            {battery.level}%
          </span>
          <span className="vital-unit">
            {battery.isCharging ? 'Mengisi Daya' : battery.chargeType}
          </span>
        </div>

        <div className="vital-progress-bg">
          <div 
            className="vital-progress-bar"
            style={{ 
              width: `${battery.level}%`,
              background: battery.level <= 20 
                ? 'linear-gradient(90deg, #ef4444, #f43f5e)' 
                : battery.isCharging 
                ? 'linear-gradient(90deg, #10b981, #34d399)' 
                : 'linear-gradient(90deg, #6366f1, #38bdf8)'
            }}
          />
        </div>

        <div className="vital-footer">
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Thermometer size={12} /> {battery.temperature}°C ({battery.temperature > 40 ? '⚠️ Panas' : 'Normal'})
          </span>
          <span>{battery.voltage}V • {battery.cycles} Siklus</span>
        </div>
      </div>

      {/* 2. CPU LOAD & CHIPSET */}
      <div className="vital-card">
        <div className="vital-top">
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            PROSESOR & BEBAN CPU
          </span>
          <div className="vital-icon-box" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
            <Cpu size={20} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="vital-value-row">
            <span className="vital-large-val">{currentCpu}%</span>
            <span className="vital-unit">{hardware.cpuCores} Cores</span>
          </div>

          {/* Mini Live Sparkline */}
          <div style={{ width: sparkWidth, height: sparkHeight }}>
            <svg width={sparkWidth} height={sparkHeight} style={{ overflow: 'visible' }}>
              <defs>
                <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <polyline
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
            </svg>
          </div>
        </div>

        <div className="vital-progress-bg">
          <div 
            className="vital-progress-bar"
            style={{ 
              width: `${currentCpu}%`,
              background: currentCpu > 80 
                ? 'linear-gradient(90deg, #f59e0b, #ef4444)' 
                : 'linear-gradient(90deg, #06b6d4, #3b82f6)'
            }}
          />
        </div>

        <div className="vital-footer">
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '170px' }}>
            {hardware.cpuChipset}
          </span>
          <span>Suhu Inti {hardware.cpuTemp}°C</span>
        </div>
      </div>

      {/* 3. RAM MEMORY */}
      <div className="vital-card">
        <div className="vital-top">
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            MEMORI RAM
          </span>
          <div className="vital-icon-box" style={{ background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-violet)' }}>
            <Database size={20} />
          </div>
        </div>

        <div className="vital-value-row">
          <span className="vital-large-val">{hardware.ramUsed}</span>
          <span className="vital-unit">/ {hardware.ramTotal} GB ({ramPercent}%)</span>
        </div>

        <div className="vital-progress-bg">
          <div 
            className="vital-progress-bar"
            style={{ 
              width: `${ramPercent}%`,
              background: ramPercent > 85 
                ? 'linear-gradient(90deg, #f59e0b, #ef4444)' 
                : 'linear-gradient(90deg, #8b5cf6, #c084fc)'
            }}
          />
        </div>

        <div className="vital-footer">
          <span>Tersedia: {(hardware.ramTotal - hardware.ramUsed).toFixed(1)} GB</span>
          <span>LPDDR5X Ultra-Fast</span>
        </div>
      </div>

      {/* 4. INTERNAL STORAGE */}
      <div className="vital-card">
        <div className="vital-top">
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            PENYIMPANAN INTERNAL
          </span>
          <div className="vital-icon-box" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)' }}>
            <HardDrive size={20} />
          </div>
        </div>

        <div className="vital-value-row">
          <span className="vital-large-val">{hardware.storageUsed}</span>
          <span className="vital-unit">/ {hardware.storageTotal} GB ({storagePercent}%)</span>
        </div>

        <div className="vital-progress-bg">
          <div 
            className="vital-progress-bar"
            style={{ 
              width: `${storagePercent}%`,
              background: storagePercent > 90 
                ? 'linear-gradient(90deg, #ef4444, #dc2626)' 
                : 'linear-gradient(90deg, #f59e0b, #fbbf24)'
            }}
          />
        </div>

        <div className="vital-footer">
          <span>Aplikasi {hardware.storageApps}GB • Media {hardware.storageMedia}GB</span>
          <span>Bebas {(hardware.storageTotal - hardware.storageUsed).toFixed(1)} GB</span>
        </div>
      </div>

      {/* 5. NETWORK CONNECTIVITY */}
      <div className="vital-card">
        <div className="vital-top">
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            JARINGAN & THROUGHPUT
          </span>
          <div className="vital-icon-box" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
            <Wifi size={20} />
          </div>
        </div>

        <div className="vital-value-row">
          <span className="vital-large-val" style={{ fontSize: '1.45rem' }}>
            {connectivity.wifiSsid}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}>
            <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>↓ {downloadThroughput}</span>
            <span style={{ color: 'var(--text-muted)' }}>Mbps</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}>
            <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>↑ {uploadThroughput}</span>
            <span style={{ color: 'var(--text-muted)' }}>Mbps</span>
          </div>
          <span className="pill pill-indigo" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
            {connectivity.cellularType}
          </span>
        </div>

        <div className="vital-footer">
          <span>IP: <strong style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>{connectivity.ipAddress}</strong></span>
          <span>Sinyal {connectivity.wifiSignal} dBm</span>
        </div>
      </div>

      {/* 6. DISPLAY & SENSOR STATE */}
      <div className="vital-card">
        <div className="vital-top">
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            TAMPILAN & HARDWARE
          </span>
          <div className="vital-icon-box" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-indigo)' }}>
            <Monitor size={20} />
          </div>
        </div>

        <div className="vital-value-row">
          <span className="vital-large-val" style={{ fontSize: '1.45rem' }}>
            {device.screenOn ? 'Layar AKTIF' : 'Layar SIAGA'}
          </span>
          <span className="vital-unit">{device.screenBrightness}% Kecerahan</span>
        </div>

        <div className="vital-progress-bg">
          <div 
            className="vital-progress-bar"
            style={{ 
              width: `${device.screenBrightness}%`,
              background: 'linear-gradient(90deg, #6366f1, #a855f7)'
            }}
          />
        </div>

        <div className="vital-footer">
          <span>Bluetooth: {connectivity.bluetoothEnabled ? 'Aktif' : 'Mati'}</span>
          <span>VPN MDM: {connectivity.vpnActive ? 'Terenkripsi' : 'Mati'}</span>
        </div>
      </div>
    </div>
  );
}
