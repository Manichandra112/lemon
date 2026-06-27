import React from 'react';
import { Plus, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onReadMore }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      showToast('Please login to add items to cart', 'info');
      navigate('/login');
      return;
    }
    addToCart(product, 1);
    showToast(`${product.name} added to cart!`, 'success');
  };

  // Fake discount for display
  const originalPrice = Math.round(product.price * 1.25);
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  return (
    <div
      className="product-card"
      onClick={() => onReadMore(product)}
    >
      {/* Image Section */}
      <div style={{
        position: 'relative',
        aspectRatio: '1',
        overflow: 'hidden',
        background: 'var(--surface-secondary)',
      }}>
        {(product.image?.startsWith('/') || product.image?.startsWith('data:image/') || product.image?.startsWith('http://') || product.image?.startsWith('https://')) ? (
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '4rem',
          }}>
            {product.image}
          </div>
        )}

        {/* Discount badge */}
        {discount > 0 && (
          <div style={{
            position: 'absolute', top: '8px', left: '8px',
            background: 'var(--primary)',
            color: '#fff', padding: '3px 8px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.6875rem', fontWeight: '800',
          }}>
            {discount}% OFF
          </div>
        )}

        {/* Organic badge */}
        <div style={{
          position: 'absolute', top: '8px', right: '8px',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(4px)',
          padding: '3px 8px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.625rem', fontWeight: '700',
          color: 'var(--primary)',
          border: '1px solid var(--primary-tint)',
        }}>
          🌿 Organic
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Delivery time */}
        <div style={{
          fontSize: '0.6875rem', fontWeight: '700',
          color: 'var(--text-muted)', marginBottom: '4px',
          display: 'flex', alignItems: 'center', gap: '4px',
        }}>
          <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }} />
          24 hrs delivery
        </div>

        {/* Name */}
        <h3 style={{
          fontSize: '0.875rem', fontWeight: '700',
          color: 'var(--text-primary)',
          marginBottom: '2px', lineHeight: '1.3',
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {product.name}
        </h3>

        {/* Weight */}
        <p style={{
          fontSize: '0.75rem', color: 'var(--text-muted)',
          margin: '0 0 2px', fontWeight: '500',
        }}>
          {product.weight} • {product.lemonCount}
        </p>

        {/* Rating */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          marginBottom: '8px',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '2px',
            background: 'var(--primary)',
            color: '#fff', padding: '1px 6px',
            borderRadius: '4px', fontSize: '0.6875rem', fontWeight: '700',
          }}>
            <Star size={10} fill="#fff" />
            4.5
          </div>
          <span style={{ fontSize: '0.6875rem', color: 'var(--text-light)' }}>
            ({product.reviews?.length || 0})
          </span>
        </div>

        {/* Price + Add */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginTop: 'auto',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                ₹{product.price}
              </span>
              <span style={{
                fontSize: '0.75rem', color: 'var(--text-light)',
                textDecoration: 'line-through',
              }}>
                ₹{originalPrice}
              </span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            style={{
              background: 'var(--surface)',
              border: '1.5px solid var(--primary)',
              color: 'var(--primary)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8125rem', fontWeight: '800',
              cursor: 'pointer', display: 'flex',
              alignItems: 'center', gap: '4px',
              transition: 'var(--transition-fast)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'var(--primary)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'var(--surface)';
              e.currentTarget.style.color = 'var(--primary)';
            }}
          >
            <Plus size={14} strokeWidth={3} />
            ADD
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
