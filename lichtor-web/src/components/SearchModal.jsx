'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SearchModal({ isOpen, onClose }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [catResults, setCatResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            document.body.style.overflow = 'auto';
            setQuery('');
            setResults([]);
            setCatResults([]);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const fetchResults = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/public/products?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setResults(data.products || []);
                setCatResults(data.categories || []);
            } catch (err) {
                console.error('Failed to search:', err);
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(fetchResults, 300);
        return () => clearTimeout(timer);
    }, [query]);

    if (!isOpen) return null;

    return (
        <div className="search-overlay" onClick={onClose}>
            <div className="search-modal" onClick={e => e.stopPropagation()}>
                <div className="search-header">
                    <div className="search-input-wrapper">
                        <svg className="search-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="M21 21l-4.35-4.35" />
                        </svg>
                        <input
                            ref={inputRef}
                            type="text"
                            className="search-input"
                            placeholder="What are you looking for?"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        {query && (
                            <button className="search-clear-inline" onClick={() => setQuery('')}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <button className="search-close-btn" onClick={onClose} aria-label="Close search">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                        <span>Esc</span>
                    </button>
                </div>

                <div className="search-suggestions">
                    {!query && (
                        <>
                            <div className="suggestion-label">Popular Categories</div>
                            <div className="suggestion-chips">
                                {[
                                    { name: 'Indoor', slug: 'indoor' },
                                    { name: 'Outdoor', slug: 'outdoor' },
                                    { name: 'Commercial', slug: 'commercial' },
                                    { name: 'Industrial', slug: 'industrial' },
                                    { name: 'Accessories', slug: 'accessories' }
                                ].map(cat => (
                                    <Link 
                                        key={cat.slug} 
                                        href={`/categories#${cat.slug}`} 
                                        className="chip"
                                        onClick={onClose}
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}
                </div>
                
                <div className="search-results">
                    {isLoading && <div className="search-loading">Searching...</div>}
                    
                    {!isLoading && query && results.length === 0 && catResults.length === 0 && (
                        <div className="search-empty">
                            No results found matching "{query}"
                        </div>
                    )}

                    {!isLoading && (results.length > 0 || catResults.length > 0) && (
                        <div className="search-list">
                            {/* Category Results First */}
                            {catResults.map(cat => (
                                <Link 
                                    key={cat.slug} 
                                    href={`/categories#${cat.slug}`}
                                    className="search-item category-result"
                                    onClick={onClose}
                                >
                                    <div className="search-item-image category-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                                            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                            <line x1="12" y1="22.08" x2="12" y2="12" />
                                        </svg>
                                    </div>
                                    <div className="search-item-content">
                                        <h4 className="search-item-title">{cat.name}</h4>
                                        <span className="search-item-category">Go to Category</span>
                                    </div>
                                    <svg className="search-item-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            ))}

                            {/* Product Results */}
                            {results.map(product => (
                                <Link 
                                    key={product._id} 
                                    href={`/products/${product.slug}`}
                                    className="search-item"
                                    onClick={onClose}
                                >
                                    <div className="search-item-image">
                                        {product.images?.[0] ? (
                                            <img src={product.images[0].url} alt={product.name} />
                                        ) : (
                                            <div className="search-item-placeholder">No Image</div>
                                        )}
                                    </div>
                                    <div className="search-item-content">
                                        <h4 className="search-item-title">{product.name}</h4>
                                        <span className="search-item-category">{product.category?.name || 'Uncategorized'}</span>
                                    </div>
                                    <svg className="search-item-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
