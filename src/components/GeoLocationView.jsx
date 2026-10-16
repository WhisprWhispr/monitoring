import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  Navigation, 
  ShieldCheck, 
  ShieldAlert, 
  Crosshair, 
  Compass, 
  Gauge, 
  Play, 
  Layers,
  ExternalLink,
  Sliders
} from 'lucide-react';
import { soundFX } from '../utils/audio';

export default function GeoLocationView({ device, onUpdateLocation, showNotificationToast }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const polylineRef = useRef(null);

  const [isSimulating, setIsSimulating] = useState(false);
  const [geofenceRadius, setGeofenceRadius] = useState(device?.location?.geofenceRadius || 400);

  const loc = device?.location || { lat: -6.2088, lng: 106.8456, geofenceStatus: 'safe', geofenceRadius: 400 };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize Leaflet Map
      const map = L.map(mapContainerRef.current, {
        center: [loc.lat, loc.lng],
        zoom: 15,
        zoomControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // OpenStreetMap Tiles with Cyber Dark Filter
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Custom Glowing Radar Pulse Marker
    const radarIcon = L.divIcon({
      className: 'custom-radar-marker',
      html: `
        <div style="position: relative; width: 36px; height: 36px;">
          <div style="position: absolute; inset: 0; border-radius: 50%; background: rgba(99, 102, 241, 0.35); animation: pulse-ring 2s infinite ease-in-out;"></div>
          <div style="position: absolute; inset: 8px; border-radius: 50%; background: #6366f1; border: 2.5px solid #ffffff; box-shadow: 0 0 14px #6366f1;"></div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    // Update or Add Device Marker
    if (!markerRef.current) {
      markerRef.current = L.marker([loc.lat, loc.lng], { icon: radarIcon })
        .addTo(map)
        .bindPopup(`<b>${device.name}</b><br/>${loc.address || 'Posisi Saat Ini'}`);
    } else {
      markerRef.current.setLatLng([loc.lat, loc.lng]);
    }

    // Update or Add Geofence Circle
    const isSafe = loc.geofenceStatus === 'safe';
    const circleColor = isSafe ? '#10b981' : '#f43f5e';
    const circleFill = isSafe ? '#10b981' : '#f43f5e';

    if (!circleRef.current) {
      circleRef.current = L.circle([loc.lat, loc.lng], {
        radius: geofenceRadius,
        color: circleColor,
        fillColor: circleFill,
        fillOpacity: 0.12,
        weight: 1.5,
        dashArray: '4, 6'
      }).addTo(map);
    } else {
      circleRef.current.setLatLng([loc.lat, loc.lng]);
      circleRef.current.setRadius(geofenceRadius);
      circleRef.current.setStyle({
        color: circleColor,
        fillColor: circleFill
      });
    }

    // Draw Location History Polyline Trail
    if (device.locationHistory && device.locationHistory.length > 1) {
      const latlngs = device.locationHistory.map(h => [h.lat, h.lng]);
      if (!polylineRef.current) {
        polylineRef.current = L.polyline(latlngs, {
          color: '#818cf8',
          weight: 3,
          opacity: 0.7,
          dashArray: '5, 8'
        }).addTo(map);
      } else {
        polylineRef.current.setLatLngs(latlngs);
      }
    }

    map.panTo([loc.lat, loc.lng]);

  }, [device.id, loc.lat, loc.lng, loc.geofenceStatus, geofenceRadius]);

  // Center Map View Button
  const handleCenter = () => {
    soundFX.playClick();
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([loc.lat, loc.lng], 16, { duration: 1 });
    }
  };

  // Toggle Geofence Status (Safe vs Breached)
  const handleToggleGeofenceStatus = () => {
    soundFX.playNotification();
    const nextStatus = loc.geofenceStatus === 'safe' ? 'breached' : 'safe';
    if (onUpdateLocation) {
      onUpdateLocation({
        ...loc,
        geofenceStatus: nextStatus,
        lastUpdate: 'Baru saja'
      });
    }
    if (showNotificationToast) {
      showNotificationToast(
        nextStatus === 'breached' ? "⚠️ PERINGATAN: Perangkat Melanggar Geofence!" : "✓ Status Geofence: Aman di dalam radius",
        nextStatus === 'breached' ? "error" : "success"
      );
    }
  };

  // Radius slider change
  const handleRadiusChange = (newR) => {
    setGeofenceRadius(newR);
    if (onUpdateLocation) {
      onUpdateLocation({
        ...loc,
        geofenceRadius: newR
      });
    }
  };

  // Open in Google Maps
  const handleOpenGoogleMaps = () => {
    soundFX.playClick();
    window.open(`https://www.google.com/maps?q=${loc.lat},${loc.lng}`, '_blank');
  };

  // Simulate GPS Route Movement
  const handleSimulateMovement = () => {
    soundFX.playNotification();
    setIsSimulating(true);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      const deltaLat = (Math.random() - 0.45) * 0.0018;
      const deltaLng = (Math.random() - 0.45) * 0.0018;
      const newLat = +(loc.lat + deltaLat).toFixed(6);
      const newLng = +(loc.lng + deltaLng).toFixed(6);
      const newSpeed = Math.floor(Math.random() * 45 + 15);

      if (onUpdateLocation) {
        onUpdateLocation({
          ...loc,
          lat: newLat,
          lng: newLng,
          speed: newSpeed,
          lastUpdate: 'Baru saja (Real-time GPS)'
        });
      }

      if (step >= 4) {
        clearInterval(interval);
        setIsSimulating(false);
        if (showNotificationToast) {
          showNotificationToast(`📍 Rute GPS baru tersimpan: ${newLat}, ${newLng}`, "info");
        }
      }
    }, 1400);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Geolocation Telemetry Bar */}
      <div className="glass-card" style={{ padding: '16px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div className="vital-icon-box" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-indigo)' }}>
              <Navigation size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{loc.address}</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
                Koordinat: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>{loc.lat}, {loc.lng}</span> • Akurasi: {loc.accuracy}m
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div className="stat-chip">
              <Gauge size={14} style={{ color: 'var(--accent-indigo)' }} />
              <span>Kecepatan: <strong>{loc.speed} km/h</strong></span>
            </div>

            <button 
              className={`pill ${loc.geofenceStatus === 'safe' ? 'pill-emerald' : 'pill-rose'}`}
              onClick={handleToggleGeofenceStatus}
              title="Klik untuk mensimulasikan pelanggaran zona aman"
              style={{ cursor: 'pointer', border: '1px solid currentColor' }}
            >
              {loc.geofenceStatus === 'safe' ? (
                <>
                  <ShieldCheck size={12} />
                  <span>Di Dalam Geofence: {loc.geofenceName}</span>
                </>
              ) : (
                <>
                  <ShieldAlert size={12} />
                  <span>PERINGATAN: Di Luar Geofence!</span>
                </>
              )}
            </button>

            <button className="btn btn-secondary" onClick={handleCenter} title="Pusatkan Peta">
              <Crosshair size={14} />
              <span>Pusatkan</span>
            </button>

            <button className="btn btn-secondary" onClick={handleOpenGoogleMaps} title="Buka di Google Maps Nyata">
              <ExternalLink size={14} />
              <span>Buka Google Maps</span>
            </button>

            <button 
              className="btn btn-primary" 
              onClick={handleSimulateMovement}
              disabled={isSimulating}
            >
              <Play size={14} />
              <span>{isSimulating ? 'Sedang Bergerak...' : 'Simulasi Rute GPS'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Leaflet Map */}
      <div className="map-view-container">
        <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />

        {/* Floating HUD on Map with interactive Geofence radius slider */}
        <div className="map-floating-overlay">
          <div style={{ fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>🛰️ Status GNSS & Geofence</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Ketinggian:</span>
              <strong style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>{loc.altitude} m dpl</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Arah Heading:</span>
              <strong style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>{loc.heading}° Utara</strong>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Radius Zona Aman:</span>
                <strong style={{ color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>{geofenceRadius}m</strong>
              </div>
              <input 
                type="range" 
                min="100" 
                max="1500" 
                step="50"
                value={geofenceRadius}
                onChange={e => handleRadiusChange(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#10b981' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Pembaruan:</span>
              <span style={{ color: 'var(--accent-cyan)' }}>{loc.lastUpdate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Travel Trail History Breadcrumbs */}
      {device.locationHistory && device.locationHistory.length > 0 && (
        <div className="glass-card">
          <div className="card-header-row">
            <div>
              <div className="card-title">
                <Compass size={18} style={{ color: 'var(--accent-indigo)' }} />
                <span>Riwayat Jejak Perjalanan Hari Ini</span>
              </div>
              <div className="card-subtitle">Titik breadcrumb checkpoint yang tercatat di server MDM</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
            {device.locationHistory.map((pt, idx) => (
              <div 
                key={idx} 
                style={{ 
                  background: 'rgba(255, 255, 255, 0.02)', 
                  border: '1px solid var(--border-subtle)', 
                  borderRadius: 'var(--radius-md)', 
                  padding: '12px' 
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--accent-indigo)', fontWeight: 700 }}>
                  <span>Checkpoint #{idx + 1}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{pt.timestamp}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#fff', marginTop: '4px' }}>
                  {pt.lat}, {pt.lng}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Kecepatan rata-rata: {pt.speed} km/h
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
