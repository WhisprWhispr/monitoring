import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Key, 
  Terminal, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Smartphone, 
  Eye, 
  Camera, 
  Mic, 
  MapPin, 
  MessageSquare 
} from 'lucide-react';
import { soundFX } from '../utils/audio';

export default function SecurityAuditView({ device, showNotificationToast }) {
  if (!device) return null;

  const sec = device.security || {};
  const isHealthy = sec.score >= 85;

  const securityChecks = [
    { name: "Root / Akses Superuser (Magisk)", value: sec.rooted ? "Terdeteksi Root (Bahaya)" : "Aman (Non-Rooted)", pass: !sec.rooted, desc: "Memastikan integritas kernel OS Android tidak dimodifikasi." },
    { name: "Bootloader Lock State", value: sec.bootloaderUnlocked ? "Terbuka (Unlocked)" : "Terkunci Aman (Locked)", pass: !sec.bootloaderUnlocked, desc: "Mencegah injeksi ROM kustom atau recovery manipulasi." },
    { name: "USB Debugging (ADB Port)", value: sec.usbDebugging ? "Aktif (Perhatian)" : "Nonaktif (Sesuai Standar)", pass: !sec.usbDebugging, desc: "Mencegah akses shell fisik tidak sah melalui kabel USB." },
    { name: "Sideloading (Unknown Sources)", value: sec.unknownSources ? "Aktif (Risiko Malware)" : "Diblokir oleh MDM", pass: !sec.unknownSources, desc: "Pemasangan APK di luar Google Play Store dinonaktifkan." },
    { name: "Google Play Protect & SafetyNet", value: sec.playProtectActive ? "Aktif & Tersertifikasi" : "Nonaktif", pass: sec.playProtectActive, desc: "Pemindaian malware harian otomatis oleh Google Services." },
    { name: "Status SELinux", value: sec.selinuxStatus, pass: sec.selinuxStatus === "Enforcing", desc: "Security-Enhanced Linux mode wajib Enforcing untuk isolasi proses." },
    { name: "Enkripsi Penyimpanan", value: sec.encryption, pass: true, desc: "Enkripsi perangkat keras File-Based Encryption level militer." },
    { name: "Hardware Security Enclave", value: sec.knoxStatus, pass: true, desc: "Perlindungan kunci privat hardware terisolasi (Knox / Titan M2)." }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Security Hero Score Card */}
      <div className="glass-card" style={{ 
        background: isHealthy 
          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)' 
          : 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)',
        border: `1px solid ${isHealthy ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)'}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ 
              width: '74px', 
              height: '74px', 
              borderRadius: 'var(--radius-xl)', 
              background: isHealthy ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              border: `2px solid ${isHealthy ? '#10b981' : '#ef4444'}`,
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: `0 0 24px ${isHealthy ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
            }}>
              {isHealthy ? <ShieldCheck size={38} style={{ color: '#10b981' }} /> : <ShieldAlert size={38} style={{ color: '#ef4444' }} />}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
                  Postur Keamanan: Tingkat {sec.grade || 'A+'}
                </h2>
                <span className={`pill ${isHealthy ? 'pill-emerald' : 'pill-rose'}`} style={{ fontSize: '0.82rem' }}>
                  Skor: {sec.score} / 100
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', marginTop: '4px' }}>
                {isHealthy 
                  ? "Perangkat mematuhi seluruh standar kepatuhan regulasi Enterprise Zero Trust." 
                  : "Ditemukan beberapa celah konfigurasi yang memerlukan tindakan remediasi dari tim IT."}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Security Patch</div>
              <div style={{ color: '#fff', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{device.securityPatch}</div>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => {
                soundFX.playNotification();
                if (showNotificationToast) showNotificationToast("Memulai Audit Integritas 8 Pilar Android...", "info");
                setTimeout(() => {
                  soundFX.playClick();
                  if (showNotificationToast) showNotificationToast(`Audit Selesai: Skor Keamanan ${sec.score}/100 (${sec.grade}) Terverifikasi`, "success");
                }, 1500);
              }}
              style={{ fontSize: '0.78rem' }}
            >
              <Key size={14} />
              <span>Pindai Ulang Sekarang</span>
            </button>
          </div>
        </div>

        {/* Threat Warning Banner if present */}
        {sec.warnings && sec.warnings.length > 0 && (
          <div style={{ marginTop: '20px', padding: '14px', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-rose)', fontWeight: 700, marginBottom: '6px' }}>
              <AlertTriangle size={16} />
              <span>Ancaman & Celah Terdeteksi ({sec.warnings.length}):</span>
            </div>
            <ul style={{ paddingLeft: '24px', fontSize: '0.82rem', color: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {sec.warnings.map((warn, i) => (
                <li key={i}>{warn}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Security Verification Checklist */}
      <div className="glass-card">
        <div className="card-header-row">
          <div>
            <div className="card-title">
              <Key size={18} style={{ color: 'var(--accent-indigo)' }} />
              <span>Pemeriksaan 8 Pilar Integritas Sistem Android</span>
            </div>
            <div className="card-subtitle">Hasil verifikasi telemetri kernel dan sandboxing aplikasi</div>
          </div>
        </div>

        <table className="modern-table">
          <thead>
            <tr>
              <th>Indikator Keamanan</th>
              <th>Status Perangkat</th>
              <th>Deskripsi Perlindungan</th>
              <th>Status Kelulusan</th>
            </tr>
          </thead>
          <tbody>
            {securityChecks.map((item, idx) => (
              <tr key={idx}>
                <td><strong>{item.name}</strong></td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                  <span style={{ color: item.pass ? '#fff' : 'var(--accent-rose)' }}>{item.value}</span>
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{item.desc}</td>
                <td>
                  <span className={`pill ${item.pass ? 'pill-emerald' : 'pill-rose'}`}>
                    {item.pass ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    {item.pass ? "Lulus" : "Peringatan"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* App Permissions Risk Auditor */}
      <div className="glass-card">
        <div className="card-header-row">
          <div>
            <div className="card-title">
              <Eye size={18} style={{ color: 'var(--accent-cyan)' }} />
              <span>Audit Izin Sensitif Aplikasi (Runtime Permissions)</span>
            </div>
            <div className="card-subtitle">Pemantauan aplikasi yang memiliki akses ke sensor privasi tinggi</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-indigo)' }}>
              <Camera size={18} />
              <strong style={{ color: '#fff' }}>Akses Kamera</strong>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'var(--font-mono)', margin: '8px 0 4px', color: '#fff' }}>
              3 Aplikasi
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>WhatsApp, Teams, Sentinel MDM</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-cyan)' }}>
              <Mic size={18} />
              <strong style={{ color: '#fff' }}>Akses Mikrofon</strong>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'var(--font-mono)', margin: '8px 0 4px', color: '#fff' }}>
              2 Aplikasi
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>WhatsApp, Teams</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-emerald)' }}>
              <MapPin size={18} />
              <strong style={{ color: '#fff' }}>Lokasi Presisi (GPS)</strong>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'var(--font-mono)', margin: '8px 0 4px', color: '#fff' }}>
              4 Aplikasi
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Google Maps, Sentinel, Chrome, WA</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-amber)' }}>
              <MessageSquare size={18} />
              <strong style={{ color: '#fff' }}>SMS & Log Telepon</strong>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'var(--font-mono)', margin: '8px 0 4px', color: '#fff' }}>
              1 Aplikasi
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>BCA Mobile (Perbankan Terdaftar)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
