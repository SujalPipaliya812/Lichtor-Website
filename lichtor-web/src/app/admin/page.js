'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ products: 0, categories: 0 });
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));

        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        Promise.all([
            fetch('/api/products', config).then(r => r.json()).catch(() => ({ total: 0 })),
            fetch('/api/categories', config).then(r => r.json()).catch(() => []),
        ]).then(([prodData, catData]) => {
            setStats({
                products: prodData.total || 0,
                categories: Array.isArray(catData) ? catData.length : 0,
            });
        });
    }, []);

    return (
        <>
            <div className="admin-stats-grid">
                {[
                    { icon: '📦', label: 'Products', value: stats.products, color: 'blue' },
                    { icon: '📁', label: 'Categories', value: stats.categories, color: 'green' },
                    { icon: '📧', label: 'Enquiries', value: 0, color: 'amber' },
                    { icon: '👤', label: 'Admin Users', value: 1, color: 'violet' },
                ].map(s => (
                    <div key={s.label} className="admin-stat-card">
                        <div className={`admin-stat-icon ${s.color}`}>{s.icon}</div>
                        <div className="admin-stat-value">{s.value}</div>
                        <div className="admin-stat-label">{s.label}</div>
                    </div>
                ))}
            </div>

            <div className="admin-cards-row">
                <div className="admin-card">
                    <h3 className="admin-card-title">Quick Actions</h3>
                    <div className="admin-quick-actions">
                        <Link href="/admin/products" className="admin-action-btn primary">➕ Add Product</Link>
                        <Link href="/admin/categories" className="admin-action-btn success">📁 Manage Categories</Link>
                    </div>
                </div>

                <div className="admin-card">
                    <h3 className="admin-card-title">System Status</h3>
                    <div className="admin-status-ok">
                        <span>✓</span> All systems operational
                    </div>
                    <p className="admin-status-text">Welcome back, {user?.name || 'Admin'}! The admin panel is ready.</p>
                </div>
            </div>
        </>
    );
}
