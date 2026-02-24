import { useState, useEffect } from 'react';
import Header from '../components/Header';
import api from '../services/api';

const Enquiries = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);

    useEffect(() => {
        fetchEnquiries();
    }, [filter]);

    const fetchEnquiries = async () => {
        try {
            const params = filter ? `?status=${filter}` : '';
            const response = await api.get(`/enquiries${params}`);
            setEnquiries(response.data.enquiries || []);
        } catch (error) {
            console.error('Error fetching enquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/enquiries/${id}/status`, { status });
            fetchEnquiries();
            if (selectedEnquiry?._id === id) {
                setSelectedEnquiry({ ...selectedEnquiry, status });
            }
        } catch (error) {
            alert('Error updating status');
        }
    };

    const statusColors = {
        new: 'info',
        contacted: 'warning',
        negotiating: 'warning',
        converted: 'success',
        closed: 'error'
    };

    return (
        <>
            <Header title="Enquiries" />
            <div className="page-content">
                {/* Filters */}
                <div style={{ marginBottom: '24px', display: 'flex', gap: '8px' }}>
                    {['', 'new', 'contacted', 'negotiating', 'converted', 'closed'].map((status) => (
                        <button
                            key={status}
                            className={`btn ${filter === status ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                            onClick={() => setFilter(status)}
                        >
                            {status || 'All'}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: selectedEnquiry ? '1fr 400px' : '1fr', gap: '24px' }}>
                    {/* Enquiries List */}
                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title">All Enquiries ({enquiries.length})</h2>
                        </div>
                        <div className="card-body" style={{ padding: 0 }}>
                            {loading ? (
                                <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
                            ) : enquiries.length > 0 ? (
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Type</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {enquiries.map((enquiry) => (
                                            <tr
                                                key={enquiry._id}
                                                onClick={() => setSelectedEnquiry(enquiry)}
                                                style={{ cursor: 'pointer', background: selectedEnquiry?._id === enquiry._id ? '#F3F4F6' : '' }}
                                            >
                                                <td><strong>{enquiry.name}</strong></td>
                                                <td>{enquiry.email}</td>
                                                <td style={{ textTransform: 'capitalize' }}>{enquiry.enquiryType}</td>
                                                <td>
                                                    <span className={`badge badge-${statusColors[enquiry.status]}`}>
                                                        {enquiry.status}
                                                    </span>
                                                </td>
                                                <td>{new Date(enquiry.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
                                    No enquiries found.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Enquiry Detail */}
                    {selectedEnquiry && (
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Enquiry Details</h3>
                                <button
                                    onClick={() => setSelectedEnquiry(null)}
                                    style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
                                >
                                    ×
                                </button>
                            </div>
                            <div className="card-body">
                                <div style={{ marginBottom: '20px' }}>
                                    <h4 style={{ fontSize: '18px', marginBottom: '4px' }}>{selectedEnquiry.name}</h4>
                                    <p style={{ color: '#6B7280' }}>{selectedEnquiry.email}</p>
                                    {selectedEnquiry.phone && <p style={{ color: '#6B7280' }}>{selectedEnquiry.phone}</p>}
                                    {selectedEnquiry.company && <p style={{ color: '#6B7280' }}>{selectedEnquiry.company}</p>}
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ fontWeight: '600', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                                        Message
                                    </label>
                                    <p style={{ background: '#F9FAFB', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
                                        {selectedEnquiry.message}
                                    </p>
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ fontWeight: '600', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                                        Update Status
                                    </label>
                                    <select
                                        className="form-select"
                                        value={selectedEnquiry.status}
                                        onChange={(e) => updateStatus(selectedEnquiry._id, e.target.value)}
                                    >
                                        <option value="new">New</option>
                                        <option value="contacted">Contacted</option>
                                        <option value="negotiating">Negotiating</option>
                                        <option value="converted">Converted</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </div>

                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <a
                                        href={`mailto:${selectedEnquiry.email}`}
                                        className="btn btn-primary btn-sm"
                                    >
                                        Send Email
                                    </a>
                                    {selectedEnquiry.phone && (
                                        <a
                                            href={`tel:${selectedEnquiry.phone}`}
                                            className="btn btn-secondary btn-sm"
                                        >
                                            Call
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Enquiries;
