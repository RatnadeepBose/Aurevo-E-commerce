// AUREVO Premium Mobile Catalog - JavaScript
// Mobile-first e-commerce functionality

// ===== ENHANCED CAROUSEL FUNCTIONALITY =====
class CarouselManager {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 5;
        this.autoplayInterval = null;
        this.isAutoplayActive = true;
        this.isTransitioning = false;
        
        // Wait for DOM to be ready before initializing
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    init() {
        console.log('🎠 Initializing Carousel Manager...');
        
        // Check if carousel elements exist
        const carousel = document.getElementById('bannerCarousel');
        const track = document.getElementById('carouselTrack');
        const dots = document.querySelectorAll('.dot');
        
        if (!carousel || !track || dots.length === 0) {
            console.error('❌ Carousel elements not found!');
            return;
        }
        
        console.log('✅ Carousel elements found');
        console.log(`📊 Total slides: ${this.totalSlides}`);
        console.log(`🎯 Total dots: ${dots.length}`);
        
        this.bindEvents();
        this.handleTouchEvents();
        this.handleKeyboardEvents();
        this.startAutoplay();
        
        // Initial setup
        this.updateCarousel();
        this.updateDots();
        
        console.log('🎉 Carousel initialized successfully!');
    }
    
    bindEvents() {
        // Dot navigation
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(`🎯 Dot ${index} clicked`);
                this.goToSlide(index);
                this.resetAutoplay();
            });
            
            // Add hover effects for desktop
            dot.addEventListener('mouseenter', () => {
                if (window.innerWidth > 768) {
                    dot.style.transform = 'scale(1.2)';
                }
            });
            
            dot.addEventListener('mouseleave', () => {
                if (window.innerWidth > 768) {
                    dot.style.transform = index === this.currentSlide ? 'scale(1.3)' : 'scale(1)';
                }
            });
        });
        
        // Pause autoplay on hover/focus (desktop)
        const carousel = document.getElementById('bannerCarousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => {
                console.log('🖱️ Mouse entered carousel - pausing autoplay');
                this.pauseAutoplay();
            });
            
            carousel.addEventListener('mouseleave', () => {
                console.log('🖱️ Mouse left carousel - resuming autoplay');
                this.resumeAutoplay();
            });
            
            // Add click handlers for slides themselves
            const slides = carousel.querySelectorAll('.banner-slide');
            slides.forEach((slide, index) => {
                slide.addEventListener('click', () => {
                    console.log(`🖼️ Slide ${index} clicked`);
                    this.resetAutoplay();
                });
            });
        }
    }
    
    handleTouchEvents() {
        const track = document.getElementById('carouselTrack');
        if (!track) return;
        
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        let startTime = 0;
        
        // Touch events
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startTime = Date.now();
            isDragging = true;
            this.pauseAutoplay();
            console.log('👆 Touch start');
        }, { passive: true });
        
        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        }, { passive: true });
        
        track.addEventListener('touchend', () => {
            if (!isDragging) return;
            
            const diffX = startX - currentX;
            const diffTime = Date.now() - startTime;
            const threshold = 50;
            const velocity = Math.abs(diffX) / diffTime;
            
            console.log(`👆 Touch end - diffX: ${diffX}, velocity: ${velocity}`);
            
            // Swipe with sufficient distance or velocity
            if (Math.abs(diffX) > threshold || velocity > 0.3) {
                if (diffX > 0) {
                    console.log('👉 Swipe left - next slide');
                    this.nextSlide();
                } else {
                    console.log('👈 Swipe right - previous slide');
                    this.prevSlide();
                }
            }
            
            isDragging = false;
            this.resetAutoplay();
        }, { passive: true });
        
        // Mouse events for desktop
        track.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            startTime = Date.now();
            isDragging = true;
            this.pauseAutoplay();
            e.preventDefault();
            console.log('🖱️ Mouse down');
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            currentX = e.clientX;
        });
        
        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            
            const diffX = startX - currentX;
            const threshold = 50;
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    console.log('🖱️ Mouse drag left - next slide');
                    this.nextSlide();
                } else {
                    console.log('🖱️ Mouse drag right - previous slide');
                    this.prevSlide();
                }
            }
            
            isDragging = false;
            this.resetAutoplay();
        });
    }
    
    handleKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            // Only handle if carousel is in view
            const carousel = document.getElementById('bannerCarousel');
            if (!carousel || !this.isElementInView(carousel)) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    console.log('⌨️ Left arrow - previous slide');
                    this.prevSlide();
                    this.resetAutoplay();
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                    console.log('⌨️ Right arrow - next slide');
                    this.nextSlide();
                    this.resetAutoplay();
                    e.preventDefault();
                    break;
                case ' ': // Space bar
                    console.log('⌨️ Space bar - toggle autoplay');
                    if (this.isAutoplayActive) {
                        this.pauseAutoplay();
                    } else {
                        this.resumeAutoplay();
                    }
                    e.preventDefault();
                    break;
            }
        });
    }
    
    isElementInView(element) {
        const rect = element.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }
    
    goToSlide(index) {
        if (this.isTransitioning || index === this.currentSlide) return;
        
        this.isTransitioning = true;
        this.currentSlide = index;
        console.log(`🎯 Going to slide ${index}`);
        
        this.updateCarousel();
        this.updateDots();
        
        // Reset transition flag after animation
        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        console.log(`➡️ Next slide: ${this.currentSlide} → ${nextIndex}`);
        this.goToSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
        console.log(`⬅️ Previous slide: ${this.currentSlide} → ${prevIndex}`);
        this.goToSlide(prevIndex);
    }
    
    updateCarousel() {
        const track = document.getElementById('carouselTrack');
        if (!track) {
            console.error('❌ Carousel track not found!');
            return;
        }
        
        const translateX = -this.currentSlide * 20; // 20% per slide
        track.style.transform = `translateX(${translateX}%)`;
        console.log(`🎠 Carousel updated - translateX: ${translateX}%`);
    }
    
    updateDots() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            const isActive = index === this.currentSlide;
            dot.classList.toggle('active', isActive);
            dot.setAttribute('aria-selected', isActive);
            
            // Update scale for active dot
            if (isActive) {
                dot.style.transform = 'scale(1.3)';
            } else {
                dot.style.transform = 'scale(1)';
            }
        });
        console.log(`🔵 Dots updated - active: ${this.currentSlide}`);
    }
    
    startAutoplay() {
        this.stopAutoplay();
        
        console.log('▶️ Starting autoplay');
        this.autoplayInterval = setInterval(() => {
            if (this.isAutoplayActive && !this.isTransitioning) {
                console.log('⏰ Autoplay tick');
                this.nextSlide();
            }
        }, 4000); // 4 seconds per slide
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            console.log('⏹️ Stopping autoplay');
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    pauseAutoplay() {
        console.log('⏸️ Pausing autoplay');
        this.isAutoplayActive = false;
    }
    
    resumeAutoplay() {
        console.log('▶️ Resuming autoplay');
        this.isAutoplayActive = true;
    }
    
    resetAutoplay() {
        console.log('🔄 Resetting autoplay');
        this.stopAutoplay();
        this.isAutoplayActive = true;
        setTimeout(() => this.startAutoplay(), 1000);
    }
}

