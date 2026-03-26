'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import SearchModal from '@/components/SearchModal';

export default function Header() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        const header = document.getElementById('header');
        const handleScroll = () => {
            if (window.scrollY > 50) header?.classList.add('scrolled');
            else header?.classList.remove('scrolled');
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className="header" id="header">
            <div className="container">
                <div className="header-inner">
                    <Link href="/" className="logo">
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
                            className="whatsapp-btn" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            aria-label="Contact on WhatsApp"
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                            </svg>
                        </a>
                        <span className="nav-divider"></span>
                        <button className="search-btn" aria-label="Search" onClick={() => setIsSearchOpen(true)}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <path d="M21 21l-4.35-4.35" />
                            </svg>
                        </button>
                        <Link href="/customer-care" className="btn btn-primary">Contact Us</Link>
                        <button className="mobile-menu-btn" aria-label="Menu">
                            <span></span><span></span><span></span>
                        </button>
                    </div>
                </div>
            </div>
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </header>
    );
}
