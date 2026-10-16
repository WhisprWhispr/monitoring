import React from 'react';
import { 
  Smartphone, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  BatteryCharging, 
  Wifi, 
  MapPin, 
  User, 
  Phone, 
  RefreshCw,
  BellRing
} from 'lucide-react';
import { soundFX } from '../utils/audio';

export default function DeviceHeroBanner({ device, onPing, onToggleLock }) {
  if (!device) return null;

  const isLocked = device.controls?.isLocked;
  const isAlarmPlaying = device.controls?.isAlarmPlaying;

  return (
    <div className="device-hero-card">
      <div className="device-hero-info">
        <div className="device-avatar-box">
          <Smartphone size={32} />
          <div className={`hero-status-indicator ${device.status}`} />
        </div>

        <div className="device-title-box">
          <h1>
            {device.name}
            {isAlarmPlaying && (
              <span className="pill pill-rose" style={{ animation: 'pulse-ring 1s infinite' }}>
                <BellRing size={12} /> ALARM AKTIF
              </span>
            )}
            {isLocked && (
              <span className="pill pill-amber">
                <Lock size={12} /> TERKUNCI (MDM)
              </span>
            )}
          </h1>

          <div className="device-meta-pills">
            <span className="pill pill-indigo">
              <strong>{device.os}</strong> ({device.uiVersion})
            </span>
            <span className="pill pill-dark">
              <User size={12} /> {device.assignedUser}
            </span>
            <span className="pill pill-dark">
              <Phone size={12} /> {device.phoneNumber}
            </span>
            <span className="pill pill-dark">
              IMEI: <span style={{ fontFamily: 'var(--font-mono)' }}>{device.imei}</span>
            </span>
            <span className="pill pill-dark">
              Uptime: {device.uptime}
            </span>
            {(device.security?.score ?? 90) >= 90 ? (
              <span className="pill pill-emerald">
                <ShieldCheck size={12} /> Skor Keamanan {device.security?.score ?? 95}/100
              </span>
            ) : (
              <span className="pill pill-rose">
                <ShieldAlert size={12} /> Skor Keamanan {device.security?.score ?? 70}/100
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="hero-quick-actions">
        <button 
          className="btn btn-secondary" 
          onClick={() => {
            soundFX.playClick();
            onPing();
          }}
          title="Kirim Ping Verifikasi Jaringan"
        >
          <RefreshCw size={15} />
          <span>Ping Device</span>
        </button>

        <button 
          className={`btn ${isLocked ? 'btn-warning' : 'btn-secondary'}`} 
          onClick={() => {
            onToggleLock();
          }}
          title={isLocked ? "Buka kunci layar perangkat" : "Kunci layar perangkat via MDM"}
        >
          {isLocked ? (
            <>
              <Unlock size={15} />
              <span>Buka Kunci Layar</span>
            </>
          ) : (
            <>
              <Lock size={15} />
              <span>Kunci Layar Remote</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