// ===== DYNAMIC IMAGE UPDATING FEATURE =====
class ImageManager {
    constructor() {
        this.images = new Map();
        this.init();
    }
    
    init() {
        // Store all image elements with their IDs
        const images = document.querySelectorAll('img[id]');
        images.forEach(img => {
            this.images.set(img.id, img);
        });
        
        // Make updateImage available globally
        window.updateImage = this.updateImage.bind(this);
        window.updateBannerSlide = this.updateBannerSlide.bind(this);
        window.getImageList = this.getImageList.bind(this);
        
        console.log('🖼️ Image Manager Loaded');
        console.log('📋 Available functions:');
        console.log('• updateImage(id, newSrc) - Update any image by ID');
        console.log('• updateBannerSlide(slideIndex, newSrc) - Update banner background');
        console.log('• getImageList() - View all updateable images');
        console.log('');
        console.log('Example: updateImage("heritage-main", "https://newimage.jpg")');
    }
    
    updateImage(id, newSrc) {
        const img = this.images.get(id);
        if (!img) {
            console.error(`❌ Image with ID "${id}" not found`);
            console.log('Available IDs:', Array.from(this.images.keys()));
            return false;
        }
        
        img.src = newSrc;
        console.log(`✅ Updated image "${id}" to: ${newSrc}`);
        return true;
    }
    
