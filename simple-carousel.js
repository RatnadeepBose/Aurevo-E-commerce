/**
 * AUREVO - Homepage Product Card Carousels
 * Version: 2.0 - Complete & Production Ready
 * For: index.html only
 */

console.log('🎠 Loading Homepage Product Carousels...');

// ===== PRODUCT CARD CAROUSEL STATE =====
const productCarouselState = {
    current: {}
};

function ensureProductInit(productKey) {
    const { images } = getProductNodes(productKey);
    if (!images.length) {
        console.warn(`⚠️ No images found for product: ${productKey}`);
        return 0;
    }
    
    if (typeof productCarouselState.current[productKey] !== 'number') {
        productCarouselState.current[productKey] = 0;
        console.log(`✅ Initialized ${productKey} carousel with ${images.length} images`);
        updateProductActive(productKey, 0);
    }
    return images.length;
}

function getProductNodes(productKey) {
    const container = document.querySelector(`.product-image-container[data-product="${productKey}"]`);
    const images = container ? Array.from(container.querySelectorAll('.product-image')) : [];
    const dots = container ? Array.from(container.querySelectorAll('.product-dot')) : [];
    return { container, images, dots };
}

function updateProductActive(productKey, index) {
    const { images, dots } = getProductNodes(productKey);
    if (!images.length) return;
    
    console.log(`🖼️ Updating ${productKey} to image ${index + 1}/${images.length}`);
    
    images.forEach((img, i) => {
        if (i === index) {
            img.classList.add('active');
            img.style.opacity = '1';
            img.style.display = 'block';
            img.style.zIndex = '2';
        } else {
            img.classList.remove('active');
            img.style.opacity = '0';
            img.style.zIndex = '1';
            setTimeout(() => {
                if (!img.classList.contains('active')) {
                    img.style.display = 'none';
                }
            }, 400);
        }
    });
    
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function showProductImage(productKey, index) {
    const total = ensureProductInit(productKey);
    if (!total) return;
    
    const bounded = ((index % total) + total) % total;
    productCarouselState.current[productKey] = bounded;
    updateProductActive(productKey, bounded);
    
    console.log(`🎯 ${productKey}: Showing image ${bounded + 1}/${total}`);
}

function nextProductImage(productKey) {
    console.log(`➡️ Next image for ${productKey}`);
    const total = ensureProductInit(productKey);
    if (!total) return;
    
    const current = productCarouselState.current[productKey] || 0;
    const nextIndex = (current + 1) % total;
    showProductImage(productKey, nextIndex);
}

function prevProductImage(productKey) {
    console.log(`⬅️ Previous image for ${productKey}`);
    const total = ensureProductInit(productKey);
    if (!total) return;
    
    const current = productCarouselState.current[productKey] || 0;
    const prevIndex = current === 0 ? total - 1 : current - 1;
    showProductImage(productKey, prevIndex);
}

// ===== EXPOSE GLOBALLY =====
window.goToProductImage = showProductImage;
window.nextProductImage = nextProductImage;
window.prevProductImage = prevProductImage;

// ===== INITIALIZE ALL PRODUCT CAROUSELS =====
function initAllProductCardCarousels() {
    console.log('🚀 Initializing all product card carousels...');
    
    const productContainers = document.querySelectorAll('.product-image-container[data-product]');
    console.log(`📦 Found ${productContainers.length} product carousels`);
    
    if (productContainers.length === 0) {
        console.warn('⚠️ No product carousels found on this page');
        return;
    }
    
    productContainers.forEach(container => {
        const key = container.getAttribute('data-product');
        const images = container.querySelectorAll('.product-image');
        const dots = container.querySelectorAll('.product-dot');
        
        console.log(`✅ ${key}: ${images.length} images, ${dots.length} dots`);
        
        images.forEach((img, i) => {
            img.style.position = 'absolute';
            img.style.top = '0';
            img.style.left = '0';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.transition = 'opacity 0.4s ease';
            
            if (i === 0) {
                img.classList.add('active');
                img.style.opacity = '1';
                img.style.display = 'block';
                img.style.zIndex = '2';
            } else {
                img.classList.remove('active');
                img.style.opacity = '0';
                img.style.display = 'none';
                img.style.zIndex = '1';
            }
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === 0);
        });
        
        ensureProductInit(key);
    });
    
    console.log('🎉 All product card carousels initialized!');
}

// ===== TOUCH/SWIPE SUPPORT =====
function setupTouchSupport() {
    document.querySelectorAll('.product-image-container[data-product]').forEach(container => {
        const productKey = container.getAttribute('data-product');
        let startX = 0;
        let isDragging = false;
        
        container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });
        
        container.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            const threshold = 50;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    nextProductImage(productKey);
                } else {
                    prevProductImage(productKey);
                }
            }
            
            isDragging = false;
        }, { passive: true });
    });
    
    console.log('📱 Touch support enabled');
}

// ===== INITIALIZATION =====
function initHomepageCarousels() {
    console.log('🎨 Initializing Homepage Carousels...');
    
    setTimeout(() => {
        try {
            initAllProductCardCarousels();
            setupTouchSupport();
            console.log('✅ Homepage carousels ready!');
        } catch (error) {
            console.error('❌ Homepage carousel initialization error:', error);
        }
    }, 100);
}

// Multiple initialization methods
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHomepageCarousels);
} else {
    initHomepageCarousels();
}

window.addEventListener('load', initHomepageCarousels);
setTimeout(initHomepageCarousels, 500);

// ===== DEBUG FUNCTIONS =====
window.testProductCarousels = function() {
    console.log('🧪 Testing product carousels...');
    
    const products = Object.keys(productCarouselState.current);
    if (products.length === 0) {
        console.log('No products initialized yet');
        return;
    }
    
    console.log(`Testing ${products.length} products...`);
    
    products.forEach((product, i) => {
        setTimeout(() => {
            console.log(`Testing ${product}...`);
            nextProductImage(product);
        }, i * 1000);
    });
};

window.productCarouselStatus = function() {
    console.log('📊 Product Carousel Status:');
    Object.entries(productCarouselState.current || {}).forEach(([product, index]) => {
        const { images } = getProductNodes(product);
        console.log(`- ${product}: image ${index + 1}/${images.length}`);
    });
};

console.log('✅ Homepage Product Carousels loaded');
console.log('🔧 Debug: window.testProductCarousels()');
console.log('🔧 Status: window.productCarouselStatus()');