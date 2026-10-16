import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_DEVICES } from './data/mockDevices';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LiveAdbStatusBar from './components/LiveAdbStatusBar';
import DeviceHeroBanner from './components/DeviceHeroBanner';
import TelemetryVitals from './components/TelemetryVitals';
import GeoLocationView from './components/GeoLocationView';
import RemoteCommandCenter from './components/RemoteCommandCenter';
import SecurityAuditView from './components/SecurityAuditView';
import AppManagerView from './components/AppManagerView';
import ActivityLogsView from './components/ActivityLogsView';
import AndroidSimulatorModal from './components/AndroidSimulatorModal';
import AndroidSimulatorStudio from './components/AndroidSimulatorStudio';
import AdbBridgeView from './components/AdbBridgeView';
import ExportReportModal from './components/ExportReportModal';
import AddDeviceModal from './components/AddDeviceModal';
import WebSensorAgentModal from './components/WebSensorAgentModal';
import GlobalToast from './components/GlobalToast';
import { soundFX } from './utils/audio';

export default function App() {
  const [devices, setDevices] = useState(INITIAL_DEVICES);
  const [selectedDeviceId, setSelectedDeviceId] = useState(INITIAL_DEVICES[0].id);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Global Toast Notifications
  const [globalToast, setGlobalToast] = useState(null);
  const showNotificationToast = (message, type = 'info') => {
    setGlobalToast({ message, type });
    setTimeout(() => setGlobalToast(null), 3500);
  };

  // Real ADB Status & Live Polling
  const [adbStatus, setAdbStatus] = useState({ adbInstalled: true, adbPath: 'D:\\sdk\\platform-tools\\adb.exe', connectedCount: 0 });
  const [realDevicesCount, setRealDevicesCount] = useState(0);
  const prevRealCountRef = useRef(0);

  // Modals
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);
  const [isWebSensorOpen, setIsWebSensorOpen] = useState(false);
  const [activeToast, setActiveToast] = useState(null);

  // Poll real devices from ADB server
  const backendHost = typeof window !== 'undefined' ? (window.location.hostname || 'localhost') : 'localhost';

  const fetchLiveDevices = async () => {
    try {
      const res = await fetch(`http://${backendHost}:5001/api/live-devices`);
      if (!res.ok) return;
      const data = await res.json();
      setAdbStatus(data);

      if (data.devices && data.devices.length > 0) {
        setRealDevicesCount(data.devices.length);

        setDevices(prevDevices => {
          const simulatedOnly = prevDevices.filter(d => !d.isRealDevice);
          return [...data.devices, ...simulatedOnly];
        });

        // Automatically select the real device if newly plugged in
        if (prevRealCountRef.current < data.devices.length) {
          soundFX.playNotification();
          setSelectedDeviceId(data.devices[0].id);
        }
        prevRealCountRef.current = data.devices.length;
      } else {
        setRealDevicesCount(0);
        prevRealCountRef.current = 0;
      }
    } catch {
      // Backend quiet
    }
  };

  useEffect(() => {
    fetchLiveDevices();
    const timer = setInterval(fetchLiveDevices, 2500);

    // Check if opened via QR enrollment scan from smartphone camera or web sensor agent param
    const urlParams = new URLSearchParams(window.location.search);
    const enrollToken = urlParams.get('enroll');
    const sensorParam = urlParams.get('sensor');
    if (enrollToken || sensorParam) {
      soundFX.playNotification();
      showNotificationToast(`📱 Perangkat Siap Dikoneksikan via Sensor Web! Token: ${enrollToken || 'Auto'}`, 'success');
      setIsWebSensorOpen(true);
    }

    return () => clearInterval(timer);
  }, []);

  const handleConnectWifi = async (ip) => {
    try {
      const res = await fetch(`http://${backendHost}:5001/api/connect-wifi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip })
      });
      const data = await res.json();
      await fetchLiveDevices();
      return data;
    } catch (err) {
      return { success: false, output: err.message };
    }
  };

  // Find active device
  const currentDevice = devices.find(d => d.id === selectedDeviceId) || devices[0];

  // Helper to send real ADB command if current device is physical
  const sendRealCommand = async (action, params = {}) => {
    if (!currentDevice?.isRealDevice) return;
    try {
      await fetch(`http://${backendHost}:5001/api/real-command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId: currentDevice.id, action, params })
      });
    } catch {}
  };

  // Helper to update current device
  const updateCurrentDevice = (updater) => {
    setDevices(prevDevices => 
      prevDevices.map(d => {
        if (d.id === currentDevice.id) {
          return typeof updater === 'function' ? updater(d) : { ...d, ...updater };
        }
        return d;
      })
    );
  };

  // Device Ping
  const handlePing = () => {
    soundFX.playNotification();
    showNotificationToast(`Ping dikirim ke ${currentDevice?.name || 'Perangkat'}. Respon: 14ms (Optimal)`, 'success');
    updateCurrentDevice(prev => ({
      ...prev,
      lastSeen: "Baru saja (Respon: 14ms)",
      controls: { ...prev.controls, lastPing: "Baru saja" }
    }));
  };

  // Toggle Remote Lock
  const handleToggleLock = (customMsg, customPin) => {
    soundFX.playLockSound();
    const nextLocked = !currentDevice?.controls?.isLocked;
    showNotificationToast(nextLocked ? 'Layar ponsel berhasil dikunci secara remote!' : 'Layar ponsel berhasil dibuka kunci!', 'info');
    if (currentDevice?.isRealDevice) {
      sendRealCommand('toggle_screen');
    }
    updateCurrentDevice(prev => {
      const isNext = !prev.controls?.isLocked;
      return {
        ...prev,
        controls: {
          ...prev.controls,
          isLocked: isNext,
          lockMessage: customMsg || prev.controls?.lockMessage,
          unlockPin: customPin || prev.controls?.unlockPin
        }
      };
    });
  };

  // Toggle Siren Alarm
  const handleToggleAlarm = (isPlaying) => {
    showNotificationToast(isPlaying ? '🚨 SIRENE ALARM DIAKTIFKAN DI PERANGKAT!' : 'Sirene alarm dimatikan', isPlaying ? 'error' : 'info');
    if (currentDevice?.isRealDevice && isPlaying) {
      sendRealCommand('ring_siren');
    } else if (currentDevice?.isRealDevice && !isPlaying) {
      sendRealCommand('stop_siren');
    }
    updateCurrentDevice(prev => ({
      ...prev,
      controls: {
        ...prev.controls,
        isAlarmPlaying: isPlaying
      }
    }));
  };

  // Push Notification to Android Device
  const handlePushNotification = (title, body) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      app: "Sentinel MDM",
      title,
      text: body,
      time: "Baru saja",
      type: "system",
      unread: true
    };

    // If connected to a real physical phone, send real ADB push notification!
    if (currentDevice?.isRealDevice) {
      sendRealCommand('push_notification', { title, body });
    }

    setActiveToast({ app: "Sentinel MDM", title, body });
    showNotificationToast(`Notifikasi "${title}" terkirim ke ponsel Android fisik!`, 'success');
    // Auto dismiss toast after 6 seconds
    setTimeout(() => {
      setActiveToast(null);
    }, 6000);

    updateCurrentDevice(prev => ({
      ...prev,
      notifications: [newNotif, ...(prev.notifications || [])]
    }));
  };

  // Toggle Battery Saver
  const handleToggleBatterySaver = () => {
    const nextVal = !currentDevice?.controls?.isBatterySaver;
    showNotificationToast(nextVal ? 'Mode Penghemat Baterai Diaktifkan' : 'Mode Penghemat Baterai Dimatikan', 'info');
    updateCurrentDevice(prev => ({
      ...prev,
      controls: {
        ...prev.controls,
        isBatterySaver: !prev.controls?.isBatterySaver
      }
    }));
  };

  // Toggle Flashlight
  const handleToggleFlashlight = () => {
    const nextVal = !currentDevice?.controls?.isFlashlightOn;
    showNotificationToast(nextVal ? 'Senter Lampu LED HP Dinyalakan' : 'Senter Lampu LED HP Dimatikan', 'info');
    updateCurrentDevice(prev => ({
      ...prev,
      controls: {
        ...prev.controls,
        isFlashlightOn: !prev.controls?.isFlashlightOn
      }
    }));
  };

  // Remote Reboot Simulation / Real ADB
  const handleRemoteReboot = () => {
    soundFX.playBeep(440, 0.3);
    showNotificationToast('Perintah Reboot terkirim ke ponsel. Perangkat sedang memulai ulang...', 'warning');
    if (currentDevice?.isRealDevice) {
      sendRealCommand('reboot');
    }
    updateCurrentDevice(prev => ({
      ...prev,
      status: "offline",
      uptime: "Rebooting..."
    }));

    setTimeout(() => {
      soundFX.playNotification();
      showNotificationToast('Perangkat berhasil boot kembali (Online & Siap)', 'success');
      updateCurrentDevice(prev => ({
        ...prev,
        status: "online",
        uptime: "1 menit",
        lastSeen: "Baru saja"
      }));
    }, 3000);
  };

  // Factory Wipe Simulation
  const handleFactoryWipe = () => {
    soundFX.playBeep(200, 0.4, 'sawtooth');
    showNotificationToast('⚠️ Factory Wipe MDM Berhasil: Data pengguna telah dibersihkan!', 'error');
    updateCurrentDevice(prev => ({
      ...prev,
      apps: prev.apps.filter(a => a.status === 'protected'),
      notifications: [],
      calls: [],
      sms: [],
      security: { ...prev.security, threatsDetected: 0, warnings: [] },
      hardware: { ...prev.hardware, storageUsed: 24.0, storageApps: 12.0, storageMedia: 2.0 }
    }));
  };

  // Battery Level slider from Simulator
  const handleUpdateBattery = (newLevel) => {
    updateCurrentDevice(prev => ({
      ...prev,
      battery: {
        ...prev.battery,
        level: newLevel,
        estimatedTimeRemaining: newLevel < 20 ? "Kritis (< 30 menit)" : prev.battery.estimatedTimeRemaining
      },
      status: newLevel < 20 ? "alert" : "online"
    }));
  };

  // Charger toggle from Simulator
  const handleToggleCharger = () => {
    updateCurrentDevice(prev => {
      const isCharging = !prev.battery.isCharging;
      return {
        ...prev,
        battery: {
          ...prev.battery,
          isCharging,
          chargeType: isCharging ? "USB-PD (Fast Charging 45W)" : "Discharging"
        }
      };
    });
  };

  // Update Location coordinates & history
  const handleUpdateLocation = (newLoc) => {
    updateCurrentDevice(prev => {
      const newHistoryItem = {
        lat: newLoc.lat,
        lng: newLoc.lng,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        speed: newLoc.speed
      };

      return {
        ...prev,
        location: newLoc,
        locationHistory: [...(prev.locationHistory || []), newHistoryItem]
      };
    });
  };

  // Uninstall App
  const handleUninstallApp = (appId) => {
    soundFX.playNotification();
    if (currentDevice?.isRealDevice) {
      const targetApp = currentDevice.apps.find(a => a.id === appId);
      if (targetApp) sendRealCommand('uninstall', { package: targetApp.package });
    }
    updateCurrentDevice(prev => ({
      ...prev,
      apps: prev.apps.filter(a => a.id !== appId)
    }));
  };

  // Force Stop App
  const handleForceStopApp = (appId) => {
    if (currentDevice?.isRealDevice) {
      const targetApp = currentDevice.apps.find(a => a.id === appId);
      if (targetApp) sendRealCommand('force_stop', { package: targetApp.package });
    }
    updateCurrentDevice(prev => ({
      ...prev,
      apps: prev.apps.map(a => a.id === appId ? { ...a, status: 'sleeping', memory: '0 MB' } : a)
    }));
  };

  // Launch Real App on Device
  const handleLaunchRealApp = async (packageName) => {
    soundFX.playClick();
    showNotificationToast(`Membuka aplikasi ${packageName} di ponsel...`, 'info');
    if (currentDevice?.isRealDevice && packageName) {
      await sendRealCommand('launch_app', { package: packageName });
    }
  };

  // Add Device
  const handleAddDevice = (newDevice) => {
    soundFX.playNotification();
    setDevices(prev => [...prev, newDevice]);
    setSelectedDeviceId(newDevice.id);
    showNotificationToast(`Perangkat "${newDevice.name}" berhasil didaftarkan!`, 'success');
  };

  // Import Real Physical Device via ADB Simulation
  const handleImportAdbDevice = () => {
    const adbDevId = `adb-device-${Date.now()}`;
    const realAdbDevice = {
      id: adbDevId,
      name: "Samsung Galaxy (ADB USB Connected)",
      tag: "Perangkat Fisik USB",
      assignedUser: "Pengembang Lokal (ADB Host)",
      status: "online",
      brand: "Samsung",
      model: "SM-G998B (Real Hardware)",
      os: "Android 14 (Physical)",
      buildNumber: "UP1A.231005.007",
      uiVersion: "One UI 6.1",
      securityPatch: "1 Oktober 2026",
      imei: "358129034918231",
      serialNumber: "RF8N30GHA1L",
      phoneNumber: "+62 813-0000-8888",
      uptime: "94 jam 10 menit",
      lastSeen: "Real ADB Active",
      screenOn: true,
      screenBrightness: 85,

      battery: {
        level: 82,
        isCharging: true,
        chargeType: "USB Debugging Cable (AC/USB)",
        temperature: 32.1,
        health: "Good (Hardware Checked)",
        voltage: 4.15,
        technology: "Li-Ion 5000 mAh",
        cycles: 110,
        estimatedTimeRemaining: "1 jam hingga penuh"
      },

      hardware: {
        cpuLoad: 29,
        cpuCores: 8,
        cpuChipset: "Exynos 2100 Octa-Core",
        cpuTemp: 36.2,
        ramTotal: 12,
        ramUsed: 6.4,
        storageTotal: 256,
        storageUsed: 112.0,
        storageApps: 54.0,
        storageMedia: 44.0,
        storageSystem: 14.0
      },

      connectivity: {
        wifiEnabled: true,
        wifiSsid: "Home-Office-WiFi",
        wifiBssid: "24:F5:A2:99:11:44",
        wifiSignal: -52,
        ipAddress: "192.168.1.188",
        publicIp: "180.252.12.90",
        macAddress: "5C:F9:38:12:89:BC",
        cellularType: "5G NSA",
        carrier: "Telkomsel 5G",
        cellularSignal: -74,
        bluetoothEnabled: true,
        bluetoothDevice: "Galaxy Watch (Active)",
        downloadSpeed: 75.0,
        uploadSpeed: 28.0,
        vpnActive: false,
        vpnName: "Nonaktif"
      },

      location: {
        lat: -6.2000,
        lng: 106.8166,
        accuracy: 3.8,
        altitude: 18.0,
        speed: 0,
        heading: 0,
        address: "Kawasan Menteng, Jakarta Pusat, DKI Jakarta",
        geofenceName: "Home Office Menteng",
        geofenceStatus: "safe",
        geofenceRadius: 300,
        geofenceCenter: { lat: -6.2000, lng: 106.8166 },
        lastUpdate: "Baru saja"
      },

      locationHistory: [
        { lat: -6.2000, lng: 106.8166, timestamp: "Hari ini", speed: 0 }
      ],

      security: {
        score: 92,
        grade: "A",
        rooted: false,
        bootloaderUnlocked: false,
        usbDebugging: true,
        developerOptions: true,
        unknownSources: false,
        playProtectActive: true,
        selinuxStatus: "Enforcing",
        screenLockType: "Fingerprint & PIN",
        encryption: "FBE AES-256",
        knoxStatus: "Knox 3.9 Active",
        threatsDetected: 0,
        warnings: ["USB Debugging aktif untuk transmisi ADB."]
      },

      controls: {
        isLocked: false,
        lockMessage: "Perangkat ini dikelola via ADB Bridge.",
        unlockPin: "1122",
        isAlarmPlaying: false,
        isFlashlightOn: false,
        isBatterySaver: false,
        isKioskMode: false,
        cameraStreamActive: false,
        lastPing: "Baru saja"
      },

      apps: [
        { id: "adb-a1", name: "WhatsApp", package: "com.whatsapp", version: "2.24.18", category: "Komunikasi", size: "135 MB", memory: "220 MB", battery: "14%", permissions: ["Kamera", "Lokasi"], status: "running", safe: true },
        { id: "adb-a2", name: "Google Chrome", package: "com.android.chrome", version: "128.0", category: "Browser", size: "180 MB", memory: "340 MB", battery: "12%", permissions: ["Lokasi"], status: "running", safe: true },
        { id: "adb-a3", name: "Spotify", package: "com.spotify.music", version: "8.9.60", category: "Media", size: "95 MB", memory: "160 MB", battery: "8%", permissions: ["Penyimpanan"], status: "running", safe: true }
      ],

      notifications: [
        { id: "adb-n1", app: "ADB Bridge", title: "Koneksi Fisik Terjalin", text: "Streaming telemetri hardware aktif melalui port ADB.", time: "Baru saja", type: "system", unread: true }
      ],

      calls: [],
      sms: []
    };

    setDevices(prev => [...prev, realAdbDevice]);
    setSelectedDeviceId(adbDevId);
    soundFX.playNotification();
    showNotificationToast("Perangkat fisik USB berhasil disinkronkan ke konsol pemantauan!", "success");
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        device={currentDevice}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Header 
          devices={devices}
          selectedDeviceId={selectedDeviceId}
          onSelectDevice={setSelectedDeviceId}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenSimulator={() => setActiveTab('simulator')}
          onOpenReport={() => setIsReportOpen(true)}
          onOpenAddDevice={() => setIsAddDeviceOpen(true)}
        />

        <main className="content-area">
          {/* Live ADB Hardware Bridge Status Bar */}
          <LiveAdbStatusBar 
            adbStatus={adbStatus} 
            realDevicesCount={realDevicesCount} 
            onRefreshAdb={fetchLiveDevices} 
            onConnectWifi={handleConnectWifi} 
            onOpenWebSensor={() => setIsWebSensorOpen(true)}
          />

          {/* Top Device Banner always visible for context */}
          <DeviceHeroBanner 
            device={currentDevice} 
            onPing={handlePing}
            onToggleLock={() => handleToggleLock()}
          />

          {/* Tab 1: Dashboard & Telemetry Overview */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <TelemetryVitals device={currentDevice} />
              <div className="dashboard-bento">
                <GeoLocationView 
                  device={currentDevice} 
                  onUpdateLocation={handleUpdateLocation} 
                />
                <ActivityLogsView device={currentDevice} />
              </div>
            </div>
          )}

          {/* Tab: Virtual Phone Studio */}
          {activeTab === 'simulator' && (
            <AndroidSimulatorStudio 
              device={currentDevice}
              onUpdateBattery={handleUpdateBattery}
              onToggleCharger={handleToggleCharger}
              onToggleLock={() => handleToggleLock()}
              onToggleAlarm={handleToggleAlarm}
              onPushNotification={handlePushNotification}
              onUpdateLocation={handleUpdateLocation}
              onRemoteReboot={handleRemoteReboot}
              activeToast={activeToast}
              onDismissNotif={() => setActiveToast(null)}
              onLaunchRealApp={handleLaunchRealApp}
              showNotificationToast={showNotificationToast}
            />
          )}

          {/* Tab 2: GPS & Live Geofence */}
          {activeTab === 'gps' && (
            <GeoLocationView 
              device={currentDevice} 
              onUpdateLocation={handleUpdateLocation} 
              showNotificationToast={showNotificationToast}
            />
          )}

          {/* Tab 3: Remote Command Center */}
          {activeTab === 'commands' && (
            <RemoteCommandCenter 
              device={currentDevice}
              onToggleLock={handleToggleLock}
              onToggleAlarm={handleToggleAlarm}
              onPushNotification={handlePushNotification}
              onToggleBatterySaver={handleToggleBatterySaver}
              onToggleFlashlight={handleToggleFlashlight}
              onRemoteReboot={handleRemoteReboot}
              onFactoryWipe={handleFactoryWipe}
              onOpenSimulator={() => setIsSimulatorOpen(true)}
              showNotificationToast={showNotificationToast}
            />
          )}

          {/* Tab 4: Security & Knox Audit */}
          {activeTab === 'security' && (
            <SecurityAuditView 
              device={currentDevice} 
              showNotificationToast={showNotificationToast}
            />
          )}

          {/* Tab 5: App Management */}
          {activeTab === 'apps' && (
            <AppManagerView 
              device={currentDevice}
              onUninstallApp={handleUninstallApp}
              onForceStopApp={handleForceStopApp}
              onLaunchRealApp={handleLaunchRealApp}
              showNotificationToast={showNotificationToast}
            />
          )}

          {/* Tab 6: Activity & Notifications */}
          {activeTab === 'logs' && (
            <ActivityLogsView device={currentDevice} />
          )}

          {/* Tab 7: ADB Bridge Hardware Connection */}
          {activeTab === 'adb' && (
            <AdbBridgeView onImportAdbDevice={handleImportAdbDevice} />
          )}
        </main>
      </div>

      {/* Global Toast Notification */}
      <GlobalToast toast={globalToast} onDismiss={() => setGlobalToast(null)} />

      {/* Virtual Android Phone Simulator Modal */}
      {isSimulatorOpen && (
        <AndroidSimulatorModal 
          device={currentDevice}
          onClose={() => setIsSimulatorOpen(false)}
          onUpdateBattery={handleUpdateBattery}
          onToggleCharger={handleToggleCharger}
          onToggleLock={() => handleToggleLock()}
          onDismissNotif={() => setActiveToast(null)}
          activeToast={activeToast}
        />
      )}

      {/* Export Report Modal */}
      {isReportOpen && (
        <ExportReportModal 
          device={currentDevice}
          onClose={() => setIsReportOpen(false)}
        />
      )}

      {/* Add New Device Modal */}
      {isAddDeviceOpen && (
        <AddDeviceModal 
          onClose={() => setIsAddDeviceOpen(false)}
          onAddDevice={handleAddDevice}
        />
      )}

      {/* Web Sensor Agent Modal (No USB Debugging Required!) */}
      <WebSensorAgentModal 
        isOpen={isWebSensorOpen}
        onClose={() => setIsWebSensorOpen(false)}
        showNotificationToast={showNotificationToast}
      />
    </div>
  );
}
