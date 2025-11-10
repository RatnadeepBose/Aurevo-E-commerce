/**
 * AUREVO - Unified Product Carousel System
 * Handles both homepage product cards and product page carousels
 */

console.log('🎠 Loading Unified Product Carousel System...');

class UnifiedCarousel {
    constructor() {
        this.homepageState = {};
        this.productPageState = {
            currentIndex: 0,
            totalSlides: 0
        };
        this.init();
    }

    init() {
        this.initHomepageCarousels();
        this.initProductPageCarousel();
        this.setupTouchSupport();
        console.log('✅ Unified Carousel System Ready');
    }

    // ===== HOMEPAGE PRODUCT CARD CAROUSELS =====
    initHomepageCarousels() {
        const productContainers = document.querySelectorAll('.product-image-container[data-product]');
        
        if (productContainers.length > 0) {
            console.log(`🏠 Initializing ${productContainers.length} homepage carousels`);
            
            productContainers.forEach(container => {
                const key = container.getAttribute('data-product');
                const images = container.querySelectorAll('.product-image');
                const dots = container.querySelectorAll('.product-dot');
                
                this.homepageState[key] = 0;
                
                // Initialize first image
                this.updateHomepageCarousel(key, 0);
                
                console.log(`✅ ${key}: ${images.length} images initialized`);
            });
        }
    }

    updateHomepageCarousel(productKey, index) {
        const { images, dots } = this.getHomepageNodes(productKey);
        if (!images.length) return;

        const total = images.length;
        const boundedIndex = ((index % total) + total) % total;
        
        this.homepageState[productKey] = boundedIndex;

        images.forEach((img, i) => {
            if (i === boundedIndex) {
                img.classList.add('active');
                img.style.opacity = '1';
                img.style.display = 'block';
            } else {
                img.classList.remove('active');
                img.style.opacity = '0';
                setTimeout(() => {
                    if (!img.classList.contains('active')) {
                        img.style.display = 'none';
                    }
                }, 400);
            }
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === boundedIndex);
        });
    }

    getHomepageNodes(productKey) {
        const container = document.querySelector(`.product-image-container[data-product="${productKey}"]`);
        const images = container ? Array.from(container.querySelectorAll('.product-image')) : [];
        const dots = container ? Array.from(container.querySelectorAll('.product-dot')) : [];
        return { container, images, dots };
    }

    // ===== PRODUCT PAGE CAROUSEL =====
    initProductPageCarousel() {
        const slides = document.querySelectorAll('.product-slide');
        const dots = document.querySelectorAll('.image-dot');
        
        if (slides.length > 0) {
            console.log(`🛍️ Initializing product page carousel with ${slides.length} slides`);
            
            this.productPageState.totalSlides = slides.length;
            this.showProductPageSlide(0);
        }
    }

    showProductPageSlide(index) {
        const slides = document.querySelectorAll('.product-slide');
        const dots = document.querySelectorAll('.image-dot');
        
        if (!slides.length) return;

        const total = slides.length;
        const boundedIndex = ((index % total) + total) % total;
        
        this.productPageState.currentIndex = boundedIndex;

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

    // ===== TOUCH SUPPORT =====
    setupTouchSupport() {
        // Homepage product cards
        document.querySelectorAll('.product-image-container[data-product]').forEach(container => {
            this.addTouchSupport(container, 'homepage');
        });

        // Product page carousel
        const productCarousel = document.getElementById('productCarousel');
        if (productCarousel) {
            this.addTouchSupport(productCarousel, 'productPage');
        }
    }

    addTouchSupport(element, type) {
        let startX = 0;
        let isDragging = false;

        element.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });

        element.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            const threshold = 50;

            if (Math.abs(diff) > threshold) {
                if (type === 'homepage') {
                    const productKey = element.getAttribute('data-product');
                    if (diff > 0) {
                        this.nextHomepageImage(productKey);
                    } else {
                        this.prevHomepageImage(productKey);
                    }
                } else {
                    if (diff > 0) {
                        this.nextProductPageSlide();
                    } else {
                        this.prevProductPageSlide();
                    }
                }
            }
            
            isDragging = false;
        }, { passive: true });
    }

    // ===== PUBLIC METHODS =====
    nextHomepageImage(productKey) {
        const current = this.homepageState[productKey] || 0;
        this.updateHomepageCarousel(productKey, current + 1);
    }

    prevHomepageImage(productKey) {
        const current = this.homepageState[productKey] || 0;
        this.updateHomepageCarousel(productKey, current - 1);
    }

    goToHomepageImage(productKey, index) {
        this.updateHomepageCarousel(productKey, index);
    }

    nextProductPageSlide() {
        const current = this.productPageState.currentIndex;
        this.showProductPageSlide(current + 1);
    }

    prevProductPageSlide() {
        const current = this.productPageState.currentIndex;
        this.showProductPageSlide(current - 1);
    }

    goToProductPageSlide(index) {
        this.showProductPageSlide(index);
    }
}

// ===== GLOBAL INITIALIZATION =====
let unifiedCarousel;

function initUnifiedCarousel() {
    unifiedCarousel = new UnifiedCarousel();
    
    // Expose methods globally for HTML onclick handlers
    window.nextProductImage = (productKey) => unifiedCarousel.nextHomepageImage(productKey);
    window.prevProductImage = (productKey) => unifiedCarousel.prevHomepageImage(productKey);
    window.goToProductImage = (productKey, index) => unifiedCarousel.goToHomepageImage(productKey, index);
    
    window.nextImage = () => unifiedCarousel.nextProductPageSlide();
    window.previousImage = () => unifiedCarousel.prevProductPageSlide();
    window.showImage = (index) => unifiedCarousel.goToProductPageSlide(index);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUnifiedCarousel);
} else {
    initUnifiedCarousel();
}

// Debug functions
window.carouselDebug = () => {
    console.log('🏠 Homepage State:', unifiedCarousel.homepageState);
    console.log('🛍️ Product Page State:', unifiedCarousel.productPageState);
};