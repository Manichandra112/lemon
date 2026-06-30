import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, Shield, User, CheckCircle } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setUsers(data || []);
      } catch (error) {
        console.error('Error fetching users from Supabase:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const name = user.name || '';
    const email = user.email || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      {/* Title */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-darker)', margin: 0 }}>
          Registry Database
        </h2>
        <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
          Browse system registers and administrative roles
        </p>
      </div>

      {/* Filters */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '16px', 
        marginBottom: '24px' 
      }}>
        <div className="form-group" style={{ marginBottom: '0' }}>
          <label className="form-label">Search Registers</label>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-light)',
              pointerEvents: 'none'
            }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search by name or email address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '36px', borderRadius: 'var(--radius-sm)' }}
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '0' }}>
          <label className="form-label">Filter Roles</label>
          <select
            className="form-select"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            style={{ borderRadius: 'var(--radius-sm)', borderColor: 'var(--border)' }}
          >
            <option value="all">All Roles</option>
            <option value="customer">Customers</option>
            <option value="admin">Administrators</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="card" style={{ border: '1px solid var(--border-light)', padding: 0, overflow: 'hidden', marginBottom: '24px' }}>
        {loading ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>
            Loading registry database from Supabase...
          </p>
        ) : filteredUsers.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>
            No registered users match your search criteria.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th style={{ padding: '12px 14px' }}>Account Name</th>
                  <th style={{ padding: '12px 14px' }}>Email Address</th>
                  <th style={{ padding: '12px 14px' }}>Phone Number</th>
                  <th style={{ padding: '12px 14px' }}>User Role</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const isAdmin = user.role === 'admin';
                  return (
                    <tr key={user.id}>
                      <td style={{ fontWeight: '700', color: 'var(--primary-dark)', padding: '14px' }}>
                        {user.name}
                      </td>
                      <td style={{ padding: '14px' }}>
                        {user.email}
                      </td>
                      <td style={{ color: 'var(--text-secondary)', padding: '14px' }}>
                        {user.phone || 'N/A'}
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span 
                          style={{
                            background: isAdmin ? 'var(--gold-tint)' : 'var(--primary-tint)',
                            color: isAdmin ? 'var(--gold-dark)' : 'var(--primary)',
                            border: isAdmin ? '1px solid var(--gold-light)' : '1px solid var(--primary-light)',
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.6875rem',
                            fontWeight: '800',
                            textTransform: 'uppercase',
                            letterSpacing: '0.02em',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {isAdmin ? <Shield size={12} /> : <User size={12} />}
                          {isAdmin ? 'Admin' : 'Customer'}
                        </span>
                      </td>
                      <td style={{ padding: '14px', textAlign: 'right' }}>
                        <span 
                          style={{
                            color: 'var(--primary)',
                            fontSize: '0.8125rem',
                            fontWeight: '700',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <CheckCircle size={14} /> Active
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px'
      }}>
        <div className="card" style={{ border: '1px solid var(--border-light)', padding: '16px 20px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.03em' }}>
            Total Registry Accounts
          </span>
          <h4 style={{ fontWeight: '800', fontSize: '1.75rem', color: 'var(--text-primary)', margin: '4px 0 0' }}>
            {filteredUsers.length}
          </h4>
        </div>
        
        <div className="card" style={{ border: '1px solid var(--border-light)', padding: '16px 20px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.03em' }}>
            Total Customers
          </span>
          <h4 style={{ fontWeight: '800', fontSize: '1.75rem', color: 'var(--primary)', margin: '4px 0 0' }}>
            {filteredUsers.filter(u => u.role === 'customer').length}
          </h4>
        </div>

        <div className="card" style={{ border: '1px solid var(--border-light)', padding: '16px 20px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.03em' }}>
            Total Administrators
          </span>
          <h4 style={{ fontWeight: '800', fontSize: '1.75rem', color: 'var(--gold-dark)', margin: '4px 0 0' }}>
            {filteredUsers.filter(u => u.role === 'admin').length}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
