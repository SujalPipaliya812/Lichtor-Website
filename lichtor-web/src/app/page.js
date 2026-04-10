import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <span className="badge hero-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L4 12h6v10h4V12h6L12 2z" />
                </svg>
                Made in India
              </span>
              <h1 className="heading-1 hero-title">
                Illuminate Your World with <span className="highlight">LICHTOR</span>
              </h1>
              <p className="hero-description">
                India&apos;s trusted manufacturer of high-performance LED lighting solutions.
                From homes to industries, we deliver brilliance that lasts with superior
                energy efficiency and uncompromising quality.
              </p>
              <div className="hero-actions">
                <Link href="/categories" className="btn btn-primary btn-lg">
                  Explore Products
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link href="/about" className="btn btn-secondary btn-lg">Learn More</Link>
              </div>
              <div className="hero-stats">
                <div className="hero-stat">
                  <span className="hero-stat-value">15+</span>
                  <span className="hero-stat-label">Years Experience</span>
                </div>
                <div className="hero-stat">
                  <span className="hero-stat-value">500+</span>
                  <span className="hero-stat-label">Products</span>
                </div>
                <div className="hero-stat">
                  <span className="hero-stat-value">50K+</span>
                  <span className="hero-stat-label">Happy Customers</span>
                </div>
              </div>
            </div>
            <div className="hero-image">
              <div className="hero-image-wrapper">
                <div className="hero-glow"></div>
                <div className="hero-image-main">
                  <img src="https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=600&h=600&fit=crop" alt="LICHTOR Premium LED Panel Light" />
                </div>
                <div className="floating-card floating-card-1">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #10B981, #059669)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2L4 12h6v10h4V12h6L12 2z" /></svg>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>Energy Saving</div>
                      <div style={{ color: '#6B7280', fontSize: '12px' }}>Up to 80% less power</div>
                    </div>
                  </div>
                </div>
                <div className="floating-card floating-card-2">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #0066CC, #0099FF)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>BIS Certified</div>
                      <div style={{ color: '#6B7280', fontSize: '12px' }}>Quality Assured</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="badge">Our Products</span>
            <h2 className="heading-2">Explore Our Categories</h2>
            <p className="subheading">Discover our comprehensive range of LED lighting solutions designed for every application and space.</p>
          </div>
          <div className="categories-grid" style={{ gridTemplateColumns: 'repeat(min(5, auto-fit), minmax(200px, 1fr))', justifyContent: 'center' }}>
            <Link href="/categories#indoor" className="category-card">
              <div className="category-card-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
              </div>
              <h3 className="category-card-title">Indoor</h3>
              <p className="category-card-count">Home & Residential</p>
            </Link>
            
            <Link href="/categories#outdoor" className="category-card">
              <div className="category-card-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2v4M6.34 6.34l2.83 2.83M2 12h4M6.34 17.66l2.83-2.83M12 18v4M17.66 17.66l-2.83-2.83M22 12h-4M17.66 6.34l-2.83 2.83" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
              </div>
              <h3 className="category-card-title">Outdoor</h3>
              <p className="category-card-count">Street & Flood Lights</p>
            </Link>

            <Link href="/categories#commercial" className="category-card">
              <div className="category-card-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z" />
                </svg>
              </div>
              <h3 className="category-card-title">Commercial</h3>
              <p className="category-card-count">Office & Retail</p>
            </Link>

            <Link href="/categories#industrial" className="category-card">
              <div className="category-card-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                  <path d="M9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                </svg>
              </div>
              <h3 className="category-card-title">Industrial</h3>
              <p className="category-card-count">Factory & Warehouse</p>
            </Link>
            
            <Link href="/categories#accessories" className="category-card">
              <div className="category-card-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.8 6.47c-2.31-2.93-6.6-3.41-9.52-1.1L5.94 8.04 15.96 18.06l2.67-3.34c2.31-2.93 1.83-7.22-1.1-9.52l1.27-1.27z"/>
                </svg>
              </div>
              <h3 className="category-card-title">Accessories</h3>
              <p className="category-card-count">Drivers & Connectors</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section" style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div className="section-header">
            <span className="badge">Bestsellers</span>
            <h2 className="heading-2">Featured Products</h2>
            <p className="subheading">Our most popular LED lighting solutions trusted by thousands of customers across India.</p>
          </div>
          <div className="products-grid">
            <div className="product-card">
              <div className="product-card-image">
                <span className="product-card-badge">New</span>
                <img src="/assets/products/page_3.jpeg" alt="LICHTOR Ultra Slim Panel Light" />
              </div>
              <div className="product-card-content">
                <span className="product-card-category">Panel Lights</span>
                <h3 className="product-card-title">Ultra Slim Panel Light 18W</h3>
                <div className="product-card-specs">
                  <span className="product-card-spec"><svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>18W</span>
                  <span className="product-card-spec"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>1800 Lm</span>
                </div>
                <div className="product-card-action">
                  <Link href="/products/ultra-slim-panel" className="product-card-link">View Details<svg viewBox="0 0 24 24"><path d="M5 12h14m-7-7l7 7-7 7" /></svg></Link>
                </div>
              </div>
            </div>
            <div className="product-card">
              <div className="product-card-image">
                <img src="/assets/products/page_20.jpeg" alt="LICHTOR COB Downlighter" />
              </div>
              <div className="product-card-content">
                <span className="product-card-category">Downlighters</span>
                <h3 className="product-card-title">COB Downlighter 15W</h3>
                <div className="product-card-specs">
                  <span className="product-card-spec"><svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>15W</span>
                  <span className="product-card-spec"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>1500 Lm</span>
                </div>
                <div className="product-card-action">
                  <Link href="/products/cob-downlighter" className="product-card-link">View Details<svg viewBox="0 0 24 24"><path d="M5 12h14m-7-7l7 7-7 7" /></svg></Link>
                </div>
              </div>
            </div>
            <div className="product-card">
              <div className="product-card-image">
                <span className="product-card-badge">Popular</span>
                <img src="/assets/products/page_12.jpeg" alt="LICHTOR LED Batten" />
              </div>
              <div className="product-card-content">
                <span className="product-card-category">Tube Lights</span>
                <h3 className="product-card-title">LED Batten T5 22W</h3>
                <div className="product-card-specs">
                  <span className="product-card-spec"><svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>22W</span>
                  <span className="product-card-spec"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>2200 Lm</span>
                </div>
                <div className="product-card-action">
                  <Link href="/products/led-batten-t5" className="product-card-link">View Details<svg viewBox="0 0 24 24"><path d="M5 12h14m-7-7l7 7-7 7" /></svg></Link>
                </div>
              </div>
            </div>
            <div className="product-card">
              <div className="product-card-image">
                <img src="/assets/products/page_23.jpeg" alt="LICHTOR Street Light" />
              </div>
              <div className="product-card-content">
                <span className="product-card-category">Street Lights</span>
                <h3 className="product-card-title">Street Light 100W</h3>
                <div className="product-card-specs">
                  <span className="product-card-spec"><svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>100W</span>
                  <span className="product-card-spec"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>12000 Lm</span>
                </div>
                <div className="product-card-action">
                  <Link href="/products/street-light-100w" className="product-card-link">View Details<svg viewBox="0 0 24 24"><path d="M5 12h14m-7-7l7 7-7 7" /></svg></Link>
                </div>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
            <Link href="/categories" className="btn btn-secondary btn-lg">
              View All Products
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose LICHTOR Section */}
      <section className="section features">
        <div className="container">
          <div className="section-header">
            <span className="badge">Why LICHTOR</span>
            <h2 className="heading-2">The LICHTOR Advantage</h2>
            <p className="subheading">What sets us apart as India&apos;s preferred LED lighting manufacturer.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg></div>
              <h3 className="feature-title">Energy Efficient</h3>
              <p className="feature-description">Save up to 80% on electricity bills with our high-efficiency LED solutions that deliver maximum brightness with minimum power consumption.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg></div>
              <h3 className="feature-title">BIS Certified</h3>
              <p className="feature-description">All our products meet Bureau of Indian Standards specifications, ensuring safety, quality, and reliability you can trust.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></svg></div>
              <h3 className="feature-title">Long Lifespan</h3>
              <p className="feature-description">Our LED lights are designed to last 50,000+ hours, providing years of reliable illumination with minimal maintenance.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" /><path fill="white" d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z" /></svg></div>
              <h3 className="feature-title">2-Year Warranty</h3>
              <p className="feature-description">We stand behind our products with comprehensive warranty coverage and dedicated after-sales support across India.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="badge">Applications</span>
            <h2 className="heading-2">Lighting for Every Space</h2>
            <p className="subheading">From cozy homes to massive industrial facilities, LICHTOR has the perfect lighting solution.</p>
          </div>
          <div className="applications-grid">
            <div className="application-card">
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=450&fit=crop" alt="Residential Lighting" />
              <div className="application-overlay">
                <h3 className="application-title">Residential</h3>
                <p className="application-description">Create warm, inviting spaces in homes and apartments</p>
              </div>
            </div>
            <div className="application-card">
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=450&fit=crop" alt="Commercial Lighting" />
              <div className="application-overlay">
                <h3 className="application-title">Commercial</h3>
                <p className="application-description">Professional lighting for offices, retail, and hospitality</p>
              </div>
            </div>
            <div className="application-card">
              <img src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=450&fit=crop" alt="Industrial Lighting" />
              <div className="application-overlay">
                <h3 className="application-title">Industrial</h3>
                <p className="application-description">High-performance solutions for factories and warehouses</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">15<span>+</span></div>
              <div className="stat-label">Years of Excellence</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">500<span>+</span></div>
              <div className="stat-label">Product Range</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">1000<span>+</span></div>
              <div className="stat-label">Dealer Network</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">28<span>+</span></div>
              <div className="stat-label">States Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Light Up Your Project?</h2>
            <p className="cta-description">Connect with our team to find the perfect LED lighting solutions for your needs. We offer dealer partnerships, bulk orders, and project consultations.</p>
            <div className="cta-actions">
              <Link href="/customer-care" className="btn btn-white btn-lg">
                Contact Sales
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <a href="/catalogue.pdf" download="LICHTOR-Product-Catalogue.pdf" className="btn btn-outline-white btn-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                Download Full Catalogue
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
