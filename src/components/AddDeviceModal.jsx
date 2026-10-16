import React, { useState, useEffect, useRef } from 'react';
import { X, Smartphone, QrCode, PlusCircle, Check, Copy, ExternalLink, RefreshCw, Barcode, ShieldCheck, Download } from 'lucide-react';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import { soundFX } from '../utils/audio';

export default function AddDeviceModal({ onClose, onAddDevice }) {
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [assignedUser, setAssignedUser] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [os, setOs] = useState('Android 14');
  const [enrollmentCode, setEnrollmentCode] = useState(`MDM-${Math.floor(100000 + Math.random() * 900000)}`);

  // Code Display State
  const [activeCodeType, setActiveCodeType] = useState('qr'); // 'qr' | 'barcode'
  const [payloadType, setPayloadType] = useState('url'); // 'url' | 'token'
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const barcodeRef = useRef(null);

  // Local IP of host machine for network enrollment access
  const hostIp = '192.168.18.67';
  const enrollUrl = `http://${hostIp}:5173/?enroll=${enrollmentCode}`;
  const currentPayload = payloadType === 'url' ? enrollUrl : enrollmentCode;

  // Generate Real QR Code Data URL
  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(currentPayload, {
      width: 220,
      margin: 1,
      color: {
        dark: '#050811',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    }).then(url => {
      if (isMounted) setQrDataUrl(url);
    }).catch(err => {
      console.error('Error generating QR code:', err);
    });

    return () => { isMounted = false; };
  }, [currentPayload]);

  // Generate Real 1D Barcode (Code128)
  useEffect(() => {
    if (activeCodeType === 'barcode' && barcodeRef.current) {
      try {
        JsBarcode(barcodeRef.current, enrollmentCode, {
          format: "CODE128",
          lineColor: "#050811",
          background: "#ffffff",
          width: 2.2,
          height: 60,
          displayValue: true,
          fontSize: 14,
          font: "monospace",
          margin: 10
        });
      } catch (err) {
        console.error('Error generating barcode:', err);
      }
    }
  }, [activeCodeType, enrollmentCode]);

  const handleRegenerateCode = () => {
    soundFX.playClick();
    const newCode = `MDM-${Math.floor(100000 + Math.random() * 900000)}`;
    setEnrollmentCode(newCode);
  };

  const handleCopyPayload = () => {
    soundFX.playClick();
    navigator.clipboard.writeText(currentPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !assignedUser) return;

    soundFX.playNotification();

    const newDevice = {
      id: `dev-${Date.now()}`,
      name: name,
      tag: "Unit Baru Terdaftar (QR/Barcode)",
      assignedUser: assignedUser,
      status: "online",
      brand: "Android",
      model: model || "Generic Phone",
      os: os,
      buildNumber: "UP1A.240901.002",
      uiVersion: "Stock Android",
      securityPatch: "1 Oktober 2026",
      imei: `35${Math.floor(1000000000000 + Math.random() * 9000000000000)}`,
      serialNumber: enrollmentCode,
      phoneNumber: phoneNumber || "+62 812-0000-1111",
      uptime: "1 jam 10 menit",
      lastSeen: "Baru saja",
      screenOn: true,
      screenBrightness: 70,

      battery: {
        level: 90,
        isCharging: false,
        chargeType: "Discharging",
        temperature: 31.5,
        health: "Good (100% SOH)",
        voltage: 4.20,
        technology: "Li-Po 5000 mAh",
        cycles: 12,
        estimatedTimeRemaining: "15 jam 30 menit"
      },

      hardware: {
        cpuLoad: 24,
        cpuCores: 8,
        cpuChipset: "Octa-core 3.2 GHz",
        cpuTemp: 34.0,
        ramTotal: 8,
        ramUsed: 3.2,
        storageTotal: 256,
        storageUsed: 45.0,
        storageApps: 22.0,
        storageMedia: 12.0,
        storageSystem: 11.0
      },

      connectivity: {
        wifiEnabled: true,
        wifiSsid: "Telkom-Corp-Secure-5G",
        wifiBssid: "74:83:C2:90:AF:99",
        wifiSignal: -56,
        ipAddress: `192.168.18.${Math.floor(100 + Math.random() * 150)}`,
        publicIp: "103.144.170.82",
        macAddress: "AA:BB:CC:DD:EE:FF",
        cellularType: "5G SA",
        carrier: "Telkomsel 5G Enterprise",
        cellularSignal: -76,
        bluetoothEnabled: true,
        bluetoothDevice: "None",
        downloadSpeed: 48.0,
        uploadSpeed: 16.0,
        vpnActive: true,
        vpnName: "WireGuard MDM Tunnel"
      },

      location: {
        lat: -6.2088 + (Math.random() - 0.5) * 0.02,
        lng: 106.8456 + (Math.random() - 0.5) * 0.02,
        accuracy: 4.5,
        altitude: 15.0,
        speed: 0,
        heading: 0,
        address: "Kawasan Pusat Bisnis Jakarta, DKI Jakarta",
        geofenceName: "HQ Jakarta Office",
        geofenceStatus: "safe",
        geofenceRadius: 350,
        geofenceCenter: { lat: -6.2088, lng: 106.8456 },
        lastUpdate: "Baru saja"
      },

      locationHistory: [],

      security: {
        score: 95,
        grade: "A+",
        rooted: false,
        bootloaderUnlocked: false,
        usbDebugging: false,
        developerOptions: false,
        unknownSources: false,
        playProtectActive: true,
        selinuxStatus: "Enforcing",
        screenLockType: "Fingerprint & PIN",
        encryption: "FBE AES-256",
        knoxStatus: "Protected Hardware",
        threatsDetected: 0,
        warnings: []
      },

      controls: {
        isLocked: false,
        lockMessage: "Perangkat inventaris resmi perusahaan.",
        unlockPin: "1234",
        isAlarmPlaying: false,
        isFlashlightOn: false,
        isBatterySaver: false,
        isKioskMode: false,
        cameraStreamActive: false,
        lastPing: "Baru saja"
      },

      apps: [
        { id: "a1", name: "Sentinel MDM Agent", package: "com.sentinel.mdm.agent", version: "3.4.1", category: "Sistem IT", size: "48 MB", memory: "65 MB", battery: "2%", permissions: ["Admin Perangkat", "Lokasi Latar Belakang"], status: "protected", safe: true },
        { id: "a2", name: "WhatsApp", package: "com.whatsapp", version: "2.24.12", category: "Komunikasi", size: "120 MB", memory: "180 MB", battery: "10%", permissions: ["Kamera", "Lokasi"], status: "running", safe: true }
      ],

      notifications: [
        { id: "n1", app: "Sentinel MDM", title: "Pendaftaran Sukses", text: `Perangkat berhasil di-enroll via ${enrollmentCode}.`, time: "Baru saja", type: "system", unread: true }
      ],

      calls: [],
      sms: []
    };

    onAddDevice(newDevice);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '640px', padding: '28px', maxHeight: '92vh', overflowY: 'auto' }}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Tutup">
          <X size={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
          <div className="vital-icon-box" style={{ background: 'rgba(99, 102, 241, 0.2)', color: 'var(--accent-indigo)' }}>
            <Smartphone size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
              Daftarkan Perangkat Android Baru (MDM Enrollment)
            </h2>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Pindai QR / Barcode asli langsung menggunakan kamera HP atau scanner
            </div>
          </div>
        </div>

        {/* Real Scannable Barcode & QR Code Section */}
        <div style={{ 
          background: 'rgba(15, 23, 42, 0.7)', 
          border: '1px solid var(--border-accent)', 
          borderRadius: 'var(--radius-lg)', 
          padding: '18px',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          {/* Format Toggle Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.4)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
              <button
                type="button"
                className={`btn ${activeCodeType === 'qr' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => {
                  soundFX.playClick();
                  setActiveCodeType('qr');
                }}
                style={{ fontSize: '0.76rem', padding: '6px 12px' }}
              >
                <QrCode size={14} />
                <span>QR Code 2D (Kamera HP)</span>
              </button>
              <button
                type="button"
                className={`btn ${activeCodeType === 'barcode' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => {
                  soundFX.playClick();
                  setActiveCodeType('barcode');
                }}
                style={{ fontSize: '0.76rem', padding: '6px 12px' }}
              >
                <Barcode size={14} />
                <span>Barcode 1D (Garis)</span>
              </button>
            </div>

            <span className="pill pill-emerald" style={{ fontSize: '0.72rem' }}>
              <ShieldCheck size={12} /> 100% Dapat Dipindai
            </span>
          </div>

          {/* Code Canvas Display Card */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '18px', 
            background: 'rgba(0,0,0,0.3)', 
            padding: '16px', 
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)'
          }}>
            {/* The Actual Scannable Code (White High-Contrast Box) */}
            <div style={{ 
              background: '#ffffff', 
              padding: '10px', 
              borderRadius: '12px', 
              boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {activeCodeType === 'qr' ? (
                qrDataUrl ? (
                  <img 
                    src={qrDataUrl} 
                    alt={`Scannable QR Code ${enrollmentCode}`} 
                    style={{ width: '150px', height: '150px', display: 'block', imageRendering: 'pixelated' }} 
                  />
                ) : (
                  <div style={{ width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '0.8rem' }}>
                    Membuat QR...
                  </div>
                )
              ) : (
                <div style={{ minWidth: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg ref={barcodeRef} style={{ display: 'block' }}></svg>
                </div>
              )}
            </div>

            {/* Information and Scan Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: '180px' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Token Pendaftaran
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--accent-indigo)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{enrollmentCode}</span>
                  <button 
                    type="button" 
                    onClick={handleRegenerateCode} 
                    title="Buat Token Acak Baru" 
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>
              </div>

              {activeCodeType === 'qr' && (
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Format QR:</span>
                  <button 
                    type="button" 
                    onClick={() => setPayloadType('url')}
                    className={`pill ${payloadType === 'url' ? 'pill-indigo' : 'pill-dark'}`}
                    style={{ cursor: 'pointer', fontSize: '0.68rem', padding: '2px 8px' }}
                  >
                    URL Web Wi-Fi
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setPayloadType('token')}
                    className={`pill ${payloadType === 'token' ? 'pill-indigo' : 'pill-dark'}`}
                    style={{ cursor: 'pointer', fontSize: '0.68rem', padding: '2px 8px' }}
                  >
                    Token Teks
                  </button>
                </div>
              )}

              <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: '1.4', margin: 0 }}>
                {activeCodeType === 'qr' 
                  ? "Buka aplikasi Kamera atau Google Lens di HP Anda dan arahkan ke kotak QR di samping untuk langsung membuka link pendaftaran."
                  : "Arahkan alat barcode scanner laser atau aplikasi scanner barcode untuk membaca kode 1D Code128 di samping."}
              </p>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '2px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={handleCopyPayload}
                  style={{ fontSize: '0.74rem', padding: '5px 10px' }}
                >
                  {copied ? <Check size={13} style={{ color: 'var(--accent-emerald)' }} /> : <Copy size={13} />}
                  <span>{copied ? "Tersalin!" : "Salin Isi Kode"}</span>
                </button>

                {activeCodeType === 'qr' && payloadType === 'url' && (
                  <>
                    <a 
                      href={enrollUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="btn btn-secondary" 
                      style={{ fontSize: '0.74rem', padding: '5px 10px', textDecoration: 'none' }}
                    >
                      <ExternalLink size={13} />
                      <span>Uji Buka URL</span>
                    </a>

                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={async () => {
                        soundFX.playNotification();
                        try {
                          await fetch('http://localhost:5001/api/real-command', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ action: 'open_url', params: { url: enrollUrl } })
                          });
                        } catch {}
                      }}
                      style={{ fontSize: '0.74rem', padding: '5px 10px' }}
                      title="Kirim instruksi ke HP via ADB untuk langsung membuka browser di ponsel"
                    >
                      <Smartphone size={13} />
                      <span>Buka di HP (via ADB)</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Guide Alert for Scanner Compatibility */}
          <div style={{ 
            padding: '10px 14px', 
            borderRadius: 'var(--radius-md)', 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.25)', 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: '10px', 
            fontSize: '0.75rem', 
            lineHeight: '1.4' 
          }}>
            <span style={{ fontSize: '1rem', lineHeight: 1 }}>💡</span>
            <div style={{ color: '#cbd5e1' }}>
              <strong style={{ color: '#fff', display: 'block', marginBottom: '2px' }}>
                Jika Muncul Pesan "Invalid QR Code":
              </strong>
              Pindai menggunakan <strong>Aplikasi Kamera Bawaan HP (Mode Foto)</strong> atau <strong>Google Lens</strong>. Jangan gunakan menu <em>"Tautkan ke Windows" (Link to Windows / Phone Link)</em> atau scanner WhatsApp karena scanner tersebut khusus untuk ekosistem Microsoft/WhatsApp.
            </div>
          </div>
        </div>

        {/* Manual Enrollment Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Nama Perangkat / Label:
            </label>
            <input 
              type="text" 
              required
              placeholder="cth: Samsung Galaxy A14 5G (Field Unit 1)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', color: '#fff', fontSize: '0.84rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Model Hardware:
              </label>
              <input 
                type="text" 
                placeholder="cth: SM-A146P"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', color: '#fff', fontSize: '0.84rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Versi OS:
              </label>
              <select 
                value={os}
                onChange={(e) => setOs(e.target.value)}
                style={{ width: '100%', background: '#111827', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', color: '#fff', fontSize: '0.84rem' }}
              >
                <option value="Android 15">Android 15 (Vanilla)</option>
                <option value="Android 14">Android 14</option>
                <option value="Android 13">Android 13</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Nama Pengguna / Karyawan:
              </label>
              <input 
                type="text" 
                required
                placeholder="cth: Pengguna Lapangan"
                value={assignedUser}
                onChange={(e) => setAssignedUser(e.target.value)}
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', color: '#fff', fontSize: '0.84rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Nomor Telepon:
              </label>
              <input 
                type="text" 
                placeholder="+62 812-xxxx-xxxx"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', color: '#fff', fontSize: '0.84rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              <PlusCircle size={16} />
              <span>Simpan & Daftarkan Perangkat</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
