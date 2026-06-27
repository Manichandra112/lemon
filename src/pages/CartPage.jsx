import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ShieldCheck, Truck, Clock, Briefcase, Home } from 'lucide-react';
import { supabase } from '../lib/supabase';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const { addOrder } = useData();
  const { authUser } = useAuth();
  const { showToast, showConfirm } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Address Book States
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);

  const [newAddressForm, setNewAddressForm] = useState({
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
    is_default: false
  });
  const [addressFormLoading, setAddressFormLoading] = useState(false);

  const fetchAddresses = async () => {
    if (!authUser) {
      setAddresses([]);
      setAddressesLoading(false);
      return;
    }
    setAddressesLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session?.user) {
        setAddresses([]);
        return;
      }

      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('userId', authUser.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
      
      if (data && data.length > 0) {
        const defaultAddr = data.find(a => a.is_default);
        setSelectedAddressId(defaultAddr ? defaultAddr.id : data[0].id);
      }
    } catch (err) {
      console.error('Error loading addresses in Checkout:', err);
    } finally {
      setAddressesLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [authUser]);

  const handleCheckout = async () => {
    if (addresses.length === 0) {
      showToast('Please add a shipping address first.', 'error');
      setShowAddAddressModal(true);
      return;
    }

    if (!selectedAddressId) {
      showToast('Please select a delivery address.', 'error');
      return;
    }

    const selectedAddr = addresses.find(a => a.id === selectedAddressId);
    if (!selectedAddr) {
      showToast('Selected address not found.', 'error');
      return;
    }

    // Format address nicely for order record
    const formattedAddressText = `${selectedAddr.full_name}, Phone: ${selectedAddr.phone} - ${selectedAddr.house_no ? `${selectedAddr.house_no}, ` : ''}${selectedAddr.street}, ${selectedAddr.area ? `${selectedAddr.area}, ` : ''}${selectedAddr.city}, ${selectedAddr.state} - ${selectedAddr.pincode}${selectedAddr.landmark ? ` (Landmark: ${selectedAddr.landmark})` : ''}`;

    setLoading(true);
    try {
      const order = {
        userId: authUser.id,
        items: cart,
        totalPrice: getTotalPrice(),
        address: formattedAddressText,
        status: 'pending'
      };
      await addOrder(order);
      clearCart();
      showToast('Order placed successfully! 🎉', 'success');
      navigate('/orders');
    } catch (error) {
      showToast('Error placing order. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddressForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!newAddressForm.full_name || !newAddressForm.phone || !newAddressForm.street || !newAddressForm.city || !newAddressForm.state || !newAddressForm.pincode) {
      showToast('Please fill in all required (*) fields.', 'error');
      return;
    }

    setAddressFormLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session?.user) {
        showToast('Please login before saving a shipping address.', 'error');
        return;
      }

      if (newAddressForm.is_default) {
        // Reset default tags on other addresses
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('userId', authUser.id);
      }

      const payload = {
        userId: authUser.id,
        full_name: newAddressForm.full_name,
        phone: newAddressForm.phone,
        house_no: newAddressForm.house_no,
        street: newAddressForm.street,
        area: newAddressForm.area,
        city: newAddressForm.city,
        state: newAddressForm.state,
        pincode: newAddressForm.pincode,
        landmark: newAddressForm.landmark,
        address_type: newAddressForm.address_type,
        is_default: newAddressForm.is_default || addresses.length === 0
      };

      const { data, error } = await supabase
        .from('addresses')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      
      showToast('Shipping address added! 📍', 'success');
      setShowAddAddressModal(false);
      
      await fetchAddresses();
      if (data) {
        setSelectedAddressId(data.id);
      }
    } catch (err) {
      console.error('Error saving address in checkout:', err);
      showToast('Failed to save address.', 'error');
    } finally {
      setAddressFormLoading(false);
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

                {/* Delivery Address Selector */}
                <div style={{ marginBottom: '20px' }}>
                  <div className="flex-between" style={{ marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.8125rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                      Deliver To Shipping Address
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setNewAddressForm({
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
                          is_default: addresses.length === 0
                        });
                        setShowAddAddressModal(true);
                      }}
                      style={{
                        background: 'none', border: 'none', color: 'var(--primary)',
                        fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer',
                        padding: 0, display: 'flex', alignItems: 'center', gap: '3px'
                      }}
                    >
                      <Plus size={12} /> Add New
                    </button>
                  </div>

                  {addressesLoading ? (
                    <div style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      Loading saved destinations...
                    </div>
                  ) : addresses.length === 0 ? (
                    <div style={{
                      padding: '16px', border: '1.5px dashed var(--border)', borderRadius: 'var(--radius-sm)',
                      textAlign: 'center', backgroundColor: 'var(--surface-secondary)'
                    }}>
                      <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>📍</div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 10px' }}>
                        No shipping addresses saved yet.
                      </p>
                      <button
                        type="button"
                        className="btn btn-primary btn-small"
                        onClick={() => {
                          setNewAddressForm({
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
                            is_default: true
                          });
                          setShowAddAddressModal(true);
                        }}
                        style={{ fontSize: '0.75rem', fontWeight: '700', padding: '6px 12px' }}
                      >
                        Add Shipping Address
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
                      {addresses.map((addr) => (
                        <label
                          key={addr.id}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px',
                            padding: '10px 12px',
                            border: selectedAddressId === addr.id ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            background: selectedAddressId === addr.id ? 'var(--primary-tint)' : 'var(--surface)',
                            transition: 'var(--transition-fast)',
                          }}
                        >
                          <input
                            type="radio"
                            name="checkout_address"
                            value={addr.id}
                            checked={selectedAddressId === addr.id}
                            onChange={() => setSelectedAddressId(addr.id)}
                            style={{ marginTop: '3px', accentColor: 'var(--primary)' }}
                          />
                          <div style={{ fontSize: '0.8125rem' }}>
                            <div style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
                              <span>{addr.full_name}</span>
                              <span style={{ 
                                fontSize: '0.625rem', 
                                fontWeight: '800', 
                                background: 'var(--primary-tint)', 
                                color: 'var(--primary-dark)', 
                                padding: '1px 5px', 
                                borderRadius: '2px',
                                display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '2px'
                              }}>
                                {addr.address_type === 'Work' ? <Briefcase size={9} /> : <Home size={9} />}
                                {addr.address_type}
                              </span>
                              {addr.is_default && <span style={{ color: 'var(--gold-dark)', fontSize: '0.625rem', fontWeight: '800' }}>★ Default</span>}
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px', fontWeight: '500' }}>
                              Phone: {addr.phone}
                            </div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '3px', lineHeight: '1.4' }}>
                              {addr.house_no ? `${addr.house_no}, ` : ''}{addr.street}, {addr.area ? `${addr.area}, ` : ''}{addr.city}, {addr.state} - {addr.pincode}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
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

        <style>{`
          @media (min-width: 769px) {
            .cart-layout {
              grid-template-columns: 1fr 380px !important;
            }
          }
        `}</style>

        {/* INLINE ADDRESS MODAL */}
        {showAddAddressModal && (
      <div style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px', zIndex: 1000,
        animation: 'fadeIn 0.2s ease'
      }}>
        <div className="card" style={{ 
          maxWidth: '480px', width: '100%', 
          maxHeight: '90vh', overflowY: 'auto',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' 
        }}>
          <div className="flex-between" style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
            <h3 style={{ margin: 0, fontSize: '1.125rem', color: 'var(--primary-dark)', fontWeight: '800' }}>
              Add Shipping Destination
            </h3>
            <button 
              onClick={() => setShowAddAddressModal(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', display: 'flex' }}
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
                    value={newAddressForm.full_name}
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
                    value={newAddressForm.phone}
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
                    value={newAddressForm.house_no}
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
                    value={newAddressForm.street}
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
                  value={newAddressForm.area}
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
                    value={newAddressForm.city}
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
                    value={newAddressForm.state}
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
                    value={newAddressForm.pincode}
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
                    value="India"
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
                  value={newAddressForm.landmark}
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
                    value={newAddressForm.address_type}
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
                    checked={newAddressForm.is_default}
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
                onClick={() => setShowAddAddressModal(false)}
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
                {addressFormLoading ? 'Saving...' : 'Add Address'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
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

export default CartPage;
