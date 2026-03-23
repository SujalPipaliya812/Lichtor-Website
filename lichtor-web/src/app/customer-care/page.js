'use client';
import Link from 'next/link';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CustomerCarePage() {
    const [form, setForm] = useState({ name: '', countryCode: '+91', phone: '', email: '', enquiryType: 'product', message: '' });
    const [phoneError, setPhoneError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate phone: exactly 10 digits
        const phoneDigits = form.phone.replace(/\D/g, '');
        if (phoneDigits.length !== 10) {
            setPhoneError('Phone number must be exactly 10 digits');
            return;
        }
        setPhoneError('');

        // Validate email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(form.email)) {
            setEmailError('Please enter a valid email address');
            return;
        }
        setEmailError('');

        setSubmitting(true);
        setError('');
        try {
            const res = await fetch('/api/public/enquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, phone: form.countryCode + ' ' + form.phone }),
            });
            if (res.ok) {
                setSubmitted(true);
                setForm({ name: '', countryCode: '+91', phone: '', email: '', enquiryType: 'product', message: '' });
            } else {
                const data = await res.json();
                setError(data.message || 'Failed to submit');
            }
        } catch {
            setError('Something went wrong. Please try again.');
        }
        setSubmitting(false);
    };

    return (
        <>
            <Header />

            {/* Hero Banner */}
            <section style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingTop: 'var(--header-height)', lineHeight: 0 }}>
                <img
                    src="/customer-care-hero.png"
                    alt="LICHTOR Customer Support"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                />
            </section>
            <section style={{ background: 'var(--off-white)', padding: 'var(--space-3) 0' }}>
                <div className="container">
                    <nav className="breadcrumb" style={{ justifyContent: 'flex-start' }}>
                        <Link href="/">Home</Link>
                        <span className="breadcrumb-separator">/</span>
                        <span>Customer Care</span>
                    </nav>
                </div>
            </section>

            {/* Contact Options */}
            <section className="section">
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-6)' }}>
                        <div className="info-card" style={{ textAlign: 'center' }}>
                            <div className="info-card-icon" style={{ margin: '0 auto var(--space-5)' }}>
                                <svg viewBox="0 0 24 24" fill="var(--primary)"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>
                            </div>
                            <h3>Call Us</h3>
                            <p style={{ color: 'var(--gray)', marginBottom: 'var(--space-4)' }}>Mon-Sat: 9:00 AM - 6:00 PM</p>
                            <a href="tel:+919624800095" style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-semibold)', color: 'var(--primary)' }}>+91 96248 00095</a>
                        </div>
                        <div className="info-card" style={{ textAlign: 'center' }}>
                            <div className="info-card-icon" style={{ margin: '0 auto var(--space-5)' }}>
                                <svg viewBox="0 0 24 24" fill="var(--primary)"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" fill="none" stroke="white" strokeWidth="2" /></svg>
                            </div>
                            <h3>Email Us</h3>
                            <p style={{ color: 'var(--gray)', marginBottom: 'var(--space-4)' }}>Response within 24 hours</p>
                            <a href="mailto:dharmjivan.led95@gmail.com" style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--primary)' }}>dharmjivan.led95@gmail.com</a>
                        </div>
                        <div className="info-card" style={{ textAlign: 'center' }}>
                            <div className="info-card-icon" style={{ margin: '0 auto var(--space-5)' }}>
                                <svg viewBox="0 0 24 24" fill="var(--primary)"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" fill="white" /></svg>
                            </div>
                            <h3>Visit Us</h3>
                            <p style={{ color: 'var(--gray)', marginBottom: 'var(--space-4)' }}>Head Office</p>
                            <a href="https://www.google.com/maps/place/Lichtor+LED+LIGHT/data=!4m2!3m1!1s0x0:0x1507b73edf85a43" target="_blank" rel="noreferrer" style={{ fontSize: 'var(--text-sm)', color: 'var(--dark-gray)', textDecoration: 'none' }}>Dharmjivan Industries<br />GIDC, Ahmedabad, Gujarat</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section className="section" style={{ background: 'var(--off-white)' }} id="contact">
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)' }}>
                        <div>
                            <span className="badge">Get in Touch</span>
                            <h2 className="heading-2" style={{ margin: 'var(--space-4) 0' }}>Send Us a Message</h2>
                            <p className="subheading" style={{ marginBottom: 'var(--space-6)' }}>Have a question or need assistance? Fill out the form and our team will get back to you shortly.</p>

                            {submitted ? (
                                <div style={{ textAlign: 'center', padding: 'var(--space-12) 0' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>✅</div>
                                    <h3 style={{ color: 'var(--dark)', marginBottom: 'var(--space-2)' }}>Thank You!</h3>
                                    <p style={{ color: 'var(--gray)' }}>Your enquiry has been submitted. We&apos;ll get back to you soon.</p>
                                    <button onClick={() => setSubmitted(false)} className="btn btn-primary" style={{ marginTop: 'var(--space-6)' }}>Send Another</button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    {error && <div style={{ color: '#e53e3e', padding: 'var(--space-3)', background: '#fff5f5', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-4)' }}>{error}</div>}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                        <div className="form-group">
                                            <label className="form-label">Full Name *</label>
                                            <input type="text" className="form-input" placeholder="Your name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Phone *</label>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <select className="form-select" style={{ width: '100px', flexShrink: 0 }} value={form.countryCode} onChange={e => setForm({ ...form, countryCode: e.target.value })}>
                                                    <option value="+91">🇮🇳 +91</option>
                                                    <option value="+1">🇺🇸 +1</option>
                                                    <option value="+44">🇬🇧 +44</option>
                                                    <option value="+971">🇦🇪 +971</option>
                                                    <option value="+65">🇸🇬 +65</option>
                                                    <option value="+61">🇦🇺 +61</option>
                                                    <option value="+49">🇩🇪 +49</option>
                                                </select>
                                                <input type="tel" className="form-input" placeholder="XXXXX XXXXX" required maxLength={10} value={form.phone} onChange={e => { const val = e.target.value.replace(/\D/g, '').slice(0, 10); setForm({ ...form, phone: val }); setPhoneError(''); }} style={{ flex: 1 }} />
                                            </div>
                                            {phoneError && <p style={{ color: '#e53e3e', fontSize: '13px', marginTop: '4px' }}>{phoneError}</p>}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email *</label>
                                        <input type="email" className="form-input" placeholder="your@email.com" required value={form.email} onChange={e => { setForm({ ...form, email: e.target.value }); setEmailError(''); }} />
                                        {emailError && <p style={{ color: '#e53e3e', fontSize: '13px', marginTop: '4px' }}>{emailError}</p>}
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Inquiry Type *</label>
                                        <select className="form-select" required value={form.enquiryType} onChange={e => setForm({ ...form, enquiryType: e.target.value })}>
                                            <option value="product">Product Inquiry</option>
                                            <option value="dealer">Dealer Partnership</option>
                                            <option value="other">Warranty Claim</option>
                                            <option value="other">Technical Support</option>
                                            <option value="bulk">Bulk Order</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Message *</label>
                                        <textarea className="form-textarea" placeholder="How can we help you?" rows={4} required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
                                        {submitting ? 'Submitting...' : 'Submit Inquiry'}
                                    </button>
                                </form>
                            )}
                        </div>
                        <div>
                            <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', height: '100%', minHeight: '400px' }}>
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d72.41!3d23.02!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x1507b73edf85a43!2sLichtor%20LED%20LIGHT!5e0!3m2!1sen!2sin!4v1705752000000!5m2!1sen!2sin"
                                    width="100%" height="100%" style={{ border: 0, minHeight: '500px' }} allowFullScreen="" loading="lazy"></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Warranty */}
            <section className="section" id="warranty">
                <div className="container">
                    <div className="section-header">
                        <span className="badge">Warranty</span>
                        <h2 className="heading-2">Our Warranty Policy</h2>
                        <p className="subheading">We stand behind our products with comprehensive warranty coverage</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-6)' }}>
                        <div className="feature-card">
                            <div className="feature-icon"><svg viewBox="0 0 24 24" fill="white"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg></div>
                            <h3 className="feature-title">2-Year Warranty</h3>
                            <p className="feature-description">All LICHTOR products come with 2-year manufacturer warranty against defects</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon"><svg viewBox="0 0 24 24" fill="white"><path d="M4 4h16v16H4z" /><path d="M9 9h6v6H9z" fill="var(--primary)" /></svg></div>
                            <h3 className="feature-title">Easy Claims</h3>
                            <p className="feature-description">Simple warranty claim process through dealers or direct contact</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon"><svg viewBox="0 0 24 24" fill="white"><path d="M12 2L4 12h6v10h4V12h6L12 2z" /></svg></div>
                            <h3 className="feature-title">Quick Replacement</h3>
                            <p className="feature-description">Fast replacement for verified warranty claims within 7-10 days</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQs */}
            <section className="section" style={{ background: 'var(--off-white)' }} id="faq">
                <div className="container">
                    <div className="section-header">
                        <span className="badge">FAQs</span>
                        <h2 className="heading-2">Frequently Asked Questions</h2>
                    </div>
                    <div className="accordion" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        {[
                            { q: 'How can I become a LICHTOR dealer?', a: "Contact our sales team at dharmjivan.led95@gmail.com or call +91 96248 00095. We'll guide you through the dealership application process and discuss territory availability." },
                            { q: 'What is the warranty period for LICHTOR products?', a: 'All LICHTOR LED products come with a standard 2-year manufacturer warranty covering manufacturing defects. Keep your purchase invoice for warranty claims.' },
                            { q: 'How do I claim warranty for a defective product?', a: 'Contact your dealer with the original invoice and defective product, or reach out to us directly with product photos and invoice copy at warranty@lichtor.in.' },
                            { q: 'Do you provide installation services?', a: 'LICHTOR products are designed for easy installation by qualified electricians. We provide detailed installation guides with each product. For project installations, contact your local dealer.' },
                            { q: 'Where can I download product datasheets?', a: 'Product datasheets are available on each product detail page. You can also request a complete catalog by contacting our sales team.' },
                        ].map((faq, i) => (
                            <div key={i} className={`accordion-item${i === 0 ? ' active' : ''}`} onClick={(e) => {
                                const item = e.currentTarget;
                                const isActive = item.classList.contains('active');
                                document.querySelectorAll('.accordion-item').forEach(el => el.classList.remove('active'));
                                if (!isActive) item.classList.add('active');
                            }}>
                                <button className="accordion-header">
                                    {faq.q}
                                    <span className="accordion-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg></span>
                                </button>
                                <div className="accordion-content">
                                    <p>{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