    updateBannerSlide(slideIndex, newSrc) {
        const slides = document.querySelectorAll('.banner-slide');
        if (slideIndex < 0 || slideIndex >= slides.length) {
            console.error(`❌ Invalid slide index. Must be 0-${slides.length - 1}`);
            return false;
        }
        
        const slide = slides[slideIndex];
        slide.style.backgroundImage = `url('${newSrc}')`;
        console.log(`✅ Updated banner slide ${slideIndex} to: ${newSrc}`);
        return true;
    }
    
    getImageList() {
        console.log('📸 Available Images:');
        this.images.forEach((img, id) => {
            console.log(`• ${id}: ${img.src}`);
        });
        console.log('');
        console.log('Banner slides (0-4): Use updateBannerSlide(index, newSrc)');
    }
}

// ===== MOBILE OPTIMIZATION =====
class MobileOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.optimizeTouchEvents();
        this.handleViewportChanges();
        this.optimizeScrolling();
    }
    
    optimizeTouchEvents() {
        // Add touch feedback to product cards
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.addEventListener('touchstart', () => {
                card.style.transform = 'scale(0.98)';
            });
            
            card.addEventListener('touchend', () => {
                setTimeout(() => {
                    card.style.transform = '';
                }, 100);
            });
        });
        
        // Add touch feedback to buttons
        const buttons = document.querySelectorAll('button, .icon-btn');
        buttons.forEach(button => {
            button.addEventListener('touchstart', () => {
                button.style.transform = 'scale(0.95)';
            });
            
            button.addEventListener('touchend', () => {
                setTimeout(() => {
                    button.style.transform = '';
                }, 100);
            });
        });
    }
    
    handleViewportChanges() {
        // Handle device orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                window.scrollTo(0, 0);
                // Trigger carousel resize if needed
                if (window.carouselManager) {
                    window.carouselManager.updateCarousel();
                }
            }, 300);
        });
        
        // Handle viewport height changes (mobile keyboard)
        let initialHeight = window.innerHeight;
        window.addEventListener('resize', () => {
            const currentHeight = window.innerHeight;
            const heightDiff = initialHeight - currentHeight;
            
            // If height decreased significantly (keyboard opened)
            if (heightDiff > 150) {
                document.body.classList.add('keyboard-open');
            } else {
                document.body.classList.remove('keyboard-open');
            }
        });
    }
    
    optimizeScrolling() {
        // Smooth scroll behavior for internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Optimize scroll performance
        let ticking = false;
        function updateOnScroll() {
            // Add scroll-based optimizations here if needed
            ticking = false;
        }
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateOnScroll);
                ticking = true;
            }
        });
    }
}

// ===== SEARCH FUNCTIONALITY =====
class SearchManager {
    constructor() {
        this.isActive = false;
        this.init();
    }
    
    init() {
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.toggleSearch();
            });
        }
    }
    
    toggleSearch() {
        this.isActive = !this.isActive;
        
        if (this.isActive) {
            // Create search overlay (simplified for demo)
            const searchOverlay = document.createElement('div');
            searchOverlay.className = 'search-overlay';
            searchOverlay.innerHTML = `
                <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
                           background: rgba(0,0,0,0.8); z-index: 2000; 
                           display: flex; align-items: flex-start; justify-content: center; padding-top: 20vh;">
                    <div style="background: white; padding: 2rem; border-radius: 16px; width: 90%; max-width: 400px;">
                        <input type="text" placeholder="Search products..." 
                               style="width: 100%; padding: 1rem; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem;">
                        <p style="margin-top: 1rem; color: #666; text-align: center;">Search functionality coming soon!</p>
                        <button onclick="this.closest('.search-overlay').remove(); window.searchManager.isActive = false;" 
                                style="margin-top: 1rem; width: 100%; padding: 0.8rem; background: var(--primary-brown); 
                                       color: white; border: none; border-radius: 8px; font-size: 1rem;">Close</button>
                    </div>
                </div>
            `;
            document.body.appendChild(searchOverlay);
        }
    }
}

