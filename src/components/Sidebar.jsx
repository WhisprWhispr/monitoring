import React from 'react';
import { 
  LayoutDashboard, 
  MapPin, 
  Terminal, 
  ShieldCheck, 
  Layers, 
  BellRing, 
  Cpu, 
  Smartphone,
  Radio,
  FileText
} from 'lucide-react';
import { soundFX } from '../utils/audio';

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen, device, onOpenSimulator, onOpenReport }) {
  const handleNavClick = (tabId) => {
    soundFX.playClick();
    setActiveTab(tabId);
    if (window.innerWidth <= 768 && setIsOpen) {
      setIsOpen(false);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard & Telemetri', icon: LayoutDashboard },
    { id: 'simulator', label: 'Virtual Phone Studio', icon: Smartphone, badge: 'LIVE' },
    { id: 'gps', label: 'Peta GPS & Geofence', icon: MapPin },
    { id: 'commands', label: 'Remote Command Center', icon: Terminal, badge: device?.controls?.isAlarmPlaying ? 'ALARM' : null },
    { id: 'security', label: 'Audit Keamanan & Knox', icon: ShieldCheck, badge: device?.security?.threatsDetected > 0 ? `${device.security.threatsDetected} Alert` : null },
    { id: 'apps', label: 'Manajemen Aplikasi', icon: Layers, count: device?.apps?.length || 0 },
    { id: 'logs', label: 'Panggilan & Notifikasi', icon: BellRing, count: device?.notifications?.length || 0 },
    { id: 'adb', label: 'ADB Bridge & Device Nyata', icon: Cpu }
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="logo-icon-box">
          <Smartphone size={22} />
        </div>
        <div>
          <div className="logo-text">DroidPulse</div>
          <span className="logo-sub">Enterprise Sentinel</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        <div className="nav-section-title">Pemantauan Armada</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              id={`nav-tab-${item.id}`}
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} className="nav-icon" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="nav-badge badge-alert">{item.badge}</span>
              )}
              {item.count !== undefined && !item.badge && (
                <span className="nav-badge badge-count">{item.count}</span>
              )}
            </button>
          );
        })}

        <div className="nav-section-title" style={{ marginTop: '12px' }}>Aksi Cepat</div>
        <button 
          id="sidebar-simulator-btn"
          className="nav-item"
          onClick={() => {
            soundFX.playClick();
            onOpenSimulator();
          }}
          style={{ color: 'var(--accent-cyan)' }}
        >
          <Smartphone size={18} />
          <span>Virtual Phone Simulator</span>
        </button>

        <button 
          id="sidebar-report-btn"
          className="nav-item"
          onClick={() => {
            soundFX.playClick();
            onOpenReport();
          }}
          style={{ color: 'var(--accent-indigo)' }}
        >
          <FileText size={18} />
          <span>Cetak Audit Report</span>
        </button>
      </nav>

      {/* Footer System Status */}
      <div className="sidebar-footer">
        <div className="system-status-box">
          <div className="status-row">
            <span style={{ display: 'flex', alignContent: 'center', alignItems: 'center' }}>
              <span className="pulse-dot"></span>
              <strong style={{ color: '#fff' }}>MDM Gateway</strong>
            </span>
            <span style={{ color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>Online</span>
          </div>
          <div className="status-row" style={{ color: 'var(--text-muted)' }}>
            <span>Latensi Sync</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>18ms</span>
          </div>
          <div className="status-row" style={{ color: 'var(--text-muted)' }}>
            <span>Protokol Enkripsi</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>TLS 1.3 / FBE</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
