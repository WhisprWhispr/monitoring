import React from 'react';
import { X, Printer, Download, FileText, CheckCircle2, ShieldCheck, Smartphone } from 'lucide-react';
import { soundFX } from '../utils/audio';

export default function ExportReportModal({ device, onClose }) {
  if (!device) return null;

  const handlePrint = () => {
    soundFX.playClick();
    window.print();
  };

  const handleDownloadJson = () => {
    soundFX.playClick();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(device, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `droidpulse_audit_${device.id}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '750px', padding: '28px' }}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Tutup">
          <X size={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="vital-icon-box" style={{ background: 'rgba(99, 102, 241, 0.2)', color: 'var(--accent-indigo)' }}>
              <FileText size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                Laporan Audit Diagnostik & Kepatuhan MDM
              </h2>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Dihasilkan oleh DroidPulse Enterprise Sentinel • {new Date().toLocaleString('id-ID')}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={handleDownloadJson} title="Unduh format JSON mentah">
              <Download size={15} />
              <span>Unduh JSON</span>
            </button>
            <button className="btn btn-primary" onClick={handlePrint}>
              <Printer size={15} />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>
        </div>

        {/* Printable Document Preview */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.02)', 
          border: '1px solid var(--border-light)', 
          borderRadius: 'var(--radius-md)', 
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}>
          {/* Identity Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Nama & Model Perangkat</div>
              <strong style={{ color: '#fff', fontSize: '1.05rem' }}>{device.name}</strong>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Model: {device.model} ({device.brand})</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Pengguna: {device.assignedUser}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Identitas Hardware</div>
              <div style={{ color: '#fff', fontSize: '0.84rem' }}>IMEI: <span style={{ fontFamily: 'var(--font-mono)' }}>{device.imei}</span></div>
              <div style={{ color: '#fff', fontSize: '0.84rem' }}>Serial: <span style={{ fontFamily: 'var(--font-mono)' }}>{device.serialNumber}</span></div>
              <div style={{ color: '#fff', fontSize: '0.84rem' }}>OS: <strong>{device.os}</strong> ({device.securityPatch})</div>
            </div>
          </div>

          {/* Telemetry Summary */}
          <div>
            <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--accent-indigo)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Ringkasan Telemetri Hardware & Sensor
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Baterai</div>
                <strong style={{ color: '#fff' }}>{device.battery?.level ?? 80}%</strong>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{device.battery?.temperature ?? 30}°C • {device.battery?.health ?? 'Normal'}</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Beban CPU</div>
                <strong style={{ color: '#fff' }}>{device.hardware?.cpuLoad ?? 20}%</strong>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{device.hardware?.cpuCores ?? 8} Cores</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>RAM Digunakan</div>
                <strong style={{ color: '#fff' }}>{device.hardware?.ramUsed ?? 4} / {device.hardware?.ramTotal ?? 8} GB</strong>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Penyimpanan</div>
                <strong style={{ color: '#fff' }}>{device.hardware?.storageUsed ?? 40} / {device.hardware?.storageTotal ?? 128} GB</strong>
              </div>
            </div>
          </div>

          {/* Geolocation Audit */}
          <div>
            <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Posisi Geografis & Geofencing
            </h4>
            <div style={{ fontSize: '0.82rem', color: '#fff' }}>
              Lokasi: {device.location.address}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              Lat: {device.location.lat}, Lng: {device.location.lng} • Akurasi: {device.location.accuracy}m • Geofence: {device.location.geofenceName} ({device.location.geofenceStatus.toUpperCase()})
            </div>
          </div>

          {/* Security Compliance */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--accent-emerald)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Kepatuhan Keamanan Enterprise
                </h4>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Root Status: {device.security.rooted ? "TERDETEKSI (TIDAK LULUS)" : "NON-ROOT (LULUS)"} • SELinux: {device.security.selinuxStatus} • Enkripsi: {device.security.encryption}
                </div>
              </div>
              <div className="pill pill-emerald" style={{ fontSize: '0.85rem' }}>
                <ShieldCheck size={14} /> Skor: {device.security.score}/100 ({device.security.grade})
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
