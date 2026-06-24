import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LogIn, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = login(email, password);
      if (result.success) {
        showToast(`Welcome back, ${result.user.name}!`, 'success');
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'var(--surface-secondary)',
    }}>
      {/* Left decorative panel - desktop */}
      <div className="login-side-panel" style={{
        flex: 1, display: 'none',
        background: 'linear-gradient(135deg, var(--primary-darker) 0%, var(--primary-dark) 50%, var(--primary) 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/hero_banner.png)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.15,
        }} />
        <div style={{
          position: 'relative', zIndex: 2, padding: '60px 40px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          height: '100%',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🍋</div>
          <h1 style={{ color: '#fff', fontSize: '2.25rem', fontWeight: '800', lineHeight: 1.15, marginBottom: '16px' }}>
            Welcome to <span style={{ color: 'var(--gold)' }}>LemonMart</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '400px' }}>
            India's premium organic lemon delivery service. Farm-fresh lemons delivered to your doorstep in 24 hours.
          </p>
          <div style={{ display: 'flex', gap: '20px', marginTop: '32px' }}>
            {['10K+ Customers', '100% Organic', 'Free Delivery'].map((text, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                color: 'var(--gold)', fontSize: '0.8125rem', fontWeight: '700',
              }}>
                <span>✓</span> {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '32px 20px',
      }}>
        <div style={{ maxWidth: '400px', width: '100%' }}>
          {/* Mobile Logo */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.75rem', marginBottom: '16px',
            }}>🍋</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '6px' }}>
              Welcome Back
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Login to your LemonMart account
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: '#FEF2F2', border: '1px solid #FECACA',
              color: 'var(--danger)', padding: '10px 14px',
              borderRadius: 'var(--radius-sm)', marginBottom: '20px',
              fontSize: '0.8125rem', fontWeight: '600',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email" className="form-input"
                placeholder="your@email.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'} className="form-input"
                  placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  required style={{ paddingRight: '40px' }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                  position: 'absolute', right: '12px', top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', cursor: 'pointer', color: 'var(--text-light)',
                  display: 'flex', padding: '2px',
                }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
              color: '#fff', border: 'none',
              borderRadius: 'var(--radius-sm)', fontWeight: '800',
              fontSize: '0.9375rem', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              fontFamily: 'inherit', display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: '0 4px 12px rgba(10, 104, 71, 0.3)',
              transition: 'var(--transition-fast)',
            }}>
              <LogIn size={18} />
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div style={{
            textAlign: 'center', margin: '24px 0',
            position: 'relative',
          }}>
            <div style={{
              borderTop: '1px solid var(--border)', position: 'absolute',
              top: '50%', left: 0, right: 0,
            }} />
            <span style={{
              background: 'var(--surface-secondary)', padding: '0 12px',
              color: 'var(--text-light)', position: 'relative',
              fontSize: '0.8125rem', fontWeight: '500',
            }}>
              New to LemonMart?
            </span>
          </div>

          <Link to="/signup" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '100%', padding: '12px',
            border: '1.5px solid var(--primary)', color: 'var(--primary)',
            borderRadius: 'var(--radius-sm)', fontWeight: '700',
            fontSize: '0.875rem', textDecoration: 'none',
            transition: 'var(--transition-fast)',
          }}>
            Create Free Account
          </Link>

          <Link to="/" style={{
            display: 'block', textAlign: 'center', marginTop: '20px',
            fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: '600',
          }}>
            ← Back to Home
          </Link>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .login-side-panel { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
