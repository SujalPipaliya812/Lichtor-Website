import Link from 'next/link';
import dbConnect from '@/lib/db';
import Category from '@/lib/models/Category';
import Product from '@/lib/models/Product';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoriesClient from './CategoriesClient';

// Fallback static categories used when DB has no data yet
const fallbackCategories = [
    { name: 'LED Panel Lights', slug: 'led-panel-light', tag: 'Popular', filter: 'indoor commercial', img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop', desc: 'Ultra-slim recessed panels for false ceilings. Available in round, square & rectangular shapes.', count: '45+ Products' },
    { name: 'LED Surface Lights', slug: 'led-surface-light', filter: 'indoor commercial', img: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=300&fit=crop', desc: 'Surface-mounted panels for ceilings without false ceiling. Easy installation, modern design.', count: '35+ Products' },
    { name: 'LED Down Lights', slug: 'led-down-light', tag: 'Bestseller', filter: 'indoor commercial', img: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=300&fit=crop', desc: 'Recessed ceiling downlighters for uniform ambient lighting. Various wattages available.', count: '60+ Products' },
    { name: 'LED COB Lights', slug: 'led-cob-light', filter: 'indoor commercial', img: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400&h=300&fit=crop', desc: 'High-intensity Chip-on-Board lights for focused illumination. Ideal for accent lighting.', count: '40+ Products' },
    { name: 'LED Junction Lights', slug: 'led-junction-light', filter: 'indoor', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', desc: 'Quick-install junction box lights. Perfect for residential applications.', count: '20+ Products' },
    { name: 'LED Spot Lights', slug: 'led-spot-light', filter: 'indoor commercial', img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop', desc: 'Directional spotlights for highlighting displays, artwork, and architectural features.', count: '15+ Products' },
    { name: 'LED Bulkhead Lights', slug: 'led-bulkhead-light', filter: 'outdoor industrial', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop', desc: 'Weather-resistant wall/ceiling lights for outdoor corridors, stairways, and entrances.', count: '10+ Products' },
    { name: 'LED Street Lights', slug: 'led-street-light', tag: 'New', filter: 'outdoor industrial', img: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=300&fit=crop', desc: 'High-efficiency street lighting for roads, highways, and urban areas. IP65+ rated.', count: '15+ Products' },
    { name: 'LED Flood Lights', slug: 'led-flood-light', filter: 'outdoor industrial', img: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=400&h=300&fit=crop', desc: 'Powerful area lighting for grounds, facades, sports facilities, and security applications.', count: '25+ Products' },
    { name: 'LED Highbay Lights', slug: 'led-highbay-light', filter: 'industrial', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=300&fit=crop', desc: 'Industrial-grade high bay lights for warehouses, factories, and large commercial spaces.', count: '10+ Products' },
    { name: 'LED Strip Lights', slug: 'led-strip-light', tag: 'Popular', filter: 'indoor commercial', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', desc: 'Flexible LED strips for cove lighting, under-cabinet, and decorative applications. RGB available.', count: '10+ Products' },
    { name: 'LED Bulb & Tube Lights', slug: 'led-bulbtube-light', filter: 'indoor commercial', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop', desc: 'Essential bulb and tube lights for daily household and commercial illumination needs.', count: '30+ Products' },
];

export const metadata = {
    title: 'All LED Lighting Categories | LICHTOR',
    description: 'Browse LICHTOR\'s full range of premium LED lighting products — indoor, outdoor, commercial, and industrial solutions.',
};

async function getCategories() {
    try {
        await dbConnect();

        // Fetch all active categories from DB, ordered by the `order` field
        const dbCategories = await Category.find({ isActive: true })
            .sort({ order: 1, name: 1 })
            .lean();

        if (!dbCategories || dbCategories.length === 0) {
            return fallbackCategories;
        }

        // For each category, count how many active products are in it and get the first product slug
        const categoriesWithCount = await Promise.all(
            dbCategories.map(async (cat) => {
                const productCount = await Product.countDocuments({
                    category: cat._id,
                    isActive: true,
                });

                // Get first active product to enable direct linking
                const firstProduct = await Product.findOne({
                    category: cat._id,
                    isActive: true,
                }).select('slug').lean();

                // Get all unique body colors from products in this category
                const productsWithColors = await Product.find({
                    category: cat._id,
                    isActive: true,
                }).select('bodyColors').lean();
                
                const allColors = [...new Set(
                    productsWithColors.flatMap(p => p.bodyColors || [])
                )];

                // Match a fallback entry to get filter tag and image if not stored in DB
                const fallback = fallbackCategories.find(f =>
                    f.slug === cat.slug || f.name.toLowerCase() === cat.name.toLowerCase()
                );

                return {
                    _id: cat._id.toString(),
                    name: cat.name,
                    slug: cat.slug,
                    productSlug: firstProduct ? firstProduct.slug : null,
                    desc: cat.description || fallback?.desc || '',
                    img: cat.bannerImage
                        ? (cat.bannerImage.startsWith('/assets') 
                            ? cat.bannerImage 
                            : `http://localhost:5001${cat.bannerImage}`)
                        : (fallback?.img || 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop'),
                    count: productCount,
                    bodyColors: allColors,
                    tag: fallback?.tag || null,
                    filter: cat.applicationAreas && cat.applicationAreas.length > 0 
                        ? cat.applicationAreas.join(' ') 
                        : (fallback?.filter || 'all'),
                };
            })
        );

        return categoriesWithCount;
    } catch {
        // If DB is unreachable, fall back to static data
        return fallbackCategories;
    }
}

export default async function CategoriesPage() {
    const categories = await getCategories();
    const isFromDB = categories.length > 0 && typeof categories[0].count === 'number';

    return (
        <>
            <Header />

            {/* Hero Banner */}
            <section className="hero-banner">
                <div className="hero-banner-image">
                    <img src="/Premium LED lighting for every space.png" alt="LICHTOR LED Lighting Categories" title="LED Lighting Categories" />
                </div>
                <div className="hero-breadcrumb">
                    <Link href="/">Home</Link>
                    <span> › </span>
                    <span className="current">Categories</span>
                </div>
            </section>

            {/* Client component handles the filter tabs + grid interactivity */}
            <CategoriesClient categories={categories} isFromDB={isFromDB} />

            {/* Statistics */}
            <section className="section stats-section">
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-item">
                            <div className="stat-value">500<span>+</span></div>
                            <div className="stat-label">Total Products</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">15</div>
                            <div className="stat-label">Product Categories</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">BIS</div>
                            <div className="stat-label">Certified Quality</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">2<span>Yr</span></div>
                            <div className="stat-label">Warranty</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2 className="cta-title">Need Bulk Orders or Custom Solutions?</h2>
                        <p className="cta-description">Contact our sales team for dealer partnerships, project quotations, and customized LED solutions.</p>
                        <div className="cta-actions">
                            <Link href="/customer-care" className="btn btn-white btn-lg">Contact Sales</Link>
                            <a href="/catalogue.pdf" download="LICHTOR-Product-Catalogue.pdf" className="btn btn-outline-white btn-lg">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                                Download Full Catalog
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
