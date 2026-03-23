import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-main">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <img src="/Lichtor-01.png" alt="LICHTOR" style={{ height: '40px', width: 'auto', filter: 'brightness(0) invert(1)' }} />
                        </div>
                        <p className="footer-description">
                            A flagship brand of Dharmjivan Industries, LICHTOR is committed to delivering
                            innovative, energy-efficient LED lighting solutions that illuminate India&apos;s progress.
                        </p>
                        <div className="footer-social">
                            <a href="#" className="footer-social-link" aria-label="Facebook">
                                <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
                            </a>
                            <a href="#" className="footer-social-link" aria-label="Twitter">
                                <svg viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" /></svg>
                            </a>
                            <a href="#" className="footer-social-link" aria-label="LinkedIn">
                                <svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z" /></svg>
                            </a>
                            <a href="#" className="footer-social-link" aria-label="YouTube">
                                <svg viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z" /><polygon points="9.75,15.02 15.5,11.75 9.75,8.48" fill="white" /></svg>
                            </a>
                        </div>
                    </div>
                    <div className="footer-column">
                        <h4>Products</h4>
                        <div className="footer-links">
                            <Link href="/categories#panel-lights" className="footer-link">Panel Lights</Link>
                            <Link href="/categories#downlighters" className="footer-link">Downlighters</Link>
                            <Link href="/categories#tube-lights" className="footer-link">Tube Lights</Link>
                            <Link href="/categories#led-bulbs" className="footer-link">LED Bulbs</Link>
                            <Link href="/categories#street-lights" className="footer-link">Street Lights</Link>
                            <Link href="/categories#industrial" className="footer-link">Industrial Lights</Link>
                        </div>
                    </div>
                    <div className="footer-column">
                        <h4>Company</h4>
                        <div className="footer-links">
                            <Link href="/about" className="footer-link">About Us</Link>
                            <Link href="/about#manufacturing" className="footer-link">Manufacturing</Link>
                            <Link href="/about#quality" className="footer-link">Quality Assurance</Link>
                            <Link href="/investors" className="footer-link">Investors</Link>
                            <a href="#" className="footer-link">Careers</a>
                            <a href="#" className="footer-link">Media Center</a>
                        </div>
                    </div>
                    <div className="footer-column">
                        <h4>Support</h4>
                        <div className="footer-links">
                            <Link href="/customer-care" className="footer-link">Customer Care</Link>
                            <Link href="/customer-care#warranty" className="footer-link">Warranty</Link>
                            <Link href="/customer-care#service" className="footer-link">Service Centers</Link>
                            <a href="#" className="footer-link">Downloads</a>
                            <Link href="/customer-care#faq" className="footer-link">FAQs</Link>
                            <Link href="/customer-care#contact" className="footer-link">Contact Us</Link>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p className="footer-copyright">
                        © 2024 Dharmjivan Industries. All rights reserved. LICHTOR® is a registered trademark.
                    </p>
                    <div className="footer-legal">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Use</a>
                        <a href="#">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
