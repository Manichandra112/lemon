import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, LogOut, Shield, Search, MapPin, ChevronDown, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { authUser, logout, isAdmin, isCustomer } = useAuth();
  const { getTotalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <>
      {/* Top delivery bar */}
      <div style={{
        background: 'linear-gradient(90deg, var(--primary-darker) 0%, var(--primary-dark) 100%)',
        color: '#fff',
        padding: '6px 0',
        fontSize: '0.75rem',
        fontWeight: '500',
        textAlign: 'center',
        letterSpacing: '0.02em',
      }}>
        <div className="container flex-center gap-2">
          <span style={{ color: 'var(--gold)' }}>🍋</span>
          <span>Free delivery on orders above ₹199 • Fresh organic lemons delivered in 24hrs</span>
        </div>
      </div>

      {/* Main Navbar */}
      <nav style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div className="container" style={{ padding: '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', height: '60px', gap: '24px' }}>

            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', flexShrink: 0 }}>
              <div style={{
                width: '36px', height: '36px',
                borderRadius: 'var(--radius-sm)',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.25rem',
              }}>🍋</div>
              <div>
                <div style={{ fontSize: '1.0625rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.1 }}>
                  LemonMart
                </div>
                <div style={{ fontSize: '0.625rem', color: 'var(--primary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Fresh • Organic • Premium
                </div>
              </div>
            </Link>

            {/* Location - desktop */}
            {authUser && (
              <div className="desktop-only" style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 12px', borderRadius: 'var(--radius-full)',
                background: 'var(--surface-secondary)', cursor: 'pointer',
                fontSize: '0.8125rem', color: 'var(--text-secondary)',
                border: '1px solid var(--border-light)',
              }}>
                <MapPin size={14} color="var(--primary)" />
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Deliver to</span>
                <span className="truncate" style={{ maxWidth: '120px' }}>
                  {authUser.address || 'Set location'}
                </span>
                <ChevronDown size={14} />
              </div>
            )}

            {/* Search bar - desktop */}
            <div className="desktop-only" style={{
              flex: 1, maxWidth: '420px',
              position: 'relative',
            }}>
              <Search size={16} style={{
                position: 'absolute', left: '12px', top: '50%',
                transform: 'translateY(-50%)', color: 'var(--text-light)',
                pointerEvents: 'none',
              }} />
              <input
                type="text"
                placeholder='Search "fresh lemons"'
                readOnly
                onClick={() => {
                  if (isCustomer) navigate('/dashboard');
                  else navigate('/login');
                }}
                style={{
                  width: '100%', padding: '9px 14px 9px 36px',
                  border: '1.5px solid var(--border)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8125rem', background: 'var(--surface-secondary)',
                  color: 'var(--text-muted)', cursor: 'pointer',
                  outline: 'none', fontFamily: 'inherit',
                  transition: 'var(--transition-fast)',
                }}
              />
            </div>

            {/* Spacer */}
            <div style={{ flex: 1 }} className="mobile-only" />

            {/* Desktop Nav Items */}
            <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
              {!authUser && (
                <>
                  <Link to="/login" className="btn btn-ghost" style={{ fontWeight: '600' }}>
                    Login
                  </Link>
                  <Link to="/signup" className="btn btn-primary" style={{ fontWeight: '700' }}>
                    Sign Up
                  </Link>
                </>
              )}
              {isCustomer && (
                <>
                  <Link to="/dashboard" className="btn btn-ghost" style={{ fontWeight: '600', fontSize: '0.8125rem' }}>
                    Shop
                  </Link>
                  <Link to="/orders" className="btn btn-ghost" style={{ fontWeight: '600', fontSize: '0.8125rem' }}>
                    My Orders
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link to="/admin" className="btn btn-ghost" style={{ fontWeight: '600', color: 'var(--gold-dark)', fontSize: '0.8125rem' }}>
                  <Shield size={15} /> Admin
                </Link>
              )}
              {authUser && (
                <>
                  {isCustomer && (
                    <Link to="/cart" style={{
                      position: 'relative', display: 'flex', alignItems: 'center',
                      gap: '6px', padding: '8px 16px',
                      background: getTotalItems() > 0 ? 'var(--primary)' : 'transparent',
                      color: getTotalItems() > 0 ? '#fff' : 'var(--text-secondary)',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: '700', fontSize: '0.8125rem',
                      transition: 'var(--transition-fast)',
                      border: getTotalItems() > 0 ? 'none' : '1px solid var(--border)',
                    }}>
                      <ShoppingCart size={18} />
                      {getTotalItems() > 0 && (
                        <span>
                          {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''}
                        </span>
                      )}
                      {getTotalItems() === 0 && <span>Cart</span>}
                    </Link>
                  )}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '6px 12px', borderRadius: 'var(--radius-full)',
                    background: 'var(--surface-secondary)',
                    border: '1px solid var(--border-light)',
                  }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: 'var(--primary-tint)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <User size={14} color="var(--primary)" />
                    </div>
                    <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-primary)', maxWidth: '80px' }} className="truncate">
                      {authUser.name?.split(' ')[0]}
                    </span>
                    <button
                      onClick={handleLogout}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--text-muted)', display: 'flex', padding: '2px',
                      }}
                      title="Logout"
                    >
                      <LogOut size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile: Cart + Hamburger */}
            <div className="mobile-only" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {authUser && isCustomer && (
                <Link to="/cart" style={{
                  position: 'relative', display: 'flex', alignItems: 'center',
                  padding: '8px',
                }}>
                  <ShoppingCart size={22} color={getTotalItems() > 0 ? 'var(--primary)' : 'var(--text-muted)'} />
                  {getTotalItems() > 0 && (
                    <span style={{
                      position: 'absolute', top: '2px', right: '0',
                      background: 'var(--primary)', color: '#fff',
                      width: '18px', height: '18px', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.625rem', fontWeight: '800',
                    }}>
                      {getTotalItems()}
                    </span>
                  )}
                </Link>
              )}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '6px', display: 'flex', color: 'var(--text-primary)',
                }}
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{
            background: 'var(--surface)',
            borderTop: '1px solid var(--border-light)',
            padding: '12px 16px 16px',
            animation: 'slideDown 0.2s ease',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Link to="/" onClick={() => setMenuOpen(false)} className="mobile-nav-link">
                Home
              </Link>
              {!authUser && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <Link to="/login" className="btn btn-outline" style={{ flex: 1, fontWeight: '700', justifyContent: 'center' }} onClick={() => setMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/signup" className="btn btn-primary" style={{ flex: 1, fontWeight: '700', justifyContent: 'center' }} onClick={() => setMenuOpen(false)}>
                    Sign Up
                  </Link>
                </div>
              )}
              {isCustomer && (
                <>
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="mobile-nav-link">
                    🛒 Shop
                  </Link>
                  <Link to="/orders" onClick={() => setMenuOpen(false)} className="mobile-nav-link">
                    📦 My Orders
                  </Link>
                  <Link to="/cart" onClick={() => setMenuOpen(false)} className="mobile-nav-link">
                    🛍️ Cart {getTotalItems() > 0 && `(${getTotalItems()})`}
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="mobile-nav-link" style={{ color: 'var(--gold-dark)' }}>
                  🔒 Admin Dashboard
                </Link>
              )}
              {authUser && (
                <>
                  <div style={{ height: '1px', background: 'var(--border-light)', margin: '8px 0' }} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: 'var(--primary-tint)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                      }}>
                        <User size={16} color="var(--primary)" />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '700' }}>{authUser.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{authUser.email}</div>
                      </div>
                    </div>
                    <button onClick={handleLogout} className="btn btn-outline btn-small" style={{ gap: '4px' }}>
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <style>{`
        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          font-weight: 600;
          font-size: 0.875rem;
          color: var(--text-primary);
          transition: var(--transition-fast);
        }
        .mobile-nav-link:hover {
          background: var(--surface-secondary);
          color: var(--primary);
        }
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .mobile-only { display: flex !important; }
        }
        @media (min-width: 769px) {
          .desktop-only { display: flex !important; }
          .mobile-only { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