// ===== CART FUNCTIONALITY =====
class CartManager {
    constructor() {
        this.items = [];
        this.init();
    }
    
    init() {
        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                this.showCart();
            });
        }
        
        this.updateBadge();
    }
    
    addItem(item) {
        this.items.push(item);
        this.updateBadge();
        console.log('Item added to cart:', item);
    }
    
    removeItem(index) {
        if (index >= 0 && index < this.items.length) {
            const removedItem = this.items.splice(index, 1)[0];
            this.updateBadge();
            console.log('Item removed from cart:', removedItem);
            return removedItem;
        }
        return null;
    }
    
    clearCart() {
        this.items = [];
        this.updateBadge();
        console.log('Cart cleared');
    }
    
    updateBadge() {
        const badge = document.querySelector('#cartBtn .badge');
        if (badge) {
            const count = this.items.length;
            if (count > 0) {
                badge.textContent = count;
                badge.classList.remove('hidden');
                badge.style.display = '';
            } else {
                badge.classList.add('hidden');
                badge.textContent = '';
            }
        }
    }
    
    showCart() {
        // Simple cart display (could be enhanced)
        alert(`Cart contains ${this.items.length} items.\nCart functionality coming soon!`);
    }
    
    // Get current cart count
    getItemCount() {
        return this.items.length;
    }
    
    // Get all items
    getItems() {
        return [...this.items]; // Return copy of items array
    }
}

// ===== PERFORMANCE OPTIMIZER =====
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.lazyLoadImages();
        this.preloadCriticalImages();
    }
    
    lazyLoadImages() {
        // Simple intersection observer for image lazy loading
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        // Observe images with data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    preloadCriticalImages() {
        // Preload first banner image and first product images
        const criticalImages = [
            'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1556821840-3a9fbc8ea9af?w=400&h=500&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=500&fit=crop&crop=center'
        ];
        
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
}

// ===== INITIALIZATION =====
function initializeApp() {
    console.log('🌟 AUREVO Premium E-Commerce Loaded');
    console.log('📱 Mobile-first design optimized');
    
    // Initialize all managers with error handling
    try {
        window.carouselManager = new CarouselManager();
        console.log('✅ Carousel Manager initialized');
    } catch (error) {
        console.error('❌ Carousel Manager failed:', error);
    }
    
    try {
        window.imageManager = new ImageManager();
        console.log('✅ Image Manager initialized');
    } catch (error) {
        console.error('❌ Image Manager failed:', error);
    }
    
    try {
        window.mobileOptimizer = new MobileOptimizer();
        console.log('✅ Mobile Optimizer initialized');
    } catch (error) {
        console.error('❌ Mobile Optimizer failed:', error);
    }
    
    try {
        window.searchManager = new SearchManager();
        console.log('✅ Search Manager initialized');
    } catch (error) {
        console.error('❌ Search Manager failed:', error);
    }
    
    try {
        window.cartManager = new CartManager();
        console.log('✅ Cart Manager initialized');
    } catch (error) {
        console.error('❌ Cart Manager failed:', error);
    }
    
    try {
        window.performanceOptimizer = new PerformanceOptimizer();
        console.log('✅ Performance Optimizer initialized');
    } catch (error) {
        console.error('❌ Performance Optimizer failed:', error);
    }
    
    console.log('🎉 All systems loaded successfully');
    console.log('');
    console.log('🛠️ Admin Functions Available:');
    console.log('• updateImage(id, newSrc) - Update any product image');
    console.log('• updateBannerSlide(index, newSrc) - Update banner backgrounds');
    console.log('• getImageList() - View all image IDs');
    console.log('• Test carousel: window.carouselManager.nextSlide()');
    console.log('• Test cart: testAddToCart(), testRemoveFromCart(), testClearCart()');
    console.log('');
    console.log('Example: updateImage("heritage-main", "https://your-new-image.jpg")');
    
    // Test carousel after 2 seconds
    setTimeout(() => {
        if (window.carouselManager) {
            console.log('🧪 Testing carousel functionality...');
            console.log('Current slide:', window.carouselManager.currentSlide);
        }
    }, 2000);
}

