'use client';

export default function ProductOptions({ watt, colors, types }) {
    const getColorCode = (c) => {
        if (!c) return '#e5e7eb';
        switch(c.trim().toLowerCase()) {
            case 'cool white': return '#f0f4ff';
            case 'natural white': return '#fef9ef';
            case 'warm white': return '#fde68a';
            case '3-color change': return 'linear-gradient(135deg, #f0f4ff 33%, #fef9ef 66%, #fde68a 100%)';
            case 'red': return '#ef4444';
            case 'blue': return '#3b82f6';
            case 'green': return '#22c55e';
            case 'pink': return '#ec4899';
            case 'amber': return '#f59e0b';
            case 'ice blue': return '#67e8f9';
            case 'rgb': return 'linear-gradient(135deg, #ef4444, #22c55e, #3b82f6)';
            case 'white': return '#ffffff';
            case 'black': return '#222222';
            case 'copper': return '#b87333';
            case 'grey': return '#9ca3af';
            default: return '#e5e7eb';
        }
    };

    return (
        <>
            {/* Quick Spec Pills */}
            {watt && (
                <div className="product-quick-specs" style={{ marginBottom: '20px' }}>
                    <div 
                        className="quick-spec"
                        style={{ 
                            transition: 'all 0.2s ease', 
                            border: '1.5px solid transparent'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = '#93c5fd';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = 'transparent';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <span className="quick-spec-label">Wattage</span>
                        <span className="quick-spec-value">{watt}W</span>
                    </div>
                </div>
            )}

            {/* Color Variants Panel */}
            {colors?.length > 0 && (
                <div style={{ marginTop: '24px', marginBottom: '24px' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                        Color Options
                    </p>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        {colors.map((color, i) => (
                            <div 
                                key={i} 
                                title={color}
                                style={{
                                    width: '36px', 
                                    height: '36px',
                                    borderRadius: '50%',
                                    background: getColorCode(color),
                                    border: '1px solid #e5e7eb',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    transform: 'scale(1)'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.borderColor = '#3b82f6';
                                    e.currentTarget.style.transform = 'scale(1.15)';
                                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.2)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Types / Variants */}
            {types?.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                        Available Types
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {types.map((t, i) => (
                            <div 
                                key={i} 
                                style={{
                                    border: '1.5px solid #e5e7eb',
                                    borderRadius: '10px',
                                    padding: '10px 16px',
                                    background: '#f9fafb',
                                    minWidth: '110px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.borderColor = '#3b82f6';
                                    e.currentTarget.style.background = '#eff6ff';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(59, 130, 246, 0.1)';
                                    e.currentTarget.querySelector('.type-name').style.color = '#1d4ed8';
                                    e.currentTarget.querySelectorAll('.type-watt').forEach(w => {
                                        w.style.background = '#bfdbfe';
                                    });
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                    e.currentTarget.style.background = '#f9fafb';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.querySelector('.type-name').style.color = '#1f2937';
                                    e.currentTarget.querySelectorAll('.type-watt').forEach(w => {
                                        w.style.background = '#dbeafe';
                                    });
                                }}
                            >
                                <div className="type-name" style={{ fontWeight: 700, fontSize: '14px', color: '#1f2937', marginBottom: '4px', transition: 'color 0.2s' }}>{t.name}</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                    {t.wattages?.map((w, j) => (
                                        <span className="type-watt" key={j} style={{
                                            background: '#dbeafe',
                                            color: '#1d4ed8',
                                            borderRadius: '20px',
                                            padding: '2px 8px',
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            transition: 'background 0.2s'
                                        }}>{w}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
