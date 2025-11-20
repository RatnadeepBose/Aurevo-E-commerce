/**
 * AUREVO - Enhanced Cart and Wishlist Management System
 * Version: 3.0 - Desktop Optimized
 */
class CartWishlistManager {
    constructor() {
        this.cart = this.loadFromStorage('aurevo_cart') || [];
        this.storageAvailable = this.checkStorageAvailability();

        // Defer init until DOM is ready to ensure elements can be injected/selected
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        // Ensure a global floating cart button is present on pages without a header cart
        this.ensureGlobalCartButton();

        try {
            console.debug('CartWishlistManager: running init() - cart count:', this.getCartCount());
            this.updateBadges();
            this.bindEvents();
            this.updateProductStates();
            console.debug('CartWishlistManager: init complete');
        } catch (err) {
            console.error('CartWishlistManager.init error:', err);
        }
    }

    // ===== STORAGE METHODS =====
    checkStorageAvailability() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error loading ${key}:`, error);
            return null;
        }
    }

    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error(`Error saving ${key}:`, error);
            return false;
        }
    }

    // ===== CART METHODS =====
    addToCart(productId, productData) {
        if (!productId || !productData) {
            this.showNotification('Invalid product data', 'error');
            return false;
        }

        const existingItem = this.cart.find(item => 
            item.id === productId && 
            item.size === (productData.size || 'M') && 
            item.color === (productData.color || 'Default')
        );

        if (existingItem) {
            existingItem.quantity += 1;
            this.showNotification('Updated quantity in cart!', 'success');
        } else {
            const cartItem = {
                id: productId,
                name: productData.name || 'Unknown Product',
                price: productData.price || 0,
                originalPrice: productData.originalPrice || productData.price,
                image: productData.image || '',
                size: productData.size || 'M',
                color: productData.color || 'Default',
                quantity: 1,
                addedAt: Date.now()
            };
            this.cart.push(cartItem);
            this.showNotification('Added to cart!', 'success');
        }

        this.saveToStorage('aurevo_cart', this.cart);
        this.updateBadges();
        this.updateProductStates();
        return true;
    }

    removeFromCart(productId, size, color) {
        const originalLength = this.cart.length;
        this.cart = this.cart.filter(item => 
            !(item.id === productId && item.size === size && item.color === color)
        );
        
        if (this.cart.length < originalLength) {
            this.saveToStorage('aurevo_cart', this.cart);
            this.updateBadges();
            this.showNotification('Removed from cart!', 'info');
            return true;
        }
        return false;
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getCartCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    clearCart() {
        this.cart = [];
        this.saveToStorage('aurevo_cart', this.cart);
        this.updateBadges();
        this.showNotification('Cart cleared!', 'info');
    }

    

    // ===== UI UPDATE METHODS =====
    updateBadges() {
        // Support multiple badge locations: header `#cartBadge`, injected `#globalCartBadge`, and inner `#cartBtn .badge`
        let cartBadges;
        try {
            cartBadges = document.querySelectorAll('#cartBadge, #globalCartBadge, #cartBtn .badge');
        } catch (err) {
            console.error('updateBadges: selector error', err);
            return;
        }

        // Determine cart count from multiple sources: internal state, and fallback to any other CartManager exposed on window
        let cartCount = this.getCartCount();
        try {
            if (window.cartManager && typeof window.cartManager.getItemCount === 'function') {
                const otherCount = Number(window.cartManager.getItemCount() || 0);
                if (!isNaN(otherCount)) cartCount = Math.max(cartCount, otherCount);
            }
        } catch (err) {
            console.warn('updateBadges: error reading external cartManager count', err);
        }

        // wishlist removed — no wishlist count

        cartBadges.forEach(badge => {
            try {
                if (cartCount > 0) {
                    badge.textContent = cartCount > 99 ? '99+' : cartCount;
                    badge.classList.remove('hidden');
                    badge.style.display = '';
                } else {
                    badge.classList.add('hidden');
                    badge.textContent = '';
                    badge.style.display = 'none';
                }
            } catch (err) {
                console.error('updateBadges: error updating a badge element', err, badge);
            }
        });

