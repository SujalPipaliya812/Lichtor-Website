import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5001/api';

export default function Dashboard() {
    const [stats, setStats] = useState({ products: 0, categories: 0, enquiries: 0, activeProducts: 0 });
    const [recentProducts, setRecentProducts] = useState([]);
    const [recentEnquiries, setRecentEnquiries] = useState([]);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));

        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const fetchAll = async () => {
            try {
                const [prodRes, catRes, enqRes] = await Promise.all([
                    axios.get(`${API_URL}/products?limit=100`, config).catch(() => ({ data: { products: [] } })),
                    axios.get(`${API_URL}/categories`, config).catch(() => ({ data: [] })),
                    axios.get(`${API_URL}/enquiries`, config).catch(() => ({ data: [] }))
                ]);

                const prods = prodRes.data?.products || prodRes.data || [];
                const cats = Array.isArray(catRes.data) ? catRes.data : [];
                const enqs = Array.isArray(enqRes.data) ? enqRes.data : [];

                setStats({
                    products: prods.length,
                    categories: cats.length,
                    enquiries: enqs.length,
                    activeProducts: prods.filter(p => p.isActive).length
                });

                setRecentProducts(prods.slice(0, 5));
                setRecentEnquiries(enqs.slice(0, 5));
            } catch (err) {
                console.error('Dashboard fetch error:', err);
            }
        };

        fetchAll();
    }, []);

    const imgSrc = (url) => {
        if (!url) return '';
        return url.startsWith('http') || url.startsWith('/assets') ? url : `http://localhost:5001${url}`;
    };

    return (
        <>
            {/* Stat Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon products">📦</div>
                    <div className="stat-content">
                        <h3>{stats.products}</h3>
                        <p>Total Products</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon categories">📁</div>
                    <div className="stat-content">
                        <h3>{stats.categories}</h3>
                        <p>Categories</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>✅</div>
                    <div className="stat-content">
                        <h3>{stats.activeProducts}</h3>
                        <p>Active Products</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon enquiries">📧</div>
                    <div className="stat-content">
                        <h3>{stats.enquiries}</h3>
                        <p>Enquiries</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card" style={{ marginBottom: '20px' }}>
                <h3 style={{ marginBottom: '12px' }}>Quick Actions</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button className="btn btn-primary" onClick={() => navigate('/products')}>
                        ➕ Add Product
                    </button>
                    <button className="btn btn-secondary" onClick={() => navigate('/categories')}>
                        📁 Manage Categories
                    </button>
                    <button className="btn btn-secondary" onClick={() => navigate('/enquiries')}>
                        📧 View Enquiries
                    </button>
                </div>
            </div>

            <div className="grid-2">
                {/* Recent Products */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h3>Recent Products</h3>
                        <a href="/products" style={{ fontSize: '13px', color: '#4f46e5', textDecoration: 'none' }}>View All →</a>
                    </div>
                    {recentProducts.length === 0 ? (
                        <p style={{ color: '#9ca3af', fontSize: '14px' }}>No products yet</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {recentProducts.map(p => (
                                <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderRadius: '8px', background: '#f9fafb' }}>
                                    {p.image ? (
                                        <img src={imgSrc(p.image)} alt="" style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📦</div>
                                    )}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 500, fontSize: '13px' }}>{p.name}</div>
                                        <div style={{ fontSize: '11px', color: '#9ca3af' }}>{p.category?.name || '—'}</div>
                                    </div>
                                    <span className={`status-badge ${p.isActive ? 'active' : 'inactive'}`} style={{ fontSize: '11px' }}>
                                        {p.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Enquiries */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h3>Recent Enquiries</h3>
                        <a href="/enquiries" style={{ fontSize: '13px', color: '#4f46e5', textDecoration: 'none' }}>View All →</a>
                    </div>
                    {recentEnquiries.length === 0 ? (
                        <p style={{ color: '#9ca3af', fontSize: '14px' }}>No enquiries yet</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {recentEnquiries.map(e => (
                                <div key={e._id} style={{ padding: '8px', borderRadius: '8px', background: '#f9fafb' }}>
                                    <div style={{ fontWeight: 500, fontSize: '13px' }}>{e.name || e.company || 'Unknown'}</div>
                                    <div style={{ fontSize: '11px', color: '#9ca3af' }}>{e.email || '—'} · {e.product || '—'}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* System Status */}
            <div className="card" style={{ marginTop: '20px' }}>
                <h3>System Status</h3>
                <div className="alert alert-success" style={{ marginTop: '10px' }}>
                    <span>✓</span> All systems operational
                </div>
                <p style={{ color: '#6b7280', marginTop: '12px', fontSize: '14px' }}>
                    Welcome back, {user?.name || 'Admin'}! The admin panel is ready.
                </p>
            </div>
        </>
    );
}
