import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  BellRing, 
  Camera, 
  Send, 
  BatteryLow, 
  Flashlight, 
  RotateCcw, 
  Trash2, 
  CheckCircle, 
  AlertTriangle,
  Terminal,
  Shield,
  Smartphone
} from 'lucide-react';
import { soundFX } from '../utils/audio';

export default function RemoteCommandCenter({ 
  device, 
  onToggleLock, 
  onToggleAlarm, 
  onPushNotification, 
  onToggleBatterySaver, 
  onToggleFlashlight,
  onRemoteReboot,
  onFactoryWipe,
  onOpenSimulator
}) {
  const [lockMsg, setLockMsg] = useState(device?.controls?.lockMessage || "Perangkat terkunci oleh Administrator MDM Sentinel.");
  const [lockPin, setLockPin] = useState(device?.controls?.unlockPin || "9988");
  const [notifTitle, setNotifTitle] = useState("Pesan Resmi Administrator IT");
  const [notifBody, setNotifBody] = useState("Harap segera laporkan status operasional Anda ke kantor pusat.");
  
  const [snapshotPreview, setSnapshotPreview] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showWipeModal, setShowWipeModal] = useState(false);
  const [wipeConfirmText, setWipeConfirmText] = useState("");
  const [commandLogs, setCommandLogs] = useState([
    { id: 1, cmd: "Koneksi MDM Terverifikasi", status: "Sukses", time: "Baru saja", by: "Admin (You)" }
  ]);

  const isLocked = device?.controls?.isLocked;
  const isAlarmPlaying = device?.controls?.isAlarmPlaying;
  const isFlashlightOn = device?.controls?.isFlashlightOn;
  const isBatterySaver = device?.controls?.isBatterySaver;

  const logCommand = (cmdName, status = "Sukses") => {
    setCommandLogs(prev => [
      {
        id: Date.now(),
        cmd: cmdName,
        status,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        by: "Admin Konsol"
      },
      ...prev
    ]);
  };

  const handleLockSubmit = (e) => {
    e.preventDefault();
    soundFX.playLockSound();
    onToggleLock(lockMsg, lockPin);
    logCommand(isLocked ? "Buka Kunci Layar Remote" : `Kunci Layar (PIN: ${lockPin})`);
  };

  const handleAlarmToggle = () => {
    if (isAlarmPlaying) {
      soundFX.stopSiren();
      onToggleAlarm(false);
      logCommand("Matikan Alarm Siren");
    } else {
      soundFX.startSiren();
      onToggleAlarm(true);
      logCommand("Bunyikan Alarm Siren Darurat");
    }
  };

  const handleSendNotif = (e) => {
    e.preventDefault();
    soundFX.playNotification();
    onPushNotification(notifTitle, notifBody);
    logCommand(`Push Notifikasi: "${notifTitle}"`);
    setNotifTitle("");
    setNotifBody("");
  };

  const handleCaptureSnapshot = () => {
    soundFX.playClick();
    setIsCapturing(true);
    const realScreenshotUrl = device?.isRealDevice 
      ? `http://localhost:5001/api/real-screenshot?deviceId=${device.id}&t=${Date.now()}` 
      : null;

    setTimeout(() => {
      setIsCapturing(false);
      setSnapshotPreview({
        time: new Date().toLocaleTimeString('id-ID'),
        screen: "Tampilan Layar Terkini",
        activeApp: device.isRealDevice ? `${device.name} (Live Screen)` : "WhatsApp Business (Latar Depan)",
        imageUrl: realScreenshotUrl
      });
      logCommand("Ambil Screenshot Remote Berhasil");
    }, 1200);
  };

  const executeWipe = () => {
    if (wipeConfirmText === "HAPUS-PERANGKAT") {
      soundFX.playBeep(200, 0.5, 'sawtooth');
      onFactoryWipe();
      logCommand("FACTORY WIPE DATA DIEKSEKUSI (SIMULASI)", "KRITIS");
      setShowWipeModal(false);
      setWipeConfirmText("");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Top Banner Alert if Alarm Active */}
      {isAlarmPlaying && (
        <div style={{ 
          background: 'rgba(239, 68, 68, 0.18)', 
          border: '1px solid var(--accent-rose)', 
          borderRadius: 'var(--radius-lg)', 
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          animation: 'pulse-ring 1.5s infinite'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <BellRing size={24} style={{ color: 'var(--accent-rose)' }} />
            <div>
              <strong style={{ color: '#fff', fontSize: '1rem' }}>SIREN ALARM PERANGKAT SEDANG BERBUNYI!</strong>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Suara audio dan strobe visual aktif pada perangkat Android.</div>
            </div>
          </div>
          <button className="btn btn-danger" onClick={handleAlarmToggle}>
            Hentikan Siren Sekarang
          </button>
        </div>
      )}

      {/* Grid of MDM Commands */}
      <div className="commands-grid">
        {/* 1. LOCK / UNLOCK DEVICE */}
        <div className="command-card">
          <div className="command-card-top">
            <div className="command-icon-box" style={{ background: isLocked ? 'rgba(245, 158, 11, 0.18)' : 'rgba(99, 102, 241, 0.18)', color: isLocked ? 'var(--accent-amber)' : 'var(--accent-indigo)' }}>
              {isLocked ? <Lock size={22} /> : <Unlock size={22} />}
            </div>
            <div>
              <h3>{isLocked ? "Buka Kunci Layar (Unlock)" : "Kunci Layar Remote (Lock)"}</h3>
              <p>Mengunci layar seketika dengan pesan darurat dan PIN khusus.</p>
            </div>
          </div>

          <form onSubmit={handleLockSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Pesan Darurat di Layar:
              </label>
              <input 
                type="text" 
                value={lockMsg}
                onChange={(e) => setLockMsg(e.target.value)}
                className="cmd-input"
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ width: '100px' }}>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  PIN Pembuka:
                </label>
                <input 
                  type="text" 
                  maxLength={6}
                  value={lockPin}
                  onChange={(e) => setLockPin(e.target.value)}
                  className="cmd-input"
                  style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}
                />
              </div>

              <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end' }}>
                <button 
                  type="submit" 
                  className={`btn ${isLocked ? 'btn-warning' : 'btn-primary'} btn-block`} 
                >
                  {isLocked ? <Unlock size={15} /> : <Lock size={15} />}
                  <span>{isLocked ? "Buka Kunci" : "Kunci Sekarang"}</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* 2. RING SIREN ALARM */}
        <div className="command-card">
          <div className="command-card-top">
            <div className="command-icon-box" style={{ background: isAlarmPlaying ? 'rgba(239, 68, 68, 0.2)' : 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)' }}>
              <BellRing size={22} />
            </div>
            <div>
              <h3>Bunyikan Alarm Siren</h3>
              <p>Memicu suara sirine desibel tinggi dan kilatan strobe darurat.</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Status Alarm: <strong>{isAlarmPlaying ? "BERBUNYI NYARING" : "Siaga / Mati"}</strong>
            </div>

            <button 
              className={`btn ${isAlarmPlaying ? 'btn-danger' : 'btn-secondary'} btn-block`}
              onClick={handleAlarmToggle}
            >
              <BellRing size={15} />
              <span>{isAlarmPlaying ? "Hentikan Suara Alarm" : "Bunyikan Alarm Darurat"}</span>
            </button>
          </div>
        </div>

        {/* 3. CAPTURE SNAPSHOT / SCREEN */}
        <div className="command-card">
          <div className="command-card-top">
            <div className="command-icon-box" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
              <Camera size={22} />
            </div>
            <div>
              <h3>Ambil Tangkapan Layar</h3>
              <p>Permintaan snapshot layar real-time untuk audit operasional.</p>
            </div>
          </div>

          <div>
            <button 
              className="btn btn-secondary btn-block" 
              onClick={handleCaptureSnapshot}
              disabled={isCapturing}
            >
              <Camera size={15} />
              <span>{isCapturing ? "Mengambil Tangkapan..." : "Ambil Snapshot Sekarang"}</span>
            </button>

            {snapshotPreview && (
              <div style={{ marginTop: '10px', padding: '10px', background: 'rgba(0,0,0,0.4)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.74rem' }}>
                <div style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>✓ Snapshot Berhasil Diambil</div>
                <div style={{ color: 'var(--text-muted)' }}>Waktu: {snapshotPreview.time}</div>
                <div style={{ color: 'var(--text-secondary)' }}>Aplikasi: {snapshotPreview.activeApp}</div>
                {snapshotPreview.imageUrl && (
                  <div style={{ marginTop: '8px', border: '1px solid var(--border-light)', borderRadius: '6px', overflow: 'hidden' }}>
                    <img 
                      src={snapshotPreview.imageUrl} 
                      alt="Tangkapan Layar Real HP" 
                      style={{ width: '100%', maxHeight: '280px', objectFit: 'contain', background: '#000', display: 'block' }} 
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 4. PUSH NOTIFICATION */}
        <div className="command-card">
          <div className="command-card-top">
            <div className="command-icon-box" style={{ background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-violet)' }}>
              <Send size={22} />
            </div>
            <div>
              <h3>Kirim Notifikasi Push MDM</h3>
              <p>Kirim pesan pop-up langsung ke layar beranda perangkat.</p>
            </div>
          </div>

          <form onSubmit={handleSendNotif} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input 
              type="text" 
              placeholder="Judul Notifikasi..." 
              value={notifTitle}
              onChange={(e) => setNotifTitle(e.target.value)}
              required
              className="cmd-input"
            />
            <input 
              type="text" 
              placeholder="Isi Pesan Notifikasi..." 
              value={notifBody}
              onChange={(e) => setNotifBody(e.target.value)}
              required
              className="cmd-input"
            />
            <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '4px' }}>
              <Send size={15} />
              <span>Kirimkan Notifikasi</span>
            </button>
          </form>
        </div>

        {/* 5. TOGGLE BATTERY SAVER */}
        <div className="command-card">
          <div className="command-card-top">
            <div className="command-icon-box" style={{ background: isBatterySaver ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)', color: isBatterySaver ? 'var(--accent-emerald)' : 'var(--text-secondary)' }}>
              <BatteryLow size={22} />
            </div>
            <div>
              <h3>Mode Hemat Baterai</h3>
              <p>Membatasi aktivitas latar belakang dan menurunkan refresh rate.</p>
            </div>
          </div>

          <button 
            className={`btn ${isBatterySaver ? 'btn-emerald' : 'btn-secondary'} btn-block`}
            onClick={() => {
              soundFX.playClick();
              onToggleBatterySaver();
              logCommand(isBatterySaver ? "Matikan Penghemat Baterai" : "Aktifkan Penghemat Baterai");
            }}
          >
            <span>{isBatterySaver ? "Mode Hemat Aktif (Matikan)" : "Aktifkan Hemat Daya"}</span>
          </button>
        </div>

        {/* 6. FLASHLIGHT STROBE */}
        <div className="command-card">
          <div className="command-card-top">
            <div className="command-icon-box" style={{ background: isFlashlightOn ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)', color: isFlashlightOn ? 'var(--accent-amber)' : 'var(--text-secondary)' }}>
              <Flashlight size={22} />
            </div>
            <div>
              <h3>Lampu Senter / Strobe</h3>
              <p>Nyalakan senter LED kamera untuk sinyal pencarian visual.</p>
            </div>
          </div>

          <button 
            className={`btn ${isFlashlightOn ? 'btn-warning' : 'btn-secondary'} btn-block`}
            onClick={() => {
              soundFX.playClick();
              onToggleFlashlight();
              logCommand(isFlashlightOn ? "Matikan Senter" : "Nyalakan Senter Kamera");
            }}
          >
            <Flashlight size={15} />
            <span>{isFlashlightOn ? "Matikan Lampu Senter" : "Nyalakan Senter Kamera"}</span>
          </button>
        </div>

        {/* 7. REMOTE REBOOT */}
        <div className="command-card">
          <div className="command-card-top">
            <div className="command-icon-box" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-indigo)' }}>
              <RotateCcw size={22} />
            </div>
            <div>
              <h3>Restart Perangkat Remote</h3>
              <p>Kirim perintah reboot aman ke sistem operasi Android.</p>
            </div>
          </div>

          <button 
            className="btn btn-secondary btn-block"
            onClick={() => {
              soundFX.playClick();
              onRemoteReboot();
              logCommand("Restart Perangkat (Reboot)");
            }}
          >
            <RotateCcw size={15} />
            <span>Restart Perangkat Sekarang</span>
          </button>
        </div>

        {/* 8. FACTORY WIPE DATA */}
        <div className="command-card" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
          <div className="command-card-top">
            <div className="command-icon-box" style={{ background: 'rgba(239, 68, 68, 0.18)', color: 'var(--accent-rose)' }}>
              <Trash2 size={22} />
            </div>
            <div>
              <h3 style={{ color: 'var(--accent-rose)' }}>Hapus Seluruh Data (Wipe)</h3>
              <p>Hapus memori internal dan kembalikan ke setelan pabrik jika hilang.</p>
            </div>
          </div>

          <button 
            className="btn btn-danger btn-block"
            onClick={() => {
              soundFX.playClick();
              setShowWipeModal(true);
            }}
          >
            <Trash2 size={15} />
            <span>Wipe Data Perangkat</span>
          </button>
        </div>
      </div>

      {/* Audit Log Table of Executed Commands */}
      <div className="glass-card">
        <div className="card-header-row">
          <div>
            <div className="card-title">
              <Terminal size={18} style={{ color: 'var(--accent-indigo)' }} />
              <span>Log Audit Eksekusi Perintah MDM</span>
            </div>
            <div className="card-subtitle">Riwayat instruksi remote yang dikirim ke {device.name}</div>
          </div>
          <button className="btn btn-secondary" onClick={onOpenSimulator} style={{ fontSize: '0.78rem' }}>
            <Smartphone size={14} />
            <span>Lihat Respon di Simulator HP</span>
          </button>
        </div>

        <table className="modern-table">
          <thead>
            <tr>
              <th>Waktu</th>
              <th>Instruksi / Perintah</th>
              <th>Eksekutor</th>
              <th>Status Transmisi</th>
            </tr>
          </thead>
          <tbody>
            {commandLogs.map(log => (
              <tr key={log.id}>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{log.time}</td>
                <td><strong>{log.cmd}</strong></td>
                <td style={{ color: 'var(--text-secondary)' }}>{log.by}</td>
                <td>
                  <span className={`pill ${log.status === 'KRITIS' ? 'pill-rose' : 'pill-emerald'}`} style={{ fontSize: '0.72rem' }}>
                    {log.status === 'KRITIS' ? <AlertTriangle size={10} /> : <CheckCircle size={10} />} {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Wipe Confirmation Modal */}
      {showWipeModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ borderColor: 'var(--accent-rose)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--accent-rose)', marginBottom: '14px' }}>
              <AlertTriangle size={28} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>KONFIRMASI FACTORY WIPE DATA</h2>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: '1.5', marginBottom: '16px' }}>
              Tindakan ini akan <strong>MENGHAPUS SEMUA DATA</strong> pada {device.name}, termasuk akun Google, kontak, foto, dan aplikasi perusahaan. Tindakan ini tidak dapat dibatalkan!
            </p>

            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Ketik teks <strong style={{ color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)' }}>HAPUS-PERANGKAT</strong> untuk konfirmasi:
              </label>
              <input 
                type="text" 
                value={wipeConfirmText}
                onChange={(e) => setWipeConfirmText(e.target.value)}
                placeholder="HAPUS-PERANGKAT"
                style={{ 
                  width: '100%', 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid var(--border-light)', 
                  borderRadius: 'var(--radius-sm)', 
                  padding: '10px', 
                  color: '#fff', 
                  fontFamily: 'var(--font-mono)' 
                }} 
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn btn-secondary" onClick={() => setShowWipeModal(false)}>
                Batalkan
              </button>
              <button 
                className="btn btn-danger" 
                disabled={wipeConfirmText !== "HAPUS-PERANGKAT"}
                onClick={executeWipe}
              >
                Hapus Seluruh Data Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
