import { useState, useEffect } from 'react';
import api from '../services/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const emptyWattRow = () => ({ watt: '', lumen: '', cct: '', current: '' });
const emptyType = () => ({ name: '', bodyColors: [''] });

const defaultForm = () => ({
    name: '', category: '',
    watt: '',
    bodyColors: [''],
    wattTable: [emptyWattRow()],
    types: [emptyType()],
    features: [''],
    isActive: true,
    image: '', gallery: [],
    datasheet: '',
    similarProducts: []
});

export default function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState(defaultForm());
    const [editingId, setEditingId] = useState(null);
    const [uploading, setUploading] = useState({});
    const [activeTab, setActiveTab] = useState('basic');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [sortBy, setSortBy] = useState('latest');


    useEffect(() => { fetchData(); }, [searchQuery, filterCategory, filterStatus, sortBy]);

    const fetchData = async () => {
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append('search', searchQuery);
            if (filterCategory) params.append('category', filterCategory);
            if (filterStatus) params.append('status', filterStatus);
            if (sortBy !== 'latest') params.append('sort', sortBy);
            params.append('limit', '100');

            const [prodRes, catRes] = await Promise.all([
                api.get(`/products?${params.toString()}`),
                api.get('/categories')
            ]);
            setProducts(prodRes.data.products || []);
            setCategories(catRes.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // ── File uploads ──
    const handleFileChange = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;
        const fd = new FormData();
        fd.append('file', file);
        fd.append('folder', 'products');
        
        // Auto-naming: Use product name as public ID
        if (formData.name) {
            const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            fd.append('customPublicId', `products/${slug}`);
        }

        setUploading(prev => ({ ...prev, [field]: true }));
        try {
            const res = await api.post('/media/upload', fd, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData(prev => ({ ...prev, [field]: res.data.url }));
        } catch {
            alert('Upload failed');
        } finally {
            setUploading(prev => ({ ...prev, [field]: false }));
        }
    };

    const handleGalleryUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        setUploading(prev => ({ ...prev, gallery: true }));
        try {
            const urls = [];
            const slug = formData.name ? formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : '';
            
            for (const [idx, file] of files.entries()) {
                const fd = new FormData();
                fd.append('file', file);
                fd.append('folder', 'products');
                if (slug) {
                    fd.append('customPublicId', `products/${slug}-gallery-${Date.now()}-${idx}`);
                }

                const res = await api.post('/media/upload', fd, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                urls.push(res.data.url);
            }
            
            setFormData(prev => {
                const newState = { ...prev, gallery: [...prev.gallery, ...urls] };
                // Automation: If main image is empty, set it to the first uploaded gallery image
                if (!newState.image && urls.length > 0) {
                    newState.image = urls[0];
                    console.log('Automatically set thumbnail from gallery upload');
                }
                return newState;
            });
        } catch {
            alert('Gallery upload failed');
        } finally {
            setUploading(prev => ({ ...prev, gallery: false }));
        }
    };

    const removeGalleryImage = (idx) => {
        setFormData(prev => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== idx) }));
    };

    // ── Array field helpers ──
    const updateArrayField = (field, idx, val) => {
        const arr = [...formData[field]];
        arr[idx] = val;
        setFormData(prev => ({ ...prev, [field]: arr }));
    };
    const addArrayField = (field) => setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
    const removeArrayField = (field, idx) => {
        const arr = formData[field].filter((_, i) => i !== idx);
        setFormData(prev => ({ ...prev, [field]: arr.length ? arr : [''] }));
    };

    // ── Watt Table helpers ──
    const updateWattRow = (idx, field, val) => {
        const rows = formData.wattTable.map((r, i) => i === idx ? { ...r, [field]: val } : r);
        setFormData(prev => ({ ...prev, wattTable: rows }));
    };
    const addWattRow = () => setFormData(prev => ({ ...prev, wattTable: [...prev.wattTable, emptyWattRow()] }));
    const removeWattRow = (idx) => {
        const rows = formData.wattTable.filter((_, i) => i !== idx);
        setFormData(prev => ({ ...prev, wattTable: rows.length ? rows : [emptyWattRow()] }));
    };

    // ── Types helpers ──
    const addType = () => setFormData(prev => ({ ...prev, types: [...prev.types, emptyType()] }));
    const removeType = (idx) => {
        const t = formData.types.filter((_, i) => i !== idx);
        setFormData(prev => ({ ...prev, types: t.length ? t : [emptyType()] }));
    };
    const updateTypeName = (idx, val) => {
        const t = formData.types.map((tp, i) => i === idx ? { ...tp, name: val } : tp);
        setFormData(prev => ({ ...prev, types: t }));
    };
    const addColorToType = (idx) => {
        const t = formData.types.map((tp, i) => i === idx ? { ...tp, bodyColors: [...(tp.bodyColors || []), ''] } : tp);
        setFormData(prev => ({ ...prev, types: t }));
    };
    const removeColorFromType = (typeIdx, cIdx) => {
        const t = formData.types.map((tp, i) => {
            if (i !== typeIdx) return tp;
            const c = (tp.bodyColors || []).filter((_, j) => j !== cIdx);
            return { ...tp, bodyColors: c.length ? c : [''] };
        });
        setFormData(prev => ({ ...prev, types: t }));
    };
    const updateColorInType = (typeIdx, cIdx, val) => {
        const t = formData.types.map((tp, i) => {
            if (i !== typeIdx) return tp;
            const c = (tp.bodyColors || ['']).map((cv, j) => j === cIdx ? val : cv);
            return { ...tp, bodyColors: c };
        });
        setFormData(prev => ({ ...prev, types: t }));
    };

    // ── Similar Products toggle (max 4) ──
    const toggleSimilarProduct = (productId) => {
        setFormData(prev => {
            if (prev.similarProducts.includes(productId)) {
                return { ...prev, similarProducts: prev.similarProducts.filter(id => id !== productId) };
            }
            if (prev.similarProducts.length >= 4) {
                alert('Maximum 4 similar products allowed');
                return prev;
            }
            return { ...prev, similarProducts: [...prev.similarProducts, productId] };
        });
    };

    // ── Submit ──
    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            features: formData.features.filter(f => f.trim()),
            bodyColors: formData.bodyColors.filter(c => c.trim()),
            wattTable: formData.wattTable.filter(r => r.watt || r.lumen || r.cct),
            types: formData.types.filter(t => t.name.trim()).map(t => ({
                name: t.name, bodyColors: (t.bodyColors || []).filter(c => c.trim())
            })),
        };
        try {
            if (editingId) {
                await api.put(`/products/${editingId}`, payload);
            } else {
                await api.post('/products', payload);
            }
            fetchData();
            setShowModal(false);
            resetForm();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product');
        }
    };

    const resetForm = () => { setFormData(defaultForm()); setEditingId(null); setActiveTab('basic'); };

    const handleEdit = (product) => {
        setFormData({
            name: product.name || '',
            category: product.category?._id || product.category || '',
            watt: product.watt || '',
            bodyColors: product.bodyColors?.length ? product.bodyColors : [''],
            wattTable: product.wattTable?.length ? product.wattTable : [emptyWattRow()],
            types: product.types?.length ? product.types : [emptyType()],
            features: product.features?.length ? product.features : [''],
            isActive: product.isActive,
            image: product.image || '',
            gallery: product.gallery || [],
            datasheet: product.datasheet || '',
            similarProducts: product.similarProducts?.map(p => typeof p === 'object' ? p._id : p) || []
        });
        setEditingId(product._id);
        setActiveTab('basic');
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}`);
                fetchData();
            } catch { alert('Failed to delete product'); }
        }
    };

    const handleDuplicate = async (id) => {
        try {
            await api.post(`/products/${id}/duplicate`, {});
            fetchData();
        } catch { alert('Failed to duplicate product'); }
    };

    const handleToggleStatus = async (id) => {
        try {
            await api.patch(`/products/${id}/status`, {});
            fetchData();
        } catch { alert('Failed to toggle status'); }
    };

    // ── Tabs config ──
    const tabs = [
        { id: 'basic', label: 'Basic Info' },
        { id: 'technical', label: 'Technical' },
        { id: 'types', label: 'Types' },
        { id: 'images', label: 'Images' },
        { id: 'features', label: 'Features' },
        { id: 'similar', label: 'Similar Products' },
    ];

    const imgSrc = (url) => {
        if (!url) return '';
        // If it's a local asset from the main web project, point to the live site
        if (url.startsWith('/assets')) {
            return `https://lichtor.co.in${url}`;
        }
        return url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
    };

    // ── RENDER ──
    return (
        <div className="page-container">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Products</h1>
                    <p className="text-gray">Manage your LED lighting products</p>
                </div>
                <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
                    + Add Product
                </button>
            </div>

            {/* Search / Filter Bar */}
            <div className="card" style={{ marginBottom: '20px', padding: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                    type="text"
                    className="form-input"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ flex: '1 1 200px', minWidth: '200px' }}
                />
                <select className="form-input" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{ width: '180px' }}>
                    <option value="">All Categories</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
                <select className="form-input" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ width: '140px' }}>
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
                <select className="form-input" value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ width: '140px' }}>
                    <option value="latest">Latest</option>
                    <option value="name">Name</option>
                    <option value="category">Category</option>
                </select>
            </div>

            {/* Products Table */}
            <div className="card">
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ width: '50px' }}>Image</th>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Wattage</th>
                                <th>Status</th>
                                <th style={{ width: '200px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center">Loading...</td></tr>
                            ) : products.length === 0 ? (
                                <tr><td colSpan="6" className="text-center">No products found</td></tr>
                            ) : (
                                products.map(product => (
                                    <tr key={product._id}>
                                        <td>
                                            {product.image ? (
                                                <img src={imgSrc(product.image)} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
                                            ) : (
                                                <div style={{ width: '40px', height: '40px', background: '#f3f4f6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>📦</div>
                                            )}
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{product.name}</div>
                                            <div style={{ fontSize: '12px', color: '#6b7280' }}>/{product.slug}</div>
                                        </td>
                                        <td>{product.category?.name || '—'}</td>
                                        <td style={{ color: '#6b7280', fontSize: '13px' }}>{product.watt || '—'}</td>
                                        <td>
                                            <span
                                                className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}
                                                onClick={() => handleToggleStatus(product._id)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {product.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                <button className="btn-icon" onClick={() => handleEdit(product)} title="Edit">✏️</button>
                                                <button className="btn-icon" onClick={() => handleDuplicate(product._id)} title="Duplicate">📋</button>
                                                <button className="btn-icon" onClick={() => window.open(`${import.meta.env.VITE_WEB_URL || 'http://localhost:3000'}/products/${product.slug}`, '_blank')} title="Preview">👁️</button>
                                                <button className="btn-icon delete" onClick={() => handleDelete(product._id)} title="Delete">🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Product Form Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                        <div className="modal-header">
                            <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
                            <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
                        </div>

                        {/* Tabs */}
                        <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid #e5e7eb', padding: '0 20px', overflowX: 'auto', flexShrink: 0 }}>
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        padding: '10px 16px',
                                        border: 'none',
                                        borderBottom: activeTab === tab.id ? '2px solid #4f46e5' : '2px solid transparent',
                                        background: 'none',
                                        color: activeTab === tab.id ? '#4f46e5' : '#6b7280',
                                        fontWeight: activeTab === tab.id ? 600 : 400,
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} style={{ flex: 1, overflow: 'auto' }}>
                            <div className="modal-body" style={{ padding: '20px' }}>

                                {/* ═══ BASIC INFO TAB ═══ */}
                                {activeTab === 'basic' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div className="form-group">
                                            <label className="form-label">Product Name *</label>
                                            <input type="text" className="form-input" value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Category *</label>
                                            <select className="form-input" value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })} required>
                                                <option value="">Select Category</option>
                                                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Status</label>
                                            <select className="form-input" value={formData.isActive ? 'true' : 'false'}
                                                onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}>
                                                <option value="true">Active</option>
                                                <option value="false">Inactive</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {/* ═══ TECHNICAL TAB ═══ */}
                                {activeTab === 'technical' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div className="form-group">
                                            <label className="form-label">Wattage</label>
                                            <input type="text" className="form-input" value={formData.watt}
                                                onChange={(e) => setFormData({ ...formData, watt: e.target.value })} placeholder="e.g. 12W" />
                                        </div>

                                        {/* Body Colors */}
                                        <div className="form-group">
                                            <label className="form-label">Body Colors (shown as color circles on website)</label>
                                            {formData.bodyColors.map((color, i) => (
                                                <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                                                    <input type="text" className="form-input" value={color}
                                                        onChange={(e) => updateArrayField('bodyColors', i, e.target.value)}
                                                        placeholder="e.g. Cool White, Warm White, Black" />
                                                    <button type="button" className="btn-icon delete" onClick={() => removeArrayField('bodyColors', i)}>✕</button>
                                                </div>
                                            ))}
                                            <button type="button" className="btn btn-secondary" style={{ fontSize: '12px' }}
                                                onClick={() => addArrayField('bodyColors')}>+ Add Color</button>
                                        </div>

                                        {/* Watt Table */}
                                        <div className="form-group">
                                            <label className="form-label">Watt / Lumen Table</label>
                                            {formData.wattTable.map((row, i) => (
                                                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '8px', marginBottom: '6px' }}>
                                                    <input type="text" className="form-input" placeholder="Watt" value={row.watt} onChange={(e) => updateWattRow(i, 'watt', e.target.value)} />
                                                    <input type="text" className="form-input" placeholder="Lumen" value={row.lumen} onChange={(e) => updateWattRow(i, 'lumen', e.target.value)} />
                                                    <input type="text" className="form-input" placeholder="CCT" value={row.cct} onChange={(e) => updateWattRow(i, 'cct', e.target.value)} />
                                                    <input type="text" className="form-input" placeholder="Current" value={row.current} onChange={(e) => updateWattRow(i, 'current', e.target.value)} />
                                                    <button type="button" className="btn-icon delete" onClick={() => removeWattRow(i)}>✕</button>
                                                </div>
                                            ))}
                                            <button type="button" className="btn btn-secondary" style={{ fontSize: '12px' }} onClick={addWattRow}>+ Add Row</button>
                                        </div>
                                    </div>
                                )}

                                {/* ═══ TYPES TAB ═══ */}
                                {activeTab === 'types' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <label className="form-label">Available Types / Variants</label>
                                        {formData.types.map((tp, i) => (
                                            <div key={i} style={{ background: '#f9fafb', borderRadius: '10px', padding: '16px', border: '1px solid #e5e7eb' }}>
                                                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                                                    <input type="text" className="form-input" placeholder="Type Name (e.g. Round, Square)" value={tp.name}
                                                        onChange={(e) => updateTypeName(i, e.target.value)} />
                                                    <button type="button" className="btn-icon delete" onClick={() => removeType(i)}>✕</button>
                                                </div>
                                                <label className="form-label" style={{ fontSize: '12px' }}>Body Colors for this type:</label>
                                                {(tp.bodyColors || ['']).map((c, j) => (
                                                    <div key={j} style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                                                        <input type="text" className="form-input" placeholder="e.g. Warm White" value={c}
                                                            onChange={(e) => updateColorInType(i, j, e.target.value)} style={{ maxWidth: '200px' }} />
                                                        <button type="button" className="btn-icon delete" onClick={() => removeColorFromType(i, j)}>✕</button>
                                                    </div>
                                                ))}
                                                <button type="button" className="btn btn-secondary" style={{ fontSize: '11px', marginTop: '6px' }}
                                                    onClick={() => addColorToType(i)}>+ Add Color</button>
                                            </div>
                                        ))}
                                        <button type="button" className="btn btn-secondary" onClick={addType}>+ Add Type</button>
                                    </div>
                                )}

                                {/* ═══ IMAGES TAB ═══ */}
                                {activeTab === 'images' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        {/* Thumbnail */}
                                        <div className="form-group">
                                            <label className="form-label">Thumbnail Image</label>
                                            <input type="file" className="form-input" onChange={(e) => handleFileChange(e, 'image')} accept="image/*" />
                                            {uploading.image && <span style={{ color: '#6b7280', fontSize: '12px' }}>Uploading...</span>}
                                            {formData.image && (
                                                <div style={{ marginTop: '10px' }}>
                                                    <img src={imgSrc(formData.image)} alt="Thumbnail" style={{ height: '80px', borderRadius: '8px', objectFit: 'cover' }} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Gallery */}
                                        <div className="form-group">
                                            <label className="form-label">Gallery Images</label>
                                            <div style={{
                                                border: '2px dashed #d1d5db', borderRadius: '12px', padding: '24px',
                                                textAlign: 'center', cursor: 'pointer', background: '#fafafa',
                                                transition: 'border-color 0.2s'
                                            }}
                                                onClick={() => document.getElementById('gallery-upload').click()}
                                                onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#4f46e5'; }}
                                                onDragLeave={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; }}
                                                onDrop={(e) => {
                                                    e.preventDefault();
                                                    e.currentTarget.style.borderColor = '#d1d5db';
                                                    const input = document.getElementById('gallery-upload');
                                                    input.files = e.dataTransfer.files;
                                                    handleGalleryUpload({ target: input });
                                                }}
                                            >
                                                <p style={{ color: '#6b7280', margin: 0 }}>📷 Click or drag images here to upload</p>
                                            </div>
                                            <input id="gallery-upload" type="file" multiple accept="image/*" style={{ display: 'none' }}
                                                onChange={handleGalleryUpload} />
                                            {uploading.gallery && <span style={{ color: '#6b7280', fontSize: '12px' }}>Uploading...</span>}

                                            {formData.gallery.length > 0 && (
                                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
                                                    {formData.gallery.map((url, i) => (
                                                        <div key={i} style={{ position: 'relative' }}>
                                                            <img src={imgSrc(url)} alt={`Gallery ${i}`} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                                                            <button type="button" onClick={() => removeGalleryImage(i)}
                                                                style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '11px', lineHeight: '18px' }}>✕</button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Datasheet */}
                                        <div className="form-group">
                                            <label className="form-label">Datasheet PDF</label>
                                            <input type="file" className="form-input" onChange={(e) => handleFileChange(e, 'datasheet')} accept=".pdf" />
                                            {formData.datasheet && <a href={imgSrc(formData.datasheet)} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#4f46e5' }}>📄 View Datasheet</a>}
                                        </div>
                                    </div>
                                )}

                                {/* ═══ FEATURES TAB ═══ */}
                                {activeTab === 'features' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <label className="form-label">Product Features (Bullet Points)</label>
                                        {formData.features.map((f, i) => (
                                            <div key={i} style={{ display: 'flex', gap: '8px' }}>
                                                <span style={{ color: '#22c55e', fontWeight: 600, marginTop: '10px' }}>✓</span>
                                                <input type="text" className="form-input" value={f}
                                                    onChange={(e) => updateArrayField('features', i, e.target.value)}
                                                    placeholder="e.g. Energy efficient design" />
                                                <button type="button" className="btn-icon delete" onClick={() => removeArrayField('features', i)}>✕</button>
                                            </div>
                                        ))}
                                        <button type="button" className="btn btn-secondary" onClick={() => addArrayField('features')}>+ Add Feature</button>
                                    </div>
                                )}

                                {/* ═══ SIMILAR PRODUCTS TAB ═══ */}
                                {activeTab === 'similar' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <label className="form-label">Select Similar Products</label>
                                        <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '-8px' }}>Choose products to show in the "Similar Products" section on the product detail page</p>
                                        <div style={{ maxHeight: '400px', overflow: 'auto', border: '1px solid #e5e7eb', borderRadius: '10px' }}>
                                            {products.filter(p => p._id !== editingId).map(p => {
                                                const isSelected = formData.similarProducts.includes(p._id);
                                                return (
                                                    <div key={p._id}
                                                        onClick={() => toggleSimilarProduct(p._id)}
                                                        style={{
                                                            display: 'flex', alignItems: 'center', gap: '12px',
                                                            padding: '10px 14px', cursor: 'pointer',
                                                            borderBottom: '1px solid #f3f4f6',
                                                            background: isSelected ? '#eff6ff' : '#fff',
                                                            transition: 'background 0.15s'
                                                        }}
                                                    >
                                                        <input type="checkbox" checked={isSelected} readOnly style={{ accentColor: '#4f46e5' }} />
                                                        {p.image ? (
                                                            <img src={imgSrc(p.image)} alt="" style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '6px' }} />
                                                        ) : (
                                                            <div style={{ width: '36px', height: '36px', background: '#f3f4f6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📦</div>
                                                        )}
                                                        <div>
                                                            <div style={{ fontWeight: 500, fontSize: '14px', color: '#111827' }}>{p.name}</div>
                                                            <div style={{ fontSize: '12px', color: '#6b7280' }}>{p.category?.name || ''}</div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#374151', fontWeight: 500 }}>
                                            {formData.similarProducts.length} product(s) selected
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="modal-footer" style={{ borderTop: '1px solid #e5e7eb', padding: '16px 20px', display: 'flex', justifyContent: 'space-between' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">
                                    {editingId ? 'Save Changes' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
