// simple-order-system.js
class SimpleOrderSystem {
    constructor() {
        this.cart = this.loadCartData();
        this.orders = this.loadFromStorage('aurevo_orders') || [];
        console.log('🛒 Cart data loaded:', this.cart); // Debug log
        this.init();
    }

    loadCartData() {
        // Try multiple possible storage keys and formats
        let cartData = null;
        
        // Try main cart storage
        cartData = this.loadFromStorage('aurevo_cart');
        console.log('📦 Main cart data:', cartData);
        
        if (!cartData || cartData.length === 0) {
            // Try alternative storage keys
            cartData = this.loadFromStorage('cart') || 
                       this.loadFromStorage('shopping_cart') ||
                       this.loadFromStorage('aurevo_shopping_cart');
            console.log('🔍 Alternative cart data:', cartData);
        }
        
        // Handle different cart formats
        if (cartData) {
            if (Array.isArray(cartData)) {
                return cartData;
            } else if (typeof cartData === 'object' && cartData.items) {
                return cartData.items; // Handle object format
            }
        }
        
        // Get cart from existing cartWishlist manager if available
        if (window.cartWishlist && window.cartWishlist.cart) {
            console.log('🎯 Using cartWishlist data');
            return window.cartWishlist.cart;
        }
        
        console.log('❌ No cart data found');
        return [];
    }

    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            if (data) {
                const parsed = JSON.parse(data);
                console.log(`📖 Loaded ${key}:`, parsed);
                return parsed;
            }
        } catch (error) {
            console.error(`Error loading ${key}:`, error);
        }
        return null;
    }

    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            console.log(`💾 Saved ${key}:`, data);
            return true;
        } catch (error) {
            console.error(`Error saving ${key}:`, error);
            return false;
        }
    }

    init() {
        console.log('🚀 Initializing Order System...');
        this.populateOrderSummary();
        this.bindEvents();
        this.debugCartData();
    }

    debugCartData() {
        console.log('🐛 DEBUG CART INFO:');
        console.log('- Cart length:', this.cart.length);
        console.log('- Cart items:', this.cart);
        console.log('- LocalStorage keys:', Object.keys(localStorage));
        
        // Check all localStorage items that might contain cart data
        Object.keys(localStorage).forEach(key => {
            if (key.toLowerCase().includes('cart')) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    console.log(`- ${key}:`, data);
                } catch (e) {
                    console.log(`- ${key}:`, localStorage.getItem(key));
                }
            }
        });
    }

    populateOrderSummary() {
        const orderSummary = document.getElementById('orderSummary');
        const finalTotal = document.getElementById('finalTotal');

        if (!orderSummary) {
            console.error('❌ Order summary element not found');
            return;
        }

        console.log('📊 Populating order summary with:', this.cart);

        if (this.cart.length === 0) {
            orderSummary.innerHTML = `
                <div class="empty-cart-message">
                    <p>Your cart is empty</p>
                    <button onclick="window.location.href='index.html'" class="btn-primary">
                        Continue Shopping
                    </button>
                </div>
            `;
            finalTotal.textContent = '₹0';
            return;
        }

        let html = '';
        let total = 0;

        this.cart.forEach((item, index) => {
            console.log(`📦 Processing item ${index}:`, item);
            
            // Handle different item structures
            const productName = item.name || item.productName || item.title || 'Unknown Product';
            const productPrice = parseFloat(item.price) || parseFloat(item.productPrice) || 0;
            const productQuantity = parseInt(item.quantity) || parseInt(item.productQuantity) || 1;
            const productSize = item.size || item.productSize || 'One Size';
            const productColor = item.color || item.productColor || 'Default';
            const productImage = item.image || item.productImage || item.img || '';
            
            const itemTotal = productPrice * productQuantity;
            total += itemTotal;

            console.log(`💰 Item ${index} total: ${itemTotal}`);

            html += `
                <div class="order-item">
                    <img src="${this.escapeHtml(productImage)}" 
                         alt="${this.escapeHtml(productName)}" 
                         class="order-item-image"
                         onerror="this.style.display='none'">
                    <div class="order-item-details">
                        <h4>${this.escapeHtml(productName)}</h4>
                        <p>Size: ${this.escapeHtml(productSize)} | Color: ${this.escapeHtml(productColor)}</p>
                        <div class="order-item-meta">
                            <span class="order-item-price">₹${productPrice} × ${productQuantity}</span>
                            <span class="order-item-total">₹${itemTotal}</span>
                        </div>
                    </div>
                </div>
            `;
        });

        orderSummary.innerHTML = html;
        finalTotal.textContent = `₹${total}`;
        
        console.log('✅ Order summary populated. Total:', total);
    }

    bindEvents() {
        const form = document.getElementById('checkoutForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleOrderSubmission();
            });
        }

        // Add manual refresh button for debugging
        this.addDebugButtons();
    }

    addDebugButtons() {
        // Add debug button to refresh cart data
        const debugBtn = document.createElement('button');
        debugBtn.textContent = 'Refresh Cart';
        debugBtn.style.cssText = `
            position: fixed;
            bottom: 10px;
            left: 10px;
            background: #007bff;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 5px;
            font-size: 12px;
            z-index: 9999;
            cursor: pointer;
        `;
        debugBtn.addEventListener('click', () => {
            console.log('🔄 Refreshing cart data...');
            this.cart = this.loadCartData();
            this.populateOrderSummary();
        });
        document.body.appendChild(debugBtn);

        // Add test data button
        const testBtn = document.createElement('button');
        testBtn.textContent = 'Add Test Item';
        testBtn.style.cssText = `
            position: fixed;
            bottom: 50px;
            left: 10px;
            background: #28a745;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 5px;
            font-size: 12px;
            z-index: 9999;
            cursor: pointer;
        `;
        testBtn.addEventListener('click', () => {
            this.addTestItem();
        });
        document.body.appendChild(testBtn);
    }

    addTestItem() {
        const testItem = {
            id: 'test-item-' + Date.now(),
            name: 'Test Product',
            price: 1999,
            quantity: 1,
            size: 'M',
            color: 'Black',
            image: 'https://via.placeholder.com/150'
        };
        
        this.cart.push(testItem);
        this.saveToStorage('aurevo_cart', this.cart);
        this.populateOrderSummary();
        console.log('✅ Test item added');
    }

    validateForm() {
        const requiredFields = ['fullName', 'email', 'mobile', 'address', 'pincode'];
        let isValid = true;
        
        // Clear previous errors
        this.clearFieldErrors();

        for (const fieldName of requiredFields) {
            const field = document.getElementById(fieldName);
            if (!field || !field.value.trim()) {
                this.showFieldError(fieldName, 'This field is required');
                isValid = false;
            }
        }

        // Email validation
        const email = document.getElementById('email')?.value;
        if (email && !this.isValidEmail(email)) {
            this.showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }

        // Mobile validation
        const mobile = document.getElementById('mobile')?.value;
        if (mobile && !this.isValidMobile(mobile)) {
            this.showFieldError('mobile', 'Please enter a valid 10-digit mobile number');
            isValid = false;
        }

        return isValid;
    }

    clearFieldErrors() {
        document.querySelectorAll('.field-error').forEach(error => error.remove());
        document.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
    }

    showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        if (field) {
            field.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = message;
            field.parentNode.appendChild(errorDiv);
        }
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    isValidMobile(mobile) {
        return /^[0-9]{10}$/.test(mobile.replace(/\D/g, ''));
    }

    createOrder() {
        const formData = new FormData(document.getElementById('checkoutForm'));
        
        const order = {
            orderId: this.generateOrderId(),
            timestamp: new Date().toISOString(),
            customer: {
                name: formData.get('fullName'),
                email: formData.get('email'),
                mobile: formData.get('mobile'),
                address: formData.get('address'),
                pincode: formData.get('pincode')
            },
            items: this.cart.map(item => ({
                id: item.id,
                name: item.name || item.productName || item.title,
                price: parseFloat(item.price) || parseFloat(item.productPrice) || 0,
                size: item.size || item.productSize || 'One Size',
                color: item.color || item.productColor || 'Default',
                quantity: parseInt(item.quantity) || parseInt(item.productQuantity) || 1,
                image: item.image || item.productImage || item.img || ''
            })),
            total: this.cart.reduce((sum, item) => {
                const price = parseFloat(item.price) || parseFloat(item.productPrice) || 0;
                const quantity = parseInt(item.quantity) || parseInt(item.productQuantity) || 1;
                return sum + (price * quantity);
            }, 0),
            status: 'confirmed'
        };

        console.log('📝 Created order:', order);
        return order;
    }

    generateOrderId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `AUR-${timestamp}-${random}`.toUpperCase();
    }

    async processOrder(order) {
        try {
            // 1. Save order locally
            this.saveOrderLocally(order);

            // 2. Generate and download TXT file
            this.downloadOrderTxt(order);

            // 3. Update CSV log
            this.updateCsvLog(order);

            // 4. Send email notification
            await this.sendEmailNotification(order);

            // 5. Clear cart
            this.clearCart();

            console.log('✅ Order processed successfully');
        } catch (error) {
            console.error('❌ Order processing failed:', error);
            throw error;
        }
    }

    saveOrderLocally(order) {
        this.orders.push(order);
        this.saveToStorage('aurevo_orders', this.orders);
    }

    downloadOrderTxt(order) {
        const content = this.generateOrderText(order);
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `aurevo-order-${order.orderId}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('📄 TXT file downloaded');
    }

    generateOrderText(order) {
        const itemsText = order.items.map(item => 
            `• ${item.name}\n  Size: ${item.size} | Color: ${item.color}\n  Quantity: ${item.quantity} × ₹${item.price} = ₹${item.quantity * item.price}`
        ).join('\n\n');

        return `
AUREVO - ORDER CONFIRMATION
============================

Order ID: ${order.orderId}
Order Date: ${new Date(order.timestamp).toLocaleString('en-IN')}

CUSTOMER INFORMATION
-------------------
Name: ${order.customer.name}
Email: ${order.customer.email}
Mobile: ${order.customer.mobile}
Address: ${order.customer.address}
PIN Code: ${order.customer.pincode}

ORDER ITEMS
-----------
${itemsText}

ORDER SUMMARY
-------------
Subtotal: ₹${order.total}
Shipping: FREE
Total: ₹${order.total}

Thank you for choosing AUREVO!
Conscious Luxury | Made in India

Contact: aurevoindia@gmail.com
Delivery: Jalpaiguri (735101)
        `.trim();
    }

    updateCsvLog(order) {
        let csvContent = '';
        const csvFile = 'aurevo-orders.csv';
        
        // Check if CSV exists and get header
        let orders = this.loadFromStorage('aurevo_orders_csv') || [];
        
        if (orders.length === 0) {
            // Add CSV header
            csvContent = 'OrderID,Date,CustomerName,Email,Mobile,Address,Pincode,Items,Total\n';
            orders.push(csvContent.trim());
        }

        // Add order to CSV
        const itemsText = order.items.map(item => 
            `${item.name} (${item.size}, ${item.color}) x${item.quantity}`
        ).join('; ');

        const csvRow = [
            order.orderId,
            order.timestamp,
            `"${order.customer.name.replace(/"/g, '""')}"`,
            order.customer.email,
            order.customer.mobile,
            `"${order.customer.address.replace(/"/g, '""')}"`,
            order.customer.pincode,
            `"${itemsText.replace(/"/g, '""')}"`,
            order.total
        ].join(',');

        orders.push(csvRow);
        this.saveToStorage('aurevo_orders_csv', orders);

        // Download updated CSV
        this.downloadCsv(orders);
    }

    downloadCsv(orders) {
        const csvContent = orders.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `aurevo-orders-backup-${new Date().toISOString().split('T')[0]}.csv`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('📊 CSV file updated and downloaded');
    }

    async sendEmailNotification(order) {
        console.log('📧 Sending email notification for order:', order.orderId);
        
        // Simulate email sending (replace with actual API call)
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('✅ Email notification sent (simulated)');
        
        // For real implementation, uncomment and configure:
        /*
        try {
            const response = await fetch('/api/send-order-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order })
            });
            
            if (!response.ok) {
                throw new Error('Failed to send email');
            }
            
            console.log('✅ Email sent successfully');
        } catch (error) {
            console.error('❌ Email sending failed:', error);
            // Don't throw error - order should still complete
        }
        */
    }

    clearCart() {
        this.cart = [];
        this.saveToStorage('aurevo_cart', this.cart);
        
        // Update UI badges
        const badges = document.querySelectorAll('#cartBadge');
        badges.forEach(badge => {
            badge.style.display = 'none';
            badge.textContent = '';
        });
        
        console.log('🛒 Cart cleared');
    }

    showSuccess(order) {
        // Fire confetti
        this.fireConfetti();

        // Show success modal
        const modal = document.getElementById('successModal');
        const orderIdDisplay = document.getElementById('orderIdDisplay');
        
        if (orderIdDisplay) {
            orderIdDisplay.textContent = order.orderId;
        }
        
        if (modal) {
            modal.classList.remove('hidden');
        }
        
        console.log('🎉 Order success shown');
    }

    fireConfetti() {
        // Main confetti burst
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#005A2B', '#D4AF37', '#FFFFFF', '#1E8449']
        });

        // Left side confetti
        setTimeout(() => confetti({
            particleCount: 80,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
        }), 150);

        // Right side confetti
        setTimeout(() => confetti({
            particleCount: 80,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
        }), 300);

        // Final burst
        setTimeout(() => confetti({
            particleCount: 100,
            spread: 100,
            decay: 0.91,
            scalar: 1.2
        }), 500);
    }

    escapeHtml(text) {
        if (typeof text !== 'string') return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;', 
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏁 DOM loaded, initializing order system...');
    window.orderSystem = new SimpleOrderSystem();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SimpleOrderSystem;
}