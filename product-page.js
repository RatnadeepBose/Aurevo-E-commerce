/**
 * AUREVO - Unified Product Carousel System
 * Fixed & Optimized Version
 */
class ProductCarouselManager {
    constructor() {
        this.currentIndex = 0;
        this.totalSlides = 0;
        this.init();
    }

    init() {
        this.initProductPageCarousel();
        this.setupTouchSupport();
        this.setupKeyboardNavigation();
    }

    initProductPageCarousel() {
        const slides = document.querySelectorAll('.product-slide');
        const dots = document.querySelectorAll('.image-dot');
        
        if (slides.length > 0) {
            this.totalSlides = slides.length;
            this.showSlide(0);
        }
    }

    showSlide(index) {
        const slides = document.querySelectorAll('.product-slide');
        const dots = document.querySelectorAll('.image-dot');
        
        if (!slides.length) return;

        const boundedIndex = ((index % this.totalSlides) + this.totalSlides) % this.totalSlides;
        this.currentIndex = boundedIndex;

        slides.forEach((slide, i) => {
            if (i === boundedIndex) {
                slide.classList.add('active');
                slide.style.display = 'block';
                slide.style.opacity = '1';
            } else {
                slide.classList.remove('active');
                slide.style.opacity = '0';
                setTimeout(() => {
                    if (!slide.classList.contains('active')) {
                        slide.style.display = 'none';
                    }
                }, 400);
            }
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === boundedIndex);
        });
    }

    nextSlide() {
        this.showSlide(this.currentIndex + 1);
    }

    prevSlide() {
        this.showSlide(this.currentIndex - 1);
    }

    goToSlide(index) {
        this.showSlide(index);
    }

    setupTouchSupport() {
        const carousel = document.getElementById('productCarousel');
        if (!carousel) return;

        let startX = 0;
        let isDragging = false;

        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            const threshold = 50;

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            
            isDragging = false;
        }, { passive: true });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            const carousel = document.getElementById('productCarousel');
            if (!carousel) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    this.prevSlide();
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                    this.nextSlide();
                    e.preventDefault();
                    break;
            }
        });
    }
}

// Initialize product page functionality
function initProductPage() {
    // Initialize carousel
    window.productCarousel = new ProductCarouselManager();
    
    // Initialize product options
    if (typeof ProductOptions !== 'undefined') {
        window.productOptions = new ProductOptions();
    }
    
    // Setup share button
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const productTitle = document.querySelector('.product-title')?.textContent || 'AUREVO Product';
            if (navigator.share) {
                navigator.share({
                    title: `${productTitle} - AUREVO`,
                    text: 'Check out this premium product from AUREVO!',
                    url: window.location.href
                });
            } else {
                navigator.clipboard.writeText(window.location.href)
                    .then(() => alert('Link copied to clipboard!'))
                    .catch(() => alert('Please copy the URL manually.'));
            }
        });
    }
    
    // Setup size guide
    const sizeGuideBtn = document.querySelector('.size-guide-link');
    if (sizeGuideBtn) {
        sizeGuideBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showSizeGuideModal();
        });
    }
}

function showSizeGuideModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 16px; width: 90%; max-width: 500px;">
            <style>
                /* Replace all hardcoded colors with these variables */
:root {
    --primary-green: #005A2B;      /* Rolex green */
    --secondary-gold: #D4AF37;    /* Luxury gold */
    --accent-orange: #FF6B35;      /* For CTAs */
    --text-dark: #1a1a1a;
    --text-light: #666666;
    --border-color: #e0e0e0;
    --background-light: #f8f8f8;
}

                /* Desktop Product Details Section */
                .product-details-section {
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    box-shadow: 0 2px 15px rgba(0,0,0,0.1);
                }

                /* Flipkart-Style Price Box */
                .price-box {
                    background: var(--background-light);
                    padding: 1.5rem;
                    border-radius: 8px;
                    border: 1px solid var(--border-color);
                }

                .price-box .current-price {
                    font-size: 2rem;
                    color: var(--primary-green);
                }

                /* Offer List Styles */
                .offer-list {
                    list-style: none;
                    padding-left: 0;
                }

                .offer-list li {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.5rem;
                    color: var(--text-light);
                }

                .offer-list li::before {
                    content: "✓";
                    color: var(--primary-green);
                }

                /* Update sticky bottom actions */
                .sticky-bottom-actions {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.5rem;
                    padding: 1rem;
                    box-shadow: 0 -4px 15px rgba(0,0,0,0.1);
                }

                .btn-primary, .btn-buy-now {
                    font-size: 1rem !important;
                    padding: 1rem !important;
                    border-radius: 8px !important;
                }

                @media (min-width: 768px) {
                    .sticky-bottom-actions {
                        display: none; /* Show desktop-style actions instead */
                    }
                }
            </style>
            <h3 style="color: #005A2B; margin-bottom: 1rem;">Unisex Size Guide</h3>
            <div style="margin-bottom: 1.5rem;">
                <h4 style="color: #4A635D; margin-bottom: 0.5rem;">Heritage Crewneck Measurements</h4>
                <div style="display: grid; gap: 0.5rem; font-size: 0.9rem;">
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: #f5f5f5; border-radius: 4px;">
                        <span><strong>XS:</strong></span><span>Chest 36" | Length 25"</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: #f5f5f5; border-radius: 4px;">
                        <span><strong>S:</strong></span><span>Chest 38" | Length 26"</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: #f5f5f5; border-radius: 4px;">
                        <span><strong>M:</strong></span><span>Chest 40" | Length 27"</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: #f5f5f5; border-radius: 4px;">
                        <span><strong>L:</strong></span><span>Chest 42" | Length 28"</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: #f5f5f5; border-radius: 4px;">
                        <span><strong>XL:</strong></span><span>Chest 44" | Length 29"</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: #f5f5f5; border-radius: 4px;">
                        <span><strong>XXL:</strong></span><span>Chest 46" | Length 30"</span>
                    </div>
                </div>
            </div>
            <p style="color: #4A635D; font-size: 0.9rem; margin-bottom: 1.5rem; line-height: 1.5;">
                <strong>🌿 Unisex Fit:</strong> Our relaxed fit is designed to be comfortable for all body types. 
                The measurements above are garment measurements. For a looser fit, size up.
            </p>
            <button onclick="this.closest('.modal-overlay').remove()" 
                    style="width: 100%; padding: 1rem; background: #005A2B; color: white; border: none; border-radius: 8px; cursor: pointer;">
                Close Size Guide
            </button>
        </div>
    `;
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    document.body.appendChild(modal);
}

// Expose functions globally for HTML onclick handlers
window.nextImage = () => window.productCarousel?.nextSlide();
window.previousImage = () => window.productCarousel?.prevSlide();
window.showImage = (index) => window.productCarousel?.goToSlide(index);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductPage);
} else {
    initProductPage();
}