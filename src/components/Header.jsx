import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Volume2, 
  VolumeX, 
  Smartphone, 
  FileDown, 
  PlusCircle, 
  Clock, 
  Wifi, 
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';
import { soundFX } from '../utils/audio';

export default function Header({ 
  devices, 
  selectedDeviceId, 
  onSelectDevice, 
  toggleSidebar, 
  onOpenSimulator, 
  onOpenReport, 
  onOpenAddDevice 
}) {
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB'
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleSound = () => {
    const nextState = !muted;
    setMuted(nextState);
    soundFX.setMuted(nextState);
    if (!nextState) soundFX.playBeep(880, 0.08);
  };

  const onlineCount = devices.filter(d => d.status === 'online').length;
  const alertCount = devices.filter(d => d.status === 'alert' || (d.battery && d.battery.level < 20)).length;

  return (
    <header className="top-header">
      {/* Left: Mobile Toggle & Device Selector */}
      <div className="header-left">
        <button 
          className="menu-toggle-btn" 
          onClick={toggleSidebar}
          aria-label="Buka Menu"
        >
          <Menu size={20} />
        </button>

        <div className="device-select-wrapper">
          <Smartphone size={20} style={{ color: 'var(--accent-indigo)' }} />
          <div className="device-select-box">
            <span className="device-select-label">Perangkat Aktif</span>
            <select 
              id="select-device"
              value={selectedDeviceId} 
              onChange={(e) => {
                soundFX.playClick();
                onSelectDevice(e.target.value);
              }}
              className="device-dropdown"
            >
              {devices.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} {d.status === 'alert' ? '⚠️ (Alert)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Center: Fleet Metrics */}
      <div className="header-center-stats">
        <div className="stat-chip">
          <CheckCircle2 size={14} style={{ color: 'var(--accent-emerald)' }} />
          <span>{onlineCount} Online</span>
        </div>
        {alertCount > 0 && (
          <div className="stat-chip" style={{ borderColor: 'rgba(244, 63, 94, 0.4)', background: 'rgba(244, 63, 94, 0.08)' }}>
            <ShieldAlert size={14} style={{ color: 'var(--accent-rose)' }} />
            <span style={{ color: 'var(--accent-rose)' }}>{alertCount} Butuh Perhatian</span>
          </div>
        )}
        <div className="stat-chip stat-chip-time">
          <Clock size={14} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontFamily: 'var(--font-mono)' }}>{currentTime}</span>
        </div>
      </div>

      {/* Right: Quick Tools */}
      <div className="header-actions">
        <button 
          id="btn-toggle-sound"
          className="btn-icon-only" 
          onClick={toggleSound}
          title={muted ? "Nyalakan Suara Feedback" : "Bisukan Suara"}
        >
          {muted ? <VolumeX size={18} style={{ color: 'var(--accent-rose)' }} /> : <Volume2 size={18} />}
        </button>

        <button 
          id="btn-open-simulator"
          className="btn btn-secondary" 
          onClick={() => {
            soundFX.playClick();
            onOpenSimulator();
          }}
          title="Buka Layar Virtual Smartphone"
        >
          <Smartphone size={15} />
          <span className="hide-mobile">Virtual Phone</span>
        </button>

        <button 
          id="btn-open-report"
          className="btn btn-secondary" 
          onClick={() => {
            soundFX.playClick();
            onOpenReport();
          }}
          title="Ekspor Laporan Audit MDM"
        >
          <FileDown size={15} />
          <span className="hide-mobile">Ekspor</span>
        </button>

        <button 
          id="btn-add-device"
          className="btn btn-primary" 
          onClick={() => {
            soundFX.playClick();
            onOpenAddDevice();
          }}
          title="Daftarkan Perangkat Baru via QR / Barcode"
        >
          <PlusCircle size={15} />
          <span>+ Device</span>
        </button>
      </div>
    </header>
  );
}
