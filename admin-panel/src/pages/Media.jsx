import Header from '../components/Header';

const Media = () => {
    return (
        <>
            <Header title="Media Library" />
            <div className="page-content">
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Media Files</h2>
                        <button className="btn btn-primary">+ Upload Files</button>
                    </div>
                    <div className="card-body">
                        <div style={{
                            padding: '60px',
                            textAlign: 'center',
                            color: '#6B7280',
                            border: '2px dashed #E5E7EB',
                            borderRadius: '12px'
                        }}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 16px', display: 'block', color: '#9CA3AF' }}>
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <path d="M21 15l-5-5L5 21" />
                            </svg>
                            <p style={{ marginBottom: '8px', fontWeight: '500' }}>Drop files here or click to upload</p>
                            <p style={{ fontSize: '13px' }}>Supports: JPG, PNG, PDF up to 10MB</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Media;
