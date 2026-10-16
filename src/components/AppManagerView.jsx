import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  Trash2, 
  PowerOff, 
  Play,
  ExternalLink,
  Cpu,
  HardDrive,
  Battery
} from 'lucide-react';
import { soundFX } from '../utils/audio';

export default function AppManagerView({ device, onUninstallApp, onForceStopApp, onLaunchRealApp, showNotificationToast }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  if (!device) return null;

  const apps = device.apps || [];
  const categories = ['Semua', ...new Set(apps.map(a => a.category))];

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.package.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'Semua' || app.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleForceStop = (app) => {
    soundFX.playClick();
    if (onForceStopApp) onForceStopApp(app.id);
    if (showNotificationToast) {
      showNotificationToast(`Aplikasi "${app.name}" berhasil dihentikan paksa (Force-Stopped)`, "warning");
    }
  };

  const handleUninstall = (app) => {
    soundFX.playLockSound();
    if (onUninstallApp) onUninstallApp(app.id);
    if (showNotificationToast) {
      showNotificationToast(`Aplikasi "${app.name}" berhasil dicopot (Uninstalled)`, "error");
    }
  };

  const handleLaunch = (app) => {
    soundFX.playNotification();
    if (onLaunchRealApp && app.package) {
      onLaunchRealApp(app.package);
    }
    if (showNotificationToast) {
      showNotificationToast(`Membuka aplikasi "${app.name}" di HP`, "success");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Filter and Search Bar */}
      <div className="glass-card" style={{ padding: '18px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1', minWidth: '240px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Cari nama aplikasi atau package (cth: com.whatsapp)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  width: '100%', 
                  background: 'rgba(0,0,0,0.3)', 
                  border: '1px solid var(--border-light)', 
                  borderRadius: 'var(--radius-md)', 
                  padding: '9px 12px 9px 36px', 
                  color: '#fff', 
                  fontSize: '0.84rem' 
                }} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  soundFX.playClick();
                  setSelectedCategory(cat);
                }}
                className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.76rem', padding: '6px 12px' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Installed Applications Table */}
      <div className="glass-card">
        <div className="card-header-row">
          <div>
            <div className="card-title">
              <Layers size={18} style={{ color: 'var(--accent-indigo)' }} />
              <span>Daftar Aplikasi Terpasang ({filteredApps.length} Aplikasi)</span>
            </div>
            <div className="card-subtitle">Penggunaan sumber daya dan izin runtime per aplikasi</div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="modern-table">
            <thead>
              <tr>
                <th>Aplikasi & Package</th>
                <th>Kategori & Versi</th>
                <th>Memori RAM</th>
                <th>Ukuran Disk</th>
                <th>Beban Baterai</th>
                <th>Izin Runtime Sensitif</th>
                <th>Aksi Remote MDM</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app) => (
                <tr key={app.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ 
                        width: '36px', 
                        height: '36px', 
                        borderRadius: 'var(--radius-md)', 
                        background: app.safe ? 'rgba(99, 102, 241, 0.15)' : 'rgba(239, 68, 68, 0.2)',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: app.safe ? 'var(--accent-indigo)' : 'var(--accent-rose)'
                      }}>
                        {app.safe ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>{app.name}</span>
                          {!app.safe && (
                            <span className="pill pill-rose" style={{ fontSize: '0.65rem' }}>Mencurigakan</span>
                          )}
                          {app.status === 'protected' && (
                            <span className="pill pill-indigo" style={{ fontSize: '0.65rem' }}>Protected MDM</span>
                          )}
                          {app.status === 'sleeping' && (
                            <span className="pill pill-dark" style={{ fontSize: '0.65rem' }}>Tidur (Stopped)</span>
                          )}
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          {app.package}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div style={{ fontSize: '0.8rem', color: '#fff' }}>{app.category}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>v{app.version}</div>
                  </td>

                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#fff' }}>
                    {app.memory}
                  </td>

                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {app.size}
                  </td>

                  <td>
                    <span className={`pill ${parseInt(app.battery) > 20 ? 'pill-rose' : 'pill-dark'}`}>
                      {app.battery}
                    </span>
                  </td>

                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '240px' }}>
                      {app.permissions.map((perm, i) => (
                        <span key={i} className="pill pill-dark" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                          {perm}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button 
                        className="btn-icon-sm" 
                        onClick={() => handleLaunch(app)}
                        title="Buka Aplikasi di HP (Launch)"
                      >
                        <Play size={14} style={{ color: 'var(--accent-emerald)' }} />
                      </button>

                      <button 
                        className="btn-icon-sm" 
                        onClick={() => handleForceStop(app)} 
                        title="Paksa Berhenti (Force Stop)"
                        disabled={app.status === 'protected'}
                      >
                        <PowerOff size={14} style={{ color: 'var(--accent-amber)' }} />
                      </button>

                      <button 
                        className="btn-icon-sm" 
                        onClick={() => handleUninstall(app)} 
                        title="Copot Pemasangan (Uninstall Remote)"
                        disabled={app.status === 'protected'}
                      >
                        <Trash2 size={14} style={{ color: 'var(--accent-rose)' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
