'use client';
import { useState } from 'react';

export default function ProductGallery({ images, name }) {
    const [activeIdx, setActiveIdx] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="product-gallery">
                <div className="product-main-image" style={{ width: '100%', aspectRatio: '1/1', background: '#f8fafc', borderRadius: '12px' }}>
                    <div style={{ fontSize: '5rem', opacity: 0.2, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>💡</div>
                </div>
            </div>
        );
    }

    // Try to ensure we have exactly 4 images for the layout by repeating the first one if we have fewer
    const displayImages = [...images];
    while(displayImages.length < 4) {
        displayImages.push(images[0]);
    }

    return (
        <div className="product-gallery" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            {/* Left Thumbnails Column */}
            <div className="product-thumbnails" style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '80px', flexShrink: 0 }}>
                {displayImages.map((img, i) => (
                    <div
                        key={i}
                        className={`product-thumb ${i === activeIdx ? 'active' : ''}`}
                        onClick={() => setActiveIdx(i)}
                        style={{
                            width: '80px',
                            height: '80px',
                            border: i === activeIdx ? '2px solid #3b82f6' : '1.5px solid #e5e7eb',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            padding: '4px',
                            background: '#fff',
                            opacity: i === activeIdx ? 1 : 0.6,
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onMouseOver={(e) => { 
                            e.currentTarget.style.opacity = 1; 
                            if (i !== activeIdx) e.currentTarget.style.borderColor = '#bfdbfe';
                        }}
                        onMouseOut={(e) => { 
                            if (i !== activeIdx) {
                                e.currentTarget.style.opacity = 0.6; 
                                e.currentTarget.style.borderColor = '#e5e7eb';
                            }
                        }}
                    >
                        <img 
                            src={img} 
                            alt={`${name} thumbnail ${i + 1}`} 
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                    </div>
                ))}
            </div>

            {/* Main Image */}
            <div 
                className="product-main-image"
                style={{ 
                    flex: 1, 
                    position: 'relative', 
                    borderRadius: '12px', 
                    overflow: 'hidden',
                    background: '#f8fafc',
                    border: '1px solid #e5e7eb',
                    aspectRatio: '1/1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'border-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            >
                <img 
                    src={displayImages[activeIdx]} 
                    alt={name} 
                    style={{ 
                        maxWidth: '100%', 
                        maxHeight: '100%', 
                        objectFit: 'contain',
                        mixBlendMode: 'darken'
                    }} 
                />
            </div>
        </div>
    );
}
