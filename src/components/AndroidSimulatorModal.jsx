import React, { useState, useEffect } from 'react';
import { 
  X, 
  Wifi, 
  WifiOff, 
  Battery, 
  BatteryCharging, 
  Signal, 
  Lock, 
  Unlock, 
  BellRing, 
  Smartphone, 
  Volume2, 
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Zap,
  MapPin
} from 'lucide-react';
import { soundFX } from '../utils/audio';

export default function AndroidSimulatorModal({ 
  device, 
  onClose, 
  onUpdateBattery, 
  onToggleCharger, 
  onToggleLock, 
  onDismissNotif, 
  activeToast 
}) {
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [simTime, setSimTime] = useState('');

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

  const handleUnlockAttempt = (e) => {
    e.preventDefault();
    if (pinInput === (device.controls?.unlockPin || "9988")) {
      soundFX.playLockSound();
      setPinError(false);
      setPinInput('');
      onToggleLock(); // unlock
    } else {
      soundFX.playBeep(220, 0.2, 'sawtooth');
      setPinError(true);
      setTimeout(() => setPinError(false), 2000);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '820px', padding: '24px' }}>
        <button id="btn-close-simulator" className="modal-close-btn" onClick={onClose} aria-label="Tutup">
          <X size={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
          <div className="vital-icon-box" style={{ background: 'rgba(99, 102, 241, 0.2)', color: 'var(--accent-indigo)' }}>
            <Smartphone size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
              Virtual Android Smartphone Simulator
            </h2>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Simulasi interaktif 2 arah: uji remote command & manipulasi sensor telemetri secara instan.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start' }}>
          {/* Virtual Phone Mockup */}
          <div className="android-phone-frame">
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
              {/* Push Notification Banner Toast */}
              {activeToast && (
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
                      <X size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Siren Alarm Flasher Screen */}
              {isAlarm && (
                <div className="alarm-active-flasher">
                  <BellRing size={54} style={{ marginBottom: '14px', animation: 'pulse-ring 0.6s infinite' }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '0.05em' }}>
                    ALARM SENTINEL DARURAT!
                  </h3>
                  <p style={{ fontSize: '0.78rem', opacity: 0.9, marginTop: '8px' }}>
                    Siren bunyi desibel tinggi aktif untuk melacak lokasi perangkat fisik.
                  </p>
                </div>
              )}

              {/* MDM Locked Overlay Screen */}
              {isLocked && (
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
                        PIN Salah! Gunakan PIN MDM: {device.controls?.unlockPin || '9988'}
                      </span>
                    )}

                    <button type="submit" className="btn btn-warning" style={{ fontSize: '0.76rem', padding: '6px 14px' }}>
                      <Unlock size={14} />
                      <span>Buka Kunci Layar</span>
                    </button>
                  </form>
                </div>
              )}

              {/* Regular Android Home Screen */}
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

                {/* Simulated Android App Grid */}
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                        WA
                      </div>
                      <span style={{ fontSize: '0.65rem', color: '#fff' }}>WhatsApp</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#4285F4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                        G
                      </div>
                      <span style={{ fontSize: '0.65rem', color: '#fff' }}>Chrome</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#EA4335', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                        <MapPin size={20} />
                      </div>
                      <span style={{ fontSize: '0.65rem', color: '#fff' }}>Maps</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                        <Smartphone size={20} />
                      </div>
                      <span style={{ fontSize: '0.65rem', color: '#fff' }}>Sentinel</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Gesture Navigation Bar */}
                <div className="phone-home-pill" />
              </div>
            </div>
          </div>

          {/* Interactive Hardware Simulation Controls */}
          <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="glass-card" style={{ padding: '16px' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BatteryCharging size={16} style={{ color: 'var(--accent-emerald)' }} />
                <span>Simulasi Baterai & Daya</span>
              </h4>

              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Level Baterai Android:</span>
                  <strong style={{ color: battery.level <= 20 ? 'var(--accent-rose)' : '#fff', fontFamily: 'var(--font-mono)' }}>
                    {battery.level}%
                  </strong>
                </div>
                <input 
                  type="range" 
                  min="2" 
                  max="100" 
                  value={battery.level} 
                  onChange={(e) => onUpdateBattery(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: battery.level <= 20 ? '#ef4444' : '#6366f1' }}
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Geser ke &lt;20% untuk memicu status & badge PERINGATAN KRITIS di dashboard.
                </span>
              </div>

              <button 
                className={`btn ${battery.isCharging ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => {
                  soundFX.playClick();
                  onToggleCharger();
                }}
                style={{ width: '100%' }}
              >
                <Zap size={14} />
                <span>{battery.isCharging ? "Lepas Kabel Charger (Discharging)" : "Pasang Fast Charger (USB-PD)"}</span>
              </button>
            </div>

            <div className="glass-card" style={{ padding: '16px' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
                Uji Interaksi Cepat
              </h4>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.4' }}>
                Coba kirim "Lock Screen" atau "Bunyikan Alarm" dari tab Remote Command, lalu perhatikan layar smartphone ini bereaksi secara langsung!
              </p>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    soundFX.playLockSound();
                    onToggleLock();
                  }}
                  style={{ flex: 1, fontSize: '0.76rem' }}
                >
                  {isLocked ? "Buka Kunci" : "Kunci Layar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
