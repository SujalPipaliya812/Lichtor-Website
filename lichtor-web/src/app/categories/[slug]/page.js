import Link from 'next/link';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';
import Category from '@/lib/models/Category';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { API_URL } from '@/lib/constants';

const staticData = {
    'panel-lights': {
        name: 'Panel Lights', description: 'Ultra-slim recessed LED panels for modern false ceiling installations.',
        features: ['High CRI >80', 'Anti-Glare', '50,000 Hrs Life', 'Surge Protection'],
        products: [
            { name: 'SSK Panel Light', slug: 'ssk-panel', watt: '3W-18W', cct: '3K-6K', shape: 'Round/Square' },
            { name: 'Moon Surface Panel', slug: 'moon-surface', watt: '6W-24W', cct: '3K-6K', shape: 'Round/Square' },
            { name: 'Edge Lite Panel', slug: 'edge-lite', watt: '6W-22W', cct: '4K-6K', shape: 'Round/Square' },
            { name: 'Glaze Pro Panel', slug: 'glaze-pro', watt: '9W-18W', cct: '3K-6K', shape: 'Round' },
        ],
    },
    'surface-lights': {
        name: 'Surface Lights', description: 'Surface-mounted panels for ceilings without false ceiling. Easy installation, modern design.',
        features: ['Easy Installation', 'Modern Design', '50,000 Hrs Life', 'Surge Protection'],
        products: [
            { name: 'Surface Round Light', slug: 'surface-round', watt: '6W-22W', cct: '3K-6K', shape: 'Round' },
            { name: 'Surface Square Light', slug: 'surface-square', watt: '6W-22W', cct: '3K-6K', shape: 'Square' },
            { name: 'Slim Surface Panel', slug: 'slim-surface', watt: '8W-18W', cct: '4K-6K', shape: 'Round' },
            { name: 'Surface Rimless Panel', slug: 'surface-rimless', watt: '9W-24W', cct: '3K-6K', shape: 'Round' },
        ],
    },
    'down-lights': {
        name: 'Down Lights', description: 'Recessed ceiling downlighters for uniform ambient lighting.',
        features: ['Precise Beam', 'Anti-Glare', 'Slim Profile', '50,000 Hrs Life'],
        products: [
            { name: 'Deep Glaze Downlighter', slug: 'deep-glaze', watt: '6W-22W', cct: '3K-6K', shape: 'Round' },
            { name: 'COB Downlighter', slug: 'cob-down', watt: '9W-24W', cct: '3K-6K', shape: 'Round' },
            { name: 'Slim Downlighter', slug: 'slim-down', watt: '8W-18W', cct: '4K-6K', shape: 'Round' },
            { name: 'Rimless Downlighter', slug: 'rimless-down', watt: '9W-24W', cct: '3K-6K', shape: 'Round' },
        ],
    },
    'cob-lights': {
        name: 'COB Lights', description: 'High-intensity Chip-on-Board lights for focused illumination.',
        features: ['High Intensity', 'True Colors', 'Heat Management', 'Precision Beam'],
        products: [
            { name: 'COB Spotlight', slug: 'cob-spotlight', watt: '7W-15W', cct: '3K-6K', shape: 'Round' },
            { name: 'COB Track Light', slug: 'cob-track', watt: '12W-30W', cct: '3K-6K', shape: 'Cylinder' },
            { name: 'COB Surface Mount', slug: 'cob-surface', watt: '9W-20W', cct: '3K-6K', shape: 'Round' },
            { name: 'COB Trimless', slug: 'cob-trimless', watt: '10W-25W', cct: '3K-6K', shape: 'Round' },
        ],
    },
};

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const data = staticData[slug];
    const name = data?.name || slug.replace(/-/g, ' ');
    return {
        title: `${name} | LICHTOR LED Lighting`,
        description: data?.description || `Browse LICHTOR ${name} — premium LED lighting solutions.`,
    };
}

