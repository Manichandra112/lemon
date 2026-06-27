import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import { Search, ShoppingCart, Filter, ChevronRight } from 'lucide-react';

const CustomerDashboard = () => {
  const { authUser } = useAuth();
  const { products } = useData();
  const { getTotalItems, getTotalPrice } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product => {
    const matchesFilter = filterType === 'all' || product.type === filterType;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'All', emoji: '🍋' },
    { id: 'small', label: 'Small Pack', emoji: '🟡' },
    { id: 'medium', label: 'Medium Pack', emoji: '🟠' },
    { id: 'large', label: 'Large Pack', emoji: '🔴' },
    { id: 'heavy-large', label: 'Heavy Large Pack', emoji: '🟣' },
  ];

  return (
    <div style={{ background: 'var(--surface-secondary)', minHeight: '100vh' }}>
      {/* Green header strip */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
        padding: '24px 0 28px',
      }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ color: '#fff', fontSize: '1.375rem', fontWeight: '800', marginBottom: '4px' }}>
                Fresh Lemons 🍋
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8125rem', margin: 0, fontWeight: '500' }}>
                Handpicked organic lemons from our farms
              </p>
            </div>
            {getTotalItems() > 0 && (
              <Link to="/cart" style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'var(--gold)', color: 'var(--primary-darker)',
                padding: '10px 18px', borderRadius: 'var(--radius-sm)',
                fontWeight: '800', fontSize: '0.8125rem',
                boxShadow: '0 4px 12px rgba(212, 160, 23, 0.4)',
                textDecoration: 'none',
              }}>
                <ShoppingCart size={16} />
                {getTotalItems()} items • ₹{getTotalPrice()}
                <ChevronRight size={14} />
              </Link>
            )}
          </div>

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{
              position: 'absolute', left: '14px', top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-light)',
              pointerEvents: 'none',
            }} />
            <input
              type="text"
              placeholder="Search lemons by name, type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px 12px 40px',
                border: 'none', borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem', background: 'rgba(255,255,255,0.95)',
                color: 'var(--text-primary)', outline: 'none',
                fontFamily: 'inherit', boxShadow: 'var(--shadow-md)',
              }}
            />
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '20px', paddingBottom: '40px' }}>
        {/* Category Chips */}
        <div style={{
          display: 'flex', gap: '8px', marginBottom: '20px',
          overflowX: 'auto', paddingBottom: '4px',
          scrollbarWidth: 'none', msOverflowStyle: 'none',
        }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilterType(cat.id)}
              className={`chip ${filterType === cat.id ? 'chip-active' : ''}`}
              style={filterType === cat.id ? {
                background: 'var(--primary)',
                color: '#fff',
                borderColor: 'var(--primary)',
                boxShadow: '0 2px 8px rgba(10, 104, 71, 0.3)',
              } : {}}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Offer Banner */}
        <div style={{
          background: 'linear-gradient(135deg, var(--gold-tint) 0%, #FFF3D0 100%)',
          border: '1.5px solid var(--gold)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 18px',
          marginBottom: '24px',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: 'var(--radius-sm)',
            background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '1.125rem', flexShrink: 0,
          }}>
            %
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: '800', color: 'var(--gold-dark)' }}>
              🎉 Special Offer — Buy 3 packs, get 20% off!
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Auto-applied at checkout. Limited time only.
            </div>
          </div>
        </div>

        {/* Results count */}
        <div style={{ marginBottom: '16px' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-muted)' }}>
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onReadMore={setSelectedProduct}
              />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center', padding: '48px 16px',
            background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔍</div>
            <h3 style={{ marginBottom: '6px', fontWeight: '700' }}>No products found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Try a different search or filter
            </p>
            <button
              onClick={() => { setSearchTerm(''); setFilterType('all'); }}
              className="btn btn-outline"
              style={{ marginTop: '16px', fontWeight: '700' }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Floating Cart Bar */}
      {getTotalItems() > 0 && (
        <div className="mobile-only" style={{
          position: 'fixed', bottom: '16px', left: '16px', right: '16px',
          zIndex: 999, display: 'flex',
        }}>
          <Link to="/cart" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', padding: '14px 20px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
            borderRadius: 'var(--radius-md)', color: '#fff',
            fontWeight: '700', fontSize: '0.875rem',
            boxShadow: '0 8px 30px rgba(10, 104, 71, 0.4)',
            textDecoration: 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingCart size={18} />
              <span>{getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: 'var(--gold)' }}>₹{getTotalPrice()}</span>
              <ChevronRight size={16} />
            </div>
          </Link>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      <style>{`
        @media (min-width: 769px) {
          .mobile-only { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default CustomerDashboard;
