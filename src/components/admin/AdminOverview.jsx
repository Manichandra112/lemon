import React from 'react';
import { Users, Package, ShoppingCart, DollarSign, ArrowUpRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { getUsers } from '../../utils/localStorage';

const AdminOverview = () => {
  const { orders, products } = useData();
  const users = getUsers();

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const totalCustomers = users.filter(u => u.role === 'customer').length;
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;

  const statCards = [
    {
      title: 'Registered Users',
      value: users.length,
      icon: Users,
      color: 'var(--primary)',
      bgColor: 'var(--primary-tint)',
      description: `${totalCustomers} Customers`
    },
    {
      title: 'Citrus Portfolio',
      value: products.length,
      icon: Package,
      color: 'var(--gold-dark)',
      bgColor: 'var(--gold-tint)',
      description: 'Active Lemon Packs'
    },
    {
      title: 'Total Allocations',
      value: orders.length,
      icon: ShoppingCart,
      color: 'var(--primary)',
      bgColor: 'var(--primary-tint)',
      description: `${pendingOrdersCount} Pending Actions`
    },
    {
      title: 'Gross Revenue',
      value: `₹${totalRevenue}`,
      icon: DollarSign,
      color: 'var(--gold-dark)',
      bgColor: 'var(--gold-tint)',
      description: 'Processed Sales'
    }
  ];

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      {/* Title block */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-darker)', margin: 0 }}>
          Overview Analytics
        </h2>
        <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
          Real-time metrics of LemonMart registry, sales, and catalog
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '20px', 
        marginBottom: '28px' 
      }}>
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ zIndex: 2 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  {stat.title}
                </span>
                <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', margin: '4px 0' }}>
                  {stat.value}
                </h3>
                <span style={{ fontSize: '0.6875rem', fontWeight: '600', color: stat.color }}>
                  {stat.description}
                </span>
              </div>
              
              {/* Icon Container with subtle color matching */}
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: stat.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: stat.color,
                zIndex: 2
              }}>
                <Icon size={24} />
              </div>

              {/* Decorative background glow */}
              <div style={{
                position: 'absolute',
                bottom: '-20px',
                right: '-20px',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: stat.bgColor,
                opacity: 0.3,
                filter: 'blur(20px)',
                zIndex: 1
              }} />
            </div>
          );
        })}
      </div>

      {/* Progress metrics and Quick Charts */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '20px',
        marginBottom: '28px'
      }}>
        {/* Status Distribution */}
        <div style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--primary-dark)', marginBottom: '20px' }}>
            Allocations By Status
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {['pending', 'processing', 'delivered'].map((status) => {
              const count = orders.filter(o => o.status === status).length;
              const percentage = orders.length > 0 ? Math.round((count / orders.length) * 100) : 0;
              const color = status === 'pending' ? 'var(--warning)' : status === 'processing' ? 'var(--gold)' : 'var(--primary)';
              return (
                <div key={status}>
                  <div className="flex-between" style={{ marginBottom: '6px' }}>
                    <span style={{ textTransform: 'capitalize', fontWeight: '700', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      {status}
                    </span>
                    <span style={{ fontWeight: '800', fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                      {count} <span style={{ color: 'var(--text-muted)', fontWeight: '500', fontSize: '0.75rem' }}>({percentage}%)</span>
                    </span>
                  </div>
                  <div style={{
                    backgroundColor: 'var(--surface-secondary)',
                    height: '8px',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      backgroundColor: color,
                      width: `${percentage}%`,
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.5s ease-out'
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* User Breakdown Chart */}
        <div style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--primary-dark)', marginBottom: '20px' }}>
            System User Segments
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <div className="flex-between" style={{ marginBottom: '6px' }}>
                <span style={{ fontWeight: '700', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Customers</span>
                <span style={{ fontWeight: '800', fontSize: '0.8125rem', color: 'var(--primary)' }}>
                  {totalCustomers} <span style={{ color: 'var(--text-muted)', fontWeight: '500', fontSize: '0.75rem' }}>({users.length > 0 ? Math.round((totalCustomers / users.length) * 100) : 0}%)</span>
                </span>
              </div>
              <div style={{
                backgroundColor: 'var(--surface-secondary)',
                height: '8px',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  backgroundColor: 'var(--primary)',
                  width: users.length > 0 ? `${(totalCustomers / users.length) * 100}%` : '0%',
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.5s ease-out'
                }}></div>
              </div>
            </div>

            <div>
              <div className="flex-between" style={{ marginBottom: '6px' }}>
                <span style={{ fontWeight: '700', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Administrators</span>
                <span style={{ fontWeight: '800', fontSize: '0.8125rem', color: 'var(--gold-dark)' }}>
                  {users.length - totalCustomers} <span style={{ color: 'var(--text-muted)', fontWeight: '500', fontSize: '0.75rem' }}>({users.length > 0 ? Math.round(((users.length - totalCustomers) / users.length) * 100) : 0}%)</span>
                </span>
              </div>
              <div style={{
                backgroundColor: 'var(--surface-secondary)',
                height: '8px',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  backgroundColor: 'var(--gold)',
                  width: users.length > 0 ? `${((users.length - totalCustomers) / users.length) * 100}%` : '0%',
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.5s ease-out'
                }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Allocations Table */}
      <div style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div className="flex-between" style={{ marginBottom: '18px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--primary-dark)', margin: 0 }}>
            Recent Transactions
          </h3>
          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>
            Showing last 5 allocations
          </span>
        </div>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-light)' }}>
            <ShoppingCart size={40} style={{ opacity: 0.2, marginBottom: '8px' }} />
            <p style={{ margin: 0, fontSize: '0.875rem' }}>No orders recorded in database yet</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th style={{ padding: '12px 14px' }}>Order ID</th>
                  <th style={{ padding: '12px 14px' }}>Customer Name</th>
                  <th style={{ padding: '12px 14px' }}>Amount</th>
                  <th style={{ padding: '12px 14px' }}>Status</th>
                  <th style={{ padding: '12px 14px' }}>Allocation Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(-5).reverse().map((order) => {
                  const customer = users.find(u => u.id === order.userId);
                  const isDelivered = order.status === 'delivered';
                  const isPending = order.status === 'pending';
                  
                  return (
                    <tr key={order.id}>
                      <td style={{ fontWeight: '700', color: 'var(--text-primary)', padding: '14px' }}>
                        #{order.id}
                      </td>
                      <td style={{ fontWeight: '600', color: 'var(--text-secondary)', padding: '14px' }}>
                        {customer?.name || 'Unknown User'}
                      </td>
                      <td style={{ fontWeight: '800', color: 'var(--primary-dark)', padding: '14px' }}>
                        ₹{order.totalPrice}
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span className={`badge badge-${isDelivered ? 'success' : isPending ? 'warning' : 'info'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', padding: '14px' }}>
                        {new Date(order.date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;
