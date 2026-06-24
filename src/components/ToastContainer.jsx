import React from 'react';
import { useToast } from '../context/ToastContext';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContainer = () => {
  const { toasts, removeToast, confirmState } = useToast();

  const getToastConfig = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'var(--primary)',
          icon: <CheckCircle size={18} color="var(--gold)" />,
        };
      case 'error':
        return {
          bg: 'var(--danger)',
          icon: <AlertCircle size={18} color="#fff" />,
        };
      case 'info':
      default:
        return {
          bg: 'var(--primary-darker)',
          icon: <Info size={18} color="var(--gold)" />,
        };
    }
  };

  return (
    <>
      {/* Toasts */}
      <div style={{
        position: 'fixed', top: '70px', right: '16px',
        zIndex: 9999, display: 'flex', flexDirection: 'column',
        gap: '8px', maxWidth: '360px', width: '100%',
      }}>
        {toasts.map((toast) => {
          const config = getToastConfig(toast.type);
          return (
            <div key={toast.id} style={{
              background: config.bg, color: '#fff',
              padding: '12px 14px', borderRadius: 'var(--radius-sm)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
              display: 'flex', alignItems: 'center', gap: '10px',
              animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              borderLeft: '4px solid var(--gold)',
            }}>
              {config.icon}
              <span style={{ flex: 1, fontSize: '0.8125rem', fontWeight: '600', lineHeight: 1.4 }}>
                {toast.message}
              </span>
              <button onClick={() => removeToast(toast.id)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(255,255,255,0.6)', display: 'flex',
                padding: '2px', flexShrink: 0,
              }}>
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Confirm Modal */}
      {confirmState && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 10000, padding: '16px',
          animation: 'fadeIn 0.15s ease',
        }}>
          <div style={{
            background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
            padding: '28px', maxWidth: '380px', width: '100%',
            boxShadow: 'var(--shadow-xl)',
            animation: 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            textAlign: 'center',
          }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: 'var(--gold-tint)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <AlertTriangle size={24} color="var(--gold-dark)" />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)' }}>
              Are you sure?
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.875rem', lineHeight: 1.5 }}>
              {confirmState.message}
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={confirmState.onCancel} style={{
                flex: 1, padding: '11px',
                border: '1.5px solid var(--border)', background: 'var(--surface)',
                borderRadius: 'var(--radius-sm)', fontWeight: '700',
                fontSize: '0.875rem', cursor: 'pointer', color: 'var(--text-secondary)',
                fontFamily: 'inherit',
              }}>
                Cancel
              </button>
              <button onClick={confirmState.onConfirm} style={{
                flex: 1, padding: '11px',
                background: 'var(--primary)', color: '#fff',
                border: 'none', borderRadius: 'var(--radius-sm)',
                fontWeight: '700', fontSize: '0.875rem', cursor: 'pointer',
                fontFamily: 'inherit',
              }}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default ToastContainer;
