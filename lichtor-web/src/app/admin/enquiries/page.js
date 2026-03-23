'use client';
import { useState, useEffect } from 'react';

const statusColors = {
    new: '#e53e3e',
    read: '#3182ce',
    replied: '#38a169',
    closed: '#718096',
};

const statusLabels = {
    new: 'New',
    read: 'Read',
    replied: 'Replied',
    closed: 'Closed',
};

export default function AdminEnquiriesPage() {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [filter, setFilter] = useState('all');

    const fetchEnquiries = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/enquiries', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setEnquiries(data.enquiries || []);
        } catch { }
        setLoading(false);
    };

    useEffect(() => { fetchEnquiries(); }, []);

    const updateStatus = async (id, status) => {
        const token = localStorage.getItem('token');
        await fetch(`/api/enquiries/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ status }),
        });
        fetchEnquiries();
    };

    const deleteEnquiry = async (id) => {
        if (!confirm('Delete this enquiry?')) return;
        const token = localStorage.getItem('token');
        await fetch(`/api/enquiries/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        setSelected(null);
        fetchEnquiries();
    };

    const filtered = filter === 'all' ? enquiries : enquiries.filter(e => e.status === filter);
    const newCount = enquiries.filter(e => e.status === 'new').length;

    return (
        <div>
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Enquiries</h1>
                    <p className="admin-page-subtitle">{enquiries.length} total enquiries {newCount > 0 && `• ${newCount} new`}</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                {['all', 'new', 'read', 'replied', 'closed'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            background: filter === f ? '#0066cc' : '#f1f5f9',
                            color: filter === f ? 'white' : '#64748b',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '13px',
                            textTransform: 'capitalize',
                        }}
                    >
                        {f === 'all' ? 'All' : statusLabels[f]}
                        {f === 'new' && newCount > 0 && (
                            <span style={{
                                background: filter === f ? 'rgba(255,255,255,0.3)' : '#e53e3e',
                                color: 'white',
                                borderRadius: '10px',
                                padding: '2px 8px',
                                fontSize: '11px',
                                marginLeft: '6px',
                            }}>{newCount}</span>
                        )}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>Loading...</div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📬</div>
                    <p>No enquiries {filter !== 'all' ? `with status "${filter}"` : 'yet'}</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '24px' }}>
                    {/* Enquiry List */}
                    <div>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Inquiry Type</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(enq => (
                                    <tr key={enq._id}
                                        onClick={() => {
                                            setSelected(enq);
                                            if (enq.status === 'new') updateStatus(enq._id, 'read');
                                        }}
                                        style={{
                                            cursor: 'pointer',
                                            background: selected?._id === enq._id ? '#f0f7ff' : enq.status === 'new' ? '#fffbeb' : 'white',
                                            fontWeight: enq.status === 'new' ? 600 : 400,
                                        }}
                                    >
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{enq.name}</div>
                                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>{enq.email}</div>
                                        </td>
                                        <td><span style={{ fontSize: '13px' }}>{enq.inquiryType}</span></td>
                                        <td>
                                            <span style={{
                                                padding: '4px 10px',
                                                borderRadius: '12px',
                                                fontSize: '11px',
                                                fontWeight: 600,
                                                color: 'white',
                                                background: statusColors[enq.status] || '#718096',
                                            }}>
                                                {statusLabels[enq.status] || enq.status}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '13px', color: '#64748b' }}>
                                            {new Date(enq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                        </td>
                                        <td>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); deleteEnquiry(enq._id); }}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e53e3e', fontSize: '16px' }}
                                                title="Delete"
                                            >🗑</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Detail Panel */}
                    {selected && (
                        <div style={{
                            background: 'white',
                            borderRadius: '16px',
                            border: '1px solid #e2e8f0',
                            padding: '24px',
                            position: 'sticky',
                            top: '100px',
                            alignSelf: 'start',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ margin: 0 }}>Enquiry Details</h3>
                                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>✕</button>
                            </div>

                            <div style={{ display: 'grid', gap: '16px' }}>
                                <div>
                                    <label style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Name</label>
                                    <p style={{ margin: '4px 0', fontWeight: 600 }}>{selected.name}</p>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone</label>
                                        <p style={{ margin: '4px 0' }}><a href={`tel:${selected.phone}`} style={{ color: '#0066cc' }}>{selected.phone}</a></p>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</label>
                                        <p style={{ margin: '4px 0' }}><a href={`mailto:${selected.email}`} style={{ color: '#0066cc' }}>{selected.email}</a></p>
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Inquiry Type</label>
                                    <p style={{ margin: '4px 0' }}>{selected.inquiryType}</p>
                                </div>
                                <div>
                                    <label style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Message</label>
                                    <p style={{ margin: '4px 0', lineHeight: 1.6, color: '#334155' }}>{selected.message || '—'}</p>
                                </div>
                                <div>
                                    <label style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Received</label>
                                    <p style={{ margin: '4px 0', fontSize: '14px' }}>{new Date(selected.createdAt).toLocaleString('en-IN')}</p>
                                </div>

                                {/* Status Actions */}
                                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                                    <label style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'block' }}>Update Status</label>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {['new', 'read', 'replied', 'closed'].map(s => (
                                            <button
                                                key={s}
                                                onClick={() => updateStatus(selected._id, s)}
                                                style={{
                                                    padding: '6px 14px',
                                                    borderRadius: '8px',
                                                    border: selected.status === s ? `2px solid ${statusColors[s]}` : '1px solid #e2e8f0',
                                                    background: selected.status === s ? statusColors[s] : 'white',
                                                    color: selected.status === s ? 'white' : '#64748b',
                                                    cursor: 'pointer',
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                    textTransform: 'capitalize',
                                                }}
                                            >
                                                {statusLabels[s]}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => deleteEnquiry(selected._id)}
                                    style={{
                                        padding: '10px',
                                        borderRadius: '8px',
                                        border: '1px solid #fed7d7',
                                        background: '#fff5f5',
                                        color: '#e53e3e',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        fontSize: '13px',
                                    }}
                                >
                                    Delete Enquiry
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
