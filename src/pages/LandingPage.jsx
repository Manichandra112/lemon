import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowRight, Zap, Leaf, Truck, Star, ShieldCheck, Clock, Package, ChevronRight, ShoppingCart, MapPin, Percent, Gift } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const LandingPage = () => {
  const { products, getUserOrders } = useData();
  const { isAuthenticated, authUser } = useAuth();
  const { getTotalItems, getTotalPrice } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const userOrders = isAuthenticated ? getUserOrders(authUser.id) : [];
  const latestOrder = userOrders.length > 0 ? userOrders[userOrders.length - 1] : null;

  // Redirection for Admin
  if (isAuthenticated && authUser.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  // ========== AUTHENTICATED MEMBER VIEW ==========
  if (isAuthenticated && authUser.role === 'customer') {
    return (
      <div style={{ background: 'var(--surface-secondary)', minHeight: '100vh' }}>
        {/* Member Welcome Strip */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
          padding: '20px 0',
          color: '#fff',
        }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: '800', marginBottom: '4px' }}>
                  Hi, {authUser.name?.split(' ')[0]} 👋
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8125rem', margin: 0, fontWeight: '500' }}>
                  Fresh organic lemons, delivered to your door
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link to="/dashboard" className="btn" style={{
                  background: 'rgba(255,255,255,0.15)', color: '#fff',
                  backdropFilter: 'blur(10px)', fontWeight: '700', fontSize: '0.8125rem',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}>
                  <Zap size={15} /> Shop Now
                </Link>
                {getTotalItems() > 0 && (
                  <Link to="/cart" className="btn" style={{
                    background: 'var(--gold)', color: 'var(--primary-darker)',
                    fontWeight: '800', fontSize: '0.8125rem',
                  }}>
                    <ShoppingCart size={15} /> {getTotalItems()} items • ₹{getTotalPrice()}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container" style={{ paddingTop: '20px', paddingBottom: '40px' }}>



          {/* Order Tracking Card */}
          {latestOrder && (
            <div style={{
              background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)', padding: '20px',
              marginBottom: '28px', boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                    Latest Order
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                    Order #{latestOrder.id}
                  </div>
                </div>
                <span className={`badge badge-${latestOrder.status === 'delivered' ? 'success' : latestOrder.status === 'processing' ? 'info' : 'warning'}`}>
                  {latestOrder.status}
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '16px' }}>
                {['Placed', 'Processing', 'Delivered'].map((step, i) => {
                  const stages = { pending: 0, processing: 1, delivered: 2 };
                  const current = stages[latestOrder.status] || 0;
                  const isActive = i <= current;
                  return (
                    <React.Fragment key={step}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 0, zIndex: 2 }}>
                        <div style={{
                          width: '24px', height: '24px', borderRadius: '50%',
                          background: isActive ? 'var(--primary)' : 'var(--border)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: isActive ? '#fff' : 'var(--text-light)',
                          fontSize: '0.625rem', fontWeight: '800',
                          transition: 'var(--transition)',
                        }}>
                          {isActive ? '✓' : i + 1}
                        </div>
                        <span style={{
                          fontSize: '0.625rem', fontWeight: '600', marginTop: '4px',
                          color: isActive ? 'var(--primary)' : 'var(--text-light)',
                          whiteSpace: 'nowrap',
                        }}>
                          {step}
                        </span>
                      </div>
                      {i < 2 && (
                        <div style={{
                          flex: 1, height: '3px',
                          background: i < current ? 'var(--primary)' : 'var(--border-light)',
                          margin: '0 -4px', marginBottom: '18px',
                          borderRadius: '2px', transition: 'var(--transition)',
                        }} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  Total: <strong style={{ color: 'var(--text-primary)' }}>₹{latestOrder.totalPrice}</strong>
                </span>
                <Link to="/orders" style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  View Details <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          )}

          {/* Offers banner */}
          <div className="offer-strip" style={{ marginBottom: '28px' }}>
            <div className="offer-strip-icon">
              <Percent size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--gold-dark)' }}>
                Member Exclusive — 20% off on bulk orders
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Order 3+ packs and save. Auto-applied at checkout.
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="section-header">
            <div>
              <div className="section-title">Fresh Today 🍋</div>
              <div className="section-subtitle">Handpicked organic lemons from our farms</div>
            </div>
            <Link to="/dashboard" style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              See All <ChevronRight size={14} />
            </Link>
          </div>

          <div className="product-grid">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onReadMore={setSelectedProduct}
              />
            ))}
          </div>
        </div>

        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </div>
    );
  }

  // ========== GUEST / PUBLIC VIEW ==========
  return (
    <div style={{ background: 'var(--surface-secondary)' }}>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, var(--primary-darker) 0%, var(--primary-dark) 50%, var(--primary) 100%)',
        minHeight: '480px',
      }}>
        {/* Background image overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/hero_banner.png)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.2,
        }} />

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(3,42,26,0.8) 0%, rgba(6,78,50,0.6) 100%)',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: '60px', paddingBottom: '60px' }}>
          <div style={{ maxWidth: '600px' }}>
            {/* Trust badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
              padding: '6px 14px', borderRadius: 'var(--radius-full)',
              marginBottom: '20px', border: '1px solid rgba(255,255,255,0.15)',
            }}>
              <Star size={12} fill="var(--gold)" color="var(--gold)" />
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--gold)' }}>
                Rated 4.9/5 by 10,000+ customers
              </span>
            </div>

            <h1 style={{
              color: '#fff', fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: '800', lineHeight: 1.1, marginBottom: '16px',
              letterSpacing: '-0.02em',
            }}>
              Farm-Fresh <span style={{ color: 'var(--gold)' }}>Organic Lemons</span> Delivered to Your Door
            </h1>

            <p style={{
              color: 'rgba(255,255,255,0.8)', fontSize: '1.0625rem',
              marginBottom: '28px', lineHeight: 1.6, maxWidth: '480px',
              fontWeight: '400',
            }}>
              Handpicked from premium organic orchards. Get the freshest lemons with free delivery on your first order.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
              <Link to="/signup" className="btn btn-xl" style={{
                background: 'var(--gold)', color: 'var(--primary-darker)',
                fontWeight: '800',
              }}>
                Start Shopping <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-xl" style={{
                background: 'rgba(255,255,255,0.1)', color: '#fff',
                border: '1.5px solid rgba(255,255,255,0.3)',
                backdropFilter: 'blur(10px)', fontWeight: '700',
              }}>
                Login
              </Link>
            </div>

            {/* Trust points */}
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              {[
                { icon: <Leaf size={14} />, text: '100% Organic' },
                { icon: <Truck size={14} />, text: 'Free Delivery' },
                { icon: <Clock size={14} />, text: '24hr Fresh' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  color: 'rgba(255,255,255,0.7)', fontSize: '0.8125rem', fontWeight: '600',
                }}>
                  <div style={{ color: 'var(--gold)' }}>{item.icon}</div>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* USP Strip */}
      <section style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border-light)',
        padding: '16px 0',
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}>
            {[
              { icon: '🚚', title: 'Free Delivery', sub: 'On orders over ₹199' },
              { icon: '🍋', title: 'Farm Fresh', sub: 'Directly from orchards' },
              { icon: '🌿', title: '100% Organic', sub: 'No chemicals used' },
              { icon: '⚡', title: 'Quick Delivery', sub: 'Within 24 hours' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '8px 0',
              }}>
                <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-primary)' }}>{item.title}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section style={{ padding: '32px 0' }}>
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-title">Shop by Category</div>
              <div className="section-subtitle">Find the perfect lemons for your needs</div>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px',
          }}>
            {products.map((product, i) => (
              <div
                key={product.id}
                className="category-card"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="category-card-icon" style={{ width: '72px', height: '72px' }}>
                  {(product.image?.startsWith('/') || product.image?.startsWith('data:image/') || product.image?.startsWith('http://') || product.image?.startsWith('https://')) ? (
                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                  ) : (
                    <span style={{ fontSize: '2rem' }}>{product.image}</span>
                  )}
                </div>
                <div className="category-card-label">{product.name}</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  {product.weight}
                </div>
                <div style={{ fontSize: '0.8125rem', fontWeight: '800', color: 'var(--primary)' }}>
                  ₹{product.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: '0 0 32px' }}>
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-title">Best Sellers 🔥</div>
              <div className="section-subtitle">Our most popular organic lemon packs</div>
            </div>
          </div>

          <div className="product-grid">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onReadMore={setSelectedProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '40px 0', background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px' }}>
              How LemonMart Works
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>
              Get fresh organic lemons delivered in 3 simple steps
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
          }}>
            {[
              { step: '1', icon: '🛒', title: 'Browse & Add', desc: 'Choose from our curated selection of organic lemons' },
              { step: '2', icon: '📱', title: 'Place Order', desc: 'Quick checkout with secure payment' },
              { step: '3', icon: '🚚', title: 'Get Delivered', desc: 'Fresh lemons at your doorstep within 24 hours' },
            ].map((item, i) => (
              <div key={i} style={{
                textAlign: 'center', padding: '24px 16px',
                background: 'var(--surface-secondary)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: 'var(--primary)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: '800',
                }}>
                  {item.step}
                </div>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px', marginTop: '4px' }}>{item.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '6px' }}>{item.title}</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '40px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px' }}>
              What Our Customers Say
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
          }}>
            {[
              { name: 'Priya K.', text: 'The freshest lemons I\'ve ever ordered online. Amazing quality!', rating: 5, city: 'Mumbai' },
              { name: 'Rahul M.', text: 'Fast delivery and the lemons were perfectly fresh. Will order again!', rating: 5, city: 'Delhi' },
              { name: 'Sneha P.', text: 'Love the organic quality. My go-to for fresh lemons now.', rating: 5, city: 'Bangalore' },
            ].map((review, i) => (
              <div key={i} style={{
                padding: '20px', background: 'var(--surface)',
                borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{ display: 'flex', gap: '2px', marginBottom: '12px' }}>
                  {[...Array(review.rating)].map((_, j) => (
                    <Star key={j} size={14} fill="var(--gold)" color="var(--gold)" />
                  ))}
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '12px', fontStyle: 'italic', lineHeight: 1.6 }}>
                  "{review.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: 'var(--primary-tint)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)',
                  }}>
                    {review.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: '700' }}>{review.name}</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{review.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
        padding: '48px 0',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#fff', fontSize: '1.75rem', fontWeight: '800', marginBottom: '12px' }}>
            Ready to Order Fresh Lemons?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: '24px', fontSize: '1rem', maxWidth: '400px', margin: '0 auto 24px' }}>
            Join 10,000+ happy customers. Get free delivery on your first order.
          </p>
          <Link to="/signup" className="btn btn-xl" style={{
            background: 'var(--gold)', color: 'var(--primary-darker)',
            fontWeight: '800',
          }}>
            Create Free Account <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default LandingPage;
