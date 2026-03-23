import Link from 'next/link';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';
import Category from '@/lib/models/Category';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGallery from './ProductGallery';
import ProductOptions from './ProductOptions';
export async function generateMetadata({ params }) {
    const { slug } = await params;
    try {
        await dbConnect();
        const product = await Product.findOne({ slug }).populate('category').lean();
        if (product) {
            return {
                title: `${product.name} | LICHTOR LED Lighting`,
                description: product.description || `${product.name} — Premium LED lighting by LICHTOR.`,
            };
        }
    } catch { }
    return { title: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) };
}

export default async function ProductDetailPage({ params }) {
    const { slug } = await params;
    let product = null;
    let similarProducts = [];

    try {
        await dbConnect();
        product = await Product.findOne({ slug }).populate('category').lean();
        if (product) {
            product = JSON.parse(JSON.stringify(product));
            
            // Use admin-selected similar products first
            if (product.similarProducts?.length > 0) {
                const adminSimilar = await Product.find({
                    _id: { $in: product.similarProducts },
                    isActive: true
                }).populate('category').lean();
                similarProducts = JSON.parse(JSON.stringify(adminSimilar));
            } else {
                // Fallback: auto-fetch by category group
                const currentGroup = product.category?.productGroup;
                const appAreas = product.category?.applicationAreas || [];
                
                let similarCatsMap = new Map();
                
                if (currentGroup) {
                    const groupCats = await Category.find({
                        productGroup: currentGroup,
                        _id: { $ne: product.category._id }
                    }).select('_id').lean();
                    groupCats.forEach(c => similarCatsMap.set(c._id.toString(), c._id));
                }
                
                if (similarCatsMap.size < 4 && appAreas.length > 0) {
                    const areaCats = await Category.find({
                        applicationAreas: { $in: appAreas },
                        _id: { $ne: product.category._id }
                    }).select('_id').lean();
                    areaCats.forEach(c => similarCatsMap.set(c._id.toString(), c._id));
                }
                
                const catIds = Array.from(similarCatsMap.values());
                if (catIds.length > 0) {
                    const rawSimilar = await Product.find({
                        category: { $in: catIds },
                        _id: { $ne: product._id },
                        isActive: true,
                    }).populate('category').limit(8).lean();
                    similarProducts = JSON.parse(JSON.stringify(rawSimilar));
                }
            }
        }
    } catch { }


    if (!product) {
        return (
            <>
                <Header />
                <section className="page-header">
                    <div className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '24px' }}>🔍</div>
                        <h1 className="heading-2">Product Not Found</h1>
                        <p className="subheading">This product hasn&apos;t been added yet.</p>
                        <Link href="/categories" className="btn btn-primary" style={{ marginTop: '24px' }}>Browse Categories</Link>
                    </div>
                </section>
                <Footer />
            </>
        );
    }

    const hasTypes = product.types?.length > 0;
    const hasWattTable = product.wattTable?.length > 0;

    return (
        <>
            <Header />

            {/* Breadcrumb */}
            <section className="page-header" style={{ paddingBottom: 'var(--space-6)' }}>
                <div className="container">
                    <nav className="breadcrumb" style={{ justifyContent: 'flex-start' }}>
                        <Link href="/">Home</Link>
                        <span className="breadcrumb-separator">/</span>
                        <Link href="/categories">Categories</Link>
                        {product.category && (
                            <>
                                <span className="breadcrumb-separator">/</span>
                                <Link href="/categories">{product.category.name}</Link>
                            </>
                        )}
                        <span className="breadcrumb-separator">/</span>
                        <span>{product.name}</span>
                    </nav>
                </div>
            </section>

            {/* Product Info */}
            <section className="section" style={{ paddingTop: 0 }}>
                <div className="container">
                    <div className="product-info">
                        {/* Gallery */}
                         <ProductGallery 
                            images={
                                (product.gallery?.length > 0 ? product.gallery : product.images?.length > 0 ? product.images : (product.image ? [product.image] : [])).map(img => 
                                    img.startsWith('http') || img.startsWith('/assets') ? img : `http://localhost:5001${img}`
                                )
                            } 
                            name={product.name} 
                         />

                        {/* Details */}
                        <div className="product-details">
                            {product.category && <span className="badge">{product.category.name}</span>}
                            <h1 className="heading-2" style={{ marginBottom: '24px' }}>{product.name}</h1>

                            <ProductOptions watt={product.watt} colors={product.bodyColors} types={product.types} />

                            {/* Features */}
                            {product.features?.length > 0 && (
                                <ul className="product-features" style={{ marginTop: '20px' }}>
                                    {product.features.map((f, i) => (
                                        <li key={i}>
                                            <svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <div className="product-actions" style={{ marginTop: '24px' }}>
                                <Link href="/customer-care" className="btn btn-primary btn-lg">Request Quote</Link>
                                {product.datasheet && (
                                    <a href={product.datasheet} target="_blank" rel="noreferrer" className="btn btn-secondary btn-lg">Download Datasheet</a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Full Width Description */}
            <section style={{ background: '#fff', padding: '50px 0', textAlign: 'center' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                    <p style={{ fontSize: '16px', lineHeight: '1.9', color: '#111827', letterSpacing: '0.01em', margin: 0 }}>
                        Experience superior illumination with LICHTOR LED Lighting, designed to deliver high brightness with excellent energy efficiency. Built using premium quality materials and advanced LED technology, these lights provide reliable and long-lasting performance. The modern design ensures easy installation and a perfect fit for residential, commercial, and industrial spaces. With stable lighting output and enhanced durability, LICHTOR products reduce maintenance while maintaining consistent brightness. Engineered for efficiency and comfort, LICHTOR lighting solutions help create brighter and smarter environments. Illuminate your space with dependable lighting performance from LICHTOR.
                    </p>
                </div>
            </section>


            {/* Specifications Details */}
            <section className="section" style={{ background: '#fafafa', paddingTop: '60px', paddingBottom: '60px', borderTop: '1px solid #f3f4f6' }}>
                <div className="container" style={{ maxWidth: '1200px' }}>
                    <h2 className="heading-2" style={{ textAlign: 'center', marginBottom: '50px', fontSize: '2.5rem', fontWeight: 500 }}>Specifications</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', textAlign: 'center' }}>
                        
                        {/* Perfect Fit */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '96px', height: '96px', borderRadius: '50%', background: '#fff', border: '2px solid #0056b3', color: '#0056b3', marginBottom: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/></svg>
                            </div>
                            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: '#111827' }}>Perfect Fit</h3>
                            <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.6', maxWidth: '250px' }}>Designed for easy installation with a compact and modern structure suitable for various lighting applications.</p>
                        </div>

                        {/* Surge Protection */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '96px', height: '96px', borderRadius: '50%', background: '#fff', border: '2px solid #0056b3', color: '#0056b3', marginBottom: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                            </div>
                            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: '#111827' }}>Surge Protection</h3>
                            <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.6', maxWidth: '250px' }}>In-built protection helps safeguard the light from voltage fluctuations and ensures stable performance.</p>
                        </div>

                        {/* Lightweight Design */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '96px', height: '96px', borderRadius: '50%', background: '#fff', border: '2px solid #0056b3', color: '#0056b3', marginBottom: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                            </div>
                            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: '#111827' }}>Lightweight</h3>
                            <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.6', maxWidth: '250px' }}>Made with high-quality polycarbonate or aluminium body for durability while remaining lightweight.</p>
                        </div>

                        {/* Warranty */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '96px', height: '96px', borderRadius: '50%', background: '#fff', border: '2px solid #0056b3', color: '#0056b3', marginBottom: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            </div>
                            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: '#111827' }}>2 Year Warranty</h3>
                            <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.6', maxWidth: '250px' }}>Comes with a reliable warranty ensuring long-term performance and customer confidence.</p>
                        </div>
                        
                    </div>
                </div>
            </section>




            {/* Similar Products */}
            {similarProducts.length > 0 && (
                <section style={{ background: '#fff', padding: '80px 0' }}>
                    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 32px' }}>
                        <h2 style={{ textAlign: 'center', fontSize: '2.2rem', fontWeight: 600, color: '#1f2937', marginBottom: '50px' }}>Similar Products</h2>
                        <div className="similar-products-slider" style={{ 
                            display: 'flex', 
                            overflowX: 'auto', 
                            gap: '30px', 
                            paddingBottom: '20px',
                            paddingTop: '10px',
                            scrollSnapType: 'x mandatory',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none'
                        }}>
                            {similarProducts.map(sp => {
                                const imgSrc = sp.image
                                    ? sp.image.startsWith('http') || sp.image.startsWith('/assets')
                                        ? sp.image
                                        : `http://localhost:5001${sp.image}`
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
                                const colors = sp.bodyColors || [];

                                return (
                                    <div key={sp._id} className="product-card-interactive" style={{ scrollSnapAlign: 'start', flexShrink: 0, width: '280px' }}>
                                        <Link href={`/products/${sp.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                            {/* Image area */}
                                            <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                                                {imgSrc
                                                    ? <img src={imgSrc} alt={sp.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', mixBlendMode: 'darken' }} />
                                                    : <div style={{ fontSize: '3rem' }}>💡</div>
                                                }
                                            </div>
                                            
                                            {/* Product Name */}
                                            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                                                {sp.name}
                                            </h3>
                                            <p className="category-card-desc">
                                                {sp.description || `Premium ${sp.name} from the LICHTOR catalogue.`}
                                            </p>
                                        </Link>
                                                
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '16px' }}>
                                            {/* Know More Button */}
                                            <Link href={`/products/${sp.slug}`} style={{ textDecoration: 'none' }}>
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
                    </div>
                </section>
            )}

            <Footer />
        </>
    );
}
