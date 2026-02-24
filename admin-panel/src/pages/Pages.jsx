import { useState, useEffect } from 'react';
import Header from '../components/Header';
import api from '../services/api';

const Pages = () => {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPage, setEditingPage] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        metaTitle: '',
        metaDescription: '',
        status: 'draft'
    });

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const response = await api.get('/pages');
            setPages(response.data || []);
        } catch (error) {
            console.error('Error fetching pages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingPage) {
                await api.put(`/pages/${editingPage._id}`, formData);
            } else {
                await api.post('/pages', formData);
            }
            fetchPages();
            closeModal();
        } catch (error) {
            alert(error.response?.data?.message || 'Error saving page');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this page?')) {
            try {
                await api.delete(`/pages/${id}`);
                fetchPages();
            } catch (error) {
                alert(error.response?.data?.message || 'Error deleting page');
            }
        }
    };

    const openModal = (page = null) => {
        if (page) {
            setEditingPage(page);
            setFormData({
                title: page.title,
                slug: page.slug || '',
                content: page.content || '',
                metaTitle: page.metaTitle || '',
                metaDescription: page.metaDescription || '',
                status: page.status
            });
        } else {
            setEditingPage(null);
            setFormData({
                title: '',
                slug: '',
                content: '',
                metaTitle: '',
                metaDescription: '',
                status: 'draft'
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingPage(null);
    };

    return (
        <>
            <Header title="Pages" />
            <div className="page-content">
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">All Pages ({pages.length})</h2>
                        <button className="btn btn-primary" onClick={() => openModal()}>
                            + Add Page
                        </button>
                    </div>
                    <div className="card-body" style={{ padding: 0 }}>
                        {loading ? (
                            <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
                        ) : pages.length > 0 ? (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Slug</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pages.map((page) => (
                                        <tr key={page._id}>
                                            <td><strong>{page.title}</strong></td>
                                            <td>/{page.slug}</td>
                                            <td>
                                                <span className={`badge badge-${page.status === 'published' ? 'success' : 'warning'}`}>
                                                    {page.status}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-secondary btn-sm"
                                                    style={{ marginRight: '8px' }}
                                                    onClick={() => openModal(page)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(page._id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
                                No pages yet. Click "Add Page" to create your first page.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
                        <div className="modal-header">
                            <h3>{editingPage ? 'Edit Page' : 'Add New Page'}</h3>
                            <button onClick={closeModal} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div className="form-group">
                                        <label className="form-label">Page Title *</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Slug</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            placeholder="auto-generated if empty"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Content</label>
                                    <textarea
                                        className="form-textarea"
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        rows={6}
                                    />
                                </div>

                                <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '16px', marginTop: '8px' }}>
                                    <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>SEO Settings</h4>

                                    <div className="form-group">
                                        <label className="form-label">Meta Title</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.metaTitle}
                                            onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Meta Description</label>
                                        <textarea
                                            className="form-textarea"
                                            value={formData.metaDescription}
                                            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                            rows={2}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Status</label>
                                    <select
                                        className="form-select"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary">
                                    {editingPage ? 'Update Page' : 'Create Page'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Pages;
