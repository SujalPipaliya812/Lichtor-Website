import { API_URL } from './constants';

/**
 * Standardizes image URLs across the application.
 * Handles:
 * 1. External URLs (starts with http/https)
 * 2. Static public assets (starts with /assets)
 * 3. Base domain assets (starts with /)
 * 4. Backend-served images (prepends API_URL)
 */
export function getImageUrl(path) {
    if (!path) return '/Lichtor-01.png'; // Global fallback logo
    
    if (path.startsWith('http')) {
        return path;
    }
    
    if (path.startsWith('/assets') || path.startsWith('/uploads')) {
        // If it starts with /assets, it's a local public asset in lichtor-web
        // If it starts with /uploads, it's a backend asset (but let's check if it needs API_URL)
        if (path.startsWith('/assets')) return path;
        
        // Ensure API_URL doesn't end with slash if path starts with one
        const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
        return `${baseUrl}${path}`;
    }
    
    // Relative paths without leading slash
    if (!path.startsWith('/')) {
        const baseUrl = API_URL.endsWith('/') ? API_URL : `${API_URL}/`;
        return `${baseUrl}${path}`;
    }

    return path;
}
