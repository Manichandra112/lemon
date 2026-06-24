import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Clock, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      background: 'linear-gradient(180deg, var(--primary-darker) 0%, #011A0E 100%)',
      color: '#fff', marginTop: 0,
    }}>
      {/* Gold accent bar */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, var(--gold) 0%, var(--gold-dark) 50%, var(--gold) 100%)' }} />

      <div className="container" style={{ padding: '40px 16px 20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '32px', marginBottom: '32px',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: 'var(--radius-sm)',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.25rem',
              }}>🍋</div>
              <div>
                <span style={{ fontSize: '1.125rem', fontWeight: '800' }}>LemonMart</span>
              </div>
            </div>
            <p style={{
              color: 'rgba(255,255,255,0.5)', fontSize: '0.8125rem',
              lineHeight: 1.6, maxWidth: '280px', margin: 0,
            }}>
              India's premium organic lemon delivery platform. Fresh lemons from our partner farms, delivered to your doorstep.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              {[
                { icon: '📸', label: 'Instagram' },
                { icon: '𝕏', label: 'Twitter' },
                { icon: 'f', label: 'Facebook' },
              ].map((social, i) => (
                <a key={i} href={`#${social.label.toLowerCase()}`} style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.5)', transition: 'all 0.2s ease',
                }} title={social.label}>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              color: 'var(--gold)', marginBottom: '14px',
              fontSize: '0.8125rem', fontWeight: '700',
              textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>
              Quick Links
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'Home', to: '/' },
                { label: 'Shop Lemons', to: '/dashboard' },
                { label: 'My Orders', to: '/orders' },
                { label: 'My Cart', to: '/cart' },
              ].map((link, i) => (
                <Link key={i} to={link.to} style={{
                  color: 'rgba(255,255,255,0.5)', fontSize: '0.8125rem',
                  fontWeight: '500', transition: 'all 0.15s ease',
                  textDecoration: 'none',
                }}
                  onMouseOver={(e) => e.target.style.color = 'var(--gold)'}
                  onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.5)'}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{
              color: 'var(--gold)', marginBottom: '14px',
              fontSize: '0.8125rem', fontWeight: '700',
              textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>
              Contact Us
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { icon: <Mail size={14} />, text: 'support@lemonmart.com' },
                { icon: <Phone size={14} />, text: '+91-6303-143-435' },
                { icon: <Clock size={14} />, text: '9 AM - 6 PM IST' },
                { icon: <MapPin size={14} />, text: 'Podalakur,Nellore, AP, India' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  color: 'rgba(255,255,255,0.5)', fontSize: '0.8125rem',
                }}>
                  <span style={{ color: 'var(--gold)', flexShrink: 0 }}>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{
              color: 'var(--gold)', marginBottom: '14px',
              fontSize: '0.8125rem', fontWeight: '700',
              textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>
              Legal
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['Privacy Policy', 'Terms & Conditions', 'Refund Policy', 'FAQs'].map((text, i) => (
                <a key={i} href={`#${text.toLowerCase().replace(/\s+/g, '-')}`} style={{
                  color: 'rgba(255,255,255,0.5)', fontSize: '0.8125rem',
                  fontWeight: '500', textDecoration: 'none',
                  transition: 'all 0.15s ease',
                }}
                  onMouseOver={(e) => e.target.style.color = 'var(--gold)'}
                  onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.5)'}
                >
                  {text}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '16px', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '8px',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', margin: 0, fontSize: '0.75rem' }}>
            © {new Date().getFullYear()} LemonMart. All rights reserved.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
            Made with <span style={{ color: 'var(--gold)' }}>🍋</span> in India
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
