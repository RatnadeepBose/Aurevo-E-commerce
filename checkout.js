/**
 * AUREVO - Enhanced Checkout Functionality
 * Version: 2.1 - Fixed & Optimized
 */
class CheckoutManager {
    constructor() {
        this.config = {
            validPINs: ['735101'],
            deliveryLocation: 'Jalpaiguri',
            googleScriptURL: 'https://script.google.com/macros/s/AKfycbxyJNbTACfd6b_W2eb367iQHGd-agGiMiBjwPODK46p-GY1YuZmWCXxRveLkhjeyxhtXg/exec',
            maxRetries: 3,
            requestTimeout: 15000,
            mobileRegex: /^[0-9]{10}$/,
            emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        };
        
        this.cart = this.loadFromStorage('aurevo_cart') || [];
        this.isPinValid = false;
        this.termsAccepted = false;
        this.isLoading = false;

        this.init();
    }

    init() {
        if (this.cart.length === 0) {
            window.location.href = 'index.html';
            return;
        }
        
        this.populateOrderSummary();
        this.bindEvents();
        this.validateForm();
    }

    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    }

    populateOrderSummary() {
        const orderSummary = document.getElementById('orderSummary');
        const subtotalEl = document.getElementById('subtotal');
        const finalTotalEl = document.getElementById('finalTotal');

        if (!orderSummary) return;

        let html = '';
        let subtotal = 0;

        this.cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            html += `
                <div class="order-item">
                    <img src="${this.escapeHtml(item.image)}" alt="${this.escapeHtml(item.name)}" class="order-item-image">
                    <div class="order-item-details">
                        <div class="order-item-name">${this.escapeHtml(item.name)}</div>
                        <div class="order-item-specs">Size: ${this.escapeHtml(item.size)} | Color: ${this.escapeHtml(item.color)} | Qty: ${item.quantity}</div>
                        <div class="order-item-price">${this.formatCurrency(itemTotal)}</div>
                    </div>
                </div>
            `;
        });

        orderSummary.innerHTML = html;
        subtotalEl.textContent = this.formatCurrency(subtotal);
        finalTotalEl.textContent = this.formatCurrency(subtotal);
    }

    formatCurrency(amount) {
        return `₹${Math.round(amount).toLocaleString()}`;
    }

    getOrderTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    validateForm() {
        const placeOrderBtn = document.getElementById('placeOrderBtn');
        const acceptTermsCheckbox = document.getElementById('acceptTerms');

        if (!placeOrderBtn || !acceptTermsCheckbox) return;

        const checkFormValidity = () => {
            const formData = new FormData(document.getElementById('checkoutForm'));
            const allFieldsValid = this.validateAllFields(formData);
            const termsAccepted = acceptTermsCheckbox.checked;
            const isValid = allFieldsValid && termsAccepted && this.isPinValid;
            
            placeOrderBtn.disabled = !isValid;
            
            if (!this.isPinValid && formData.get('pincode')) {
                placeOrderBtn.innerHTML = 'Please verify PIN code';
            } else if (!termsAccepted) {
                placeOrderBtn.innerHTML = 'Accept Terms to Continue';
            } else if (!allFieldsValid) {
                placeOrderBtn.innerHTML = 'Complete Required Fields';
            } else {
                placeOrderBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"></path><path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"></path></svg> Place Order';
            }
        };

        // Add event listeners for real-time validation
        const form = document.getElementById('checkoutForm');
        if (form) {
            form.addEventListener('input', checkFormValidity);
            form.addEventListener('change', checkFormValidity);
        }
        acceptTermsCheckbox.addEventListener('change', checkFormValidity);
        
        // Initial validation
        setTimeout(checkFormValidity, 100);
    }

    validateAllFields(formData) {
        const requiredFields = ['fullName', 'email', 'mobile', 'address', 'pincode'];
        let hasErrors = false;

        // Clear all errors first
        this.clearAllFieldErrors();

        // Check required fields
        for (const field of requiredFields) {
            const value = formData.get(field);
            if (!value || value.trim() === '') {
                this.showFieldError(field, `${this.getFieldDisplayName(field)} is required`);
                hasErrors = true;
            }
        }

        // Validate email format
        const email = formData.get('email');
        if (email && email.trim() && !this.config.emailRegex.test(email.trim())) {
            this.showFieldError('email', 'Please enter a valid email address');
            hasErrors = true;
        }

        // Validate mobile number
        const mobile = formData.get('mobile');
        if (mobile && mobile.trim() && !this.config.mobileRegex.test(mobile.trim().replace(/\D/g, ''))) {
            this.showFieldError('mobile', 'Please enter a valid 10-digit mobile number');
            hasErrors = true;
        }

        // Validate PIN code format
        const pincode = formData.get('pincode');
        if (pincode && pincode.trim() && !/^[0-9]{6}$/.test(pincode.trim())) {
            this.showFieldError('pincode', 'Please enter a valid 6-digit PIN code');
            hasErrors = true;
        }

        return !hasErrors;
    }

    getFieldDisplayName(field) {
        const displayNames = {
            fullName: 'Full Name',
            email: 'Email',
            mobile: 'Mobile Number',
            address: 'Address',
            pincode: 'PIN Code'
        };
        return displayNames[field] || field;
    }

    showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        if (field) {
            field.classList.add('error');
            const existingError = field.parentNode.querySelector('.field-error');
            if (existingError) existingError.remove();
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = message;
            field.parentNode.appendChild(errorDiv);
        }
    }

    clearAllFieldErrors() {
        document.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
        document.querySelectorAll('.field-error').forEach(error => error.remove());
    }

    validatePIN(pincode) {
        const pinStatus = document.getElementById('pinStatus');
        if (!pinStatus) return;

        const cleanPincode = pincode.trim();
        if (!/^[0-9]{6}$/.test(cleanPincode)) {
            this.isPinValid = false;
            pinStatus.className = 'pin-status invalid';
            pinStatus.textContent = '✗ Please enter a valid 6-digit PIN code.';
            this.validateForm();
            return;
        }

        if (this.config.validPINs.includes(cleanPincode)) {
            this.isPinValid = true;
            pinStatus.className = 'pin-status valid';
            pinStatus.textContent = `✓ PIN code is valid. Delivery available in ${this.config.deliveryLocation}.`;
        } else {
            this.isPinValid = false;
            pinStatus.className = 'pin-status invalid';
            pinStatus.textContent = `✗ Sorry, we currently deliver only in ${this.config.deliveryLocation} (${this.config.validPINs.join(', ')}).`;
        }

        this.validateForm();
    }

    bindEvents() {
        const checkPinBtn = document.getElementById('checkPinBtn');
        const pincodeInput = document.getElementById('pincode');

        if (checkPinBtn && pincodeInput) {
            checkPinBtn.addEventListener('click', () => this.validatePIN(pincodeInput.value.trim()));
            pincodeInput.addEventListener('input', () => {
                if (pincodeInput.value.trim().length === 6) {
                    this.validatePIN(pincodeInput.value.trim());
                }
            });
        }

        // Terms modal
        const openTermsBtn = document.getElementById('openTermsBtn');
        const closeTermsBtn = document.getElementById('closeTermsBtn');
        const acceptTermsBtn = document.getElementById('acceptTermsBtn');
        const termsModal = document.getElementById('termsModal');
        const acceptTermsCheckbox = document.getElementById('acceptTerms');

        if (openTermsBtn && termsModal) {
            openTermsBtn.addEventListener('click', () => termsModal.classList.remove('hidden'));
            closeTermsBtn.addEventListener('click', () => termsModal.classList.add('hidden'));
            acceptTermsBtn.addEventListener('click', () => {
                acceptTermsCheckbox.checked = true;
                this.termsAccepted = true;
                termsModal.classList.add('hidden');
                this.validateForm();
                this.showNotification('Terms & Conditions accepted!', 'success');
            });

            termsModal.addEventListener('click', e => {
                if (e.target === termsModal) termsModal.classList.add('hidden');
            });
        }

        // Form submission
        const form = document.getElementById('checkoutForm');
        if (form) {
            form.addEventListener('submit', e => {
                e.preventDefault();
                this.handleCheckout();
            });
        }
    }

    async handleCheckout() {
        if (this.isLoading) return;
        
        this.setLoadingState(true, 'Processing order...');

        try {
            const formData = new FormData(document.getElementById('checkoutForm'));

            if (!this.validateAllFields(formData)) {
                throw new Error('Please correct the form errors before submitting.');
            }
            if (!this.isPinValid) {
                throw new Error('Please verify your PIN code for delivery.');
            }

            const orderData = this.prepareOrderData(formData);
            orderData.orderID = this.generateOrderID();
            orderData.orderDate = new Date().toISOString();
            orderData.status = 'Pending';

            const result = await this.submitToGoogleScript(orderData);

            if (result.success) {
                localStorage.removeItem('aurevo_cart');
                this.setLoadingState(false);
                const displayOrderId = result.orderId || orderData.orderID;
                this.showOrderSuccess(displayOrderId);
                this.showNotification('Order placed successfully!', 'success');
            } else {
                throw new Error(result.message || 'Server returned an error. Please try again.');
            }

        } catch (error) {
            console.error('Checkout error:', error);
            this.setLoadingState(false);
            this.showNotification(error.message || 'Order submission failed. Please try again.', 'error');
        }
    }

    prepareOrderData(formData) {
        return {
            name: formData.get('fullName'),
            email: formData.get('email'),
            mobile: formData.get('mobile'),
            address: formData.get('address'),
            city: formData.get('city'),
            state: formData.get('state'),
            pin: formData.get('pincode'),
            items: this.cart.map(item => ({
                name: item.name,
                price: item.price,
                size: item.size,
                color: item.color,
                quantity: item.quantity,
                image: item.image || ''
            })),
            total: this.getOrderTotal(),
            paymentMethod: 'Prepaid',
            notes: formData.get('orderNotes') || '',
            termsAccepted: true
        };
    }

    async submitToGoogleScript(orderData) {
        let lastError = null;

        for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.config.requestTimeout);

                const response = await fetch(this.config.googleScriptURL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: JSON.stringify(orderData),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                // Try to parse JSON response
                let result;
                try {
                    result = await response.json();
                } catch (_) {
                    const text = await response.text();
                    if (text.toLowerCase().includes('success')) {
                        return { success: true };
                    }
                    throw new Error(text || 'Unexpected response from server');
                }

                if (result && result.success === true) {
                    return result;
                }

                throw new Error(result?.message || result?.error || 'Server returned unsuccessful response');

            } catch (error) {
                lastError = error;
                if (attempt < this.config.maxRetries) {
                    await new Promise(r => setTimeout(r, 1000 * attempt));
                }
            }
        }

        return { 
            success: false, 
            message: lastError?.message || 'All submission attempts failed' 
        };
    }

    setLoadingState(isLoading, loadingText = 'Processing...') {
        this.isLoading = isLoading;
        const placeOrderBtn = document.getElementById('placeOrderBtn');
        const form = document.getElementById('checkoutForm');

        if (!placeOrderBtn || !form) return;

        if (isLoading) {
            placeOrderBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="animate-spin"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.49 8.49l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.49-8.49l2.83-2.83"/></svg> ${loadingText}`;
            placeOrderBtn.disabled = true;
            form.classList.add('loading');
        } else {
            placeOrderBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"></path><path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"></path></svg> Place Order';
            placeOrderBtn.disabled = false;
            form.classList.remove('loading');
            setTimeout(() => this.validateForm(), 100);
        }
    }

    generateOrderID() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `AUR${timestamp.toString().slice(-6)}${random}`;
    }

    showOrderSuccess(orderID) {
        const modal = document.getElementById('orderSuccessModal');
        const display = document.getElementById('orderIdDisplay');
        if (modal && display) {
            display.textContent = orderID;
            modal.classList.remove('hidden');
            this.showConfetti();
        }
    }

    showConfetti() {
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    top: -10px;
                    left: ${Math.random() * 100}vw;
                    width: 6px; height: 6px;
                    background: ${['#28a745', '#005A2B', '#D4AF37', '#FFD700'][Math.floor(Math.random() * 4)]};
                    z-index: 10002;
                    pointer-events: none;
                    animation: fall 3s linear forwards;
                `;
                document.body.appendChild(confetti);
                setTimeout(() => confetti.remove(), 3000);
            }, i * 50);
        }

        // Add confetti animation styles
        if (!document.getElementById('confettiStyle')) {
            const style = document.createElement('style');
            style.id = 'confettiStyle';
            style.textContent = `@keyframes fall { to { transform: translateY(100vh) rotate(360deg); opacity: 0; } }`;
            document.head.appendChild(style);
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `custom-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type==='success'?'✓':type==='error'?'✗':'ℹ'}</span>
                <span class="notification-message">${this.escapeHtml(message)}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    escapeHtml(str) {
        if (typeof str !== 'string') return '';
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.checkoutManager = new CheckoutManager();
});