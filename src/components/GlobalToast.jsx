import React from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export default function GlobalToast({ toast, onDismiss }) {
  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)' }} />;
      case 'error':
        return <XCircle size={18} style={{ color: 'var(--accent-rose)' }} />;
      case 'warning':
        return <AlertTriangle size={18} style={{ color: 'var(--accent-amber)' }} />;
      default:
        return <Info size={18} style={{ color: 'var(--accent-cyan)' }} />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success': return 'rgba(16, 185, 129, 0.4)';
      case 'error': return 'rgba(239, 68, 68, 0.4)';
      case 'warning': return 'rgba(245, 158, 11, 0.4)';
      default: return 'rgba(6, 182, 212, 0.4)';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(16px)',
      border: `1px solid ${getBorderColor()}`,
      borderRadius: 'var(--radius-md)',
      padding: '12px 18px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 12px 36px rgba(0, 0, 0, 0.7)',
      animation: 'slideUpToast 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      maxWidth: '380px'
    }}>
      {getIcon()}
      <div style={{ flex: 1, fontSize: '0.84rem', color: '#fff', fontWeight: 600 }}>
        {toast.message}
      </div>
      <button 
        onClick={onDismiss}
        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
      >
        <X size={15} />
      </button>
    </div>
  );
}
