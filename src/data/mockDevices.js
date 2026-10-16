// Rich Mock Dataset for Android Devices with Full Telemetry & Security Metrics

export const INITIAL_DEVICES = [
  {
    id: "dev-s24u-01",
    name: "Samsung Galaxy S24 Ultra",
    tag: "Unit Lapangan - Eksekutif",
    assignedUser: "Ahmad Rizki (Field Lead)",
    status: "online", // online | standby | alert | offline
    brand: "Samsung",
    model: "SM-S928B/DS",
    os: "Android 14",
    buildNumber: "UP1A.231005.007.S928BXXU1AXB5",
    uiVersion: "One UI 6.1",
    securityPatch: "1 Oktober 2026",
    imei: "354892091823901",
    serialNumber: "R5CW30AZX9L",
    phoneNumber: "+62 812-8890-1209",
    uptime: "148 jam 32 menit",
    lastSeen: "Baru saja",
    screenOn: true,
    screenBrightness: 78,
    
    // Battery Telemetry
    battery: {
      level: 84,
      isCharging: false,
      chargeType: "Discharging", // USB-C PD / Wireless / Discharging
      temperature: 33.4, // Celcius
      health: "Good (96% SOH)",
      voltage: 4.18, // Volts
      technology: "Li-Po 5000 mAh",
      cycles: 138,
      estimatedTimeRemaining: "11 jam 20 menit"
    },

    // Hardware Telemetry
    hardware: {
      cpuLoad: 34, // %
      cpuCores: 8,
      cpuChipset: "Qualcomm Snapdragon 8 Gen 3 (4nm)",
      cpuTemp: 38.5,
      ramTotal: 12, // GB
      ramUsed: 5.8, // GB
      storageTotal: 512, // GB
      storageUsed: 198.4, // GB
      storageApps: 84.2,
      storageMedia: 72.1,
      storageSystem: 42.1
    },

    // Connectivity
    connectivity: {
      wifiEnabled: true,
      wifiSsid: "Telkom-Corp-Secure-5G",
      wifiBssid: "74:83:C2:90:AF:11",
      wifiSignal: -54, // dBm
      ipAddress: "192.168.10.142",
      publicIp: "103.144.170.82",
      macAddress: "4C:1B:86:E9:9D:02",
      cellularType: "5G SA",
      carrier: "Telkomsel 5G Enterprise",
      cellularSignal: -78, // dBm
      bluetoothEnabled: true,
      bluetoothDevice: "Galaxy Buds Pro (Terhubung)",
      downloadSpeed: 42.8, // Mbps
      uploadSpeed: 18.4, // Mbps
      vpnActive: true,
      vpnName: "WireGuard MDM Tunnel"
    },

    // Geolocation & Geofencing
    location: {
      lat: -6.2088,
      lng: 106.8456,
      accuracy: 4.2, // meters
      altitude: 16.5, // meters
      speed: 0.0, // km/h
      heading: 45, // degrees
      address: "Jl. Jend. Sudirman Kav. 52-53, SCBD, Senayan, Jakarta Selatan",
      geofenceName: "HQ Jakarta Office",
      geofenceStatus: "safe", // safe | warning | breached
      geofenceRadius: 350, // meters
      geofenceCenter: { lat: -6.2088, lng: 106.8456 },
      lastUpdate: "3 detik yang lalu"
    },

    // Travel Trail History (Last positions)
    locationHistory: [
      { lat: -6.2255, lng: 106.8021, timestamp: "08:15 WIB", speed: 45 },
      { lat: -6.2198, lng: 106.8142, timestamp: "08:30 WIB", speed: 38 },
      { lat: -6.2130, lng: 106.8290, timestamp: "08:45 WIB", speed: 22 },
      { lat: -6.2088, lng: 106.8456, timestamp: "09:00 WIB", speed: 0 }
    ],

    // Security & Vulnerability Posture
    security: {
      score: 96, // 0 - 100
      grade: "A+",
      rooted: false,
      bootloaderUnlocked: false,
      usbDebugging: false,
      developerOptions: false,
      unknownSources: false,
      playProtectActive: true,
      selinuxStatus: "Enforcing",
      screenLockType: "Biometrik (Fingerprint + Knox PIN)",
      encryption: "Hardware FBE (AES-256 XTS)",
      knoxStatus: "Knox 3.10 Active (Warranty 0x0)",
      threatsDetected: 0,
      warnings: []
    },

    // Remote MDM Controls State
    controls: {
      isLocked: false,
      lockMessage: "Perangkat ini dikelola oleh IT Enterprise Sentinel. Hubungi admin jika ditemukan.",
      unlockPin: "9988",
      isAlarmPlaying: false,
      isFlashlightOn: false,
      isBatterySaver: false,
      isKioskMode: false,
      cameraStreamActive: false,
      lastPing: "Baru saja"
    },

    // Installed Applications
    apps: [
      { id: "app-1", name: "WhatsApp Business", package: "com.whatsapp.w4b", version: "2.24.12.78", category: "Komunikasi", size: "142 MB", memory: "210 MB", battery: "12%", permissions: ["Kamera", "Mikrofon", "Lokasi", "Kontak", "Penyimpanan"], status: "running", safe: true },
      { id: "app-2", name: "Microsoft Teams", package: "com.microsoft.teams", version: "1416/1.0.0", category: "Produktivitas", size: "230 MB", memory: "380 MB", battery: "18%", permissions: ["Kamera", "Mikrofon", "Notifikasi"], status: "running", safe: true },
      { id: "app-3", name: "Google Chrome", package: "com.android.chrome", version: "128.0.6613.88", category: "Browser", size: "195 MB", memory: "450 MB", battery: "14%", permissions: ["Lokasi", "Penyimpanan"], status: "running", safe: true },
      { id: "app-4", name: "Sentinel MDM Agent", package: "com.sentinel.mdm.agent", version: "3.4.1", category: "Sistem IT", size: "48 MB", memory: "65 MB", battery: "2%", permissions: ["Admin Perangkat", "Lokasi Latar Belakang", "Statistik", "Jaringan"], status: "protected", safe: true },
      { id: "app-5", name: "BCA Mobile", package: "com.bca", version: "3.2.0", category: "Keuangan", size: "88 MB", memory: "110 MB", battery: "1%", permissions: ["SMS", "Telepon"], status: "sleeping", safe: true },
      { id: "app-6", name: "Google Maps", package: "com.google.android.apps.maps", version: "11.134.0102", category: "Navigasi", size: "165 MB", memory: "190 MB", battery: "8%", permissions: ["Lokasi Presisi", "Penyimpanan"], status: "cached", safe: true },
      { id: "app-7", name: "Slack", package: "com.slack", version: "24.08.20", category: "Komunikasi", size: "115 MB", memory: "140 MB", battery: "6%", permissions: ["Notifikasi", "Kamera"], status: "running", safe: true },
      { id: "app-8", name: "Outlook Mobile", package: "com.microsoft.office.outlook", version: "4.2430.1", category: "Email", size: "178 MB", memory: "185 MB", battery: "9%", permissions: ["Kontak", "Kalender"], status: "running", safe: true }
    ],

    // Real-Time Notification Stream
    notifications: [
      { id: "notif-1", app: "Microsoft Teams", title: "Meeting Project Sentinel", text: "Hendro: Link presentasi arsitektur MDM sudah di-update.", time: "2 menit lalu", type: "chat", unread: true },
      { id: "notif-2", app: "Sentinel MDM", title: "Pemeriksaan Integritas Rutin", text: "Sistem keamanan berjalan optimal. Nol ancaman malware.", time: "15 menit lalu", type: "system", unread: false },
      { id: "notif-3", app: "WhatsApp Business", title: "Bpk. Bambang - Klien", text: "Baik mas Ahmad, konfirmasi SPK sudah kami kirimkan.", time: "34 menit lalu", type: "chat", unread: false },
      { id: "notif-4", app: "Google Kalender", title: "Pengingat: Evaluasi Kuartal", text: "Dimulai dalam 45 menit di Ruang Rapat Lt. 12", time: "40 menit lalu", type: "alert", unread: false }
    ],

    // Call Logs
    calls: [
      { id: "call-1", contact: "Bambang W.", number: "+62 811-2345-6789", type: "incoming", duration: "04m 12s", time: "Hari ini, 10:45 WIB" },
      { id: "call-2", contact: "Kantor IT HQ", number: "+62 21-5088-9900", type: "outgoing", duration: "02m 45s", time: "Hari ini, 09:20 WIB" },
      { id: "call-3", contact: "Driver Kurir J&T", number: "+62 858-1122-3344", type: "missed", duration: "0s", time: "Kemarin, 16:30 WIB" },
      { id: "call-4", contact: "Dian Sastro (Finance)", number: "+62 813-9988-7711", type: "incoming", duration: "08m 15s", time: "Kemarin, 14:10 WIB" }
    ],

    // SMS Messages
    sms: [
      { id: "sms-1", sender: "BCA-OTP", text: "JANGAN BERIKAN KEPADA SIAPAPUN! Kode OTP Anda: 729104 untuk otentikasi login.", time: "11:20 WIB" },
      { id: "sms-2", sender: "TELKOMSEL", text: "Sisa Kuota Enterprise Anda adalah 84.5 GB berlaku s.d 31/10/2026.", time: "07:00 WIB" },
      { id: "sms-3", sender: "Sentinel IT", text: "Token otentikasi perangkat Anda diverifikasi. Sesi MDM aktif.", time: "Kemarin" }
    ]
  },

  {
    id: "dev-pixel9-02",
    name: "Google Pixel 9 Pro XL",
    tag: "Unit Pengawas Lapangan",
    assignedUser: "Siti Rahmawati (Auditor)",
    status: "online",
    brand: "Google",
    model: "GEC77",
    os: "Android 15 (Vanilla)",
    buildNumber: "AP3A.241005.015",
    uiVersion: "Pixel Experience",
    securityPatch: "5 Oktober 2026",
    imei: "359124081923118",
    serialNumber: "4A091FDH30018",
    phoneNumber: "+62 857-7712-4401",
    uptime: "72 jam 14 menit",
    lastSeen: "Baru saja",
    screenOn: true,
    screenBrightness: 65,

    battery: {
      level: 68,
      isCharging: true,
      chargeType: "USB-PD (Fast Charging 27W)",
      temperature: 36.1,
      health: "Good (99% SOH)",
      voltage: 4.25,
      technology: "Li-Ion 5060 mAh",
      cycles: 42,
      estimatedTimeRemaining: "45 menit hingga penuh"
    },

    hardware: {
      cpuLoad: 28,
      cpuCores: 8,
      cpuChipset: "Google Tensor G4 (Titan M2)",
      cpuTemp: 39.1,
      ramTotal: 16,
      ramUsed: 7.2,
      storageTotal: 256,
      storageUsed: 94.6,
      storageApps: 48.2,
      storageMedia: 28.4,
      storageSystem: 18.0
    },

    connectivity: {
      wifiEnabled: true,
      wifiSsid: "Telkom-Corp-Secure-5G",
      wifiBssid: "74:83:C2:90:AF:12",
      wifiSignal: -61,
      ipAddress: "192.168.10.155",
      publicIp: "103.144.170.82",
      macAddress: "7A:9C:12:F4:3B:AA",
      cellularType: "5G SA",
      carrier: "Indosat Ooredoo Hutchison 5G",
      cellularSignal: -82,
      bluetoothEnabled: true,
      bluetoothDevice: "None",
      downloadSpeed: 64.2,
      uploadSpeed: 24.1,
      vpnActive: true,
      vpnName: "Corp Zero Trust VPN"
    },

    location: {
      lat: -6.1754,
      lng: 106.8272,
      accuracy: 3.5,
      altitude: 12.0,
      speed: 0.0,
      heading: 180,
      address: "Kompleks Monumen Nasional (Monas), Gambir, Jakarta Pusat",
      geofenceName: "Area Pantauan Wilayah 1",
      geofenceStatus: "safe",
      geofenceRadius: 500,
      geofenceCenter: { lat: -6.1754, lng: 106.8272 },
      lastUpdate: "5 detik yang lalu"
    },

    locationHistory: [
      { lat: -6.1912, lng: 106.8320, timestamp: "10:00 WIB", speed: 28 },
      { lat: -6.1820, lng: 106.8290, timestamp: "10:20 WIB", speed: 34 },
      { lat: -6.1754, lng: 106.8272, timestamp: "10:40 WIB", speed: 0 }
    ],

    security: {
      score: 99,
      grade: "A+",
      rooted: false,
      bootloaderUnlocked: false,
      usbDebugging: false,
      developerOptions: false,
      unknownSources: false,
      playProtectActive: true,
      selinuxStatus: "Enforcing",
      screenLockType: "Google Titan Security PIN + Face",
      encryption: "FBE AES-256 GCM",
      knoxStatus: "Titan M2 Hardware Isolated",
      threatsDetected: 0,
      warnings: []
    },

    controls: {
      isLocked: false,
      lockMessage: "Perangkat Inventaris Resmi Audit IT.",
      unlockPin: "1234",
      isAlarmPlaying: false,
      isFlashlightOn: false,
      isBatterySaver: false,
      isKioskMode: false,
      cameraStreamActive: false,
      lastPing: "Baru saja"
    },

    apps: [
      { id: "p-app-1", name: "Audit Master Pro", package: "com.enterprise.audit", version: "2.1.0", category: "Audit IT", size: "86 MB", memory: "140 MB", battery: "15%", permissions: ["Kamera", "Lokasi", "Penyimpanan"], status: "running", safe: true },
      { id: "p-app-2", name: "Google Drive", package: "com.google.android.apps.docs", version: "2.24.32", category: "Penyimpanan", size: "112 MB", memory: "95 MB", battery: "4%", permissions: ["Penyimpanan"], status: "sleeping", safe: true },
      { id: "p-app-3", name: "Slack", package: "com.slack", version: "24.08.20", category: "Komunikasi", size: "115 MB", memory: "160 MB", battery: "9%", permissions: ["Notifikasi"], status: "running", safe: true }
    ],

    notifications: [
      { id: "p-notif-1", app: "Audit Master Pro", title: "Laporan Inspeksi Tersinkron", text: "Data batch #8812 berhasil diunggah ke server cloud.", time: "8 menit lalu", type: "system", unread: false }
    ],

    calls: [
      { id: "p-call-1", contact: "Pak Manager", number: "+62 811-9900-1122", type: "incoming", duration: "03m 10s", time: "Hari ini, 09:12 WIB" }
    ],

    sms: [
      { id: "p-sms-1", sender: "INDOSAT", text: "Paket Data Unlimited Enterprise Anda aktif.", time: "Kemarin" }
    ]
  },

  {
    id: "dev-xiaomi-03",
    name: "Xiaomi 14 Ultra (Warehouse Scanner)",
    tag: "Scanner Gudang Logistik B",
    assignedUser: "Rudi Hartono (Gudang 02)",
    status: "alert", // critical battery / warning
    brand: "Xiaomi",
    model: "24030PN60G",
    os: "Android 14",
    buildNumber: "Xiaomi HyperOS 1.0.8.0.UNAMIXM",
    uiVersion: "HyperOS",
    securityPatch: "1 September 2026",
    imei: "867492041238914",
    serialNumber: "SN558912A09B",
    phoneNumber: "+62 819-3344-9911",
    uptime: "312 jam 50 menit",
    lastSeen: "1 menit lalu",
    screenOn: true,
    screenBrightness: 95,

    battery: {
      level: 14, // Alert Low!
      isCharging: false,
      chargeType: "Discharging",
      temperature: 42.8, // Alert High Temp!
      health: "Fair (87% SOH)",
      voltage: 3.65,
      technology: "Silicon-Carbon 5300 mAh",
      cycles: 380,
      estimatedTimeRemaining: "42 menit (Kritis)"
    },

    hardware: {
      cpuLoad: 72,
      cpuCores: 8,
      cpuChipset: "Snapdragon 8 Gen 3",
      cpuTemp: 46.2, // Hot
      ramTotal: 16,
      ramUsed: 11.4,
      storageTotal: 512,
      storageUsed: 410.2, // Near full
      storageApps: 160.0,
      storageMedia: 210.2,
      storageSystem: 40.0
    },

    connectivity: {
      wifiEnabled: true,
      wifiSsid: "Warehouse-Logistics-Mesh",
      wifiBssid: "E4:8D:8C:31:01:9B",
      wifiSignal: -79, // Weak WiFi
      ipAddress: "192.168.30.88",
      publicIp: "103.144.170.82",
      macAddress: "68:DB:F5:12:89:C4",
      cellularType: "4G LTE+",
      carrier: "Telkomsel IoT M2M",
      cellularSignal: -90,
      bluetoothEnabled: true,
      bluetoothDevice: "Zebra Barcode Gun (BT-991)",
      downloadSpeed: 8.5,
      uploadSpeed: 2.1,
      vpnActive: false,
      vpnName: "Nonaktif"
    },

    location: {
      lat: -6.1158,
      lng: 106.8833,
      accuracy: 9.8,
      altitude: 4.0,
      speed: 1.2,
      heading: 90,
      address: "Kawasan Pergudangan Marunda Center, Cilincing, Jakarta Utara",
      geofenceName: "Zone Gudang Marunda A",
      geofenceStatus: "warning",
      geofenceRadius: 400,
      geofenceCenter: { lat: -6.1158, lng: 106.8833 },
      lastUpdate: "1 menit lalu"
    },

    locationHistory: [
      { lat: -6.1160, lng: 106.8830, timestamp: "11:00 WIB", speed: 2 },
      { lat: -6.1158, lng: 106.8833, timestamp: "11:30 WIB", speed: 1.2 }
    ],

    security: {
      score: 68,
      grade: "C+",
      rooted: false,
      bootloaderUnlocked: false,
      usbDebugging: true, // Warning: Developer turned on USB debugging
      developerOptions: true,
      unknownSources: true, // Warning: APK Sideloading enabled!
      playProtectActive: true,
      selinuxStatus: "Enforcing",
      screenLockType: "Pola Sederhana",
      encryption: "AES-256",
      knoxStatus: "N/A (HyperOS Security Guard)",
      threatsDetected: 2,
      warnings: [
        "Sideloading (Unknown Sources) diaktifkan pengguna.",
        "USB Debugging aktif berpotensi bypass keamanan ADB.",
        "Suhu baterai tinggi (42.8°C) dan level kritis (14%)."
      ]
    },

    controls: {
      isLocked: false,
      lockMessage: "PERINGATAN: Perangkat Terkunci oleh Administrator Gudang.",
      unlockPin: "4455",
      isAlarmPlaying: false,
      isFlashlightOn: false,
      isBatterySaver: false,
      isKioskMode: true,
      cameraStreamActive: false,
      lastPing: "1 menit lalu"
    },

    apps: [
      { id: "w-app-1", name: "Warehouse WMS Scanner", package: "com.warehouse.scanner", version: "4.8.1", category: "Logistik", size: "120 MB", memory: "450 MB", battery: "42%", permissions: ["Kamera", "Bluetooth", "Penyimpanan"], status: "running", safe: true },
      { id: "w-app-2", name: "Unknown APK Sideload", package: "com.tool.tempcleaner", version: "1.0", category: "Tidak Dikenal", size: "34 MB", memory: "110 MB", battery: "12%", permissions: ["Akses Penuh Berkas", "Jaringan"], status: "running", safe: false }
    ],

    notifications: [
      { id: "w-notif-1", app: "Sistem Baterai", title: "Baterai Lemah (14%)", text: "Segera sambungkan ke dock charger di Stasiun Gudang 02.", time: "1 menit lalu", type: "alert", unread: true },
      { id: "w-notif-2", app: "Security Guard", title: "Peringatan Suhu Panas", text: "Suhu perangkat mencapai 42.8°C. Kurangi beban kerja intensif.", time: "12 menit lalu", type: "alert", unread: true }
    ],

    calls: [],
    sms: []
  },

  {
    id: "dev-oneplus-04",
    name: "OnePlus 12 5G",
    tag: "Unit Siaga Operasional",
    assignedUser: "Budi Santoso (Ops Dispatch)",
    status: "standby",
    brand: "OnePlus",
    model: "CPH2581",
    os: "Android 14",
    buildNumber: "CPH2581_14.0.0.800(EX01)",
    uiVersion: "OxygenOS 14",
    securityPatch: "1 September 2026",
    imei: "864192087612345",
    serialNumber: "OP1298410294",
    phoneNumber: "+62 821-4455-6677",
    uptime: "210 jam 05 menit",
    lastSeen: "4 menit lalu",
    screenOn: false,
    screenBrightness: 50,

    battery: {
      level: 91,
      isCharging: false,
      chargeType: "Discharging",
      temperature: 30.2,
      health: "Good (98% SOH)",
      voltage: 4.31,
      technology: "Dual-cell 5400 mAh",
      cycles: 76,
      estimatedTimeRemaining: "19 jam 40 menit"
    },

    hardware: {
      cpuLoad: 12,
      cpuCores: 8,
      cpuChipset: "Snapdragon 8 Gen 3",
      cpuTemp: 32.1,
      ramTotal: 16,
      ramUsed: 4.8,
      storageTotal: 512,
      storageUsed: 142.0,
      storageApps: 62.0,
      storageMedia: 54.0,
      storageSystem: 26.0
    },

    connectivity: {
      wifiEnabled: true,
      wifiSsid: "Dispatch-HQ-Mesh",
      wifiBssid: "8C:11:CB:44:90:3A",
      wifiSignal: -58,
      ipAddress: "192.168.10.180",
      publicIp: "103.144.170.82",
      macAddress: "90:48:9A:3C:77:E1",
      cellularType: "5G SA",
      carrier: "XL Axiata VIP Enterprise",
      cellularSignal: -74,
      bluetoothEnabled: false,
      bluetoothDevice: "None",
      downloadSpeed: 52.0,
      uploadSpeed: 21.0,
      vpnActive: true,
      vpnName: "HQ Enterprise IPsec"
    },

    location: {
      lat: -6.2297,
      lng: 106.8295,
      accuracy: 5.1,
      altitude: 18.2,
      speed: 0.0,
      heading: 0,
      address: "Kawasan Mega Kuningan, Setiabudi, Jakarta Selatan",
      geofenceName: "Dispatch Base 3",
      geofenceStatus: "safe",
      geofenceRadius: 400,
      geofenceCenter: { lat: -6.2297, lng: 106.8295 },
      lastUpdate: "4 menit lalu"
    },

    locationHistory: [
      { lat: -6.2297, lng: 106.8295, timestamp: "09:00 WIB", speed: 0 }
    ],

    security: {
      score: 94,
      grade: "A",
      rooted: false,
      bootloaderUnlocked: false,
      usbDebugging: false,
      developerOptions: false,
      unknownSources: false,
      playProtectActive: true,
      selinuxStatus: "Enforcing",
      screenLockType: "Fingerprint & PIN",
      encryption: "FBE AES-256",
      knoxStatus: "OxygenOS Vault Keeper",
      threatsDetected: 0,
      warnings: []
    },

    controls: {
      isLocked: false,
      lockMessage: "Perangkat ini dikelola oleh Sentinel MDM.",
      unlockPin: "0000",
      isAlarmPlaying: false,
      isFlashlightOn: false,
      isBatterySaver: false,
      isKioskMode: false,
      cameraStreamActive: false,
      lastPing: "4 menit lalu"
    },

    apps: [
      { id: "op-1", name: "WhatsApp", package: "com.whatsapp", version: "2.24.18", category: "Komunikasi", size: "110 MB", memory: "180 MB", battery: "8%", permissions: ["Kamera", "Lokasi"], status: "sleeping", safe: true },
      { id: "op-2", name: "Dispatch Ops", package: "com.fleet.dispatch", version: "3.0.2", category: "Operasional", size: "90 MB", memory: "160 MB", battery: "10%", permissions: ["Lokasi Latar Belakang", "Telepon"], status: "sleeping", safe: true }
    ],

    notifications: [],
    calls: [],
    sms: []
  }
];
