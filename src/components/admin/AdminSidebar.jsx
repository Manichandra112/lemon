import React from 'react';
import { BarChart3, Users, Package, ShoppingCart, LogOut, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminSidebar = ({ activeTab, onTabChange, onClose, isMobile }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    if (onClose) onClose();
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users Registry', icon: Users },
    { id: 'products', label: 'Citrus Portfolio', icon: Package },
    { id: 'orders', label: 'Allocations / Orders', icon: ShoppingCart }
  ];

  const handleTabClick = (tabId) => {
    onTabChange(tabId);
    if (onClose) onClose();
  };

  return (
    <div style={{
      backgroundColor: 'var(--primary-darker)',
      color: '#fff',
      padding: '2rem 1.25rem 1.5rem',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      overflowY: 'auto'
    }}>
      {/* Header section (Logo + Close btn on mobile) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-sm)',
            background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
          }}>
            🍋
          </div>
          <div>
            <div style={{ fontSize: '1.125rem', fontWeight: '800', color: '#fff', lineHeight: '1.1' }}>
              LemonMart
            </div>
            <div style={{ fontSize: '0.625rem', color: 'var(--gold)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Admin Console
            </div>
          </div>
        </div>

        {isMobile && onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(255, 255, 255, 0.7)',
              padding: '4px',
              display: 'flex'
            }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation menu */}
      <nav style={{ flex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                style={{
                  background: isActive ? 'var(--gold)' : 'transparent',
                  color: isActive ? 'var(--primary-darker)' : 'rgba(255, 255, 255, 0.7)',
                  border: 'none',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? '800' : '600',
                  textAlign: 'left',
                  transition: 'var(--transition-fast)',
                  width: '100%',
                }}
                className="admin-menu-item"
              >
                <Icon size={18} color={isActive ? 'var(--primary-darker)' : 'rgba(255, 255, 255, 0.6)'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer / Logout */}
      <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <button
          onClick={handleLogout}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#fff',
            padding: '10px 16px',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '0.8125rem',
            fontWeight: '700',
            width: '100%',
            transition: 'var(--transition-fast)',
          }}
          className="admin-logout-btn"
        >
          <LogOut size={16} />
          Logout Console
        </button>
      </div>

      <style>{`
        .admin-menu-item:hover {
          background: ${activeTab ? '' : 'rgba(255, 255, 255, 0.05)'};
          color: ${activeTab ? '' : 'var(--gold)'};
        }
        .admin-logout-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  );
};

export default AdminSidebar;
