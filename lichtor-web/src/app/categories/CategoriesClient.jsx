'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const filterTabs = [
    { label: 'All Categories', filter: 'all' },
    { label: 'Indoor', filter: 'indoor' },
    { label: 'Outdoor', filter: 'outdoor' },
    { label: 'Commercial', filter: 'commercial' },
    { label: 'Industrial', filter: 'industrial' },
    { label: 'Accessories', filter: 'accessories' },
];

// Icons per category name keywords (lightweight SVG lookup)
function CategoryIcon({ name }) {
    const n = name.toLowerCase();
    if (n.includes('panel')) return <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>;
    if (n.includes('surface')) return <svg viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2" /></svg>;
    if (n.includes('down')) return <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /><path d="M12 16v6" /></svg>;
    if (n.includes('cob')) return <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" fill="white" /></svg>;
    if (n.includes('spot')) return <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="6" /><path d="M8 14l4 8 4-8" /></svg>;
    if (n.includes('flood')) return <svg viewBox="0 0 24 24"><path d="M4 4h16v12H4z" /><path d="M8 16l-4 4M16 16l4 4M12 16v6" /></svg>;
    if (n.includes('street')) return <svg viewBox="0 0 24 24"><path d="M12 2v4M4 12H2M6 6L4 4M18 6l2-2M22 12h-2" /><rect x="8" y="8" width="8" height="14" rx="1" /></svg>;
    if (n.includes('strip')) return <svg viewBox="0 0 24 24"><rect x="2" y="10" width="20" height="4" rx="1" /></svg>;
    if (n.includes('highbay') || n.includes('high bay')) return <svg viewBox="0 0 24 24"><path d="M12 2L6 8h4v8H6l6 6 6-6h-4V8h4L12 2z" /></svg>;
    if (n.includes('bulkhead')) return <svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="6" /></svg>;
    if (n.includes('junction')) return <svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><circle cx="12" cy="12" r="3" /></svg>;
    // default bulb icon
    return <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" fill="white" /></svg>;
}

const getColorCode = (colorName) => {
    switch(colorName.trim().toLowerCase()) {
        case 'cool white': return '#f0f4ff';
        case 'natural white': return '#fef9ef';
        case 'warm white': return '#fde68a';
        case '3-color change': return 'linear-gradient(135deg, #f0f4ff 33%, #fef9ef 66%, #fde68a 100%)';
        case 'red': return '#ef4444';
        case 'blue': return '#3b82f6';
        case 'green': return '#22c55e';
        case 'pink': return '#ec4899';
        case 'amber': return '#f59e0b';
        case 'ice blue': return '#67e8f9';
        case 'rgb': return 'linear-gradient(135deg, #ef4444, #22c55e, #3b82f6)';
        case 'white': return '#ffffff';
        case 'black': return '#222222';
        case 'copper': return '#b87333';
        case 'grey': return '#9ca3af';
        default: return '#e5e7eb';
    }
};

export default function CategoriesClient({ categories, isFromDB }) {
    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            if (hash && ['indoor', 'outdoor', 'commercial', 'industrial', 'accessories'].includes(hash)) {
                setActiveFilter(hash);
                // Scroll to filter tabs after a short delay to allow content change
                setTimeout(() => {
                    const element = document.getElementById('category-results');
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 100);
            }
        };

        // Run once on mount
        handleHashChange();

        // Listen for changes
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const filtered = activeFilter === 'all'
        ? categories
        : categories.filter(c => c.filter && c.filter.includes(activeFilter));

    const formatCount = (cat) => {
        if (isFromDB && typeof cat.count === 'number') {
            return cat.count === 1 ? '1 Product' : `${cat.count} Products`;
        }
        // Fallback static count string
        return cat.count || '0 Products';
    };

    return (
        <section className="section" style={{ paddingTop: 0 }}>
            <div className="container">
                {/* Filter Tabs */}
                <div id="category-results" className="filter-tabs">
                    {filterTabs.map(tab => (
                        <button
                            key={tab.filter}
                            className={`filter-tab${activeFilter === tab.filter ? ' active' : ''}`}
                            onClick={() => setActiveFilter(tab.filter)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Category Grid */}
                <div className="category-grid">
                    {filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af', gridColumn: '1/-1' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
                            <p style={{ fontSize: '16px' }}>No categories found in this filter.</p>
                        </div>
                    ) : filtered.map(cat => {
                        const targetHref = cat.productSlug ? `/products/${cat.productSlug}` : `/categories/${cat.slug}`;
                        return (
                        <div key={cat.slug || cat.name} className="product-card-interactive">
                            <Link href={targetHref} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                {/* Image area */}
                                <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', borderRadius: '16px', overflow: 'hidden' }}>
                                    <img
                                        src={cat.img}
                                        alt={cat.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop';
                                        }}
                                    />
                                </div>
                                
                                {/* Product Name */}
                                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                                    {cat.name}
                                </h3>
                                <p className="category-card-desc">
                                    {cat.desc}
                                </p>
                            </Link>
                                    
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '16px' }}>
                                {/* Know More Button */}
                                <Link href={targetHref} style={{ textDecoration: 'none' }}>
                                    <div className="know-more-btn" style={{
                                        background: '#fff',
                                        padding: '10px 24px',
                                        borderRadius: '30px',
                                        color: '#111827',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                                        display: 'inline-block',
                                        transition: 'all 0.3s ease'
                                    }}>
                                        Know More
                                    </div>
                                </Link>

                                {/* Color Variants + Product Count */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {/* Color Dots */}
                                    {cat.bodyColors && cat.bodyColors.length > 0 && (
                                        <div style={{ display: 'flex', flexDirection: 'row', gap: '6px', alignItems: 'center' }}>
                                            {cat.bodyColors.slice(0, 3).map((color, idx) => (
                                                <div key={idx} title={color} className="color-dot" style={{ 
                                                    width: '22px', height: '22px', borderRadius: '50%', 
                                                    background: getColorCode(color), border: '2px solid #e5e7eb', 
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                                                    transition: 'transform 0.2s ease',
                                                    cursor: 'pointer'
                                                }}></div>
                                            ))}
                                            {cat.bodyColors.length > 3 && (
                                                <div title={`${cat.bodyColors.length - 3} more colors`} className="color-dot" style={{ 
                                                    width: '22px', height: '22px', borderRadius: '50%', 
                                                    background: '#f9fafb', border: '1px solid #e5e7eb', 
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                                    fontSize: '9px', fontWeight: 600, color: '#6b7280',
                                                    transition: 'transform 0.2s ease',
                                                    cursor: 'pointer'
                                                }}>
                                                    +{cat.bodyColors.length - 3}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
