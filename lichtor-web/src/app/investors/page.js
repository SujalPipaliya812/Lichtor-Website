import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'Investors | LICHTOR by Dharmjivan Industries',
    description: 'Investor Relations - Dharmjivan Industries. Financial highlights, corporate governance, and investor information.',
};

export default function InvestorsPage() {
    return (
        <>
            <Header />

            <section className="page-header">
                <div className="container">
                    <nav className="breadcrumb">
                        <Link href="/">Home</Link>
                        <span className="breadcrumb-separator">/</span>
                        <span>Investors</span>
                    </nav>
                    <h1 className="page-title">Investor Relations</h1>
                    <p className="page-description">Building value through sustainable growth and innovation in LED lighting</p>
                </div>
            </section>

            {/* Company Overview */}
            <section className="section">
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)', alignItems: 'center' }}>
                        <div>
                            <span className="badge">Company Overview</span>
                            <h2 className="heading-2" style={{ margin: 'var(--space-4) 0' }}>Investing in India&apos;s LED Revolution</h2>
                            <p className="subheading" style={{ marginBottom: 'var(--space-6)' }}>
                                Dharmjivan Industries has established itself as a key player in India&apos;s rapidly growing LED lighting market,
                                with the LICHTOR brand serving as our flagship consumer-facing product line.
                            </p>
                            <p style={{ color: 'var(--gray)', lineHeight: 1.8 }}>
                                India&apos;s LED lighting market is projected to grow at 20% CAGR through 2028, driven by government initiatives
                                like UJALA and increasing adoption in commercial and industrial sectors. With our established manufacturing
                                capabilities, pan-India distribution network, and focus on quality, we are well-positioned to capitalize on this growth.
                            </p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
                            <div className="info-card" style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-bold)', color: 'var(--primary)' }}>₹50Cr+</div>
                                <p style={{ color: 'var(--gray)', fontSize: 'var(--text-sm)' }}>Annual Revenue (FY24)</p>
                            </div>
                            <div className="info-card" style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-bold)', color: 'var(--secondary)' }}>25%</div>
                                <p style={{ color: 'var(--gray)', fontSize: 'var(--text-sm)' }}>Revenue Growth YoY</p>
                            </div>
                            <div className="info-card" style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-bold)', color: 'var(--primary)' }}>1000+</div>
                                <p style={{ color: 'var(--gray)', fontSize: 'var(--text-sm)' }}>Dealer Network</p>
                            </div>
                            <div className="info-card" style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-bold)', color: 'var(--secondary)' }}>28</div>
                                <p style={{ color: 'var(--gray)', fontSize: 'var(--text-sm)' }}>States Covered</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Strengths */}
            <section className="section features">
                <div className="container">
                    <div className="section-header">
                        <span className="badge">Why Invest</span>
                        <h2 className="heading-2">Our Competitive Strengths</h2>
                    </div>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon"><svg viewBox="0 0 24 24" fill="white"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" /></svg></div>
                            <h3 className="feature-title">Integrated Manufacturing</h3>
                            <p className="feature-description">In-house production from SMT to final assembly ensures quality control and cost efficiency</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon"><svg viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" /></svg></div>
                            <h3 className="feature-title">Strong Distribution</h3>
                            <p className="feature-description">1000+ dealer network with presence across all Indian states and territories</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon"><svg viewBox="0 0 24 24" fill="white"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg></div>
                            <h3 className="feature-title">Quality Certifications</h3>
                            <p className="feature-description">BIS, ISO 9001:2015, and CE certified products ensure market acceptance</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon"><svg viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg></div>
                            <h3 className="feature-title">R&amp;D Focus</h3>
                            <p className="feature-description">Continuous product innovation with dedicated R&amp;D team for new product development</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Corporate Governance */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <span className="badge">Governance</span>
                        <h2 className="heading-2">Corporate Governance</h2>
                        <p className="subheading">Committed to transparency, accountability, and ethical business practices</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-6)' }}>
                        <div className="info-card">
                            <h3 style={{ marginBottom: 'var(--space-3)' }}>Board of Directors</h3>
                            <p style={{ color: 'var(--gray)', fontSize: 'var(--text-sm)' }}>Experienced leadership with diverse expertise in manufacturing, finance, and business strategy.</p>
                        </div>
                        <div className="info-card">
                            <h3 style={{ marginBottom: 'var(--space-3)' }}>Audit Committee</h3>
                            <p style={{ color: 'var(--gray)', fontSize: 'var(--text-sm)' }}>Independent oversight ensuring financial integrity and regulatory compliance.</p>
                        </div>
                        <div className="info-card">
                            <h3 style={{ marginBottom: 'var(--space-3)' }}>Risk Management</h3>
                            <p style={{ color: 'var(--gray)', fontSize: 'var(--text-sm)' }}>Proactive identification and mitigation of business risks through robust framework.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Annual Reports */}
            <section className="section" style={{ background: 'var(--off-white)' }}>
                <div className="container">
                    <div className="section-header">
                        <span className="badge">Reports</span>
                        <h2 className="heading-2">Annual Reports &amp; Filings</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-6)', maxWidth: '900px', margin: '0 auto' }}>
                        {['FY 2023-24', 'FY 2022-23', 'FY 2021-22'].map(fy => (
                            <div key={fy} className="info-card" style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--primary)', marginBottom: 'var(--space-3)' }}>{fy}</div>
                                <p style={{ color: 'var(--gray)', marginBottom: 'var(--space-4)' }}>Annual Report</p>
                                <a href="#" className="btn btn-secondary">Download PDF</a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Investor Contact */}
            <section className="section">
                <div className="container">
                    <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                        <span className="badge">Contact</span>
                        <h2 className="heading-2" style={{ margin: 'var(--space-4) 0' }}>Investor Relations Contact</h2>
                        <div className="info-card" style={{ marginTop: 'var(--space-8)' }}>
                            <h3 style={{ marginBottom: 'var(--space-4)' }}>For Investor Inquiries</h3>
                            <p style={{ color: 'var(--gray)', marginBottom: 'var(--space-2)' }}>Dharmjivan Industries - Investor Relations</p>
                            <p style={{ marginBottom: 'var(--space-4)' }}>
                                <a href="mailto:investors@dharmjivan.com" style={{ color: 'var(--primary)', fontWeight: 'var(--font-semibold)' }}>investors@dharmjivan.com</a>
                            </p>
                            <p style={{ color: 'var(--gray)', fontSize: 'var(--text-sm)' }}>
                                GIDC Industrial Area, Ahmedabad, Gujarat 380015, India<br />Phone: +91 79 1234 5678
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2 className="cta-title">Interested in Partnership Opportunities?</h2>
                        <p className="cta-description">Let&apos;s discuss how we can grow together in India&apos;s LED lighting revolution.</p>
                        <div className="cta-actions">
                            <Link href="/customer-care" className="btn btn-white btn-lg">Contact Us</Link>
                            <Link href="/about" className="btn btn-outline-white btn-lg">Learn More About Us</Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
