import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../context/ToastContext';
import { ChevronDown, Package, User, MapPin, CheckCircle, Clock, Truck } from 'lucide-react';

const OrdersView = () => {
  const { orders, updateOrderStatus } = useData();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*');
        if (error) throw error;
        setUsers(data || []);
      } catch (err) {
        console.error('Error fetching users in OrdersView:', err);
      }
    };
    fetchUsers();
  }, []);
  const { showToast } = useToast();
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(o => o.status === filterStatus);

  const sortedOrders = [...filteredOrders].reverse();

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    showToast(`Order #${orderId} status has been updated to ${newStatus}.`, 'success');
  };

  const getBadgeStyle = (status) => {
    switch (status) {
      case 'pending':
        return {
          background: 'var(--gold-tint)',
          color: 'var(--gold-dark)',
          border: '1px solid var(--gold-light)'
        };
      case 'processing':
        return {
          background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)',
          color: '#fff',
          border: 'none'
        };
      case 'delivered':
        return {
          background: 'var(--primary-tint)',
          color: 'var(--primary)',
          border: '1px solid var(--primary-light)'
        };
      default:
        return {
          background: 'var(--surface-secondary)',
          color: 'var(--text-muted)',
          border: '1px solid var(--border)'
        };
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      {/* View Title */}
      <div className="flex-between" style={{ marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-darker)', margin: 0 }}>
            Allocation & Order Management
          </h2>
          <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            Verify client receipts, shipping destinations, and update delivery statuses
          </p>
        </div>

        {/* Filter bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Status:</span>
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ 
              padding: '8px 12px', 
              fontSize: '0.8125rem', 
              borderRadius: 'var(--radius-sm)', 
              borderColor: 'var(--primary-light)', 
              width: '150px' 
            }}
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Orders List Container */}
      {sortedOrders.length === 0 ? (
        <div className="card" style={{ border: '1px solid var(--border-light)', textAlign: 'center', padding: '40px' }}>
          <Package size={40} style={{ color: 'var(--text-light)', opacity: 0.3, marginBottom: '8px' }} />
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.875rem' }}>
            No allocations match your selected filters.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {sortedOrders.map((order) => {
            const customer = users.find(u => u.id === order.userId);
            const isExpanded = expandedOrderId === order.id;
            const badgeStyle = getBadgeStyle(order.status);
            
            return (
              <div 
                key={order.id} 
                className="card" 
                style={{ 
                  cursor: 'default', 
                  overflow: 'hidden', 
                  padding: '0', 
                  border: isExpanded ? '1.5px solid var(--primary-light)' : '1px solid var(--border-light)',
                  boxShadow: isExpanded ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                  transition: 'var(--transition)'
                }}
              >
                {/* Header Strip */}
                <div
                  onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                    backgroundColor: isExpanded ? 'var(--primary-subtle)' : 'var(--surface)',
                    borderBottom: isExpanded ? '1.5px solid var(--border-light)' : 'none',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)'
                  }}
                  className="order-header-strip"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <div>
                      <span style={{ fontSize: '0.6875rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Allocation
                      </span>
                      <h3 style={{ margin: '2px 0 0', fontSize: '1.125rem', color: 'var(--primary-dark)', fontWeight: '800' }}>
                        Order #{order.id}
                      </h3>
                    </div>

                    {/* Status Badge */}
                    <div style={{
                      padding: '4px 12px',
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      borderRadius: 'var(--radius-full)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.02em',
                      ...badgeStyle
                    }}>
                      {order.status}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap' }}>
                    <div className="desktop-only">
                      <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', display: 'block' }}>Customer</span>
                      <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{customer?.name || 'Guest User'}</strong>
                    </div>

                    <div className="desktop-only">
                      <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', display: 'block' }}>Allocated Date</span>
                      <strong style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {new Date(order.date).toLocaleDateString()}
                      </strong>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', display: 'block', textAlign: 'right' }}>Total Amount</span>
                      <strong style={{ fontSize: '1rem', color: 'var(--primary)', fontWeight: '800' }}>₹{order.totalPrice}</strong>
                    </div>

                    <div style={{
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.3s ease',
                      color: 'var(--text-light)',
                      display: 'flex'
                    }}>
                      <ChevronDown size={20} />
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                {isExpanded && (
                  <div style={{ padding: '24px', backgroundColor: 'var(--surface-secondary)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                      
                      {/* Products List Column */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: '800', color: 'var(--primary-dark)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Package size={16} /> Item Packages
                        </h4>
                        
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '12px 16px',
                              backgroundColor: 'var(--surface)',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-light)'
                            }}
                          >
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                              <div style={{ 
                                width: '40px', 
                                height: '40px', 
                                borderRadius: 'var(--radius-sm)', 
                                overflow: 'hidden',
                                border: '1px solid var(--border-light)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'var(--surface-secondary)',
                                flexShrink: 0
                              }}>
                                {item.image?.startsWith('/') ? (
                                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                  <span style={{ fontSize: '1.25rem' }}>{item.image || '🍋'}</span>
                                )}
                              </div>
                              <div>
                                <p style={{ margin: '0', fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.875rem' }}>{item.name}</p>
                                <p style={{ margin: '2px 0 0', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '600' }}>
                                  ₹{item.price} × {item.quantity}
                                </p>
                              </div>
                            </div>
                            <div style={{ fontWeight: '800', color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                              ₹{item.price * item.quantity}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Customer Info & Address Column */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                          <h4 style={{ fontSize: '0.875rem', fontWeight: '800', color: 'var(--primary-dark)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <User size={16} /> Client Profiles
                          </h4>
                          <div style={{
                            padding: '12px 16px',
                            backgroundColor: 'var(--surface)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-light)',
                            fontSize: '0.8125rem',
                            lineHeight: '1.6'
                          }}>
                            <div><strong>Name:</strong> {customer?.name || 'Guest'}</div>
                            <div><strong>Email:</strong> {customer?.email || 'N/A'}</div>
                            <div><strong>Phone:</strong> {customer?.phone || 'N/A'}</div>
                          </div>
                        </div>

                        <div>
                          <h4 style={{ fontSize: '0.875rem', fontWeight: '800', color: 'var(--primary-dark)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <MapPin size={16} /> Shipping Destination
                          </h4>
                          <div style={{
                            padding: '12px 16px',
                            backgroundColor: 'var(--gold-tint)',
                            border: '1px solid var(--gold-light)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--gold-dark)',
                            fontSize: '0.8125rem',
                            fontWeight: '600',
                            lineHeight: '1.5'
                          }}>
                            {order.address}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status update actions */}
                    <div style={{ 
                      marginTop: '20px', 
                      borderTop: '1px solid var(--border-light)', 
                      paddingTop: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}>
                      {/* Dropdown status update */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Status Stage:</span>
                        <select
                          className="form-select"
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          style={{ 
                            padding: '6px 12px', 
                            fontSize: '0.8125rem', 
                            borderRadius: 'var(--radius-sm)', 
                            width: '140px' 
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>

                      {/* Quick action buttons */}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'processing')}
                            className="btn"
                            style={{ 
                              background: 'var(--gold)', 
                              color: 'var(--primary-darker)',
                              fontWeight: '700',
                              fontSize: '0.75rem',
                              padding: '8px 16px',
                              borderRadius: 'var(--radius-sm)',
                              gap: '4px'
                            }}
                          >
                            <Clock size={14} /> Process Package
                          </button>
                        )}
                        {order.status !== 'delivered' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'delivered')}
                            className="btn btn-primary"
                            style={{ 
                              fontWeight: '700',
                              fontSize: '0.75rem',
                              padding: '8px 16px',
                              borderRadius: 'var(--radius-sm)',
                              gap: '4px'
                            }}
                          >
                            <CheckCircle size={14} /> Dispatched & Delivered
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .order-header-strip:hover {
          background-color: var(--surface-hover) !important;
        }
      `}</style>
    </div>
  );
};

export default OrdersView;
