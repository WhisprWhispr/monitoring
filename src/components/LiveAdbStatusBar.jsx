import React, { useState } from 'react';
import { 
  Usb, 
  Wifi, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Smartphone, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { soundFX } from '../utils/audio';

export default function LiveAdbStatusBar({ 
  adbStatus, 
  realDevicesCount, 
  onRefreshAdb, 
  onConnectWifi,
  onOpenWebSensor
}) {
  const [wifiIp, setWifiIp] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectMsg, setConnectMsg] = useState(null);

  const handleWifiSubmit = async (e) => {
    e.preventDefault();
    if (!wifiIp.trim()) return;

    soundFX.playClick();
    setIsConnecting(true);
    setConnectMsg(null);

    try {
      const res = await onConnectWifi(wifiIp.trim());
      if (res?.success) {
        soundFX.playNotification();
        setConnectMsg({ type: 'success', text: `Berhasil terhubung ke ${wifiIp}!` });
        setWifiIp('');
      } else {
        soundFX.playBeep(220, 0.2, 'sawtooth');
        setConnectMsg({ type: 'error', text: res?.output || 'Gagal koneksi. Pastikan port 5555 terbuka di HP.' });
      }
    } catch (err) {
      setConnectMsg({ type: 'error', text: 'Gagal menghubungi server ADB backend.' });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="glass-card" style={{ 
      padding: '16px 22px', 
      background: realDevicesCount > 0 
        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(15, 23, 42, 0.9) 100%)' 
        : 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(15, 23, 42, 0.85) 100%)',
      borderColor: realDevicesCount > 0 ? 'rgba(16, 185, 129, 0.35)' : 'rgba(6, 182, 212, 0.25)',
      boxShadow: realDevicesCount > 0 ? '0 0 25px rgba(16, 185, 129, 0.15)' : 'none'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        
        {/* Left: Real-time Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ 
            width: '42px', 
            height: '42px', 
            borderRadius: 'var(--radius-md)', 
            background: realDevicesCount > 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(6, 182, 212, 0.15)',
            color: realDevicesCount > 0 ? 'var(--accent-emerald)' : 'var(--accent-cyan)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <Usb size={22} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="pulse-dot" style={{ background: realDevicesCount > 0 ? 'var(--accent-emerald)' : 'var(--accent-cyan)' }} />
              <strong style={{ color: '#fff', fontSize: '0.98rem' }}>
                {realDevicesCount > 0 
                  ? `🔥 TERHUBUNG: ${realDevicesCount} Perangkat Android Fisik (Live Telemetry)` 
                  : 'Backend ADB Bridge Siap: Menunggu HP Terhubung (USB / Wi-Fi)'}
              </strong>
            </div>

            <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Path ADB: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>{adbStatus?.adbPath || 'D:\\sdk\\platform-tools\\adb.exe'}</span> • Status Port: <strong>5001 Aktif</strong>
            </div>
          </div>
        </div>

        {/* Right: Quick Wi-Fi connect & USB Scan */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Integrated Wi-Fi Input Capsule */}
          <form onSubmit={handleWifiSubmit} className="wifi-input-group">
            <div className="wifi-input-icon">
              <Wifi size={15} />
            </div>
            <input 
              type="text" 
              placeholder="IP HP (cth: 192.168.1.15:5555)"
              value={wifiIp}
              onChange={(e) => setWifiIp(e.target.value)}
              className="wifi-input-field"
            />
            <button 
              type="submit" 
              className="wifi-submit-btn"
              disabled={isConnecting}
              title="Koneksikan ADB via Jaringan Wi-Fi"
            >
              <span>{isConnecting ? 'Menghubungkan...' : 'Koneksikan Wi-Fi'}</span>
            </button>
          </form>

          {/* Re-scan USB Button */}
          <button 
            type="button"
            className="btn btn-primary" 
            onClick={() => {
              soundFX.playClick();
              onRefreshAdb();
            }}
            title="Pindai ulang koneksi perangkat USB ADB fisik"
          >
            <RefreshCw size={15} />
            <span>Pindai Ulang USB</span>
          </button>

          {/* Web Sensor Agent (No Debugging) Button */}
          <button 
            type="button"
            className="btn btn-emerald" 
            onClick={() => {
              soundFX.playClick();
              if (onOpenWebSensor) onOpenWebSensor();
            }}
            title="Hubungkan HP langsung lewat browser tanpa perlu mengaktifkan mode pengembang / USB debugging"
          >
            <Radio size={15} />
            <span>📡 Sambung Tanpa Debugging</span>
          </button>
        </div>
      </div>

      {/* Connection Notification Message */}
      {connectMsg && (
        <div style={{ 
          marginTop: '10px', 
          padding: '8px 12px', 
          borderRadius: 'var(--radius-sm)', 
          background: connectMsg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          color: connectMsg.type === 'success' ? 'var(--accent-emerald)' : 'var(--accent-rose)',
          fontSize: '0.76rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {connectMsg.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
          <span>{connectMsg.text}</span>
        </div>
      )}

      {/* How to connect hint if no device connected yet */}
      {realDevicesCount === 0 && (
        <div style={{ 
          marginTop: '12px', 
          padding: '10px 14px', 
          background: 'rgba(255, 255, 255, 0.02)', 
          border: '1px dashed var(--border-subtle)', 
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          fontSize: '0.76rem'
        }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            💡 <strong>Ingin data real-time dari HP Anda?</strong> Colokkan kabel USB ke HP &gt; Aktifkan <strong>USB Debugging</strong> di Pengaturan Pengembang &gt; Klik <strong>"Izinkan"</strong> pada layar HP Anda.
          </span>
          <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
            Dashboard akan otomatis mendeteksi nama perangkat, RAM, memori &amp; baterai asli Anda!
          </span>
        </div>
      )}
    </div>
  );
}
