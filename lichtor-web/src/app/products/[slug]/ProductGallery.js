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
        <div className="product-gallery">
            {/* Left Thumbnails Column */}
            <div className="product-thumbnails">
                {displayImages.map((img, i) => (
                    <div
                        key={i}
                        className={`product-thumb ${i === activeIdx ? 'active' : ''}`}
                        onClick={() => setActiveIdx(i)}
                        style={{
                            border: i === activeIdx ? '2px solid #3b82f6' : '1.5px solid #e5e7eb',
                            opacity: i === activeIdx ? 1 : 0.6,
                        }}
                    >
                        <img 
                            src={img} 
                            alt={`${name} thumbnail ${i + 1}`} 
                        />
                    </div>
                ))}
            </div>

            {/* Main Image */}
            <div className="product-main-image">
                <img 
                    src={displayImages[activeIdx]} 
                    alt={name} 
                    style={{ 
                        mixBlendMode: 'darken'
                    }} 
                />
            </div>
        </div>
    );
}
