import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'About Us | LICHTOR by Dharmjivan Industries',
    description: "Learn about Dharmjivan Industries and LICHTOR - India's trusted LED lighting manufacturer with 15+ years of excellence.",
};

export default function AboutPage() {
    return (
        <>
            <Header />

            {/* Hero Banner */}
            <section style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingTop: 'var(--header-height)', lineHeight: 0 }}>
                <img
                    src="/about-hero.png"
                    alt="LICHTOR Team — About Us"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                />
            </section>
            <section style={{ background: 'var(--off-white)', padding: 'var(--space-3) 0' }}>
                <div className="container">
                    <nav className="breadcrumb" style={{ justifyContent: 'flex-start' }}>
                        <Link href="/">Home</Link>
                        <span className="breadcrumb-separator">/</span>
                        <span>About Us</span>
                    </nav>
                </div>
            </section>

            {/* Company Story */}
            <section className="section">
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)', alignItems: 'center' }}>
                        <div>
                            <span className="badge">Our Story</span>
                            <h2 className="heading-2" style={{ margin: 'var(--space-4) 0' }}>A Legacy of Light &amp; Innovation</h2>
                            <p className="subheading" style={{ marginBottom: 'var(--space-6)' }}>
                                Founded in 2009, Dharmjivan Industries began with a vision to make energy-efficient lighting
                                accessible to every Indian home and business. Today, LICHTOR stands as a symbol of trust,
                                quality, and innovation in India&apos;s LED lighting industry.
                            </p>
                            <p style={{ color: 'var(--gray)', lineHeight: 1.8, marginBottom: 'var(--space-6)' }}>
                                From our state-of-the-art manufacturing facility in Gujarat, we produce over 500+ SKUs
                                of LED lighting products that illuminate homes, offices, streets, and industries across
                                28 states of India. Our commitment to quality, backed by BIS certification and ISO 9001:2015
                                standards, has earned us the trust of 1000+ dealers nationwide.
                            </p>
                            <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
                                <div>
                                    <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', color: 'var(--primary)' }}>15+</div>
                                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--gray)' }}>Years Experience</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', color: 'var(--primary)' }}>500+</div>
                                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--gray)' }}>Products</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', color: 'var(--primary)' }}>1000+</div>
                                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--gray)' }}>Dealers</div>
                                </div>
                            </div>
                        </div>
                        <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
                            <img src="https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=600&h=500&fit=crop" alt="LICHTOR Manufacturing" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision & Mission */}
            <section className="section" style={{ background: 'var(--off-white)' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)' }}>
                        <div className="info-card">
                            <div className="info-card-icon">
                                <svg viewBox="0 0 24 24" fill="var(--primary)"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" fill="white" /><circle cx="12" cy="12" r="2" fill="var(--primary)" /></svg>
                            </div>
                            <h3>Our Vision</h3>
                            <p>To be India&apos;s most trusted LED lighting brand, empowering every space with sustainable, high-quality illumination that enhances lives and supports the nation&apos;s energy-saving goals.</p>
                        </div>
                        <div className="info-card">
                            <div className="info-card-icon">
                                <svg viewBox="0 0 24 24" fill="var(--primary)"><path d="M12 2L4 12h6v10h4V12h6L12 2z" /></svg>
                            </div>
                            <h3>Our Mission</h3>
                            <p>To deliver innovative, energy-efficient, and affordable LED lighting solutions through continuous R&amp;D, world-class manufacturing, and a customer-centric approach that creates lasting partnerships.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Manufacturing */}
            <section className="section" id="manufacturing">
                <div className="container">
                    <div className="section-header">
                        <span className="badge">Manufacturing Excellence</span>
                        <h2 className="heading-2">World-Class Production Facility</h2>
                        <p className="subheading">Our 50,000 sq. ft. facility houses advanced SMT lines and automated assembly</p>
                    </div>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon"><svg viewBox="0 0 24 24" fill="white"><rect x="3" y="3" width="18" height="18" rx="2" /></svg></div>
                            <h3 className="feature-title">50,000 Sq. Ft.</h3>
                            <p className="feature-description">State-of-the-art manufacturing facility in Gujarat with automated production lines</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon"><svg viewBox="0 0 24 24" fill="white"><path d="M9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" /></svg></div>
                            <h3 className="feature-title">1M+ Units/Month</h3>
                            <p className="feature-description">Monthly production capacity to meet pan-India demand with consistent quality</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon"><svg viewBox="0 0 24 24" fill="white"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg></div>
                            <h3 className="feature-title">ISO 9001:2015</h3>
                            <p className="feature-description">Quality management system certified for consistent manufacturing excellence</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon"><svg viewBox="0 0 24 24" fill="white"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                            <h3 className="feature-title">100% Testing</h3>
                            <p className="feature-description">Every product undergoes rigorous quality checks before dispatch</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quality & Certifications */}
            <section className="section" style={{ background: 'var(--off-white)' }} id="quality">
                <div className="container">
                    <div className="section-header">
                        <span className="badge">Quality Assurance</span>
                        <h2 className="heading-2">Certifications &amp; Standards</h2>
                        <p className="subheading">Meeting the highest national and international quality standards</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-6)' }}>
                        {[
                            { label: 'BIS', title: 'Bureau of Indian Standards', desc: 'IS 16102 Certified' },
                            { label: 'ISO', title: 'Quality Management', desc: 'ISO 9001:2015' },
                            { label: 'CE', title: 'European Conformity', desc: 'Export Quality' },
                            { label: 'RoHS', title: 'Environment Safety', desc: 'Lead-Free Products' },
                        ].map(c => (
                            <div key={c.label} className="info-card" style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-bold)', color: 'var(--primary)', marginBottom: 'var(--space-3)' }}>{c.label}</div>
                                <h4 style={{ marginBottom: 'var(--space-2)' }}>{c.title}</h4>
                                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray)' }}>{c.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <span className="badge">Our Journey</span>
                        <h2 className="heading-2">Milestones</h2>
                    </div>
                    <div className="timeline" style={{ maxWidth: '700px', margin: '0 auto' }}>
                        {[
                            { year: '2009', title: 'Company Founded', desc: 'Dharmjivan Industries established in Gujarat with a focus on electrical products.' },
                            { year: '2012', title: 'LICHTOR Brand Launch', desc: 'Launched LICHTOR as our dedicated LED lighting brand with initial product range.' },
                            { year: '2016', title: 'BIS Certification', desc: 'Achieved Bureau of Indian Standards certification for all LED products.' },
                            { year: '2019', title: 'New Manufacturing Facility', desc: 'Expanded to 50,000 sq. ft. state-of-the-art production facility.' },
                            { year: '2023', title: 'Pan-India Presence', desc: 'Achieved dealer network across all 28 states with 500+ product SKUs.' },
                        ].map(m => (
                            <div key={m.year} className="timeline-item">
                                <div className="timeline-year">{m.year}</div>
                                <div className="timeline-title">{m.title}</div>
                                <div className="timeline-description">{m.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2 className="cta-title">Partner with LICHTOR</h2>
                        <p className="cta-description">Join our network of dealers and distributors. Let&apos;s illuminate India together.</p>
                        <div className="cta-actions">
                            <Link href="/customer-care" className="btn btn-white btn-lg">Become a Dealer</Link>
                            <Link href="/categories" className="btn btn-outline-white btn-lg">Explore Products</Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