        console.debug('updateBadges: updated badges - cartCount:', cartCount, 'badgesFound:', cartBadges.length);
    }

    updateProductStates() {
        // Wishlist removed — no product wishlist state to update
        return;
    }

    getCurrentProductId() {
        const path = window.location.pathname;
        const productMap = {
            'product1.html': 'heritage-crewneck',
            'product2.html': 'oversized-comfort', 
            'product3.html': 'cropped-minimalist',
            'product4.html': 'premium-hoodie',
            'product5.html': 'essential-tee',
            'product6.html': 'zip-front'
        };
        
        for (const [page, id] of Object.entries(productMap)) {
            if (path.includes(page)) return id;
        }
        return null;
    }

    getCurrentProductData() {
        const productId = this.getCurrentProductId();
        const productData = {
            'heritage-crewneck': {
                name: 'Black Essential Tee',
                price: 349,
                originalPrice: 1799,
                image: 'https://www.pacsun.com/dw/image/v2/AAJE_PRD/on/demandware.static/-/Sites-pacsun_storefront_catalog/default/dwda922b55/product_images/0192250500820NEW_00_659.jpg?sw=800'
            },
            'oversized-comfort': {
                name: 'Bottle Green Essential Tee', 
                price: 349,
                originalPrice: 1999,
                image: 'https://www.pacsun.com/dw/image/v2/AAJE_PRD/on/demandware.static/-/Sites-pacsun_storefront_catalog/default/dw0d883ed4/product_images/0192468680006NEW_00_001.jpg?sw=400'
            },
            'cropped-minimalist': {
                name: 'Navy Blue Essential Tee',
                price: 349, 
                originalPrice: 1599,
                image: 'https://www.pacsun.com/dw/image/v2/AAJE_PRD/on/demandware.static/-/Sites-pacsun_storefront_catalog/default/dw723701f6/product_images/0193519270125NEW_00_040.jpg?sw=400'
            },
            'premium-hoodie': {
                name: 'Beige Essential Tee',
                price: 349,
                originalPrice: 2399,
                image: 'https://www.pacsun.com/dw/image/v2/AAJE_PRD/on/demandware.static/-/Sites-pacsun_storefront_catalog/default/dw5edbb3a2/product_images/0192250500814NEW_00_120.jpg?sw=800'
            },
            'essential-tee': {
                name: 'Grey Essential Tee',
                price: 349,
                originalPrice: 1299, 
                image: 'https://www.pacsun.com/dw/image/v2/AAJE_PRD/on/demandware.static/-/Sites-pacsun_storefront_catalog/default/dw16583eba/product_images/0740609850036NEW_00_020.jpg?sw=800'
            },
            'zip-front': {
                name: 'Purple-Essential Tee',
                price: 349,
                originalPrice: 2199,
                image: 'https://www.pacsun.com/dw/image/v2/AAJE_PRD/on/demandware.static/-/Sites-pacsun_storefront_catalog/default/dw24161ca2/product_images/0751513430001NEW_01_001.jpg?sw=800'
            }
        };

        return productData[productId] || null;
    }

    // ===== EVENT BINDING =====
    bindEvents() {
        document.addEventListener('click', (e) => {
            // Cart button
            if (e.target.closest('#cartBtn, #globalCartBtn')) {
                e.preventDefault();
                this.showCartModal();
            }
            
            // (wishlist removed)
            
            // Add to cart buttons
            if (e.target.closest('#addToCartBtn, #desktopAddToCartBtn')) {
                e.preventDefault();
                this.handleAddToCart();
            }
            
            // Buy now buttons
            if (e.target.closest('#buyNowBtn, #desktopBuyNowBtn')) {
                e.preventDefault();
                this.handleBuyNow();
            }
        });

        this.setupSizeSelection();
    }

    // Inject a floating cart button when a header cart (`#cartBtn`) is not present
    ensureGlobalCartButton() {
        try {
            // If header cart exists, prefer it
            if (document.querySelector('#cartBtn')) return;

            // Avoid duplicate injection
            if (document.querySelector('#globalCartBtn')) return;

            const btn = document.createElement('button');
            btn.id = 'globalCartBtn';
            btn.className = 'icon-btn floating-cart-btn';
            btn.type = 'button';
            btn.setAttribute('aria-label', 'Open cart (floating)');

            // Minimal cart icon (SVG) and badge placeholder
            btn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M6 6h15l-1.5 9h-12L6 6z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="10" cy="20" r="1" fill="currentColor"></circle>
                    <circle cx="18" cy="20" r="1" fill="currentColor"></circle>
                </svg>
                <span id="globalCartBadge" class="badge hidden" aria-hidden="true"></span>
            `;

            // Open cart on click
            btn.addEventListener('click', (ev) => {
                ev.preventDefault();
                this.showCartModal();
            });

            document.body.appendChild(btn);
        } catch (err) {
            console.error('Could not create global cart button:', err);
        }
    }

    setupSizeSelection() {
        document.addEventListener('click', (e) => {
            const sizeBtn = e.target.closest('.size-btn');
            if (sizeBtn) {
                document.querySelectorAll('.size-btn').forEach(btn => {
                    btn.classList.remove('selected');
                });
                
                sizeBtn.classList.add('selected');
                
                const selectedSizeDisplay = document.querySelector('#selectedSize');
                if (selectedSizeDisplay) {
                    selectedSizeDisplay.textContent = sizeBtn.getAttribute('data-size') || sizeBtn.textContent;
                }
            }
        });
    }

    handleAddToCart() {
        const productId = this.getCurrentProductId();
        const productData = this.getCurrentProductData();
        
        if (!productId || !productData) {
            this.showNotification('Product not found', 'error');
            return;
        }

        const selectedSizeBtn = document.querySelector('.size-btn.selected');
        if (!selectedSizeBtn) {
            this.showNotification('Please select a size first!', 'warning');
            this.highlightSizeSection();
            return;
        }
        
        const selectedSize = selectedSizeBtn.getAttribute('data-size') || 'M';
        const selectedColor = document.querySelector('#selectedColor')?.textContent || 'Default';
        
        const activeImg = document.querySelector('.product-slide.active img, .product-image.active');
        if (activeImg && activeImg.src) {
            productData.image = activeImg.src;
        }
        
        productData.size = selectedSize;
        productData.color = selectedColor;
        
        this.addToCart(productId, productData);
    }

    // (wishlist removed)

    handleBuyNow() {
        const productId = this.getCurrentProductId();
        const productData = this.getCurrentProductData();
        
        if (!productId || !productData) {
            this.showNotification('Product not found', 'error');
            return;
        }

        const selectedSizeBtn = document.querySelector('.size-btn.selected');
        if (!selectedSizeBtn) {
            this.showNotification('Please select a size first!', 'warning');
            this.highlightSizeSection();
            return;
        }
        
        const selectedSize = selectedSizeBtn.getAttribute('data-size') || 'M';
        const selectedColor = document.querySelector('#selectedColor')?.textContent || 'Default';
        
        productData.size = selectedSize;
        productData.color = selectedColor;
        
        const activeImg = document.querySelector('.product-slide.active img, .product-image.active');
        if (activeImg && activeImg.src) {
            productData.image = activeImg.src;
        }
        
        this.addToCart(productId, productData);
        
        setTimeout(() => {
            window.location.href = 'checkout.html?from=buy';
        }, 500);
    }

    highlightSizeSection() {
        const sizeSection = document.querySelector('.size-section');
        if (sizeSection) {
            sizeSection.style.transition = 'all 0.3s ease';
            sizeSection.style.backgroundColor = 'rgba(255, 193, 7, 0.15)';
            sizeSection.style.border = '2px solid #ffc107';
            sizeSection.style.borderRadius = '12px';
            sizeSection.style.padding = '1.5rem';
            
            sizeSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            let shakeCount = 0;
            const shakeInterval = setInterval(() => {
                sizeSection.style.transform = shakeCount % 2 === 0 ? 'translateX(5px)' : 'translateX(-5px)';
                shakeCount++;
                
                if (shakeCount >= 6) {
                    clearInterval(shakeInterval);
                    sizeSection.style.transform = '';
                    
                    setTimeout(() => {
                        sizeSection.style.backgroundColor = '';
                        sizeSection.style.border = '';
                        sizeSection.style.padding = '';
                    }, 3000);
                }
            }, 100);
        }
    }

    // ===== MODAL METHODS =====
    showCartModal() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty!', 'info');
            return;
        }

        const cartHTML = this.generateCartHTML();
        this.showModal('Your Cart', cartHTML);
    }

    // Wishlist feature removed

    generateCartHTML() {
        let html = '<div class="cart-items">';
        
        this.cart.forEach(item => {
            html += `
                <div class="cart-item">
                    <img src="${this.escapeHtml(item.image)}" alt="${this.escapeHtml(item.name)}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4>${this.escapeHtml(item.name)}</h4>
                        <p>Size: ${this.escapeHtml(item.size)} | Color: ${this.escapeHtml(item.color)}</p>
                        <div class="cart-item-price">₹${item.price} × ${item.quantity}</div>
                    </div>
                    <button onclick="cartWishlist.removeFromCart('${item.id}', '${this.escapeHtml(item.size)}', '${this.escapeHtml(item.color)}')" class="remove-btn">×</button>
                </div>
            `;
        });
        
        html += `
            </div>
            <div class="cart-total">
                <strong>Total: ₹${this.getCartTotal().toLocaleString()}</strong>
            </div>
            <div class="cart-actions">
                <button onclick="cartWishlist.clearCart()" class="btn-secondary">Clear Cart</button>
                <button onclick="cartWishlist.goToCheckout()" class="btn-primary">Checkout</button>
            </div>
        `;
        
        return html;
    }

    // Wishlist feature removed

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;', 
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(text).replace(/[&<>"']/g, m => map[m]);
    }

    showModal(title, content) {
        // Remove existing modal
        const existingModal = document.querySelector('.modal-overlay');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${this.escapeHtml(title)}</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Close modal with Escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    goToCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty!', 'info');
            return;
        }
        
        window.location.href = 'checkout.html';
    }

    showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            success: '✓',
            info: 'ℹ',
            warning: '⚠',
            error: '✗'
        };
        
        const icon = icons[type] || icons.info;
        
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-text">${icon} ${this.escapeHtml(message)}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 50);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
}

// Initialize
const cartWishlist = new CartWishlistManager();
window.cartWishlist = cartWishlist;