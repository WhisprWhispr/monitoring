# DroidPulse Sentinel - Enterprise Android Device Monitoring & MDM Console

> **Modern, High-Performance Real-Time Android Fleet Telemetry & Remote Control Platform**

![DroidPulse Sentinel](https://raw.githubusercontent.com/WhisprWhispr/monitoring/main/src/assets/hero.png)

## 📌 Fitur Unggulan

- **Live Real-Time Telemetry**:
  - Monitoring persentase baterai asli, suhu, tegangan, siklus, dan status charging (*Fast/Discharging*).
  - Monitoring CPU clock, delta core load, RAM fisik terpakai, dan penyimpanan internal.
  - Geolokasi GPS langsung dengan geofencing radius interaktif.
- **Dua Metode Koneksi Fleksibel**:
  - **ADB Bridge (Hardware Live)**: Koneksi langsung lewat kabel USB atau Wi-Fi Wireless Debugging (port 5555).
  - **Web Sensor Agent (Tanpa USB Debugging)**: Cukup buka browser ponsel (Chrome) lewat URL / scan QR, langsung streaming sensor perangkat (HTML5 Battery, Geolocation, RAM, Vibrate) tanpa perlu mengaktifkan Opsi Pengembang.
- **Pendaftaran Perangkat Instan**:
  - 2D QR Code & 1D Code128 Barcode generation.
  - Kompatibel dengan kamera bawaan smartphone dan Google Lens.
- **Remote Command Center (MDM)**:
  - Kunci layar darurat dengan pesan custom & PIN pembuka.
  - Sirene alarm berbunyi keras & getar haptik darurat.
  - Tangkapan layar (*Live Screenshot*) langsung dari ponsel.
  - Notifikasi Push (*heads-up status bar*) asli Android.
  - Mode Hemat Baterai & Lampu Senter / Strobe.
  - Restart (*Reboot*) & Factory Wipe Data.
- **Virtual Phone Studio & Simulator**:
  - Simulasi interaktif smartphone lengkap dengan kontrol baterai, charger, dan status lock.
- **Audio Haptic & Sound Effects**:
  - Suara feedback sistematis dengan synthesizer Web Audio API asli.

---

## 🚀 Memulai (Quick Start)

### 1. Prasyarat
- [Node.js](https://nodejs.org/) v18+ 
- (Opsional untuk fitur kabel ADB) [Android Platform Tools / ADB](https://developer.android.com/tools/releases/platform-tools)

### 2. Instalasi Dependensi
```bash
git clone https://github.com/WhisprWhispr/monitoring.git
cd monitoring
npm install
```

### 3. Menjalankan Server Backend ADB Bridge
```bash
node server.js
```
*Backend berjalan di `http://localhost:5001`.*

### 4. Menjalankan Frontend Console
```bash
npm run dev
```
*Frontend dapat diakses di `http://localhost:5173/` atau via jaringan lokal `http://<IP_KOMPUTER>:5173/`.*

---

## 🛠️ Stack Teknologi

- **Frontend**: React 19, Vite, Vanilla CSS Design System, Lucide Icons
- **Backend**: Express.js, WebSocket (WS), Node Child Process (ADB Bridge)
- **Sensor & Telemetri**: HTML5 Battery API, Geolocation API, Network Information API, ADB Shell dumpsys

---

## 📄 Lisensi
MIT License © 2026 WhisprWhispr / DroidPulse Sentinel.
