import { useState } from 'react';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('company');

    return (
        <>
            <Header title="Settings" />
            <div className="page-content">
                {/* Tabs */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '1px solid #E5E7EB', paddingBottom: '0' }}>
                    {['company', 'profile', 'users'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '12px 20px',
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: activeTab === tab ? '#0066CC' : '#6B7280',
                                borderBottom: activeTab === tab ? '2px solid #0066CC' : '2px solid transparent',
                                marginBottom: '-1px'
                            }}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Company Settings */}
                {activeTab === 'company' && (
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Company Information</h3>
                        </div>
                        <div className="card-body">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div className="form-group">
                                    <label className="form-label">Company Name</label>
                                    <input type="text" className="form-input" defaultValue="Dharmjivan Industries" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Brand Name</label>
                                    <input type="text" className="form-input" defaultValue="LICHTOR" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-input" defaultValue="info@lichtor.com" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone</label>
                                    <input type="tel" className="form-input" defaultValue="+91 98765 43210" />
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Address</label>
                                    <textarea className="form-textarea" rows={2} defaultValue="Industrial Area, Gujarat, India" />
                                </div>
                            </div>
                            <button className="btn btn-primary" style={{ marginTop: '16px' }}>Save Changes</button>
                        </div>
                    </div>
                )}

                {/* Profile Settings */}
                {activeTab === 'profile' && (
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Your Profile</h3>
                        </div>
                        <div className="card-body">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div className="form-group">
                                    <label className="form-label">Name</label>
                                    <input type="text" className="form-input" defaultValue={user?.name || ''} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-input" defaultValue={user?.email || ''} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Role</label>
                                    <input type="text" className="form-input" value={user?.role || ''} disabled style={{ background: '#F3F4F6' }} />
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid #E5E7EB', marginTop: '24px', paddingTop: '24px' }}>
                                <h4 style={{ marginBottom: '16px', fontWeight: '600' }}>Change Password</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                                    <div className="form-group">
                                        <label className="form-label">Current Password</label>
                                        <input type="password" className="form-input" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">New Password</label>
                                        <input type="password" className="form-input" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Confirm Password</label>
                                        <input type="password" className="form-input" />
                                    </div>
                                </div>
                            </div>

                            <button className="btn btn-primary" style={{ marginTop: '16px' }}>Update Profile</button>
                        </div>
                    </div>
                )}

                {/* Users Settings */}
                {activeTab === 'users' && (
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">User Management</h3>
                            <button className="btn btn-primary btn-sm">+ Add User</button>
                        </div>
                        <div className="card-body" style={{ padding: 0 }}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div className="user-avatar" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                                                    {user?.name?.charAt(0) || 'A'}
                                                </div>
                                                <strong>{user?.name || 'Admin'}</strong>
                                            </div>
                                        </td>
                                        <td>{user?.email || 'admin@lichtor.com'}</td>
                                        <td style={{ textTransform: 'capitalize' }}>{user?.role || 'admin'}</td>
                                        <td><span className="badge badge-success">Active</span></td>
                                        <td>
                                            <button className="btn btn-secondary btn-sm">Edit</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Settings;