// Multiple initialization methods to ensure it loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Fallback initialization
setTimeout(() => {
    if (!window.carouselManager) {
        console.log('🔄 Fallback initialization...');
        initializeApp();
    }
}, 100);

// ===== UTILITY FUNCTIONS =====

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Simple loading state
function showLoading(element) {
    if (element) {
        element.classList.add('loading');
    }
}

function hideLoading(element) {
    if (element) {
        element.classList.remove('loading');
    }
}

// Format price function
function formatPrice(price) {
    return `₹${price.toLocaleString()}`;
}

// Simple analytics tracking (placeholder)
function trackEvent(eventName, eventData = {}) {
    console.log(`📊 Event: ${eventName}`, eventData);
    // Add your analytics tracking here
}

// Handle product card clicks
document.addEventListener('click', (e) => {
    const productCard = e.target.closest('.product-card');
    if (productCard) {
        const productName = productCard.querySelector('h3')?.textContent;
        trackEvent('product_card_click', { product: productName });
    }
});

// Export for use in product pages
window.AUREVO = {
    formatPrice,
    trackEvent,
    showLoading,
    hideLoading,
    debounce
};

// ===== TESTING & DEBUG FUNCTIONS =====
window.testCarousel = function() {
    console.log('🧪 Testing Carousel Functions');
    
    if (!window.carouselManager) {
        console.error('❌ Carousel Manager not found!');
        return;
    }
    
    const carousel = window.carouselManager;
    console.log('Current slide:', carousel.currentSlide);
    console.log('Total slides:', carousel.totalSlides);
    console.log('Is autoplay active:', carousel.isAutoplayActive);
    
    console.log('Testing next slide...');
    carousel.nextSlide();
    
    setTimeout(() => {
        console.log('New current slide:', carousel.currentSlide);
        console.log('Testing previous slide...');
        carousel.prevSlide();
        
        setTimeout(() => {
            console.log('Final current slide:', carousel.currentSlide);
            console.log('✅ Carousel test completed!');
        }, 1000);
    }, 1000);
};

window.manualCarouselInit = function() {
    console.log('🔧 Manual Carousel Initialization');
    try {
        if (window.carouselManager) {
            console.log('Carousel already exists, reinitializing...');
        }
        window.carouselManager = new CarouselManager();
        console.log('✅ Manual initialization successful!');
        return true;
    } catch (error) {
        console.error('❌ Manual initialization failed:', error);
        return false;
    }
};

window.debugCarousel = function() {
    console.log('🔍 Carousel Debug Information');
    
    // Check HTML elements
    const carousel = document.getElementById('bannerCarousel');
    const track = document.getElementById('carouselTrack');
    const dots = document.querySelectorAll('.dot');
    const slides = document.querySelectorAll('.banner-slide');
    
    console.log('HTML Elements:');
    console.log('- Carousel container:', carousel ? '✅ Found' : '❌ Not found');
    console.log('- Carousel track:', track ? '✅ Found' : '❌ Not found');
    console.log('- Dots count:', dots.length);
    console.log('- Slides count:', slides.length);
    
    if (track) {
        console.log('- Track transform:', track.style.transform || 'none');
        console.log('- Track width:', track.style.width || 'default');
    }
    
    // Check CSS
    if (track) {
        const computedStyle = window.getComputedStyle(track);
        console.log('CSS Properties:');
        console.log('- Display:', computedStyle.display);
        console.log('- Width:', computedStyle.width);
        console.log('- Transform:', computedStyle.transform);
        console.log('- Transition:', computedStyle.transition);
    }
    
    // Check JavaScript
    console.log('JavaScript Status:');
    console.log('- CarouselManager:', window.carouselManager ? '✅ Loaded' : '❌ Not loaded');
    
    if (window.carouselManager) {
        const mgr = window.carouselManager;
        console.log('- Current slide:', mgr.currentSlide);
        console.log('- Total slides:', mgr.totalSlides);
        console.log('- Autoplay active:', mgr.isAutoplayActive);
        console.log('- Is transitioning:', mgr.isTransitioning);
    }
};

