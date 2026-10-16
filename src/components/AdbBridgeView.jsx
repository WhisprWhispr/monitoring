import React, { useState } from 'react';
import { 
  Cpu, 
  Terminal, 
  Copy, 
  Check, 
  Usb, 
  Wifi, 
  Download, 
  ExternalLink,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { soundFX } from '../utils/audio';

export default function AdbBridgeView({ onImportAdbDevice }) {
  const [copied, setCopied] = useState(false);
  const [imported, setImported] = useState(false);

  const pythonScript = `python public/bridge_agent.py`;

  const handleCopy = () => {
    soundFX.playClick();
    navigator.clipboard.writeText(pythonScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateAdbConnect = () => {
    soundFX.playNotification();
    setImported(true);
    if (onImportAdbDevice) {
      onImportAdbDevice();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Hero Card */}
      <div className="glass-card" style={{ 
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(15, 23, 42, 0.8) 100%)',
        border: '1px solid rgba(6, 182, 212, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="vital-icon-box" style={{ width: '56px', height: '56px', background: 'rgba(6, 182, 212, 0.2)', color: 'var(--accent-cyan)' }}>
              <Usb size={28} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
                ADB Hardware Bridge (Koneksi Perangkat Fisik)
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '4px' }}>
                Hubungkan smartphone Android fisik Anda via kabel USB atau Wi-Fi untuk streaming telemetri hardware nyata.
              </p>
            </div>
          </div>

          <button 
            className="btn btn-primary"
            onClick={handleSimulateAdbConnect}
          >
            <Smartphone size={16} />
            <span>{imported ? "✓ Device Fisik Tersinkron" : "Hubungkan & Sinkronkan HP via ADB"}</span>
          </button>
        </div>
      </div>

      {/* 3 Step Integration Guide */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-indigo)', fontWeight: 700, marginBottom: '8px' }}>
            <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
            <span>Aktifkan Opsi Pengembang</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Buka <strong>Pengaturan &gt; Tentang Ponsel &gt; Informasi Perangkat Lunak</strong> di HP Android Anda. Ketuk <strong>Nomor Versi (Build Number)</strong> sebanyak 7 kali berturut-turut hingga mode developer aktif.
          </p>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '8px' }}>
            <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
            <span>Nyalakan USB Debugging</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Buka menu baru <strong>Opsi Pengembang</strong>, cari dan aktifkan <strong>Debugging USB (USB Debugging)</strong>. Colokkan kabel USB ke PC dan centang "Selalu izinkan dari komputer ini".
          </p>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-emerald)', fontWeight: 700, marginBottom: '8px' }}>
            <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
            <span>Jalankan Script Telemetri</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Jalankan script Python bawaan kami di terminal Anda untuk membaca level baterai, suhu, RAM, status jaringan, dan mengirimkannya ke dashboard ini.
          </p>
        </div>
      </div>

      {/* Terminal Command Runner Box */}
      <div className="glass-card">
        <div className="card-header-row">
          <div>
            <div className="card-title">
              <Terminal size={18} style={{ color: 'var(--accent-cyan)' }} />
              <span>Perintah Eksekusi ADB Bridge Agent</span>
            </div>
            <div className="card-subtitle">Script Python otomatis yang membaca telemetri via Android Debug Bridge</div>
          </div>

          <button className="btn btn-secondary" onClick={handleCopy} style={{ fontSize: '0.78rem' }}>
            {copied ? <Check size={14} style={{ color: 'var(--accent-emerald)' }} /> : <Copy size={14} />}
            <span>{copied ? "Tersalin!" : "Salin Perintah"}</span>
          </button>
        </div>

        <pre className="code-terminal">
          <code>
            {`# 1. Pastikan ADB terpasang di komputer\n`}
            {`adb devices\n\n`}
            {`# 2. Jalankan DroidPulse Bridge Agent\n`}
            {`python public/bridge_agent.py\n\n`}
            {`# Output otomatis membaca:\n`}
            {`# -> dumpsys battery (level, voltase, suhu kernel)\n`}
            {`# -> dumpsys meminfo (penggunaan RAM aktual)\n`}
            {`# -> ip route / netstat (IP lokal & konektivitas)`}
          </code>
        </pre>
      </div>

      {/* Direct ADB Command Reference */}
      <div className="glass-card">
        <div className="card-header-row">
          <div>
            <div className="card-title">
              <Cpu size={18} style={{ color: 'var(--accent-indigo)' }} />
              <span>Daftar Perintah Diagnostik ADB Android Native</span>
            </div>
            <div className="card-subtitle">Referensi perintah command-line untuk audit manual</div>
          </div>
        </div>

        <table className="modern-table">
          <thead>
            <tr>
              <th>Perintah Shell ADB</th>
              <th>Fungsi Telemetri</th>
              <th>Contoh Data yang Didapat</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>adb shell dumpsys battery</code></td>
              <td>Status baterai, tegangan, suhu & status pengisian daya</td>
              <td style={{ color: 'var(--text-muted)' }}>level: 84, temperature: 334, voltage: 4180</td>
            </tr>
            <tr>
              <td><code>adb shell dumpsys meminfo</code></td>
              <td>Total RAM dan pembagian memori per-proses</td>
              <td style={{ color: 'var(--text-muted)' }}>Total RAM: 11,894,228 kB, Free: 5,910,210 kB</td>
            </tr>
            <tr>
              <td><code>adb shell df -h /data</code></td>
              <td>Kapasitas penyimpanan memori internal yang terpakai</td>
              <td style={{ color: 'var(--text-muted)' }}>/data: 512G total, 198G used, 314G free</td>
            </tr>
            <tr>
              <td><code>adb shell getprop ro.product.model</code></td>
              <td>Membaca model dan nama komersial perangkat Android</td>
              <td style={{ color: 'var(--text-muted)' }}>SM-S928B, Pixel 9 Pro XL</td>
            </tr>
            <tr>
              <td><code>adb shell pm list packages -3</code></td>
              <td>Membaca daftar aplikasi pihak ketiga yang terpasang</td>
              <td style={{ color: 'var(--text-muted)' }}>package:com.whatsapp, package:com.slack</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
