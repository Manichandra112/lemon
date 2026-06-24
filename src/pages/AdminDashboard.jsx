import React, { useState } from 'react';
import { Menu, X, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminOverview from '../components/admin/AdminOverview';
import UserManagement from '../components/admin/UserManagement';
import ProductManagement from '../components/admin/ProductManagement';
import OrdersView from '../components/admin/OrdersView';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { authUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'overview': return 'Registry Overview';
      case 'users': return 'Users Registry';
      case 'products': return 'Citrus Portfolio';
      case 'orders': return 'Allocations / Orders';
      default: return 'Admin Dashboard';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview />;
      case 'users':
        return <UserManagement />;
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <OrdersView />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: 'var(--surface-secondary)',
      color: 'var(--text-primary)',
      fontFamily: 'inherit',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(3, 42, 26, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 1010,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}

      {/* Desktop Sidebar (Persistent Left Side) */}
      <aside style={{
        width: '260px',
        flexShrink: 0,
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'block',
        zIndex: 1000,
      }} className="admin-sidebar-desktop">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </aside>

      {/* Mobile Drawer Sidebar */}
      <aside style={{
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: mobileSidebarOpen ? 0 : '-260px',
        width: '260px',
        backgroundColor: 'var(--primary-darker)',
        zIndex: 1020,
        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: mobileSidebarOpen ? 'var(--shadow-xl)' : 'none',
      }}>
        <AdminSidebar 
          activeTab={activeTab} 
          onTabChange={(tab) => {
            setActiveTab(tab);
            setMobileSidebarOpen(false);
          }}
          onClose={() => setMobileSidebarOpen(false)}
          isMobile={true}
        />
      </aside>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        height: '100vh',
      }}>
        {/* Sticky Header */}
        <header style={{
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border-light)',
          padding: '0 24px',
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 900,
          boxShadow: 'var(--shadow-sm)',
        }}>
          {/* Header Left (Hamburger / Title) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setMobileSidebarOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                display: 'none',
                padding: '4px',
              }}
              className="admin-hamburger"
            >
              <Menu size={24} />
            </button>
            <h1 style={{
              fontSize: '1.25rem',
              fontWeight: '800',
              color: 'var(--primary-dark)',
              margin: 0,
            }}>
              {getTabTitle()}
            </h1>
          </div>

          {/* Header Right (Admin Profile Actions) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Quick overview metric */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--primary-tint)',
              color: 'var(--primary)',
              fontSize: '0.75rem',
              fontWeight: '700',
            }} className="desktop-only">
              <Shield size={14} />
              <span>Seller Mode</span>
            </div>

            {/* Profile Dropdown Simulation */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-light)',
              background: 'var(--surface-secondary)',
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: '800',
                fontSize: '0.75rem',
              }}>
                A
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }} className="desktop-only">
                <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {authUser?.name || 'Admin'}
                </span>
                <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                  {authUser?.email}
                </span>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  marginLeft: '4px',
                }}
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Content Workspace */}
        <main style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          background: 'var(--surface-secondary)',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {renderContent()}
          </div>
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar-desktop {
            display: none !important;
          }
          .admin-hamburger {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
