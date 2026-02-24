import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <div className="admin-layout">
            <Sidebar />
            <main className="admin-content">
                <header className="admin-header">
                    <h1>LICHTOR Admin</h1>
                    <div className="header-user">
                        <div className="user-avatar">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <span>{user.name || 'Admin'}</span>
                    </div>
                </header>
                <Outlet />
            </main>
        </div>
    );
}
