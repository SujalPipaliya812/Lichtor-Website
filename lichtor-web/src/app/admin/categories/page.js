'use client';
import { useState, useEffect, useCallback } from 'react';

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', isActive: true });

    const getAuth = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

    const fetchCategories = useCallback(async () => {
        try {
            const res = await fetch('/api/categories', { headers: getAuth() });
            const data = await res.json();
            setCategories(data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    const resetForm = () => { setFormData({ name: '', description: '', isActive: true }); setEditingId(null); };

    const openEdit = (c) => {
        setFormData({ name: c.name, description: c.description || '', isActive: c.isActive !== false });
        setEditingId(c._id);
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!formData.name) return alert('Category name is required');
        try {
            const url = editingId ? `/api/categories/${editingId}` : '/api/categories';
            const method = editingId ? 'PUT' : 'POST';
            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', ...getAuth() },
                body: JSON.stringify(formData),
            });
            setShowModal(false);
            resetForm();
            fetchCategories();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this category?')) return;
        await fetch(`/api/categories/${id}`, { method: 'DELETE', headers: getAuth() });
        fetchCategories();
    };

    const toggleStatus = async (id) => {
        await fetch(`/api/categories/${id}`, { method: 'PATCH', headers: getAuth() });
        fetchCategories();
    };

    if (loading) return <div className="admin-spinner"><div className="admin-spinner-circle" /></div>;

    return (
        <>
            <div className="admin-page-header">
                <div>
                    <h2 className="admin-page-title">Categories</h2>
                    <p className="admin-page-subtitle">{categories.length} categories</p>
                </div>
                <button onClick={() => { resetForm(); setShowModal(true); }} className="admin-btn">➕ Add Category</button>
            </div>

            <div className="admin-category-grid">
                {categories.map(c => (
                    <div key={c._id} className="admin-category-card">
                        <div className="admin-category-top">
                            <div>
                                <h3 className="admin-category-name">{c.name}</h3>
                                <p className="admin-category-slug">/{c.slug}</p>
                            </div>
                            <button onClick={() => toggleStatus(c._id)} className={`admin-badge ${c.isActive ? 'active' : 'inactive'}`}>
                                {c.isActive ? 'Active' : 'Inactive'}
                            </button>
                        </div>
                        {c.description && <p className="admin-category-desc">{c.description}</p>}
                        <div className="admin-category-actions">
                            <button onClick={() => openEdit(c)} className="admin-text-btn edit">Edit</button>
                            <button onClick={() => handleDelete(c._id)} className="admin-text-btn delete">Delete</button>
                        </div>
                    </div>
                ))}
                {categories.length === 0 && (
                    <div className="admin-empty-state" style={{ gridColumn: '1 / -1' }}>No categories yet. Click &quot;Add Category&quot; to create one.</div>
                )}
            </div>

            {showModal && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <div className="admin-modal-header">
                            <h3 className="admin-modal-title">{editingId ? 'Edit' : 'Add'} Category</h3>
                            <button onClick={() => { setShowModal(false); resetForm(); }} className="admin-modal-close">&times;</button>
                        </div>
                        <div className="admin-modal-body">
                            <div className="admin-form-group">
                                <label className="admin-label">Category Name *</label>
                                <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="admin-input" placeholder="e.g. Panel Lights" />
                            </div>
                            <div className="admin-form-group">
                                <label className="admin-label">Description</label>
                                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} className="admin-textarea" placeholder="Category description..." />
                            </div>
                            <div className="admin-toggle-row">
                                <label className="admin-label" style={{ marginBottom: 0 }}>Active</label>
                                <button onClick={() => setFormData({ ...formData, isActive: !formData.isActive })} className={`admin-toggle ${formData.isActive ? 'on' : 'off'}`}>
                                    <span className="admin-toggle-knob" />
                                </button>
                            </div>
                        </div>
                        <div className="admin-modal-footer">
                            <button onClick={() => { setShowModal(false); resetForm(); }} className="admin-btn ghost">Cancel</button>
                            <button onClick={handleSubmit} className="admin-btn">
                                {editingId ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
