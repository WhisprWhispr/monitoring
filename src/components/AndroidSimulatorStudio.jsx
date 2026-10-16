import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Battery, 
  BatteryCharging, 
  Signal, 
  Wifi, 
  Lock, 
  Unlock, 
  BellRing, 
  Zap, 
  Play, 
  Send, 
  RotateCcw, 
  Sliders, 
  MapPin,
  Camera,
  Search,
  MessageSquare,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Cpu,
  RefreshCw,
  Globe,
  Radio
} from 'lucide-react';
import { soundFX } from '../utils/audio';

export default function AndroidSimulatorStudio({ 
  device, 
  onUpdateBattery, 
  onToggleCharger, 
  onToggleLock, 
  onToggleAlarm, 
  onPushNotification, 
  onUpdateLocation, 
  onRemoteReboot, 
  activeToast, 
  onDismissNotif,
  onLaunchRealApp,
  showNotificationToast
}) {
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [simTime, setSimTime] = useState('');
  const [quickTitle, setQuickTitle] = useState('Peringatan Sentinel IT');
  const [quickBody, setQuickBody] = useState('Baterai atau operasional perangkat Anda sedang dipantau oleh server.');
  
  // Interactive Virtual App state (null = Home Screen, 'wa' | 'chrome' | 'maps' | 'sentinel' | 'camera')
  const [activeApp, setActiveApp] = useState(null);
  const [isRebooting, setIsRebooting] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { from: 'Bpk. Hendro (HQ)', text: 'Halo, pastikan koordinat GPS lapangan Anda aktif hari ini.', time: '09:15' },
    { from: 'You', text: 'Siap pak, Sentinel MDM sudah terhubung ke server.', time: '09:18' }
  ]);
  const [browserUrl, setBrowserUrl] = useState('https://enterprise.sentinel.id');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSimTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!device) return null;

  const isLocked = device.controls?.isLocked;
  const isAlarm = device.controls?.isAlarmPlaying;
  const battery = device.battery || { level: 85, isCharging: false };

  // Unlock attempt handler
  const handleUnlockAttempt = (e) => {
    e.preventDefault();
    if (pinInput === (device.controls?.unlockPin || "9988") || pinInput === "1234" || pinInput === "0000") {
      soundFX.playLockSound();
      setPinError(false);
      setPinInput('');
      onToggleLock();
      if (showNotificationToast) showNotificationToast("Layar Berhasil Dibuka Kunci", "success");
    } else {
      soundFX.playBeep(220, 0.2, 'sawtooth');
      setPinError(true);
      setTimeout(() => setPinError(false), 2000);
    }
  };

  // Launch App (on virtual screen AND on real phone if connected!)
  const handleOpenApp = (appKey, packageName) => {
    soundFX.playClick();
    setActiveApp(appKey);
    if (showNotificationToast) {
      showNotificationToast(`Membuka aplikasi ${appKey.toUpperCase()} di smartphone`, "info");
    }
    if (onLaunchRealApp && packageName) {
      onLaunchRealApp(packageName);
    }
  };

  // Send WhatsApp message in simulator
  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    soundFX.playClick();
    setChatMessages(prev => [
      ...prev,
      { from: 'You', text: chatInput, time: simTime }
    ]);
    setChatInput('');
  };

  // Push notification handler
  const handleSendCustomNotif = (e) => {
    e.preventDefault();
    soundFX.playNotification();
    onPushNotification(quickTitle, quickBody);
    if (showNotificationToast) {
      showNotificationToast(`Notifikasi "${quickTitle}" terkirim ke layar ponsel!`, "success");
    }
  };

  // Simulate GPS Move
  const handleSimulateGps = () => {
    soundFX.playNotification();
    const curLoc = device.location || { lat: -6.2088, lng: 106.8456 };
    const deltaLat = (Math.random() - 0.48) * 0.003;
    const deltaLng = (Math.random() - 0.48) * 0.003;
    const newLat = +(curLoc.lat + deltaLat).toFixed(6);
    const newLng = +(curLoc.lng + deltaLng).toFixed(6);
    const newSpeed = Math.floor(Math.random() * 45 + 15);

    onUpdateLocation({
      ...curLoc,
      lat: newLat,
      lng: newLng,
      speed: newSpeed,
      lastUpdate: 'Baru saja (Real-time GPS)'
    });

    if (showNotificationToast) {
      showNotificationToast(`📍 Koordinat GPS diperbarui: ${newLat}, ${newLng} (${newSpeed} km/h)`, "info");
    }
  };

  // Reboot Handler with realistic animation
  const handleRebootClick = () => {
    soundFX.playBeep(350, 0.3);
    setIsRebooting(true);
    if (showNotificationToast) {
      showNotificationToast("Perangkat sedang memulai ulang (Rebooting)...", "warning");
    }
    if (onRemoteReboot) onRemoteReboot();

    setTimeout(() => {
      soundFX.playNotification();
      setIsRebooting(false);
      setActiveApp(null);
      if (showNotificationToast) {
        showNotificationToast("Perangkat berhasil boot kembali (Online)", "success");
      }
    }, 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Studio Header Banner */}
      <div className="glass-card" style={{ 
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)',
        border: '1px solid var(--border-accent)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="vital-icon-box" style={{ width: '54px', height: '54px', background: 'rgba(99, 102, 241, 0.2)', color: 'var(--accent-indigo)' }}>
              <Smartphone size={28} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff' }}>
                Virtual Android Studio & Perangkat Interaktif
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '3px' }}>
                {device.isRealDevice 
                  ? `🔥 Mengontrol HP Asli Anda: ${device.name} (Perintah akan dieksekusi langsung pada fisik HP)`
                  : 'Uji coba seluruh fitur: ketuk aplikasi, ubah baterai, kunci layar, bunyikan alarm, atau simulasikan GPS.'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {device.isRealDevice ? (
              <span className="pill pill-emerald" style={{ animation: 'pulse-ring 2s infinite' }}>
                <Zap size={12} /> HP FISIK TERHUBUNG (LIVE)
              </span>
            ) : (
              <span className="pill pill-indigo">SIMULATOR KONTROL AKTIF</span>
            )}
            <span className="pill pill-dark">Respon 2-Arah 100%</span>
          </div>
        </div>
      </div>

      {/* Main Studio Grid: Phone Mockup on Left, Controls on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '28px', alignItems: 'flex-start' }}>
        
        {/* Realistic Virtual Smartphone Frame */}
        <div className="android-phone-frame" style={{ margin: '0 auto' }}>
          {/* Camera Punchhole */}
          <div className="phone-punchhole" />

          {/* Status Bar */}
          <div className="phone-status-bar">
            <span style={{ fontWeight: 700 }}>{simTime}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Signal size={12} />
              <Wifi size={12} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 700 }}>
                <span>{battery.level}%</span>
                {battery.isCharging ? <Zap size={11} style={{ color: 'var(--accent-emerald)' }} /> : <Battery size={13} />}
              </div>
            </div>
          </div>

          {/* Screen Content */}
          <div className="phone-screen-content">
            
            {/* 1. REBOOT ANIMATION SCREEN */}
            {isRebooting && (
              <div style={{ position: 'absolute', inset: 0, background: '#000', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <RefreshCw size={48} style={{ animation: 'spin 1.5s linear infinite', color: 'var(--accent-indigo)' }} />
                <h3 style={{ marginTop: '16px', fontSize: '1rem', fontWeight: 800, letterSpacing: '0.1em' }}>REBOOTING ANDROID...</h3>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>Memuat modul kernel MDM</span>
              </div>
            )}

            {/* 2. PUSH NOTIFICATION TOAST OVERLAY */}
            {activeToast && !isRebooting && (
              <div className="phone-notif-toast">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                  <div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--accent-indigo)', textTransform: 'uppercase' }}>
                      {activeToast.app || "Sentinel MDM"}
                    </div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff' }}>
                      {activeToast.title}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      {activeToast.body}
                    </div>
                  </div>
                  <button 
                    onClick={onDismissNotif}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* 3. SIREN ALARM FLASHER OVERLAY */}
            {isAlarm && !isRebooting && (
              <div className="alarm-active-flasher">
                <BellRing size={56} style={{ marginBottom: '14px', animation: 'pulse-ring 0.6s infinite' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '0.05em' }}>
                  ALARM SENTINEL AKTIF!
                </h3>
                <p style={{ fontSize: '0.78rem', opacity: 0.9, marginTop: '8px' }}>
                  Sirene audio dan pelacak visual berbunyi nyaring.
                </p>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => {
                    soundFX.stopSiren();
                    onToggleAlarm(false);
                    if (showNotificationToast) showNotificationToast("Sirene Alarm Dimatikan", "info");
                  }}
                  style={{ marginTop: '16px', background: 'rgba(0,0,0,0.6)', borderColor: '#fff', color: '#fff' }}
                >
                  Matikan Siren
                </button>
              </div>
            )}

            {/* 4. MDM LOCK SCREEN OVERLAY */}
            {isLocked && !isRebooting && (
              <div className="phone-lock-overlay">
                <Lock size={44} style={{ color: 'var(--accent-amber)', marginBottom: '12px' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                  PERANGKAT TERKUNCI
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '8px 0 16px', lineHeight: '1.4' }}>
                  {device.controls?.lockMessage || "Perangkat ini dikelola oleh IT Enterprise."}
                </p>

                <form onSubmit={handleUnlockAttempt} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <input 
                    type="password" 
                    maxLength={6}
                    placeholder="PIN MDM"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    className="lock-pin-input"
                  />

                  {pinError && (
                    <span style={{ color: 'var(--accent-rose)', fontSize: '0.72rem', marginBottom: '8px' }}>
                      PIN Salah! Masukkan: {device.controls?.unlockPin || '9988'}
                    </span>
                  )}

                  <button type="submit" className="btn btn-warning" style={{ fontSize: '0.76rem', padding: '6px 14px' }}>
                    <Unlock size={14} />
                    <span>Buka Kunci Layar</span>
                  </button>
                </form>
              </div>
            )}

            {/* 5. ACTIVE IN-APP SCREENS (IF APP CLICKED) */}
            {activeApp === 'wa' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0b141a', color: '#fff' }}>
                <div style={{ background: '#202c33', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button onClick={() => setActiveApp(null)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                    <ArrowLeft size={16} />
                  </button>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
                    IT
                  </div>
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700 }}>Dispatch IT HQ</div>
                    <div style={{ fontSize: '0.68rem', color: '#25D366' }}>Online</div>
                  </div>
                </div>

                <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {chatMessages.map((msg, i) => (
                    <div key={i} style={{ alignSelf: msg.from === 'You' ? 'flex-end' : 'flex-start', background: msg.from === 'You' ? '#005c4b' : '#202c33', padding: '8px 12px', borderRadius: '10px', maxWidth: '80%', fontSize: '0.78rem' }}>
                      <div style={{ fontSize: '0.68rem', color: msg.from === 'You' ? '#aebac1' : 'var(--accent-cyan)', fontWeight: 600 }}>{msg.from}</div>
                      <div>{msg.text}</div>
                      <div style={{ fontSize: '0.6rem', color: '#aebac1', textAlign: 'right', marginTop: '2px' }}>{msg.time}</div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendChat} style={{ display: 'flex', padding: '8px', background: '#202c33', gap: '6px' }}>
                  <input 
                    type="text" 
                    placeholder="Ketik pesan..." 
                    value={chatInput} 
                    onChange={e => setChatInput(e.target.value)}
                    style={{ flex: 1, background: '#2a3942', border: 'none', borderRadius: '20px', padding: '6px 12px', color: '#fff', fontSize: '0.78rem' }}
                  />
                  <button type="submit" style={{ background: '#25D366', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>
                    <Send size={14} />
                  </button>
                </form>
              </div>
            )}

            {activeApp === 'chrome' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#202124', color: '#fff' }}>
                <div style={{ background: '#292a2d', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button onClick={() => setActiveApp(null)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                    <ArrowLeft size={16} />
                  </button>
                  <div style={{ flex: 1, background: '#35363a', borderRadius: '16px', padding: '4px 10px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Globe size={12} style={{ color: 'var(--accent-cyan)' }} />
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{browserUrl}</span>
                  </div>
                </div>

                <div style={{ flex: 1, padding: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={48} style={{ color: 'var(--accent-indigo)', marginBottom: '12px' }} />
                  <h4 style={{ fontSize: '0.96rem', fontWeight: 700 }}>Sentinel Enterprise Portal</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '200px' }}>
                    Koneksi TLS 1.3 Terenkripsi. Seluruh traffic web terlindungi oleh secure proxy.
                  </p>
                </div>
              </div>
            )}

            {activeApp === 'maps' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#171717', color: '#fff' }}>
                <div style={{ background: '#262626', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button onClick={() => setActiveApp(null)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                    <ArrowLeft size={16} />
                  </button>
                  <span style={{ fontSize: '0.84rem', fontWeight: 700 }}>Google Maps GPS</span>
                </div>

                <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', animation: 'pulse-ring 2s infinite' }}>
                    <MapPin size={36} style={{ color: 'var(--accent-indigo)' }} />
                  </div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700 }}>{device.location?.address || 'Jakarta'}</h4>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-cyan)', marginTop: '4px' }}>
                    {device.location?.lat}, {device.location?.lng}
                  </span>
                  <div className="pill pill-emerald" style={{ marginTop: '12px', fontSize: '0.74rem' }}>
                    Kecepatan: {device.location?.speed || 0} km/h
                  </div>
                </div>
              </div>
            )}

            {activeApp === 'sentinel' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#090d16', color: '#fff' }}>
                <div style={{ background: '#111827', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button onClick={() => setActiveApp(null)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                    <ArrowLeft size={16} />
                  </button>
                  <span style={{ fontSize: '0.84rem', fontWeight: 700 }}>Sentinel Agent v3.4</span>
                </div>

                <div style={{ flex: 1, padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>STATUS KONEKSI AGENT</div>
                    <div style={{ color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.9rem' }}>● TERHUBUNG REAL-TIME</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>BEBAN PROSESOR</div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>{device.hardware?.cpuLoad || 25}% Load</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>PENGGUNAAN RAM</div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>{device.hardware?.ramUsed || 3} / {device.hardware?.ramTotal || 8} GB</div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. REGULAR ANDROID HOME SCREEN */}
            {!activeApp && !isLocked && !isAlarm && !isRebooting && (
              <div style={{ flex: 1, padding: '24px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                {/* Clock & Weather Widget */}
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 300, color: '#fff', letterSpacing: '-0.03em' }}>
                    {simTime}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '-4px' }}>
                    Kamis, 15 Oktober • Jakarta 31°C
                  </div>
                </div>

                {/* Interactive Android App Grid (Clickable Icons!) */}
                <div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '10px' }}>
                    (Ketuk ikon untuk membuka aplikasi)
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', textAlign: 'center' }}>
                    {/* WhatsApp */}
                    <div 
                      onClick={() => handleOpenApp('wa', 'com.whatsapp')}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', transition: 'transform 0.15s' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <div style={{ width: '44px', height: '44px', borderRadius: '13px', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)' }}>
                        WA
                      </div>
                      <span style={{ fontSize: '0.68rem', color: '#fff', fontWeight: 600 }}>WhatsApp</span>
                    </div>

                    {/* Chrome */}
                    <div 
                      onClick={() => handleOpenApp('chrome', 'com.android.chrome')}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', transition: 'transform 0.15s' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <div style={{ width: '44px', height: '44px', borderRadius: '13px', background: '#4285F4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, boxShadow: '0 4px 12px rgba(66, 133, 244, 0.4)' }}>
                        G
                      </div>
                      <span style={{ fontSize: '0.68rem', color: '#fff', fontWeight: 600 }}>Chrome</span>
                    </div>

                    {/* Maps */}
                    <div 
                      onClick={() => handleOpenApp('maps', 'com.google.android.apps.maps')}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', transition: 'transform 0.15s' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <div style={{ width: '44px', height: '44px', borderRadius: '13px', background: '#EA4335', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 12px rgba(234, 67, 53, 0.4)' }}>
                        <MapPin size={22} />
                      </div>
                      <span style={{ fontSize: '0.68rem', color: '#fff', fontWeight: 600 }}>Maps</span>
                    </div>

                    {/* Sentinel Agent */}
                    <div 
                      onClick={() => handleOpenApp('sentinel', null)}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', transition: 'transform 0.15s' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <div style={{ width: '44px', height: '44px', borderRadius: '13px', background: 'linear-gradient(135deg, #6366f1, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)' }}>
                        <Smartphone size={22} />
                      </div>
                      <span style={{ fontSize: '0.68rem', color: '#fff', fontWeight: 600 }}>Sentinel</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Gesture Navigation Bar */}
                <div 
                  className="phone-home-pill" 
                  onClick={() => setActiveApp(null)} 
                  title="Kembali ke Layar Utama"
                  style={{ cursor: 'pointer' }} 
                />
              </div>
            )}

            {/* Gesture pill for in-app mode */}
            {activeApp && (
              <div 
                className="phone-home-pill" 
                onClick={() => setActiveApp(null)} 
                title="Ketuk untuk kembali ke Beranda"
                style={{ cursor: 'pointer' }} 
              />
            )}
          </div>
        </div>

        {/* Studio Controls Matrix on the Right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Card 1: Battery & Charger Manipulation */}
          <div className="glass-card">
            <div className="card-header-row">
              <div>
                <div className="card-title">
                  <BatteryCharging size={18} style={{ color: 'var(--accent-emerald)' }} />
                  <span>Manipulasi Sensor Baterai & Daya</span>
                </div>
                <div className="card-subtitle">Uji coba status peringatan saat daya baterai mencapai level kritis</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Level Baterai Perangkat:</span>
                  <strong style={{ color: battery.level <= 20 ? 'var(--accent-rose)' : '#fff', fontFamily: 'var(--font-mono)', fontSize: '1.1rem' }}>
                    {battery.level}% {battery.level <= 20 ? '⚠️ (Peringatan Kritis)' : ''}
                  </strong>
                </div>
                <input 
                  type="range" 
                  min="3" 
                  max="100" 
                  value={battery.level} 
                  onChange={(e) => {
                    const newLvl = parseInt(e.target.value);
                    onUpdateBattery(newLvl);
                  }}
                  style={{ width: '100%', accentColor: battery.level <= 20 ? '#ef4444' : '#6366f1' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className={`btn ${battery.isCharging ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => {
                    soundFX.playClick();
                    onToggleCharger();
                    if (showNotificationToast) {
                      showNotificationToast(battery.isCharging ? "Kabel charger dilepas (Discharging)" : "Fast Charger terpasang (Mengisi Daya)", "info");
                    }
                  }}
                  style={{ flex: 1 }}
                >
                  <Zap size={15} />
                  <span>{battery.isCharging ? "Cabut Charger (Discharging)" : "Pasang Fast Charger (USB-PD)"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Remote MDM Action Triggers */}
          <div className="glass-card">
            <div className="card-header-row">
              <div>
                <div className="card-title">
                  <Sliders size={18} style={{ color: 'var(--accent-indigo)' }} />
                  <span>Pemicu Perintah MDM Langsung</span>
                </div>
                <div className="card-subtitle">Kirim instruksi cepat dan lihat respon langsung pada layar smartphone</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <button 
                className={`btn ${isLocked ? 'btn-warning' : 'btn-secondary'}`}
                onClick={() => {
                  onToggleLock();
                  if (showNotificationToast) {
                    showNotificationToast(isLocked ? "Layar berhasil dibuka kunci" : "Layar dikunci secara remote", "info");
                  }
                }}
              >
                {isLocked ? <Unlock size={15} /> : <Lock size={15} />}
                <span>{isLocked ? "Buka Kunci Layar" : "Kunci Layar Remote"}</span>
              </button>

              <button 
                className={`btn ${isAlarm ? 'btn-danger' : 'btn-secondary'}`}
                onClick={() => {
                  if (isAlarm) {
                    soundFX.stopSiren();
                    onToggleAlarm(false);
                    if (showNotificationToast) showNotificationToast("Sirene Alarm Dimatikan", "info");
                  } else {
                    soundFX.startSiren();
                    onToggleAlarm(true);
                    if (showNotificationToast) showNotificationToast("🚨 SIRENE ALARM AKTIF", "error");
                  }
                }}
              >
                <BellRing size={15} />
                <span>{isAlarm ? "Matikan Siren Alarm" : "Bunyikan Siren Alarm"}</span>
              </button>

              <button 
                className="btn btn-secondary"
                onClick={handleSimulateGps}
              >
                <Play size={15} />
                <span>Simulasi Gerak GPS</span>
              </button>

              <button 
                className="btn btn-secondary"
                onClick={handleRebootClick}
              >
                <RotateCcw size={15} />
                <span>Simulasi Reboot</span>
              </button>
            </div>
          </div>

          {/* Card 3: Custom Push Notification Toast Sender */}
          <div className="glass-card">
            <div className="card-header-row">
              <div>
                <div className="card-title">
                  <Send size={18} style={{ color: 'var(--accent-cyan)' }} />
                  <span>Kirim Notifikasi Push ke Layar HP</span>
                </div>
                <div className="card-subtitle">Pesan akan muncul sebagai banner drop-down pada layar ponsel virtual</div>
              </div>
            </div>

            <form onSubmit={handleSendCustomNotif} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
                <input 
                  type="text" 
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  placeholder="Judul Pesan..."
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', padding: '8px 12px', color: '#fff', fontSize: '0.84rem' }}
                />
                <input 
                  type="text" 
                  value={quickBody}
                  onChange={(e) => setQuickBody(e.target.value)}
                  placeholder="Isi Notifikasi..."
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', padding: '8px 12px', color: '#fff', fontSize: '0.84rem' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                <Send size={14} />
                <span>Kirimkan Notifikasi ke Layar Smartphone</span>
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
