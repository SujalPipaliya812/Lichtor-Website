import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Settings = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('company');
    const [users, setUsers] = useState([]);
    const [showAddUser, setShowAddUser] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'editor' });

    useEffect(() => {
        if (activeTab === 'users' && user?.role === 'admin') {
            fetchUsers();
        }
    }, [activeTab, user]);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/auth/users');
            setUsers(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', newUser);
            setShowAddUser(false);
            setNewUser({ name: '', email: '', password: '', role: 'editor' });
            fetchUsers();
            alert('User successfully added!');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to add user');
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (!confirm(`Are you sure you want to permanently delete "${userName}"? This action cannot be undone.`)) return;
        try {
            await api.delete(`/auth/users/${userId}`);
            fetchUsers();
            alert('User deleted successfully');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete user');
        }
    };

    const handleToggleUser = async (userId) => {
        try {
            await api.patch(`/auth/users/${userId}/toggle`);
            fetchUsers();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update user status');
        }
    };

    return (
        <>
            <Header title="Settings" />
            <div className="page-content">
                {/* Tabs */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '1px solid var(--gray-200)', paddingBottom: '0' }}>
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
                                fontWeight: '600',
                                color: activeTab === tab ? 'var(--primary)' : 'var(--gray-500)',
                                borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
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
                        <div className="card-header" style={{ marginBottom: '20px' }}>
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
                        <div className="card-header" style={{ marginBottom: '20px' }}>
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

                            <div style={{ borderTop: '1px solid var(--gray-200)', marginTop: '24px', paddingTop: '24px' }}>
                                <h4 style={{ marginBottom: '16px', fontWeight: '600', color: 'var(--gray-800)' }}>Change Password</h4>
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
                        <div className="card-header" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 className="card-title">User Management</h3>
                            <button className="btn btn-primary btn-sm" onClick={() => setShowAddUser(true)}>+ Add User</button>
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
                                    {users.length > 0 ? users.map(u => {
                                        const isSelf = user?._id === u._id;
                                        return (
                                        <tr key={u._id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div className="user-avatar" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                                                        {u.name?.charAt(0).toUpperCase() || 'A'}
                                                    </div>
                                                    <strong style={{ color: 'var(--gray-900)' }}>{u.name}{isSelf ? ' (You)' : ''}</strong>
                                                </div>
                                            </td>
                                            <td>{u.email}</td>
                                            <td style={{ textTransform: 'capitalize' }}>{u.role}</td>
                                            <td>
                                                <span style={{
                                                    background: u.isActive !== false ? '#d1fae5' : '#fee2e2',
                                                    color: u.isActive !== false ? '#065f46' : '#991b1b',
                                                    padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600'
                                                }}>
                                                    {u.isActive !== false ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    {!isSelf && (
                                                        <>
                                                            <button
                                                                className="btn btn-secondary btn-sm"
                                                                onClick={() => handleToggleUser(u._id)}
                                                                title={u.isActive !== false ? 'Deactivate user' : 'Activate user'}
                                                            >
                                                                {u.isActive !== false ? 'Deactivate' : 'Activate'}
                                                            </button>
                                                            <button
                                                                className="btn btn-sm"
                                                                onClick={() => handleDeleteUser(u._id, u.name)}
                                                                style={{ background: '#fee2e2', color: '#991b1b', border: 'none', cursor: 'pointer' }}
                                                            >
                                                                Delete
                                                            </button>
                                                        </>
                                                    )}
                                                    {isSelf && <span style={{ color: 'var(--gray-400)', fontSize: '12px' }}>—</span>}
                                                </div>
                                            </td>
                                        </tr>
                                        );
                                    }) : (
                                        <tr>
                                            <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--gray-400)' }}>
                                                No users found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Add User Modal */}
            {showAddUser && (
                <div className="modal-overlay" onClick={() => setShowAddUser(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Add New User</h3>
                            <button className="btn-close" onClick={() => setShowAddUser(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleAddUser}>
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input type="text" className="form-input" required value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-input" required value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Password</label>
                                    <input type="password" className="form-input" required value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Role</label>
                                    <select className="form-select form-input" required value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                                        <option value="admin">Admin</option>
                                        <option value="editor">Editor</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddUser(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Add User</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Settings;
