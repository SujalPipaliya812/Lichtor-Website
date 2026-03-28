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
