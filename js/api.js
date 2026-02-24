/**
 * LICHTOR API Client
 * Fetches products and categories from the admin backend
 */

const LICHTOR_API = {
    baseURL: 'http://localhost:5001/api/public',

    // Fetch all categories
    async getCategories() {
        try {
            const response = await fetch(`${this.baseURL}/categories`);
            if (!response.ok) throw new Error('Failed to fetch categories');
            return await response.json();
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    },

    // Fetch category by slug
    async getCategory(slug) {
        try {
            const response = await fetch(`${this.baseURL}/categories/${slug}`);
            if (!response.ok) throw new Error('Category not found');
            return await response.json();
        } catch (error) {
            console.error('Error fetching category:', error);
            return null;
        }
    },

    // Fetch products by category slug
    async getProductsByCategory(categorySlug) {
        try {
            const response = await fetch(`${this.baseURL}/categories/${categorySlug}/products`);
            if (!response.ok) throw new Error('Failed to fetch products');
            return await response.json();
        } catch (error) {
            console.error('Error fetching products:', error);
            return { category: null, products: [] };
        }
    },

    // Fetch all products
    async getProducts(limit = 100) {
        try {
            const response = await fetch(`${this.baseURL}/products?limit=${limit}`);
            if (!response.ok) throw new Error('Failed to fetch products');
            return await response.json();
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    },

    // Fetch single product by slug
    async getProduct(slug) {
        try {
            const response = await fetch(`${this.baseURL}/products/${slug}`);
            if (!response.ok) throw new Error('Product not found');
            return await response.json();
        } catch (error) {
            console.error('Error fetching product:', error);
            return null;
        }
    },

    // Submit enquiry
    async submitEnquiry(data) {
        try {
            const response = await fetch(`${this.baseURL}/enquiry`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to submit enquiry');
            return await response.json();
        } catch (error) {
            console.error('Error submitting enquiry:', error);
            return { success: false, message: 'Failed to submit' };
        }
    },

    // Render a product card HTML
    renderProductCard(product) {
        const categoryName = product.category?.name || 'LED Light';
        const specs = product.specifications || {};
        const specBadge = specs.wattage ? `<span class="product-spec-badge">${specs.wattage}</span>` : '';

        return `
            <a href="product-detail.html?slug=${product.slug}" class="product-card" data-product-id="${product._id}">
                <div class="product-card-img">
                    <img src="${product.images?.[0] || 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(product.name)}" alt="${product.name}">
                </div>
                <div class="product-card-body">
                    <span class="product-card-category">${categoryName}</span>
                    <h3 class="product-card-name">${product.name}</h3>
                    <p class="product-card-desc">${product.description?.substring(0, 80) || ''}${product.description?.length > 80 ? '...' : ''}</p>
                    ${specBadge}
                    <div class="product-card-footer">
                        <span class="view-product">View Details</span>
                        <span class="product-card-arrow">→</span>
                    </div>
                </div>
            </a>
        `;
    },

    // Render category card HTML
    renderCategoryCard(category) {
        return `
            <a href="category-${category.slug}.html" class="category-card-new" data-category-id="${category._id}">
                <div class="category-card-img">
                    <img src="${category.image || 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(category.name)}" alt="${category.name}">
                </div>
                <div class="category-card-body">
                    <h3 class="category-card-name">${category.name}</h3>
                    <p class="category-card-desc">${category.description || ''}</p>
                    <div class="category-card-footer">
                        <span class="view-products">View Products</span>
                        <span class="category-card-arrow">→</span>
                    </div>
                </div>
            </a>
        `;
    }
};

// Global export
window.LICHTOR_API = LICHTOR_API;
