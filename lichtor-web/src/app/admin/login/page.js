'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) { setError('Enter email and password'); return; }
        setError(''); setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim(), password }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Login failed');
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            router.push('/admin');
        } catch {
            setError('Connection failed. Is the server running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-card">
                <div className="admin-login-logo">
                    <img src="/Lichtor-01.png" alt="LICHTOR" />
                </div>

                <h1 className="admin-login-title">Welcome Back</h1>
                <p className="admin-login-subtitle">Sign in to LICHTOR Admin Panel</p>

                {error && (
                    <div className="admin-login-error">{error}</div>
                )}

                <div className="admin-login-form">
                    <div className="admin-login-field">
                        <label htmlFor="admin-email">Email Address</label>
                        <input
                            id="admin-email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleLogin()}
                            placeholder="admin@lichtor.com"
                        />
                    </div>
                    <div className="admin-login-field">
                        <label htmlFor="admin-password">Password</label>
                        <input
                            id="admin-password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleLogin()}
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="admin-login-btn"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </div>

                <p className="admin-login-hint">Default: admin@lichtor.com / admin123</p>
            </div>
        </div>
    );
}
