import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

export default function Dashboard() {
    const [stats, setStats] = useState({ products: 0, categories: 0, enquiries: 0 });
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }

        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                const [products, categories, enquiries] = await Promise.all([
                    axios.get(`${API_URL}/products`, config).catch(() => ({ data: [] })),
                    axios.get(`${API_URL}/categories`, config).catch(() => ({ data: [] })),
                    axios.get(`${API_URL}/enquiries`, config).catch(() => ({ data: [] }))
                ]);

                setStats({
                    products: Array.isArray(products.data) ? products.data.length : 0,
                    categories: Array.isArray(categories.data) ? categories.data.length : 0,
                    enquiries: Array.isArray(enquiries.data) ? enquiries.data.length : 0
                });
            } catch (err) {
                console.error('Failed to fetch stats:', err);
            }
        };

        fetchStats();
    }, []);

    return (
        <>
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon products">📦</div>
                    <div className="stat-content">
                        <h3>{stats.products}</h3>
                        <p>Products</p>
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
                    <div className="stat-icon enquiries">📧</div>
                    <div className="stat-content">
                        <h3>{stats.enquiries}</h3>
                        <p>Enquiries</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon users">👤</div>
                    <div className="stat-content">
                        <h3>1</h3>
                        <p>Admin Users</p>
                    </div>
                </div>
            </div>

            <div className="grid-2">
                <div className="card">
                    <h3>Quick Actions</h3>
                    <div className="quick-actions">
                        <a href="/products" className="btn btn-primary">
                            <span>➕</span> Add Product
                        </a>
                        <a href="/categories" className="btn btn-secondary">
                            <span>📁</span> Manage Categories
                        </a>
                    </div>
                </div>

                <div className="card">
                    <h3>System Status</h3>
                    <div className="alert alert-success">
                        <span>✓</span> All systems operational
                    </div>
                    <p style={{ color: '#6b7280', marginTop: '12px', fontSize: '14px' }}>
                        Welcome back, {user?.name || 'Admin'}! The admin panel is ready.
                    </p>
                </div>
            </div>
        </>
    );
}
