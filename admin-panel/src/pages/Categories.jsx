import { useState, useEffect } from 'react';
import api from '../services/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '', isActive: true, bannerImage: '', applicationAreas: [] });
    const [editingId, setEditingId] = useState(null);
    const [uploading, setUploading] = useState(false);

    const APPLICATION_AREAS = ['indoor', 'outdoor', 'commercial', 'industrial', 'accessories'];


    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const fd = new FormData();
        fd.append('file', file);
        fd.append('folder', 'categories');
        
        // Auto-naming: Use category name as public ID
        if (formData.name) {
            const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            fd.append('customPublicId', `categories/${slug}`);
        }

        setUploading(true);
        try {
            const res = await api.post('/media/upload', fd, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setFormData(prev => ({ ...prev, bannerImage: res.data.url }));
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/categories/${editingId}`, formData);
            } else {
                await api.post('/categories', formData);
            }
            fetchCategories();
            setShowModal(false);
            resetForm();
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Failed to save category');
        }
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', isActive: true, bannerImage: '', applicationAreas: [] });
        setEditingId(null);
    };

    const handleEdit = (category) => {
        setFormData({
            name: category.name,
            description: category.description || '',
            isActive: category.isActive,
            bannerImage: category.bannerImage || '',
            applicationAreas: category.applicationAreas || []
        });
        setEditingId(category._id);
        setShowModal(true);
    };

    const handleAreaToggle = (area) => {
        setFormData(prev => {
            const current = new Set(prev.applicationAreas);
            if (current.has(area)) current.delete(area);
            else current.add(area);
            return { ...prev, applicationAreas: Array.from(current) };
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await api.delete(`/categories/${id}`);
                fetchCategories();
            } catch (error) {
                console.error('Error deleting category:', error);
                alert('Failed to delete category');
            }
        }
    };

    const imgSrc = (url) => {
        if (!url) return '';
        // If it's a local asset from the main web project, point to the live site
        if (url.startsWith('/assets')) {
            return `https://lichtor.co.in${url}`;
        }
        return url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Categories</h1>
                    <p className="text-gray">Manage your product categories</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                >
                    + Add Category
                </button>
            </div>

            <div className="card">
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center">Loading...</td></tr>
                            ) : categories.length === 0 ? (
                                <tr><td colSpan="5" className="text-center">No categories found</td></tr>
                            ) : (
                                categories.map(cat => (
                                    <tr key={cat._id}>
                                        <td>
                                            {cat.bannerImage ? (
                                                <img
                                                    src={imgSrc(cat.bannerImage)}
                                                    alt={cat.name}
                                                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                                                />
                                            ) : (
                                                <div style={{ width: '40px', height: '40px', background: '#f3f4f6', borderRadius: '4px' }} />
                                            )}
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 500 }}>{cat.name}</div>
                                            <div style={{ fontSize: '12px', color: '#6b7280' }}>/{cat.slug}</div>
                                        </td>
                                        <td>{cat.description || '-'}</td>
                                        <td>
                                            <span className={`status-badge ${cat.isActive ? 'active' : 'inactive'}`}>
                                                {cat.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn-icon"
                                                onClick={() => handleEdit(cat)}
                                                title="Edit"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="btn-icon delete"
                                                onClick={() => handleDelete(cat._id)}
                                                title="Delete"
                                                style={{ marginLeft: '8px' }}
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{editingId ? 'Edit Category' : 'Add New Category'}</h3>
                            <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Category Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Banner Image</label>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <input
                                            type="file"
                                            className="form-input"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        />
                                        {uploading && <span className="text-gray-500">Uploading...</span>}
                                    </div>
                                    {formData.bannerImage && (
                                        <div style={{ marginTop: '10px' }}>
                                            <img
                                                src={imgSrc(formData.bannerImage)}
                                                alt="Preview"
                                                style={{ height: '60px', borderRadius: '4px' }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="form-input"
                                        rows="3"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Application Areas</label>
                                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', border: '2px solid #d1d5db', borderRadius: '8px', padding: '12px' }}>
                                        {APPLICATION_AREAS.map(area => (
                                            <label key={area} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.applicationAreas.includes(area)}
                                                    onChange={() => handleAreaToggle(area)}
                                                    style={{ accentColor: '#4f46e5', width: '16px', height: '16px' }}
                                                />
                                                {area.charAt(0).toUpperCase() + area.slice(1)}
                                            </label>
                                        ))}
                                    </div>
                                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Select areas where products in this category are commonly used.</p>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Status</label>
                                    <select
                                        className="form-input"
                                        value={formData.isActive ? 'true' : 'false'}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                                    >
                                        <option value="true">Active</option>
                                        <option value="false">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Category</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
