'use client';
import { useState, useEffect, useCallback } from 'react';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: '', category: '', series: '', model: '', watt: '', cct: '', lumen: '', description: '',
        isActive: true, images: [], datasheet: '',
        features: [], applications: [],
        specifications: { voltage: '', cri: '', beamAngle: '', ipRating: '', lifespan: '', dimensions: '', material: '', warranty: '', efficacy: '', powerFactor: '', cutoutSize: '', certifications: '' },
    });
    const [featureInput, setFeatureInput] = useState('');

    const getConfig = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

    const fetchData = useCallback(async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                fetch('/api/products', getConfig()).then(r => r.json()),
                fetch('/api/categories', getConfig()).then(r => r.json()),
            ]);
            setProducts(prodRes.products || []);
            setCategories(catRes || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        setUploading(true);
        try {
            const fd = new FormData();
            files.forEach(f => fd.append('files', f));
            const res = await fetch('/api/media/upload', {
                method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, body: fd,
            });
            const data = await res.json();
            if (data.urls) setFormData(prev => ({ ...prev, images: [...prev.images, ...data.urls] }));
        } catch (err) { console.error(err); }
        finally { setUploading(false); }
    };

    const removeImage = (idx) => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));

    const addFeature = () => {
        if (!featureInput.trim()) return;
        setFormData(prev => ({ ...prev, features: [...prev.features, featureInput.trim()] }));
        setFeatureInput('');
    };

    const removeFeature = (idx) => setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }));

    const resetForm = () => {
        setFormData({
            name: '', category: '', series: '', model: '', watt: '', cct: '', lumen: '', description: '',
            isActive: true, images: [], datasheet: '',
            features: [], applications: [],
            specifications: { voltage: '', cri: '', beamAngle: '', ipRating: '', lifespan: '', dimensions: '', material: '', warranty: '', efficacy: '', powerFactor: '', cutoutSize: '', certifications: '' },
        });
        setEditingId(null);
        setFeatureInput('');
    };

    const openEdit = (p) => {
        setFormData({
            name: p.name || '', category: p.category?._id || p.category || '',
            series: p.series || '', model: p.model || '',
            watt: p.watt || '', cct: p.cct || '', lumen: p.lumen || '',
            description: p.description || '', isActive: p.isActive !== false,
            images: p.images || [], datasheet: p.datasheet || '',
            features: p.features || [], applications: p.applications || [],
            specifications: { voltage: '', cri: '', beamAngle: '', ipRating: '', lifespan: '', dimensions: '', material: '', warranty: '', efficacy: '', powerFactor: '', cutoutSize: '', certifications: '', ...(p.specifications || {}) },
        });
        setEditingId(p._id);
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.category) return alert('Name and category are required');
        try {
            const url = editingId ? `/api/products/${editingId}` : '/api/products';
            const method = editingId ? 'PUT' : 'POST';
            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify(formData),
            });
            setShowModal(false);
            resetForm();
            fetchData();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this product?')) return;
        await fetch(`/api/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        fetchData();
    };

    const toggleStatus = async (id) => {
        await fetch(`/api/products/${id}`, { method: 'PATCH', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        fetchData();
    };

    if (loading) return <div className="admin-spinner"><div className="admin-spinner-circle" /></div>;

    return (
        <>
            <div className="admin-page-header">
                <div>
                    <h2 className="admin-page-title">Products</h2>
                    <p className="admin-page-subtitle">{products.length} total products</p>
                </div>
                <button onClick={() => { resetForm(); setShowModal(true); }} className="admin-btn">➕ Add Product</button>
            </div>

            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Watt</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p._id}>
                                <td>
                                    <div className="admin-table-product">
                                        <div className="admin-table-thumb">
                                            {p.images?.[0] ? <img src={p.images[0]} alt="" /> : <span>📦</span>}
                                        </div>
                                        <span className="admin-table-name">{p.name}</span>
                                    </div>
                                </td>
                                <td>{p.category?.name || '—'}</td>
                                <td>{p.watt || '—'}</td>
                                <td>
                                    <button onClick={() => toggleStatus(p._id)} className={`admin-badge ${p.isActive ? 'active' : 'inactive'}`}>
                                        {p.isActive ? 'Active' : 'Inactive'}
                                    </button>
                                </td>
                                <td>
                                    <button onClick={() => openEdit(p)} className="admin-text-btn edit">Edit</button>
                                    <button onClick={() => handleDelete(p._id)} className="admin-text-btn delete">Delete</button>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr><td colSpan={5} className="admin-empty-state">No products yet. Click &quot;Add Product&quot; to create one.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal wide">
                        <div className="admin-modal-header">
                            <h3 className="admin-modal-title">{editingId ? 'Edit' : 'Add'} Product</h3>
                            <button onClick={() => { setShowModal(false); resetForm(); }} className="admin-modal-close">&times;</button>
                        </div>

                        <div className="admin-modal-body">
                            <div className="admin-form-row">
                                <div>
                                    <label className="admin-label">Product Name *</label>
                                    <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="admin-input" placeholder="e.g. SSK Panel Light" />
                                </div>
                                <div>
                                    <label className="admin-label">Category *</label>
                                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="admin-select">
                                        <option value="">Select Category</option>
                                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="admin-form-row">
                                <div>
                                    <label className="admin-label">Series</label>
                                    <input value={formData.series} onChange={e => setFormData({ ...formData, series: e.target.value })} className="admin-input" placeholder="e.g. LICHTOR Pro Series" />
                                </div>
                                <div>
                                    <label className="admin-label">Model Number</label>
                                    <input value={formData.model} onChange={e => setFormData({ ...formData, model: e.target.value })} className="admin-input" placeholder="e.g. LPL-18R-CDL" />
                                </div>
                            </div>

                            <div className="admin-form-row-3">
                                <div>
                                    <label className="admin-label">Wattage</label>
                                    <input value={formData.watt} onChange={e => setFormData({ ...formData, watt: e.target.value })} className="admin-input" placeholder="e.g. 18" />
                                </div>
                                <div>
                                    <label className="admin-label">CCT (Color Temp)</label>
                                    <input value={formData.cct} onChange={e => setFormData({ ...formData, cct: e.target.value })} className="admin-input" placeholder="e.g. 6500K" />
                                </div>
                                <div>
                                    <label className="admin-label">Lumen Output</label>
                                    <input value={formData.lumen} onChange={e => setFormData({ ...formData, lumen: e.target.value })} className="admin-input" placeholder="e.g. 1800" />
                                </div>
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-label">Description</label>
                                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} className="admin-textarea" placeholder="Product description..." />
                            </div>

                            <h4 style={{ margin: '16px 0 8px', fontSize: '14px', fontWeight: 600, color: '#475569', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Technical Specifications</h4>
                            <div className="admin-form-row-3">
                                <div>
                                    <label className="admin-label">Voltage</label>
                                    <input value={formData.specifications.voltage} onChange={e => setFormData({ ...formData, specifications: { ...formData.specifications, voltage: e.target.value } })} className="admin-input" placeholder="e.g. 220-240V AC" />
                                </div>
                                <div>
                                    <label className="admin-label">CRI</label>
                                    <input value={formData.specifications.cri} onChange={e => setFormData({ ...formData, specifications: { ...formData.specifications, cri: e.target.value } })} className="admin-input" placeholder="e.g. >80" />
                                </div>
                                <div>
                                    <label className="admin-label">Beam Angle</label>
                                    <input value={formData.specifications.beamAngle} onChange={e => setFormData({ ...formData, specifications: { ...formData.specifications, beamAngle: e.target.value } })} className="admin-input" placeholder="e.g. 120°" />
                                </div>
                            </div>
                            <div className="admin-form-row-3">
                                <div>
                                    <label className="admin-label">Efficacy (Lm/W)</label>
                                    <input value={formData.specifications.efficacy} onChange={e => setFormData({ ...formData, specifications: { ...formData.specifications, efficacy: e.target.value } })} className="admin-input" placeholder="e.g. 100 Lm/W" />
                                </div>
                                <div>
                                    <label className="admin-label">Power Factor</label>
                                    <input value={formData.specifications.powerFactor} onChange={e => setFormData({ ...formData, specifications: { ...formData.specifications, powerFactor: e.target.value } })} className="admin-input" placeholder="e.g. >0.9" />
                                </div>
                                <div>
                                    <label className="admin-label">IP Rating</label>
                                    <input value={formData.specifications.ipRating} onChange={e => setFormData({ ...formData, specifications: { ...formData.specifications, ipRating: e.target.value } })} className="admin-input" placeholder="e.g. IP20" />
                                </div>
                            </div>
                            <div className="admin-form-row-3">
                                <div>
                                    <label className="admin-label">Cut-out Size</label>
                                    <input value={formData.specifications.cutoutSize} onChange={e => setFormData({ ...formData, specifications: { ...formData.specifications, cutoutSize: e.target.value } })} className="admin-input" placeholder="e.g. 200mm" />
                                </div>
                                <div>
                                    <label className="admin-label">Dimensions</label>
                                    <input value={formData.specifications.dimensions} onChange={e => setFormData({ ...formData, specifications: { ...formData.specifications, dimensions: e.target.value } })} className="admin-input" placeholder="e.g. 240x240x12mm" />
                                </div>
                                <div>
                                    <label className="admin-label">Material</label>
                                    <input value={formData.specifications.material} onChange={e => setFormData({ ...formData, specifications: { ...formData.specifications, material: e.target.value } })} className="admin-input" placeholder="e.g. Aluminum + PMMA" />
                                </div>
                            </div>
                            <div className="admin-form-row-3">
                                <div>
                                    <label className="admin-label">Lifespan</label>
                                    <input value={formData.specifications.lifespan} onChange={e => setFormData({ ...formData, specifications: { ...formData.specifications, lifespan: e.target.value } })} className="admin-input" placeholder="e.g. 50,000 Hours" />
                                </div>
                                <div>
                                    <label className="admin-label">Warranty</label>
                                    <input value={formData.specifications.warranty} onChange={e => setFormData({ ...formData, specifications: { ...formData.specifications, warranty: e.target.value } })} className="admin-input" placeholder="e.g. 3 Years" />
                                </div>
                                <div>
                                    <label className="admin-label">Certifications</label>
                                    <input value={formData.specifications.certifications} onChange={e => setFormData({ ...formData, specifications: { ...formData.specifications, certifications: e.target.value } })} className="admin-input" placeholder="e.g. BIS, CE, RoHS" />
                                </div>
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-label">Features</label>
                                <div className="admin-feature-row">
                                    <input value={featureInput} onChange={e => setFeatureInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())} className="admin-input" placeholder="Add a feature..." />
                                    <button onClick={addFeature} type="button" className="admin-btn">Add</button>
                                </div>
                                <div className="admin-feature-tags">
                                    {formData.features.map((f, i) => (
                                        <span key={i} className="admin-feature-tag">
                                            {f} <button onClick={() => removeFeature(i)}>&times;</button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-label">Product Images</label>
                                <div className="admin-upload-zone" onClick={() => document.getElementById('image-upload').click()}>
                                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} id="image-upload" style={{ display: 'none' }} />
                                    <div className="admin-upload-icon">📷</div>
                                    <p className="admin-upload-text">{uploading ? 'Uploading...' : 'Click to upload images (multiple allowed)'}</p>
                                    <p className="admin-upload-hint">PNG, JPG up to 5MB each</p>
                                </div>
                                {formData.images.length > 0 && (
                                    <div className="admin-image-grid">
                                        {formData.images.map((img, i) => (
                                            <div key={i} className="admin-image-item">
                                                <img src={img} alt="" />
                                                <button onClick={() => removeImage(i)} className="admin-image-remove">&times;</button>
                                                {i === 0 && <span className="admin-image-main">Main</span>}
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                                {editingId ? 'Update Product' : 'Create Product'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