export default async function CategoryDetailPage({ params }) {
    const { slug } = await params;
    const data = staticData[slug];

    let dbProducts = [];
    let dbCategory = null;
    try {
        await dbConnect();
        dbCategory = await Category.findOne({ slug }).lean();
        if (dbCategory) {
            dbProducts = await Product.find({ category: dbCategory._id, isActive: true }).lean();
            dbProducts = JSON.parse(JSON.stringify(dbProducts));
        }
    } catch { }

    const name = dbCategory ? dbCategory.name : (data?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));
    const description = dbCategory ? dbCategory.description : (data?.description || `Browse our premium range of ${name}.`);
    const features = data?.features || [];
    const staticProducts = data?.products || [];

    return (
        <>
            <Header />

            {/* Hero Banner */}
            <section className="catdetail-hero">
                <div className="container">
                    <nav className="catdetail-breadcrumb">
                        <Link href="/">Home</Link>
                        <span>/</span>
                        <Link href="/categories">Categories</Link>
                        <span>/</span>
                        <span className="current">{name}</span>
                    </nav>
                    <h1 className="catdetail-title">{name}</h1>
                    <p className="catdetail-desc">{description}</p>
                </div>
            </section>

            {/* Features Strip */}
            {features.length > 0 && (
                <section className="catdetail-features">
                    <div className="container">
                        <div className="catdetail-features-list">
                            {features.map(f => (
                                <div key={f} className="catdetail-feature-item">
                                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span>{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* DB Products */}
            <section className="catdetail-products section-padding">
                <div className="container">
                    <h2 className="catdetail-section-title">
                        Products <span className="catdetail-count">({dbProducts.length})</span>
                    </h2>

                    {dbProducts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📦</div>
                            <p style={{ fontSize: '16px' }}>No products in this category yet.</p>
                        </div>
                    ) : (
                        <div className="catdetail-product-grid">
                            {dbProducts.map(p => {
                                const imgSrc = (p.image || (p.images && p.images[0])) 
                                    ? ((p.image || p.images[0]).startsWith('http') || (p.image || p.images[0]).startsWith('/assets')
                                        ? (p.image || p.images[0])
                                        : `${API_URL}${p.image || p.images[0]}`)
                                    : null;

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
                                const colors = p.bodyColors || [];

                                return (
                                    <div key={p._id} className="product-card-interactive">
                                        <Link href={`/products/${p.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                            {/* Image area */}
                                            <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                                                {imgSrc
                                                    ? <img src={imgSrc} alt={p.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', mixBlendMode: 'darken' }} />
                                                    : <div style={{ fontSize: '3rem' }}>💡</div>
                                                }
                                            </div>
                                            
                                            {/* Product Name */}
                                            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                                                {p.name}
                                            </h3>
                                            <p className="category-card-desc">
                                                {p.description || `Premium ${p.name} from the LICHTOR catalogue.`}
                                            </p>
                                        </Link>
                                                
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '16px' }}>
                                            {/* Know More Button */}
                                            <Link href={`/products/${p.slug}`} style={{ textDecoration: 'none' }}>
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

                                            {/* Color Variants - Horizontal Row */}
                                            {colors.length > 0 && (
                                                <div style={{ display: 'flex', flexDirection: 'row', gap: '6px', alignItems: 'center' }}>
                                                    {colors.slice(0, 3).map((color, idx) => (
                                                        <div key={idx} title={color} className="color-dot" style={{ 
                                                            width: '22px', height: '22px', borderRadius: '50%', 
                                                            background: getColorCode(color), border: '2px solid #e5e7eb', 
                                                            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                                                            transition: 'transform 0.2s ease',
                                                            cursor: 'pointer'
                                                        }}></div>
                                                    ))}
                                                    {colors.length > 3 && (
                                                        <div title={`${colors.length - 3} more colors`} className="color-dot" style={{ 
                                                            width: '22px', height: '22px', borderRadius: '50%', 
                                                            background: '#f9fafb', border: '1px solid #e5e7eb', 
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                                            fontSize: '9px', fontWeight: 600, color: '#6b7280',
                                                            transition: 'transform 0.2s ease',
                                                            cursor: 'pointer'
                                                        }}>
                                                            +{colors.length - 3}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>


            {/* Static Products */}
            {staticProducts.length > 0 && (
                <section className="catdetail-range section-padding" style={{ background: 'var(--white)' }}>
                    <div className="container">
                        <h2 className="catdetail-section-title">Product Range</h2>
                        <p className="catdetail-subtitle">Showing {staticProducts.length} variants</p>
                        <div className="catdetail-range-grid">
                            {staticProducts.map(p => (
                                <div key={p.slug} className="catdetail-range-card">
                                    <div className="catdetail-range-img">
                                        <div className="catdetail-product-placeholder">💡</div>
                                    </div>
                                    <div className="catdetail-range-info">
                                        <h3>{p.name}</h3>
                                        <div className="catdetail-range-specs">
                                            <div>
                                                <span className="label">Wattage</span>
                                                <span className="value">{p.watt}</span>
                                            </div>
                                            <div>
                                                <span className="label">CCT</span>
                                                <span className="value">{p.cct}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="catdetail-cta">
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 className="catdetail-cta-title">Need Help Choosing the Right {name}?</h2>
                    <p className="catdetail-cta-text">Contact our lighting experts for personalized recommendations based on your space.</p>
                    <Link href="/customer-care" className="btn btn-white">Contact Expert</Link>
                </div>
            </section>

            <Footer />
        </>
    );
}
