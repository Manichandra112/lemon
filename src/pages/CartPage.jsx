import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ShieldCheck, Truck, Clock } from 'lucide-react';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const { addOrder } = useData();
  const { authUser } = useAuth();
  const { showToast, showConfirm } = useToast();
  const navigate = useNavigate();
  const [deliveryAddress, setDeliveryAddress] = useState(authUser?.address || '');
  const [loading, setLoading] = useState(false);

  const handleCheckout = () => {
    if (!deliveryAddress.trim()) {
      showToast('Please enter a delivery address', 'error');
      return;
    }
    setLoading(true);
    try {
      const order = {
        userId: authUser.id,
        items: cart,
        totalPrice: getTotalPrice(),
        address: deliveryAddress,
        status: 'pending'
      };
      addOrder(order);
      clearCart();
      showToast('Order placed successfully! 🎉', 'success');
      navigate('/orders');
    } catch (error) {
      showToast('Error placing order. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClearCart = () => {
    showConfirm('Clear all items from your cart?', () => {
      clearCart();
      showToast('Cart cleared', 'info');
    });
  };

  return (
    <div style={{ background: 'var(--surface-secondary)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'var(--surface)', borderBottom: '1px solid var(--border-light)',
        padding: '16px 0',
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => navigate(-1)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', padding: '4px', color: 'var(--text-primary)',
            }}>
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>
                My Cart
              </h1>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, fontWeight: '500' }}>
                {cart.length} item{cart.length !== 1 ? 's' : ''} in cart
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '16px', paddingBottom: '40px' }}>
        {cart.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🛒</div>
            <h3 style={{ fontWeight: '700', marginBottom: '8px', fontSize: '1.125rem' }}>Your cart is empty</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.875rem' }}>
              Add fresh lemons to get started
            </p>
            <Link to="/dashboard" className="btn btn-primary" style={{ fontWeight: '700' }}>
              Browse Products
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }} className="cart-layout">
            {/* Cart Items */}
            <div>
              <div style={{
                background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)', overflow: 'hidden',
              }}>
                {cart.map((item, index) => (
                  <div key={item.id} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '16px',
                    borderBottom: index < cart.length - 1 ? '1px solid var(--border-light)' : 'none',
                  }}>
                    {/* Product Image */}
                    <div style={{
                      width: '72px', height: '72px', borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden', flexShrink: 0,
                      border: '1px solid var(--border-light)',
                      background: 'var(--surface-secondary)',
                    }}>
                      {item.image.startsWith('/') ? (
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                          {item.image}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: '700', margin: '0 0 2px', color: 'var(--text-primary)' }}>
                        {item.name}
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 6px', fontWeight: '500' }}>
                        {item.weight}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.9375rem', fontWeight: '800', color: 'var(--primary)' }}>
                          ₹{item.price * item.quantity}
                        </span>
                        {item.quantity > 1 && (
                          <span style={{ fontSize: '0.6875rem', color: 'var(--text-light)' }}>
                            (₹{item.price} × {item.quantity})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity + Remove */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                      <div style={{
                        display: 'flex', alignItems: 'center',
                        border: '1.5px solid var(--primary)',
                        borderRadius: 'var(--radius-sm)', overflow: 'hidden',
                      }}>
                        <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} style={{
                          width: '30px', height: '30px', border: 'none',
                          background: 'var(--primary-tint)', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--primary)',
                        }}>
                          <Minus size={12} strokeWidth={3} />
                        </button>
                        <span style={{
                          width: '32px', textAlign: 'center', fontWeight: '800',
                          fontSize: '0.8125rem', color: 'var(--primary)',
                        }}>
                          {item.quantity}
                        </span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{
                          width: '30px', height: '30px', border: 'none',
                          background: 'var(--primary-tint)', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--primary)',
                        }}>
                          <Plus size={12} strokeWidth={3} />
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--danger)', fontSize: '0.6875rem',
                        fontWeight: '600', display: 'flex', alignItems: 'center', gap: '3px',
                        fontFamily: 'inherit',
                      }}>
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={handleClearCart} className="btn btn-ghost" style={{
                width: '100%', marginTop: '8px', color: 'var(--text-muted)',
                fontSize: '0.8125rem', fontWeight: '600',
              }}>
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div>
              <div style={{
                background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)', padding: '20px',
                position: 'sticky', top: '80px',
              }}>
                {/* Offer */}
                <div style={{
                  background: 'var(--gold-tint)', border: '1px solid var(--gold-light)',
                  borderRadius: 'var(--radius-sm)', padding: '10px 12px',
                  marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <span style={{ fontSize: '1rem' }}>🏷️</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--gold-dark)' }}>
                    Free delivery on this order!
                  </span>
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '14px', color: 'var(--text-primary)' }}>
                  Order Summary
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Subtotal ({cart.length} items)</span>
                    <span style={{ fontWeight: '600' }}>₹{getTotalPrice()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Delivery</span>
                    <span style={{ fontWeight: '700', color: 'var(--primary)' }}>FREE</span>
                  </div>
                  <div style={{
                    borderTop: '1.5px solid var(--border)',
                    paddingTop: '10px', display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                    <span style={{ fontSize: '1rem', fontWeight: '800' }}>Total</span>
                    <span style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--primary)' }}>₹{getTotalPrice()}</span>
                  </div>
                </div>

                {/* Delivery Address */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px', display: 'block' }}>
                    Delivery Address
                  </label>
                  <textarea
                    className="form-textarea"
                    rows="3"
                    placeholder="Enter your full delivery address..."
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    style={{ resize: 'none' }}
                  />
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  style={{
                    width: '100%', padding: '14px',
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                    color: '#fff', border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: '800', fontSize: '0.9375rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    fontFamily: 'inherit',
                    boxShadow: '0 4px 12px rgba(10, 104, 71, 0.3)',
                    transition: 'var(--transition-fast)',
                  }}
                >
                  {loading ? 'Placing Order...' : `Place Order — ₹${getTotalPrice()}`}
                </button>

                <Link to="/dashboard" style={{
                  display: 'block', textAlign: 'center', marginTop: '12px',
                  fontSize: '0.8125rem', fontWeight: '600', color: 'var(--primary)',
                }}>
                  Continue Shopping
                </Link>

                {/* Trust badges */}
                <div style={{
                  display: 'flex', justifyContent: 'center', gap: '16px',
                  marginTop: '16px', paddingTop: '14px',
                  borderTop: '1px solid var(--border-light)',
                }}>
                  {[
                    { icon: <ShieldCheck size={14} />, text: 'Secure' },
                    { icon: <Truck size={14} />, text: 'Free Delivery' },
                    { icon: <Clock size={14} />, text: '24hr Fresh' },
                  ].map((item, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: '600',
                    }}>
                      <span style={{ color: 'var(--gold-dark)' }}>{item.icon}</span>
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 769px) {
          .cart-layout {
            grid-template-columns: 1fr 380px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CartPage;