// ===== CART TESTING FUNCTIONS =====
window.testAddToCart = function() {
    const testProduct = {
        id: Date.now(),
        name: 'Test Product',
        size: 'M',
        color: 'Test Color',
        price: 999,
        image: 'test.jpg'
    };
    
    if (window.cartManager) {
        window.cartManager.addItem(testProduct);
        console.log('✅ Test item added to cart. Count:', window.cartManager.getItemCount());
    } else {
        console.error('❌ Cart Manager not found!');
    }
};

window.testRemoveFromCart = function() {
    if (window.cartManager && window.cartManager.items.length > 0) {
        const removedItem = window.cartManager.removeItem(0);
        console.log('✅ Removed item:', removedItem.name, '- Count:', window.cartManager.getItemCount());
    } else {
        console.log('❌ No items in cart to remove');
    }
};

window.testClearCart = function() {
    if (window.cartManager) {
        const prevCount = window.cartManager.getItemCount();
        window.cartManager.clearCart();
        console.log(`✅ Cart cleared. Previous count: ${prevCount}, Current count: ${window.cartManager.getItemCount()}`);
    } else {
        console.error('❌ Cart Manager not found!');
    }
};
// ===== DESKTOP ENHANCEMENTS =====
class DesktopEnhancer {
    constructor() {
        this.init();
    }
    
    init() {
        if (window.innerWidth >= 1025) {
            this.setupDesktopInteractions();
            this.setupDesktopCarousel();
            this.setupDesktopProductHover();
        }
    }
    
    setupDesktopInteractions() {
        // Enhanced desktop hover effects
        document.addEventListener('mouseover', (e) => {
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                productCard.style.transform = 'translateY(-4px)';
            }
        });
        
        document.addEventListener('mouseout', (e) => {
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                productCard.style.transform = '';
            }
        });
        
        // Desktop keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
                e.preventDefault();
                if (window.cartWishlist) {
                    window.cartWishlist.showCartModal();
                }
            }
        });
    }
    
    setupDesktopCarousel() {
        // Enhanced desktop carousel controls
        const carousel = document.getElementById('bannerCarousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => {
                const arrows = carousel.querySelectorAll('.carousel-arrow');
                arrows.forEach(arrow => arrow.style.opacity = '1');
            });
            
            carousel.addEventListener('mouseleave', () => {
                const arrows = carousel.querySelectorAll('.carousel-arrow');
                arrows.forEach(arrow => arrow.style.opacity = '0');
            });
        }
    }
    
    setupDesktopProductHover() {
        // Product image hover effects for desktop
        document.querySelectorAll('.product-image-container').forEach(container => {
            container.addEventListener('mouseenter', () => {
                const arrows = container.querySelectorAll('.product-arrow');
                const dots = container.querySelectorAll('.product-dots');
                arrows.forEach(arrow => arrow.style.opacity = '1');
                dots.forEach(dot => dot.style.opacity = '1');
            });
            
            container.addEventListener('mouseleave', () => {
                const arrows = container.querySelectorAll('.product-arrow');
                const dots = container.querySelectorAll('.product-dots');
                arrows.forEach(arrow => arrow.style.opacity = '0');
                dots.forEach(dot => dot.style.opacity = '0');
            });
        });
    }
}

// Initialize desktop enhancements
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new DesktopEnhancer());
} else {
    new DesktopEnhancer();
}