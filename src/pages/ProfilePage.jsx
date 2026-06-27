import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabase';
import { User, MapPin, Plus, Trash2, Edit3, Check, Star, ArrowLeft, Home, Briefcase, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { authUser, updateProfile } = useAuth();
  const { showToast, showConfirm } = useToast();
  
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'addresses'
  
  // Profile form state
  const [profileName, setProfileName] = useState(authUser?.name || '');
  const [profilePhone, setProfilePhone] = useState(authUser?.phone || '');
  const [profileLoading, setProfileLoading] = useState(false);

  // Address list state
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(true);

  // Address form modal state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    full_name: '',
    phone: '',
    house_no: '',
    street: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    address_type: 'Home',
    is_default: false
  });
  const [addressFormLoading, setAddressFormLoading] = useState(false);

  // Load addresses on mount
  useEffect(() => {
    fetchAddresses();
  }, [authUser]);

  const fetchAddresses = async () => {
    if (!authUser) return;
    setAddressesLoading(true);
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('userId', authUser.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
    } catch (err) {
      console.error('Error fetching addresses:', err);
      showToast('Could not load shipping addresses.', 'error');
    } finally {
      setAddressesLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileName.trim() || !profilePhone.trim()) {
      showToast('Name and Phone are required.', 'error');
      return;
    }
    setProfileLoading(true);
    const result = await updateProfile({ name: profileName, phone: profilePhone });
    setProfileLoading(false);
    
    if (result.success) {
      showToast('Profile updated successfully! ✨', 'success');
    } else {
      showToast(result.error || 'Failed to update profile.', 'error');
    }
  };

  const handleAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const openNewAddressForm = () => {
    setEditingAddressId(null);
    setAddressForm({
      full_name: authUser?.name || '',
      phone: authUser?.phone || '',
      house_no: '',
      street: '',
      area: '',
      city: '',
      state: '',
      pincode: '',
      landmark: '',
      address_type: 'Home',
      is_default: addresses.length === 0 // default to true if it is the first address
    });
    setShowAddressForm(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddressId(address.id);
    setAddressForm({
      full_name: address.full_name || '',
      phone: address.phone || '',
      house_no: address.house_no || '',
      street: address.street || '',
      area: address.area || '',
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || '',
      landmark: address.landmark || '',
      address_type: address.address_type || 'Home',
      is_default: address.is_default || false
    });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (id) => {
    showConfirm('Are you sure you want to remove this shipping address?', async () => {
      try {
        const { error } = await supabase
          .from('addresses')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        showToast('Address deleted successfully.', 'success');
        fetchAddresses();
      } catch (err) {
        console.error('Error deleting address:', err);
        showToast('Failed to delete address.', 'error');
      }
    });
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      // 1. Reset all addresses for user to false
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('userId', authUser.id);
      
      // 2. Set target address to true
      const { error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;
      
      showToast('Default address updated!', 'success');
      fetchAddresses();
    } catch (err) {
      console.error('Error setting default address:', err);
      showToast('Failed to set default address.', 'error');
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!addressForm.full_name || !addressForm.phone || !addressForm.street || !addressForm.city || !addressForm.state || !addressForm.pincode) {
      showToast('Please fill in all required (*) fields.', 'error');
      return;
    }

    setAddressFormLoading(true);
    try {
      if (addressForm.is_default) {
        // Reset defaults
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('userId', authUser.id);
      }

      const payload = {
        userId: authUser.id,
        full_name: addressForm.full_name,
        phone: addressForm.phone,
        house_no: addressForm.house_no,
        street: addressForm.street,
        area: addressForm.area,
        city: addressForm.city,
        state: addressForm.state,
        pincode: addressForm.pincode,
        landmark: addressForm.landmark,
        address_type: addressForm.address_type,
        is_default: addressForm.is_default || addresses.length === 0
      };

      if (editingAddressId) {
        // Update
        const { error } = await supabase
          .from('addresses')
          .update(payload)
          .eq('id', editingAddressId);
        
        if (error) throw error;
        showToast('Address updated successfully.', 'success');
      } else {
        // Insert
        const { error } = await supabase
          .from('addresses')
          .insert([payload]);

        if (error) throw error;
        showToast('Address added to your account.', 'success');
      }

      setShowAddressForm(false);
      fetchAddresses();
    } catch (err) {
      console.error('Error saving address:', err);
      showToast('Failed to save address. Please try again.', 'error');
    } finally {
      setAddressFormLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--surface-secondary)', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Header section */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
        padding: '30px 0 40px',
        color: '#fff',
      }}>
        <div className="container">
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--gold)', textDecoration: 'none', fontWeight: '700', fontSize: '0.8125rem', marginBottom: '16px' }}>
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem'
            }}>
              🍋
            </div>
            <div>
              <h1 style={{ color: '#fff', fontSize: '1.625rem', fontWeight: '800', margin: 0 }}>My Profile Settings</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', margin: '4px 0 0' }}>
                Manage your credentials and delivery destinations
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '-20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          
          {/* Navigation Tabs */}
          <div style={{
            display: 'flex',
            background: 'var(--surface)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-light)'
          }}>
            <button
              onClick={() => setActiveTab('profile')}
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                background: activeTab === 'profile' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'profile' ? '#fff' : 'var(--text-secondary)',
                fontWeight: '700',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <User size={16} /> Personal Details
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                background: activeTab === 'addresses' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'addresses' ? '#fff' : 'var(--text-secondary)',
                fontWeight: '700',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <MapPin size={16} /> Saved Addresses ({addresses.length})
            </button>
          </div>

          {/* TAB 1: Personal Details Form */}
          {activeTab === 'profile' && (
            <div className="card" style={{ animation: 'fadeIn 0.3s ease' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '1.125rem', color: 'var(--primary-dark)', fontWeight: '800' }}>
                Account Information
              </h3>
              
              <form onSubmit={handleProfileSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Contact Number</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="10 digit mobile number"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Email Address (Registered Account)</label>
                    <input
                      type="email"
                      className="form-input"
                      value={authUser?.email || ''}
                      disabled
                      style={{ backgroundColor: 'var(--surface-secondary)', cursor: 'not-allowed', color: 'var(--text-muted)' }}
                    />
                    <small style={{ color: 'var(--text-light)', display: 'block', marginTop: '4px' }}>
                      Email address cannot be changed. This matches your Supabase Auth credentials.
                    </small>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={profileLoading}
                    style={{ fontWeight: '700', padding: '10px 24px' }}
                  >
                    {profileLoading ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Saved Addresses Book */}
          {activeTab === 'addresses' && (
            <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div className="flex-between" style={{ flexWrap: 'wrap', gap: '12px' }}>
                <h3 style={{ margin: '0', fontSize: '1.125rem', color: 'var(--primary-dark)', fontWeight: '800' }}>
                  Shipping Locations
                </h3>
                <button
                  onClick={openNewAddressForm}
                  className="btn btn-primary btn-small"
                  style={{ gap: '6px', fontWeight: '700' }}
                >
                  <Plus size={15} /> Add New Address
                </button>
              </div>

              {addressesLoading ? (
                <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                  <p style={{ color: 'var(--text-muted)' }}>Loading address book...</p>
                </div>
              ) : addresses.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '60px 20px', borderStyle: 'dashed' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📍</div>
                  <h4 style={{ margin: '0 0 4px', fontWeight: '700' }}>No addresses found</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', margin: '0 0 16px' }}>
                    Please add a delivery destination to facilitate your purchase checkouts.
                  </p>
                  <button
                    onClick={openNewAddressForm}
                    className="btn btn-primary btn-small"
                    style={{ fontWeight: '700' }}
                  >
                    Add Shipping Address
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  {addresses.map((address) => (
                    <div 
                      key={address.id} 
                      className="card" 
                      style={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        border: address.is_default ? '1.5px solid var(--primary)' : '1px solid var(--border-light)',
                        boxShadow: address.is_default ? '0 4px 12px rgba(10, 104, 71, 0.08)' : 'var(--shadow-sm)',
                        position: 'relative'
                      }}
                    >
                      <div>
                        {/* Title Row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <span style={{ 
                            fontSize: '0.6875rem', 
                            fontWeight: '800', 
                            textTransform: 'uppercase',
                            background: 'var(--primary-tint)',
                            color: 'var(--primary-dark)',
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-sm)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            {address.address_type === 'Work' ? <Briefcase size={10} /> : <Home size={10} />}
                            {address.address_type || 'Home'}
                          </span>
                          
                          {address.is_default && (
                            <span style={{ 
                              fontSize: '0.6875rem', 
                              fontWeight: '800',
                              color: 'var(--gold-dark)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px'
                            }}>
                              <Star size={11} fill="var(--gold)" color="var(--gold)" /> Default
                            </span>
                          )}
                        </div>

                        {/* Name & Phone */}
                        <h4 style={{ margin: '0 0 4px', fontWeight: '800', color: 'var(--text-primary)' }}>
                          {address.full_name}
                        </h4>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>
                          Phone: {address.phone}
                        </div>

                        {/* Details */}
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                          {address.house_no ? `${address.house_no}, ` : ''}
                          {address.street}, {address.area ? `${address.area}, ` : ''}
                          <br />
                          {address.city}, {address.state} - <strong>{address.pincode}</strong>
                          {address.landmark && (
                            <span style={{ display: 'block', fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--text-light)', marginTop: '4px' }}>
                              Landmark: {address.landmark}
                            </span>
                          )}
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)' }}>
                            Country: {address.country || 'India'}
                          </span>
                        </p>
                      </div>

                      {/* Operations */}
                      <div style={{ 
                        borderTop: '1px solid var(--border-light)', 
                        marginTop: '16px', 
                        paddingTop: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        {!address.is_default ? (
                          <button
                            onClick={() => handleSetDefaultAddress(address.id)}
                            style={{
                              background: 'none', border: 'none', cursor: 'pointer',
                              color: 'var(--primary)', fontSize: '0.75rem', fontWeight: '700',
                              padding: '2px 0', display: 'flex', alignItems: 'center', gap: '3px'
                            }}
                          >
                            Set as Default
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Check size={12} /> Active Delivery
                          </span>
                        )}

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleEditAddress(address)}
                            style={{
                              background: 'none', border: 'none', cursor: 'pointer',
                              color: 'var(--text-muted)', display: 'flex', padding: '4px'
                            }}
                            title="Edit Address"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            style={{
                              background: 'none', border: 'none', cursor: 'pointer',
                              color: 'var(--danger)', display: 'flex', padding: '4px'
                            }}
                            title="Delete Address"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ADDRESS FORM MODAL */}
      {showAddressForm && (
        <div style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(3px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px', zIndex: 1000,
          animation: 'fadeIn 0.2s ease'
        }}>
          <div className="card" style={{ 
            maxWidth: '500px', width: '100%', 
            maxHeight: '90vh', overflowY: 'auto',
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' 
          }}>
            <div className="flex-between" style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '1.125rem', color: 'var(--primary-dark)', fontWeight: '800' }}>
                {editingAddressId ? 'Modify Address Profile' : 'New Shipping Address'}
              </h3>
              <button 
                onClick={() => setShowAddressForm(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddressSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group">
                    <label className="form-label">Contact Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      name="full_name"
                      value={addressForm.full_name}
                      onChange={handleAddressInputChange}
                      placeholder="e.g. John Doe"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contact Phone *</label>
                    <input
                      type="tel"
                      className="form-input"
                      name="phone"
                      value={addressForm.phone}
                      onChange={handleAddressInputChange}
                      placeholder="e.g. 9876543210"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
                  <div className="form-group">
                    <label className="form-label">Flat/House No.</label>
                    <input
                      type="text"
                      className="form-input"
                      name="house_no"
                      value={addressForm.house_no}
                      onChange={handleAddressInputChange}
                      placeholder="e.g. #304"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Street / Colony *</label>
                    <input
                      type="text"
                      className="form-input"
                      name="street"
                      value={addressForm.street}
                      onChange={handleAddressInputChange}
                      placeholder="e.g. 5th Main Road"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Locality / Area</label>
                  <input
                    type="text"
                    className="form-input"
                    name="area"
                    value={addressForm.area}
                    onChange={handleAddressInputChange}
                    placeholder="e.g. Koramangala Sector 3"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      className="form-input"
                      name="city"
                      value={addressForm.city}
                      onChange={handleAddressInputChange}
                      placeholder="e.g. Bengaluru"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <input
                      type="text"
                      className="form-input"
                      name="state"
                      value={addressForm.state}
                      onChange={handleAddressInputChange}
                      placeholder="e.g. Karnataka"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group">
                    <label className="form-label">Pincode *</label>
                    <input
                      type="text"
                      className="form-input"
                      name="pincode"
                      value={addressForm.pincode}
                      onChange={handleAddressInputChange}
                      placeholder="6 digit pincode"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      className="form-input"
                      name="country"
                      value={addressForm.country || 'India'}
                      onChange={handleAddressInputChange}
                      disabled
                      style={{ backgroundColor: 'var(--surface-secondary)', color: 'var(--text-muted)' }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Landmark (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    name="landmark"
                    value={addressForm.landmark}
                    onChange={handleAddressInputChange}
                    placeholder="e.g. Near HDFC Bank ATM"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'center', marginTop: '6px' }}>
                  <div className="form-group">
                    <label className="form-label">Address Type</label>
                    <select
                      className="form-select"
                      name="address_type"
                      value={addressForm.address_type}
                      onChange={handleAddressInputChange}
                    >
                      <option value="Home">🏡 Home (Residential)</option>
                      <option value="Work">💼 Work (Office/Commercial)</option>
                    </select>
                  </div>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', fontWeight: '700', cursor: 'pointer', marginTop: '12px' }}>
                    <input
                      type="checkbox"
                      name="is_default"
                      checked={addressForm.is_default}
                      onChange={handleAddressInputChange}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                    />
                    Set as Default Address
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowAddressForm(false)}
                  style={{ fontWeight: '700' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={addressFormLoading}
                  style={{ fontWeight: '700' }}
                >
                  {addressFormLoading ? 'Saving...' : editingAddressId ? 'Update Address' : 'Add Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple Close Icon mapping
const X = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default ProfilePage;
