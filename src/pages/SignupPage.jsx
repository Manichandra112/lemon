import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserPlus, Eye, EyeOff } from 'lucide-react';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '',
    name: '', phone: '', role: 'customer'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { showToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.email || !formData.password || !formData.name || !formData.phone) {
      setError('All fields are required');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const result = await signup(formData.email, formData.password, formData.name, formData.phone, formData.role);
      if (result.success) {
        if (result.needsEmailConfirmation) {
          showToast('Account created. Please confirm your email before logging in.', 'success');
          navigate('/login');
        } else {
          showToast('Account created! Welcome to LemonMart 🍋', 'success');
          if (result.user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
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
      <div className="signup-side-panel" style={{
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
            Join <span style={{ color: 'var(--gold)' }}>LemonMart</span> Today
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '400px' }}>
            Get access to premium organic lemons with free delivery on your first order. Fresh from farm to your kitchen.
          </p>
          <div style={{
            marginTop: '32px', padding: '20px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <div style={{ color: 'var(--gold)', fontSize: '0.875rem', fontWeight: '700', marginBottom: '8px' }}>
              🎉 First Order Offer
            </div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>
              Sign up now and get <strong style={{ color: 'var(--gold)' }}>free delivery</strong> on your first order + <strong style={{ color: 'var(--gold)' }}>20% off</strong> on bulk packs!
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '32px 20px', overflowY: 'auto',
      }}>
        <div style={{ maxWidth: '400px', width: '100%' }}>
          {/* Mobile Logo */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.75rem', marginBottom: '16px',
            }}>🍋</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '6px' }}>
              Create Account
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Join LemonMart for fresh organic lemons
            </p>
          </div>

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
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" name="name"
                placeholder="John Doe" value={formData.name}
                onChange={handleChange} required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" name="email"
                placeholder="your@email.com" value={formData.email}
                onChange={handleChange} required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="tel" className="form-input" name="phone"
                placeholder="9876543210" value={formData.phone}
                onChange={handleChange} required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'} className="form-input"
                  name="password" placeholder="••••••••"
                  value={formData.password} onChange={handleChange}
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

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input type="password" className="form-input" name="confirmPassword"
                placeholder="••••••••" value={formData.confirmPassword}
                onChange={handleChange} required
              />
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
              <UserPlus size={18} />
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div style={{
            textAlign: 'center', margin: '20px 0',
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
              Already have an account?
            </span>
          </div>

          <Link to="/login" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '100%', padding: '12px',
            border: '1.5px solid var(--primary)', color: 'var(--primary)',
            borderRadius: 'var(--radius-sm)', fontWeight: '700',
            fontSize: '0.875rem', textDecoration: 'none',
          }}>
            Login Here
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
          .signup-side-panel { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

export default SignupPage;
