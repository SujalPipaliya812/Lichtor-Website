import { useAuth } from '../context/AuthContext';

const Header = ({ title }) => {
    const { user } = useAuth();

    return (
        <header className="top-header">
            <h1 className="page-title">{title}</h1>
            <div className="user-menu">
                <span style={{ fontSize: '14px', color: '#6B7280' }}>
                    Welcome, <strong>{user?.name}</strong>
                </span>
                <div className="user-avatar">
                    {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
            </div>
        </header>
    );
};

export default Header;
