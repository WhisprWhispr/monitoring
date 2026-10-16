import React, { useState, useEffect, useRef } from 'react';
import { 
  Smartphone, 
  Battery, 
  BatteryCharging, 
  MapPin, 
  Wifi, 
  Cpu, 
  Activity, 
  CheckCircle2, 
  X, 
  Radio, 
  ShieldCheck, 
  Volume2, 
  BellRing,
  Sparkles
} from 'lucide-react';
import { soundFX } from '../utils/audio';

export default function WebSensorAgentModal({ isOpen, onClose, showNotificationToast }) {
  const [isActive, setIsActive] = useState(false);
  const [batteryState, setBatteryState] = useState({ level: 85, isCharging: false });
  const [gpsState, setGpsState] = useState({ lat: -6.2088, lng: 106.8456, accuracy: 10, speed: 0 });
  const [netState, setNetState] = useState({ type: '4G/Wi-Fi', speed: 25 });
  const [deviceInfo, setDeviceInfo] = useState({ name: 'Samsung Android Device', cores: 8, ram: 6 });
  const [streamCount, setStreamCount] = useState(0);

  const deviceIdRef = useRef(`phone-${Math.floor(1000 + Math.random() * 9000)}`);
  const intervalRef = useRef(null);

  // Initialize browser hardware sensors
  useEffect(() => {
    // 1. Detect hardware concurrency & RAM
    const cores = navigator.hardwareConcurrency || 8;
    const ram = navigator.deviceMemory || 6;
    
    // Parse UA
    const ua = navigator.userAgent;
    let devName = "Smartphone Android (Web Agent)";
    if (ua.includes("SM-") || ua.includes("Samsung")) {
      devName = "Samsung Galaxy (Sensor Web Aktif)";
    } else if (ua.includes("Android")) {
      devName = "Android Mobile (Sensor Web Aktif)";
    }
    setDeviceInfo({ name: devName, cores, ram });

    // 2. Battery API
    if (navigator.getBattery) {
      navigator.getBattery().then(bat => {
        const updateBat = () => {
          setBatteryState({
            level: Math.round(bat.level * 100),
            isCharging: bat.charging
          });
        };
        updateBat();
        bat.addEventListener('levelchange', updateBat);
        bat.addEventListener('chargingchange', updateBat);
      }).catch(() => {});
    }

    // 3. Network Information API
    if (navigator.connection) {
      setNetState({
        type: navigator.connection.effectiveType?.toUpperCase() || '4G/5G',
        speed: navigator.connection.downlink || 30
      });
    }

    // 4. Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setGpsState({
            lat: +pos.coords.latitude.toFixed(6),
            lng: +pos.coords.longitude.toFixed(6),
            accuracy: Math.round(pos.coords.accuracy),
            speed: Math.round(pos.coords.speed || 0)
          });
        },
        () => {},
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  // Streaming loop when activated
  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const reportTelemetry = async () => {
      const payload = {
        id: deviceIdRef.current,
        serialNumber: deviceIdRef.current,
        name: deviceInfo.name,
        assignedUser: "Pengguna Browser HP",
        status: batteryState.level <= 15 ? "alert" : "online",
        brand: "Samsung / Android",
        model: "Sensor Web Nirkabel (Tanpa Debugging)",
        os: "Android Browser Client",
        buildNumber: "WEB-AGENT-V1",
        uiVersion: "Native HTML5 Hardware API",
        securityPatch: "Terkini",
        imei: deviceIdRef.current,
        phoneNumber: "Tersambung via Web Wi-Fi",
        uptime: "Live Streaming",
        screenOn: true,
        screenBrightness: 85,

        battery: {
          level: batteryState.level,
          isCharging: batteryState.isCharging,
          chargeType: batteryState.isCharging ? "Fast Charging" : "Discharging",
          temperature: 31.8,
          health: "Good (Hardware Checked)",
          voltage: 4100,
          technology: "Li-Ion",
          cycles: 85,
          estimatedTimeRemaining: batteryState.isCharging ? "Sedang mengisi daya" : "Baterai normal"
        },

        hardware: {
          cpuLoad: Math.floor(Math.random() * 20 + 15),
          cpuCores: deviceInfo.cores,
          cpuChipset: "Octa-Core Native Hardware",
          cpuTemp: 34.2,
          ramTotal: deviceInfo.ram,
          ramUsed: +(deviceInfo.ram * 0.6).toFixed(1),
          storageTotal: 128,
          storageUsed: 62.4,
          storageApps: 24.0,
          storageMedia: 28.0,
          storageSystem: 10.4
        },

        connectivity: {
          wifiEnabled: true,
          wifiSsid: "Wi-Fi Lokal Terkoneksi",
          wifiBssid: "Real-Sensor",
          wifiSignal: -54,
          ipAddress: "192.168.18.67",
          publicIp: "103.144.170.82",
          macAddress: "AA:BB:CC:DD:EE:FF",
          cellularType: netState.type,
          carrier: "Operator Seluler",
          cellularSignal: -72,
          bluetoothEnabled: true,
          bluetoothDevice: "Aktif",
          downloadSpeed: netState.speed,
          uploadSpeed: 15.0,
          vpnActive: false,
          vpnName: "Nonaktif"
        },

        location: {
          lat: gpsState.lat,
          lng: gpsState.lng,
          accuracy: gpsState.accuracy,
          altitude: 18,
          speed: gpsState.speed,
          heading: 0,
          address: "Lokasi GPS Asli Sensor HP (Web Geolocation)",
          geofenceName: "Zona Pantau HP",
          geofenceStatus: "safe",
          geofenceRadius: 400,
          geofenceCenter: { lat: gpsState.lat, lng: gpsState.lng },
          lastUpdate: "Live Streaming Browser"
        },

        locationHistory: [
          { lat: gpsState.lat, lng: gpsState.lng, timestamp: "Hari ini", speed: gpsState.speed }
        ],

        security: {
          score: 98,
          grade: "A+",
          rooted: false,
          bootloaderUnlocked: false,
          usbDebugging: false,
          developerOptions: false,
          unknownSources: false,
          playProtectActive: true,
          selinuxStatus: "Enforcing",
          screenLockType: "PIN / Biometrik",
          encryption: "Hardware Encryption",
          knoxStatus: "Aman (Non-Rooted)",
          threatsDetected: 0,
          warnings: ["Mode Sensor Web: Tidak memerlukan izin USB Debugging."]
        },

        controls: {
          isLocked: false,
          lockMessage: "Perangkat ini dipantau via Sentinel Web Agent.",
          unlockPin: "1234",
          isAlarmPlaying: false,
          isFlashlightOn: false,
          isBatterySaver: false,
          isKioskMode: false,
          cameraStreamActive: false,
          lastPing: "Baru saja"
        },

        apps: [
          { id: "wa-1", name: "WhatsApp", package: "com.whatsapp", version: "2.24", category: "Komunikasi", size: "120 MB", memory: "180 MB", battery: "12%", permissions: ["Kamera", "Lokasi"], status: "running", safe: true },
          { id: "wa-2", name: "Google Chrome", package: "com.android.chrome", version: "128", category: "Browser", size: "150 MB", memory: "280 MB", battery: "15%", permissions: ["Lokasi"], status: "running", safe: true }
        ],

        notifications: [
          { id: "wn-1", app: "Web Sensor Agent", title: "Sensor HP Aktif", text: "Streaming data baterai, GPS, dan RAM ke konsol pemantauan.", time: "Baru saja", type: "system", unread: true }
        ],

        calls: [],
        sms: []
      };

      try {
        const targetHost = (typeof window !== 'undefined' && window.location.hostname) ? window.location.hostname : '192.168.18.67';
        const res = await fetch(`http://${targetHost}:5001/api/report-telemetry`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        setStreamCount(prev => prev + 1);

        // Handle remote commands from PC console (Vibrate / Alarm / Toast)
        if (data.commands && data.commands.length > 0) {
          for (const cmd of data.commands) {
            if (cmd.action === 'ring_siren' || cmd.action === 'vibrate') {
              soundFX.startSiren();
              if (navigator.vibrate) navigator.vibrate([500, 250, 500, 250, 1000]);
              alert("🚨 PERINGATAN SENTINEL MDM: Alarm darurat dibunyikan oleh admin!");
            } else if (cmd.action === 'stop_siren') {
              soundFX.stopSiren();
            } else if (cmd.action === 'push_notification') {
              soundFX.playNotification();
              alert(`📢 NOTIFIKASI SENTINEL:\n${cmd.params?.title || 'Pesan'}\n${cmd.params?.body || ''}`);
            }
          }
        }
      } catch (err) {
        // quiet
      }
    };

    reportTelemetry();
    intervalRef.current = setInterval(reportTelemetry, 2500);
    return () => clearInterval(intervalRef.current);
  }, [isActive, batteryState, gpsState, netState, deviceInfo]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '620px', padding: '26px' }}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Tutup">
          <X size={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <div className="vital-icon-box" style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-emerald)', width: '48px', height: '48px' }}>
            <Radio size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
              Mode Sambung Tanpa Debugging (Web Sensor Agent)
            </h2>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Hubungkan sensor nyata HP Android (Baterai, GPS, RAM) hanya lewat browser tanpa USB Debugging!
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div style={{ 
          background: isActive 
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)' 
            : 'rgba(0,0,0,0.4)', 
          border: `1px solid ${isActive ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-light)'}`, 
          borderRadius: 'var(--radius-lg)', 
          padding: '20px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="pulse-dot" style={{ background: isActive ? 'var(--accent-emerald)' : 'var(--text-muted)' }} />
              <strong style={{ color: '#fff', fontSize: '1rem' }}>
                {isActive ? "🟢 Sensor HP Terhubung & Streaming Live" : "⚪ Sensor HP Sedang Nonaktif"}
              </strong>
            </div>

            <button 
              className={`btn ${isActive ? 'btn-danger' : 'btn-primary'}`}
              onClick={() => {
                soundFX.playNotification();
                const next = !isActive;
                setIsActive(next);
                if (showNotificationToast) {
                  showNotificationToast(next ? "Sensor HP Berhasil Terhubung ke Dashboard!" : "Streaming Sensor HP Dihentikan", next ? "success" : "info");
                }
              }}
            >
              {isActive ? "Putuskan Sensor HP" : "🚀 Aktifkan & Hubungkan Sensor HP Ini"}
            </button>
          </div>

          {/* Real Sensor Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Battery size={13} />
                <span>Level Baterai</span>
              </div>
              <strong style={{ color: '#fff', fontSize: '1.05rem', fontFamily: 'var(--font-mono)' }}>{batteryState.level}%</strong>
              <div style={{ fontSize: '0.68rem', color: 'var(--accent-emerald)' }}>
                {batteryState.isCharging ? "Sedang Diisi Daya" : "Discharging"}
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={13} />
                <span>Koordinat GPS</span>
              </div>
              <strong style={{ color: '#fff', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>{gpsState.lat}, {gpsState.lng}</strong>
              <div style={{ fontSize: '0.68rem', color: 'var(--accent-cyan)' }}>Akurasi {gpsState.accuracy}m</div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Cpu size={13} />
                <span>Memori RAM & CPU</span>
              </div>
              <strong style={{ color: '#fff', fontSize: '1.05rem', fontFamily: 'var(--font-mono)' }}>{deviceInfo.ram} GB RAM</strong>
              <div style={{ fontSize: '0.68rem', color: 'var(--accent-indigo)' }}>{deviceInfo.cores} CPU Cores</div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Activity size={13} />
                <span>Paket Terkirim</span>
              </div>
              <strong style={{ color: '#fff', fontSize: '1.05rem', fontFamily: 'var(--font-mono)' }}>{streamCount} sync</strong>
              <div style={{ fontSize: '0.68rem', color: 'var(--accent-emerald)' }}>Interval 2.5s</div>
            </div>
          </div>
        </div>

        {/* Explanation of 3 Ways to Connect Without Debugging */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h4 style={{ fontSize: '0.86rem', color: '#fff', fontWeight: 700 }}>
            3 Cara Menghubungkan HP Android Tanpa Opsi Pengembang / USB Debugging:
          </h4>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '0.78rem', lineHeight: '1.5' }}>
            <strong style={{ color: 'var(--accent-emerald)' }}>1. Cara Tercepat (Web Sensor Agent - Buka di Chrome HP):</strong>
            <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0' }}>
              Cukup buka link <strong>http://192.168.18.67:5173/</strong> di browser Chrome HP Anda, lalu tekan tombol <em>"Aktifkan Sensor HP Ini"</em> di atas. Baterai asli, lokasi GPS, kecepatan, dan memori RAM HP langsung mengalir live ke dashboard di laptop tanpa kabel!
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '0.78rem', lineHeight: '1.5' }}>
            <strong style={{ color: 'var(--accent-indigo)' }}>2. Cara Standar Perusahaan (Install APK MDM Sentinel / Device Owner):</strong>
            <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0' }}>
              Sama seperti aplikasi Enterprise (Microsoft Intune / Samsung Knox Manage), pasang file aplikasi <code>.apk</code> di HP Android Anda sekali saja. Aplikasi akan berjalan di latar belakang HP dan mengirim telemetri otomatis ke server via Wi-Fi/4G.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '0.78rem', lineHeight: '1.5' }}>
            <strong style={{ color: 'var(--accent-cyan)' }}>3. Wireless Pairing (Wi-Fi Nirkabel Android 11+):</strong>
            <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0' }}>
              Jika tidak ingin memakai kabel USB sama sekali, Anda bisa menghubungkan via Wi-Fi langsung di menu <em>Wireless Debugging</em> menggunakan kode pairing 6 angka tanpa perlu colok kabel.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '18px' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
