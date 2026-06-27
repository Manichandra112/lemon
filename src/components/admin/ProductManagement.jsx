import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Edit2, Trash2, Plus, X, Image, Info } from 'lucide-react';

const presetImages = [
  { label: 'Woven Basket (Small Pack)', value: '/small_lemons.png' },
  { label: 'Kraft Box (Medium Pack)', value: '/medium_lemons.png' },
  { label: 'Wooden Crate (Large Pack)', value: '/large_lemons.png' },
  { label: 'Premium Barrel (Heavy Large Pack)', value: '/heavy_large_lemons.svg' }
];

const ProductManagement = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useData();
  const { showToast, showConfirm } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageType, setImageType] = useState('preset');
  const [formData, setFormData] = useState({
    name: '',
    type: 'small',
    weight: '',
    price: '',
    quantity: '',
    lemonCount: '',
    description: '',
    image: '/small_lemons.png',
    vitaminC: '53mg per 100g',
    fiber: '2.8g',
    calories: '29 per 100g'
  });

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Image size should be less than 2MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.weight) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    const productPayload = {
      name: formData.name,
      type: formData.type,
      weight: formData.weight,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity || '0'),
      lemonCount: formData.lemonCount,
      description: formData.description,
      image: formData.image,
      nutritionInfo: {
        vitaminC: formData.vitaminC,
        fiber: formData.fiber,
        calories: formData.calories
      }
    };

    if (editingId) {
      updateProduct(editingId, productPayload);
      showToast('Citrus product updated successfully!', 'success');
    } else {
      addProduct(productPayload);
      showToast('New citrus product added successfully!', 'success');
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'small',
      weight: '',
      price: '',
      quantity: '',
      lemonCount: '',
      description: '',
      image: '/small_lemons.png',
      vitaminC: '53mg per 100g',
      fiber: '2.8g',
      calories: '29 per 100g'
    });
    setShowForm(false);
    setEditingId(null);
    setImageType('preset');
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name || '',
      type: product.type || 'small',
      weight: product.weight || '',
      price: product.price || '',
      quantity: product.quantity || '',
      lemonCount: product.lemonCount || '',
      description: product.description || '',
      image: product.image || '/small_lemons.png',
      vitaminC: product.nutritionInfo?.vitaminC || '53mg per 100g',
      fiber: product.nutritionInfo?.fiber || '2.8g',
      calories: product.nutritionInfo?.calories || '29 per 100g'
    });
    setEditingId(product.id);
    setShowForm(true);

    const img = product.image || '/small_lemons.png';
    if (presetImages.some(p => p.value === img)) {
      setImageType('preset');
    } else if (img.startsWith('data:image/')) {
      setImageType('upload');
    } else {
      setImageType('custom');
    }
  };

  const handleDelete = (id) => {
    showConfirm('Are you sure you want to remove this product from the citrus portfolio?', () => {
      deleteProduct(id);
      showToast('Product deleted successfully!', 'success');
    });
  };

  // presetImages array is now defined globally at the top of the file

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div className="flex-between" style={{ marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-darker)', margin: 0 }}>
            Citrus Portfolio
          </h2>
          <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            Manage inventory and pricing of lemon packs
          </p>
        </div>
        
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="btn btn-primary"
          style={{ gap: '6px', fontWeight: '700', borderRadius: 'var(--radius-sm)' }}
        >
          <Plus size={18} /> Add New Pack
        </button>
      </div>

      {/* Form Card */}
      {showForm && (
        <div className="card" style={{ 
          marginBottom: '28px', 
          backgroundColor: 'var(--surface)', 
          border: '1px solid var(--primary-light)',
          animation: 'slideDown 0.3s ease'
        }}>
          <div className="flex-between" style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
            <h3 style={{ margin: '0', fontSize: '1.125rem', color: 'var(--primary-dark)', fontWeight: '800' }}>
              {editingId ? 'Edit Reserve Product' : 'Add New Portfolio Product'}
            </h3>
            <button
              onClick={resetForm}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', display: 'flex' }}
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  className="form-input"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Small Lemons Pack"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category / Type *</label>
                <select
                  className="form-select"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="small">Small Pack</option>
                  <option value="medium">Medium Pack</option>
                  <option value="large">Large Pack</option>
                  <option value="heavy-large">Heavy Large Pack</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Weight *</label>
                <input
                  type="text"
                  className="form-input"
                  name="weight"
                  placeholder="e.g., 500g"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Price (₹) *</label>
                <input
                  type="number"
                  className="form-input"
                  name="price"
                  placeholder="e.g., 50"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Stock Quantity</label>
                <input
                  type="number"
                  className="form-input"
                  name="quantity"
                  placeholder="e.g., 20"
                  value={formData.quantity}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Lemon Count Description</label>
                <input
                  type="text"
                  className="form-input"
                  name="lemonCount"
                  placeholder="e.g., 15-20 lemons"
                  value={formData.lemonCount}
                  onChange={handleChange}
                />
              </div>

              {/* Image selection */}
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Product Image Option</label>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <label 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      fontSize: '0.8125rem',
                      background: imageType === 'preset' ? 'var(--primary-tint)' : 'var(--surface-secondary)',
                      border: imageType === 'preset' ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    <input 
                      type="radio" 
                      name="imageType" 
                      value="preset"
                      checked={imageType === 'preset'}
                      onChange={() => {
                        setImageType('preset');
                        setFormData(prev => ({ ...prev, image: '/small_lemons.png' }));
                      }}
                      style={{ display: 'none' }}
                    />
                    <span>Preset Images</span>
                  </label>

                  <label 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      fontSize: '0.8125rem',
                      background: imageType === 'upload' ? 'var(--primary-tint)' : 'var(--surface-secondary)',
                      border: imageType === 'upload' ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    <input 
                      type="radio" 
                      name="imageType" 
                      value="upload"
                      checked={imageType === 'upload'}
                      onChange={() => {
                        setImageType('upload');
                        setFormData(prev => ({ ...prev, image: '' }));
                      }}
                      style={{ display: 'none' }}
                    />
                    <span>Upload from Device</span>
                  </label>

                  <label 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      fontSize: '0.8125rem',
                      background: imageType === 'custom' ? 'var(--primary-tint)' : 'var(--surface-secondary)',
                      border: imageType === 'custom' ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    <input 
                      type="radio" 
                      name="imageType" 
                      value="custom"
                      checked={imageType === 'custom'}
                      onChange={() => {
                        setImageType('custom');
                        setFormData(prev => ({ ...prev, image: '' }));
                      }}
                      style={{ display: 'none' }}
                    />
                    <span>Custom URL / Link</span>
                  </label>
                </div>

                {imageType === 'preset' && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px', marginBottom: '8px' }}>
                    {presetImages.map((img) => (
                      <button
                        key={img.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image: img.value }))}
                        style={{
                          border: formData.image === img.value ? '2px solid var(--primary)' : '1px solid var(--border)',
                          borderRadius: 'var(--radius-sm)',
                          background: 'none',
                          padding: '6px 10px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          color: formData.image === img.value ? 'var(--primary-dark)' : 'var(--text-secondary)'
                        }}
                      >
                        {img.label}
                      </button>
                    ))}
                  </div>
                )}

                {imageType === 'upload' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="form-input"
                      style={{ padding: '6px' }}
                    />
                    {formData.image && formData.image.startsWith('data:image/') && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                          <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: '700' }}>✓ Image loaded from device</span>
                      </div>
                    )}
                  </div>
                )}

                {imageType === 'custom' && (
                  <div style={{ marginTop: '8px' }}>
                    <input
                      type="text"
                      className="form-input"
                      name="image"
                      placeholder="Enter image URL (e.g., https://example.com/lemon.jpg)"
                      value={formData.image}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </div>

              {/* Nutrition info header */}
              <div style={{ gridColumn: '1 / -1', margin: '8px 0 -8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Info size={16} color="var(--primary)" />
                <strong style={{ fontSize: '0.8125rem', color: 'var(--primary-dark)' }}>Nutritional Information Facts</strong>
              </div>

              <div className="form-group">
                <label className="form-label">Vitamin C Content</label>
                <input
                  type="text"
                  className="form-input"
                  name="vitaminC"
                  value={formData.vitaminC}
                  onChange={handleChange}
                  placeholder="e.g., 53mg per 100g"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Dietary Fiber</label>
                <input
                  type="text"
                  className="form-input"
                  name="fiber"
                  value={formData.fiber}
                  onChange={handleChange}
                  placeholder="e.g., 2.8g"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Calories</label>
                <input
                  type="text"
                  className="form-input"
                  name="calories"
                  value={formData.calories}
                  onChange={handleChange}
                  placeholder="e.g., 29 per 100g"
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Pack Description</label>
                <textarea
                  className="form-textarea"
                  name="description"
                  rows="3"
                  value={formData.description}
                  placeholder="Enter details about freshness, orchard origin, or culinary uses..."
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={resetForm}
                style={{ fontWeight: '700' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ fontWeight: '700' }}
              >
                {editingId ? 'Update Citrus Pack' : 'Publish Citrus Pack'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Inventory Table List */}
      <div className="card" style={{ border: '1px solid var(--border-light)', padding: 0, overflow: 'hidden' }}>
        {products.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>
            No reserve products yet. Click 'Add New Pack' to publish one.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th style={{ padding: '12px 14px' }}>Pack Preview</th>
                  <th style={{ padding: '12px 14px' }}>Name</th>
                  <th style={{ padding: '12px 14px' }}>Type/Category</th>
                  <th style={{ padding: '12px 14px' }}>Weight</th>
                  <th style={{ padding: '12px 14px' }}>Price</th>
                  <th style={{ padding: '12px 14px' }}>Stock Quantity</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    {/* Pack Preview image */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        border: '1px solid var(--border-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'var(--surface-secondary)'
                      }}>
                        {(product.image?.startsWith('/') || product.image?.startsWith('data:image/') || product.image?.startsWith('http://') || product.image?.startsWith('https://')) ? (
                          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: '1.25rem' }}>{product.image || '🍋'}</span>
                        )}
                      </div>
                    </td>
                    
                    <td style={{ fontWeight: '700', color: 'var(--primary-dark)', padding: '14px' }}>
                      {product.name}
                    </td>
                    
                    <td style={{ padding: '14px' }}>
                      <span className={`badge ${product.type === 'small' ? 'badge-success' : product.type === 'medium' ? 'badge-warning' : 'badge-gold'}`}>
                        {product.type} Pack
                      </span>
                    </td>
                    
                    <td style={{ fontWeight: '500', color: 'var(--text-secondary)', padding: '14px' }}>
                      {product.weight}
                    </td>
                    
                    <td style={{ fontWeight: '800', color: 'var(--text-primary)', padding: '14px' }}>
                      ₹{product.price}
                    </td>
                    
                    <td style={{ fontWeight: '600', color: 'var(--text-secondary)', padding: '14px' }}>
                      {product.quantity} units
                    </td>
                    
                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          onClick={() => handleEdit(product)}
                          className="btn btn-outline btn-small"
                          style={{ gap: '4px', fontWeight: '700' }}
                        >
                          <Edit2 size={13} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="btn btn-outline btn-small"
                          style={{ gap: '4px', borderColor: 'var(--danger)', color: 'var(--danger)', fontWeight: '700' }}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
