import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        watt: '',
        cct: '',
        lumen: '',
        description: '',
        isActive: true,
        image: '',
        datasheet: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [uploading, setUploading] = useState({ image: false, datasheet: false });

    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                axios.get(`${API_URL}/products`, config),
                axios.get(`${API_URL}/categories`, config)
            ]);
            setProducts(prodRes.data.products || []);
            setCategories(catRes.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'products');

        setUploading(prev => ({ ...prev, [field]: true }));
        try {
            const res = await axios.post(`${API_URL}/media/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            setFormData(prev => ({ ...prev, [field]: res.data.url }));
        } catch (error) {
            console.error('Upload failed:', error);
            alert(`${field === 'image' ? 'Image' : 'Datasheet'} upload failed`);
        } finally {
            setUploading(prev => ({ ...prev, [field]: false }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`${API_URL}/products/${editingId}`, formData, config);
            } else {
                await axios.post(`${API_URL}/products`, formData, config);
            }
            fetchData();
            setShowModal(false);
            resetForm();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            category: '',
            watt: '',
            cct: '',
            lumen: '',
            description: '',
            isActive: true,
            image: '',
            datasheet: ''
        });
        setEditingId(null);
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            category: product.category?._id || product.category,
            watt: product.watt || '',
            cct: product.cct || '',
            lumen: product.lumen || '',
            description: product.description,
            isActive: product.isActive,
            image: product.image || '',
            datasheet: product.datasheet || ''
        });
        setEditingId(product._id);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`${API_URL}/products/${id}`, config);
                fetchData();
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Failed to delete product');
            }
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Products</h1>
                    <p className="text-gray">Manage your LED lighting products</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                >
                    + Add Product
                </button>
            </div>

            <div className="card">
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Specs (W/CCT/Im)</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center">Loading...</td></tr>
                            ) : products.length === 0 ? (
                                <tr><td colSpan="5" className="text-center">No products found</td></tr>
                            ) : (
                                products.map(prod => (
                                    <tr key={prod._id}>
                                        <td>
                                            {prod.image ? (
                                                <img
                                                    src={`http://localhost:5001${prod.image}`}
                                                    alt={prod.name}
                                                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                                                />
                                            ) : (
                                                <div style={{ width: '40px', height: '40px', background: '#f3f4f6', borderRadius: '4px' }} />
                                            )}
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 500 }}>{prod.name}</div>
                                            {prod.datasheet && <div style={{ fontSize: '11px', color: '#6366f1' }}>📄 Datasheet Available</div>}
                                        </td>
                                        <td>
                                            <span style={{
                                                background: '#f3f4f6',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '12px'
                                            }}>
                                                {prod.category?.name || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '13px' }}>
                                                {prod.watt && <span>{prod.watt}W • </span>}
                                                {prod.cct && <span>{prod.cct} • </span>}
                                                {prod.lumen && <span>{prod.lumen}lm</span>}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${prod.isActive ? 'active' : 'inactive'}`}>
                                                {prod.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn-icon"
                                                onClick={() => handleEdit(prod)}
                                                title="Edit"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="btn-icon delete"
                                                onClick={() => handleDelete(prod._id)}
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
                    <div className="modal-content modal-large">
                        <div className="modal-header">
                            <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
                            <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Product Image</label>
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <input
                                                type="file"
                                                className="form-input"
                                                onChange={(e) => handleFileChange(e, 'image')}
                                                accept="image/*"
                                            />
                                            {uploading.image && <span className="text-gray-500">...</span>}
                                        </div>
                                        {formData.image && (
                                            <div style={{ marginTop: '10px' }}>
                                                <img
                                                    src={`http://localhost:5001${formData.image}`}
                                                    alt="Preview"
                                                    style={{ height: '60px', borderRadius: '4px' }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Datasheet PDF</label>
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <input
                                                type="file"
                                                className="form-input"
                                                onChange={(e) => handleFileChange(e, 'datasheet')}
                                                accept=".pdf"
                                            />
                                            {uploading.datasheet && <span className="text-gray-500">...</span>}
                                        </div>
                                        {formData.datasheet && (
                                            <div style={{ marginTop: '5px', fontSize: '13px', color: '#059669' }}>
                                                ✅ PDF Uploaded
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Product Name</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Category</label>
                                        <select
                                            className="form-input"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(cat => (
                                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-section">
                                    <h4>⚡ Technical Specifications</h4>
                                    <div className="specs-grid">
                                        <div className="form-group">
                                            <label>Wattage (W)</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={formData.watt}
                                                onChange={(e) => setFormData({ ...formData, watt: e.target.value })}
                                                placeholder="e.g. 10"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>CCT (Color Temp)</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={formData.cct}
                                                onChange={(e) => setFormData({ ...formData, cct: e.target.value })}
                                                placeholder="e.g. 3000K"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Lumen Output</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={formData.lumen}
                                                onChange={(e) => setFormData({ ...formData, lumen: e.target.value })}
                                                placeholder="e.g. 900"
                                            />
                                        </div>
                                    </div>
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
                                <button type="submit" className="btn btn-primary">Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
