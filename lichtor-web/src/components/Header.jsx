'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import SearchModal from '@/components/SearchModal';

export default function Header() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const header = document.getElementById('header');
        const handleScroll = () => {
            if (window.scrollY > 50) header?.classList.add('scrolled');
            else header?.classList.remove('scrolled');
        };
        window.addEventListener('scroll', handleScroll);
        
        // Close menu on scroll or resize
        const handleResize = () => {
            if (window.innerWidth > 768) setIsMenuOpen(false);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    // Lock scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    return (
        <header className="header" id="header">
            <div className="container">
                <div className="header-inner">
                    <Link href="/" className="logo" onClick={closeMenu}>
                        <img src="/Lichtor-01.png" alt="LICHTOR" style={{ height: '55px', width: 'auto' }} />
                    </Link>
                    <nav className="nav">
                        <Link href="/categories" className="nav-link">Categories</Link>
                        <Link href="/about" className="nav-link">About Us</Link>
                        <Link href="/customer-care" className="nav-link">Customer Care</Link>
                        <Link href="/investors" className="nav-link">Investors</Link>
                        <div className="nav-dropdown">
                            <a href="#" className="nav-link">More</a>
                            <div className="nav-dropdown-menu">
                                <a href="#" className="nav-dropdown-item">Downloads</a>
                                <a href="#" className="nav-dropdown-item">Certifications</a>
                                <a href="#" className="nav-dropdown-item">Media Center</a>
                                <a href="#" className="nav-dropdown-item">Careers</a>
                            </div>
                        </div>
                    </nav>
                    <div className="header-actions">
                        <a 
                            href="https://wa.me/919999999999" 
                            className="whatsapp-btn-img" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            aria-label="Contact on WhatsApp"
                        >
                            <img src="/whatsapp.png" alt="WhatsApp" style={{ height: '24px', width: '24px', display: 'block' }} />
                        </a>
                        <span className="nav-divider"></span>
                        <button className="search-btn" aria-label="Search" onClick={() => setIsSearchOpen(true)}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <path d="M21 21l-4.35-4.35" />
                            </svg>
                        </button>
                        <Link href="/customer-care" className="btn btn-primary">Contact Us</Link>
                        <button 
                            className={`mobile-menu-btn ${isMenuOpen ? 'active' : ''}`} 
                            aria-label="Menu" 
                            onClick={toggleMenu}
                        >
                            <span></span><span></span><span></span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`} onClick={closeMenu}></div>
            
            {/* Mobile Menu Drawer */}
            <div className={`mobile-menu-drawer ${isMenuOpen ? 'open' : ''}`}>
                <div className="mobile-menu-header">
                    <Link href="/" onClick={closeMenu}>
                        <img src="/Lichtor-01.png" alt="LICHTOR" style={{ height: '40px', width: 'auto' }} />
                    </Link>
                    <button className="close-menu-btn" onClick={closeMenu}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <nav className="mobile-nav">
                    <Link href="/categories" className="mobile-nav-link" onClick={closeMenu}>Categories</Link>
                    <Link href="/about" className="mobile-nav-link" onClick={closeMenu}>About Us</Link>
                    <Link href="/customer-care" className="mobile-nav-link" onClick={closeMenu}>Customer Care</Link>
                    <Link href="/investors" className="mobile-nav-link" onClick={closeMenu}>Investors</Link>
                    <div className="mobile-nav-divider"></div>
                    <Link href="#" className="mobile-nav-link" onClick={closeMenu}>Downloads</Link>
                    <Link href="#" className="mobile-nav-link" onClick={closeMenu}>Certifications</Link>
                    <Link href="#" className="mobile-nav-link" onClick={closeMenu}>Media Center</Link>
                    <Link href="#" className="mobile-nav-link" onClick={closeMenu}>Careers</Link>
                    <div className="mobile-nav-footer">
                        <Link href="/customer-care" className="btn btn-primary" style={{ width: '100%' }} onClick={closeMenu}>Contact Us</Link>
                    </div>
                </nav>
            </div>

            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </header>
    );
}
