import React, { useState } from 'react';
import { 
  BellRing, 
  PhoneIncoming, 
  PhoneOutgoing, 
  PhoneMissed, 
  MessageSquare, 
  Clock, 
  CheckCheck,
  Search
} from 'lucide-react';
import { soundFX } from '../utils/audio';

export default function ActivityLogsView({ device }) {
  const [activeSubTab, setActiveSubTab] = useState('notifications');
  const [filterText, setFilterText] = useState('');

  if (!device) return null;

  const notifs = device.notifications || [];
  const calls = device.calls || [];
  const sms = device.sms || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Sub Tabs Navigation */}
      <div className="glass-card" style={{ padding: '14px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`btn ${activeSubTab === 'notifications' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => {
                soundFX.playClick();
                setActiveSubTab('notifications');
              }}
            >
              <BellRing size={16} />
              <span>Notifikasi Masuk ({notifs.length})</span>
            </button>

            <button
              className={`btn ${activeSubTab === 'calls' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => {
                soundFX.playClick();
                setActiveSubTab('calls');
              }}
            >
              <PhoneIncoming size={16} />
              <span>Log Telepon ({calls.length})</span>
            </button>

            <button
              className={`btn ${activeSubTab === 'sms' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => {
                soundFX.playClick();
                setActiveSubTab('sms');
              }}
            >
              <MessageSquare size={16} />
              <span>Log SMS ({sms.length})</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Cari dalam log..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                style={{ 
                  background: 'rgba(0,0,0,0.3)', 
                  border: '1px solid var(--border-light)', 
                  borderRadius: 'var(--radius-sm)', 
                  padding: '6px 10px 6px 30px', 
                  color: '#fff', 
                  fontSize: '0.8rem' 
                }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* 1. NOTIFICATIONS TAB */}
      {activeSubTab === 'notifications' && (
        <div className="glass-card">
          <div className="card-header-row">
            <div>
              <div className="card-title">
                <BellRing size={18} style={{ color: 'var(--accent-indigo)' }} />
                <span>Stream Notifikasi Sistem Android</span>
              </div>
              <div className="card-subtitle">Feed notifikasi status bar yang disinkronkan secara live ke server</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {notifs
              .filter(n => n.title.toLowerCase().includes(filterText.toLowerCase()) || n.text.toLowerCase().includes(filterText.toLowerCase()))
              .map((n) => (
                <div 
                  key={n.id}
                  style={{ 
                    padding: '14px 16px', 
                    borderRadius: 'var(--radius-md)', 
                    background: n.unread ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${n.unread ? 'rgba(99, 102, 241, 0.3)' : 'var(--border-subtle)'}`,
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: 'var(--radius-md)', 
                      background: n.type === 'alert' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                      color: n.type === 'alert' ? 'var(--accent-rose)' : 'var(--accent-indigo)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <BellRing size={18} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--accent-indigo)', textTransform: 'uppercase' }}>
                          {n.app}
                        </span>
                        {n.unread && <span className="pill pill-indigo" style={{ fontSize: '0.65rem' }}>Baru</span>}
                      </div>
                      <h4 style={{ fontSize: '0.92rem', color: '#fff', margin: '2px 0 4px', fontWeight: 700 }}>
                        {n.title}
                      </h4>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                        {n.text}
                      </p>
                    </div>
                  </div>

                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                    {n.time}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 2. CALL LOGS TAB */}
      {activeSubTab === 'calls' && (
        <div className="glass-card">
          <div className="card-header-row">
            <div>
              <div className="card-title">
                <PhoneIncoming size={18} style={{ color: 'var(--accent-emerald)' }} />
                <span>Log Riwayat Panggilan Suara & Seluler</span>
              </div>
              <div className="card-subtitle">Panggilan masuk, keluar, dan panggilan tidak terjawab</div>
            </div>
          </div>

          <table className="modern-table">
            <thead>
              <tr>
                <th>Jenis Panggilan</th>
                <th>Kontak / Nomor Telepon</th>
                <th>Durasi Bicara</th>
                <th>Waktu Transaksi</th>
              </tr>
            </thead>
            <tbody>
              {calls.map((call) => (
                <tr key={call.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {call.type === 'incoming' && <PhoneIncoming size={16} style={{ color: 'var(--accent-emerald)' }} />}
                      {call.type === 'outgoing' && <PhoneOutgoing size={16} style={{ color: 'var(--accent-cyan)' }} />}
                      {call.type === 'missed' && <PhoneMissed size={16} style={{ color: 'var(--accent-rose)' }} />}
                      <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>
                        {call.type === 'incoming' ? 'Masuk' : call.type === 'outgoing' ? 'Keluar' : 'Tak Terjawab'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#fff' }}>{call.contact}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{call.number}</div>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>
                    {call.duration}
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    {call.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. SMS LOGS TAB */}
      {activeSubTab === 'sms' && (
        <div className="glass-card">
          <div className="card-header-row">
            <div>
              <div className="card-title">
                <MessageSquare size={18} style={{ color: 'var(--accent-amber)' }} />
                <span>Log Transaksi Pesan SMS Seluler</span>
              </div>
              <div className="card-subtitle">Pesan OTP, verifikasi perbankan, dan pengingat operator</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {sms.map((msg) => (
              <div 
                key={msg.id}
                style={{ 
                  padding: '14px 16px', 
                  borderRadius: 'var(--radius-md)', 
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-amber)', marginBottom: '4px' }}>
                    Pengirim: {msg.sender}
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#fff', lineHeight: '1.4' }}>
                    {msg.text}
                  </div>
                </div>

                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                  {msg.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
