import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ChevronDown, ChevronUp, Calendar, MapPin, Package, ArrowLeft } from 'lucide-react';

const OrdersPage = () => {
  const { authUser } = useAuth();
  const { getUserOrders } = useData();
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const userOrders = getUserOrders(authUser.id);
  const sortedOrders = [...userOrders].reverse();

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending': return { label: 'Pending', bg: 'var(--gold-tint)', color: 'var(--gold-dark)', border: 'var(--gold-light)' };
      case 'processing': return { label: 'Processing', bg: '#E3F2FD', color: '#1565C0', border: '#BBDEFB' };
      case 'delivered': return { label: 'Delivered', bg: 'var(--primary-tint)', color: 'var(--primary)', border: 'rgba(10,104,71,0.15)' };
      default: return { label: status, bg: 'var(--surface-secondary)', color: 'var(--text-muted)', border: 'var(--border)' };
    }
  };

  return (
    <div style={{ background: 'var(--surface-secondary)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
        padding: '24px 0',
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/" style={{
              display: 'flex', padding: '4px', color: '#fff',
            }}>
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 style={{ color: '#fff', fontSize: '1.375rem', fontWeight: '800', margin: 0 }}>
                My Orders
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', margin: 0, fontWeight: '500' }}>
                {sortedOrders.length} order{sortedOrders.length !== 1 ? 's' : ''} placed
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '16px', paddingBottom: '40px' }}>
        {sortedOrders.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>📦</div>
            <h3 style={{ fontWeight: '700', marginBottom: '8px', fontSize: '1.125rem' }}>No orders yet</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.875rem' }}>
              Place your first order and it will appear here
            </p>
            <Link to="/dashboard" className="btn btn-primary" style={{ fontWeight: '700' }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sortedOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const isExpanded = expandedOrderId === order.id;
              return (
                <div key={order.id} style={{
                  background: 'var(--surface)', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
                }}>
                  {/* Header */}
                  <div
                    onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                    style={{
                      padding: '16px', cursor: 'pointer',
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', gap: '12px',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.9375rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                          Order #{order.id}
                        </span>
                        <span style={{
                          padding: '3px 10px', borderRadius: 'var(--radius-full)',
                          fontSize: '0.625rem', fontWeight: '700',
                          background: statusConfig.bg, color: statusConfig.color,
                          border: `1px solid ${statusConfig.border}`,
                          textTransform: 'uppercase', letterSpacing: '0.04em',
                        }}>
                          {statusConfig.label}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} />
                          {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)' }}>
                          ₹{order.totalPrice}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    <div style={{ color: 'var(--text-light)', flexShrink: 0 }}>
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>

                  {/* Expanded */}
                  {isExpanded && (
                    <div style={{
                      padding: '0 16px 16px',
                      borderTop: '1px solid var(--border-light)',
                      paddingTop: '16px',
                    }}>
                      {/* Progress */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '0',
                        marginBottom: '20px', padding: '0 8px',
                      }}>
                        {['Placed', 'Processing', 'Delivered'].map((step, i) => {
                          const stages = { pending: 0, processing: 1, delivered: 2 };
                          const current = stages[order.status] || 0;
                          const isActive = i <= current;
                          return (
                            <React.Fragment key={step}>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                                <div style={{
                                  width: '24px', height: '24px', borderRadius: '50%',
                                  background: isActive ? 'var(--primary)' : 'var(--border)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  color: isActive ? '#fff' : 'var(--text-light)',
                                  fontSize: '0.625rem', fontWeight: '800',
                                }}>
                                  {isActive ? '✓' : i + 1}
                                </div>
                                <span style={{
                                  fontSize: '0.5625rem', fontWeight: '600', marginTop: '4px',
                                  color: isActive ? 'var(--primary)' : 'var(--text-light)',
                                  whiteSpace: 'nowrap',
                                }}>
                                  {step}
                                </span>
                              </div>
                              {i < 2 && (
                                <div style={{
                                  flex: 1, height: '2px',
                                  background: i < current ? 'var(--primary)' : 'var(--border-light)',
                                  margin: '0 -2px', marginBottom: '18px',
                                  borderRadius: '1px',
                                }} />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>

                      {/* Items */}
                      <div style={{ marginBottom: '16px' }}>
                        <h4 style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
                          Items
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {order.items.map((item, idx) => (
                            <div key={idx} style={{
                              display: 'flex', alignItems: 'center', gap: '12px',
                              padding: '10px', background: 'var(--surface-secondary)',
                              borderRadius: 'var(--radius-sm)',
                            }}>
                              <div style={{
                                width: '48px', height: '48px', borderRadius: '6px',
                                overflow: 'hidden', flexShrink: 0,
                                border: '1px solid var(--border-light)',
                              }}>
                                {item.image.startsWith('/') ? (
                                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', background: 'var(--surface)' }}>
                                    {item.image}
                                  </div>
                                )}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-primary)' }}>{item.name}</div>
                                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                                  {item.weight} • Qty: {item.quantity}
                                </div>
                              </div>
                              <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--primary)' }}>
                                ₹{item.price * item.quantity}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Address */}
                      <div style={{
                        padding: '12px', background: 'var(--gold-tint)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--gold-light)',
                        display: 'flex', alignItems: 'flex-start', gap: '8px',
                        marginBottom: '12px',
                      }}>
                        <MapPin size={14} color="var(--gold-dark)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                          <div style={{ fontSize: '0.6875rem', fontWeight: '700', color: 'var(--gold-dark)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Delivery Address
                          </div>
                          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                            {order.address}
                          </div>
                        </div>
                      </div>

                      {/* Summary */}
                      <div style={{
                        padding: '12px', background: 'var(--primary-tint)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid rgba(10,104,71,0.1)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                          Total Paid
                        </span>
                        <span style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--primary)' }}>
                          ₹{order.totalPrice}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
