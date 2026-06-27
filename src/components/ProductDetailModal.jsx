import React, { useState } from 'react';
import { X, ShoppingCart, Star, Plus, Minus, Leaf, Clock, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductDetailModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      showToast('Please login to add items to cart', 'info');
      navigate('/login');
      return;
    }
    addToCart(product, quantity);
    showToast(`${product.name} (x${quantity}) added to cart!`, 'success');
    onClose();
  };

  const originalPrice = Math.round(product.price * 1.25);
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        {/* Close bar */}
        <div style={{
          display: 'flex', justifyContent: 'center', padding: '8px 0 0',
        }}>
          <div style={{
            width: '36px', height: '4px', borderRadius: '2px',
            background: 'var(--border)',
          }} />
        </div>

        {/* Image */}
        <div style={{
          position: 'relative', width: '100%', aspectRatio: '4/3',
          overflow: 'hidden', background: 'var(--surface-secondary)',
        }}>
          {(product.image?.startsWith('/') || product.image?.startsWith('data:image/') || product.image?.startsWith('http://') || product.image?.startsWith('https://')) ? (
            <img src={product.image} alt={product.name} style={{
              width: '100%', height: '100%', objectFit: 'cover',
            }} />
          ) : (
            <div style={{
              width: '100%', height: '100%', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '5rem',
            }}>
              {product.image}
            </div>
          )}

          {/* Close btn */}
          <button onClick={onClose} style={{
            position: 'absolute', top: '12px', right: '12px',
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'rgba(0,0,0,0.5)', border: 'none',
            color: '#fff', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <X size={18} />
          </button>

          {/* Discount badge */}
          {discount > 0 && (
            <div style={{
              position: 'absolute', top: '12px', left: '12px',
              background: 'var(--primary)', color: '#fff',
              padding: '4px 10px', borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem', fontWeight: '800',
            }}>
              {discount}% OFF
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '20px' }}>
          {/* Title & Price */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div className="veg-indicator" />
              <span style={{ fontSize: '0.6875rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase' }}>
                Organic
              </span>
            </div>
            <h2 style={{ fontSize: '1.375rem', fontWeight: '800', marginBottom: '6px', color: 'var(--text-primary)' }}>
              {product.name}
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              {product.weight} • {product.lemonCount}
            </p>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>
                ₹{product.price}
              </span>
              <span style={{ fontSize: '1rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                ₹{originalPrice}
              </span>
              <span className="badge badge-success" style={{ fontSize: '0.625rem' }}>
                SAVE ₹{originalPrice - product.price}
              </span>
            </div>
          </div>

          {/* USPs */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px',
            marginBottom: '16px',
          }}>
            {[
              { icon: <Leaf size={14} />, label: 'Organic', color: 'var(--primary)' },
              { icon: <Clock size={14} />, label: '24hr Delivery', color: 'var(--gold-dark)' },
              { icon: <Shield size={14} />, label: 'Quality Check', color: 'var(--primary)' },
            ].map((usp, i) => (
              <div key={i} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '4px', padding: '10px 4px',
                background: 'var(--surface-secondary)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
              }}>
                <span style={{ color: usp.color }}>{usp.icon}</span>
                <span style={{ fontSize: '0.6875rem', fontWeight: '600', color: 'var(--text-muted)' }}>{usp.label}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: '700', marginBottom: '6px', color: 'var(--text-primary)' }}>
              About this product
            </h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              {product.description}
            </p>
          </div>

          {/* Nutrition */}
          <div style={{
            background: 'var(--primary-tint)', borderRadius: 'var(--radius-md)',
            padding: '14px', marginBottom: '16px',
            border: '1px solid rgba(10, 104, 71, 0.1)',
          }}>
            <h4 style={{ fontSize: '0.75rem', fontWeight: '700', marginBottom: '10px', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Nutrition Info
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {[
                { label: 'Vitamin C', value: product.nutritionInfo.vitaminC },
                { label: 'Fiber', value: product.nutritionInfo.fiber },
                { label: 'Calories', value: product.nutritionInfo.calories },
              ].map((item, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: '800', color: 'var(--primary)' }}>{item.value}</div>
                  <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: '500', marginTop: '2px' }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: '700', marginBottom: '10px', color: 'var(--text-primary)' }}>
              Customer Reviews
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {product.reviews.map((review, idx) => (
                <div key={idx} style={{
                  padding: '12px', background: 'var(--surface-secondary)',
                  borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{
                        width: '24px', height: '24px', borderRadius: '50%',
                        background: 'var(--gold-tint)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.625rem', fontWeight: '800', color: 'var(--gold-dark)',
                      }}>
                        {review.user[0]}
                      </div>
                      <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {review.user}
                      </span>
                    </div>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '2px',
                      background: 'var(--gold-tint)', padding: '2px 6px',
                      borderRadius: '4px',
                    }}>
                      <Star size={10} fill="var(--gold)" color="var(--gold)" />
                      <span style={{ fontSize: '0.6875rem', fontWeight: '700', color: 'var(--gold-dark)' }}>
                        {review.rating}
                      </span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quantity + Add to Cart */}
          <div style={{
            display: 'flex', gap: '12px', alignItems: 'center',
            padding: '16px 0 0', borderTop: '1px solid var(--border-light)',
          }}>
            {/* Quantity */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0',
              border: '1.5px solid var(--primary)',
              borderRadius: 'var(--radius-sm)', overflow: 'hidden',
            }}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{
                width: '36px', height: '36px', border: 'none',
                background: 'var(--primary-tint)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--primary)',
              }}>
                <Minus size={14} strokeWidth={3} />
              </button>
              <span style={{
                width: '40px', textAlign: 'center', fontWeight: '800',
                fontSize: '0.9375rem', color: 'var(--primary)',
              }}>
                {quantity}
              </span>
              <button onClick={() => setQuantity(quantity + 1)} style={{
                width: '36px', height: '36px', border: 'none',
                background: 'var(--primary-tint)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--primary)',
              }}>
                <Plus size={14} strokeWidth={3} />
              </button>
            </div>

            {/* Add Button */}
            <button onClick={handleAddToCart} style={{
              flex: 1, display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px',
              padding: '12px 20px',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
              color: '#fff', border: 'none',
              borderRadius: 'var(--radius-sm)', fontWeight: '800',
              fontSize: '0.9375rem', cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(10, 104, 71, 0.3)',
              fontFamily: 'inherit',
              transition: 'var(--transition-fast)',
            }}>
              <ShoppingCart size={18} />
              Add to Cart — ₹{product.price * quantity}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
