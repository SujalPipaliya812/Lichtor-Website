// Footer Component - Inject on all pages
document.addEventListener('DOMContentLoaded', function () {
    const footerHtml = `
    <footer class="footer">
        <div class="container">
            <div class="footer-main">
                <div class="footer-brand">
                    <div class="footer-logo">
                        <img src="assets/lichtor-logo.jpg" alt="LICHTOR"
                            style="height: 40px; width: auto; filter: brightness(0) invert(1);">
                    </div>
                    <p class="footer-description">
                        A flagship brand of Dharmjivan Industries, LICHTOR is committed to delivering
                        innovative, energy-efficient LED lighting solutions that illuminate India's progress.
                    </p>
                    <div class="footer-social">
                        <a href="#" class="footer-social-link" aria-label="Facebook">
                            <svg viewBox="0 0 24 24">
                                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                            </svg>
                        </a>
                        <a href="#" class="footer-social-link" aria-label="Twitter">
                            <svg viewBox="0 0 24 24">
                                <path
                                    d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                            </svg>
                        </a>
                        <a href="#" class="footer-social-link" aria-label="LinkedIn">
                            <svg viewBox="0 0 24 24">
                                <path
                                    d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                        </a>
                        <a href="#" class="footer-social-link" aria-label="YouTube">
                            <svg viewBox="0 0 24 24">
                                <path
                                    d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z" />
                                <polygon points="9.75,15.02 15.5,11.75 9.75,8.48" fill="white" />
                            </svg>
                        </a>
                    </div>
                </div>
                <div class="footer-column">
                    <h4>Products</h4>
                    <div class="footer-links">
                        <a href="categories.html#panel-lights" class="footer-link">Panel Lights</a>
                        <a href="categories.html#downlighters" class="footer-link">Downlighters</a>
                        <a href="categories.html#tube-lights" class="footer-link">Tube Lights</a>
                        <a href="categories.html#led-bulbs" class="footer-link">LED Bulbs</a>
                        <a href="categories.html#street-lights" class="footer-link">Street Lights</a>
                        <a href="categories.html#industrial" class="footer-link">Industrial Lights</a>
                    </div>
                </div>
                <div class="footer-column">
                    <h4>Company</h4>
                    <div class="footer-links">
                        <a href="about.html" class="footer-link">About Us</a>
                        <a href="about.html#manufacturing" class="footer-link">Manufacturing</a>
                        <a href="about.html#quality" class="footer-link">Quality Assurance</a>
                        <a href="investors.html" class="footer-link">Investors</a>
                        <a href="#" class="footer-link">Careers</a>
                        <a href="#" class="footer-link">Media Center</a>
                    </div>
                </div>
                <div class="footer-column">
                    <h4>Support</h4>
                    <div class="footer-links">
                        <a href="customer-care.html" class="footer-link">Customer Care</a>
                        <a href="customer-care.html#warranty" class="footer-link">Warranty</a>
                        <a href="customer-care.html#service" class="footer-link">Service Centers</a>
                        <a href="#" class="footer-link">Downloads</a>
                        <a href="customer-care.html#faq" class="footer-link">FAQs</a>
                        <a href="customer-care.html#contact" class="footer-link">Contact Us</a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p class="footer-copyright">
                    © 2024 Dharmjivan Industries. All rights reserved. LICHTOR® is a registered trademark.
                </p>
                <div class="footer-legal">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Use</a>
                    <a href="#">Cookie Policy</a>
                </div>
            </div>
        </div>
    </footer>
    `;

    // Find existing footer or create placeholder
    const existingFooter = document.querySelector('footer.footer');
    if (existingFooter) {
        existingFooter.outerHTML = footerHtml;
    } else {
        // Append before closing body
        document.body.insertAdjacentHTML('beforeend', footerHtml);
    }
});
