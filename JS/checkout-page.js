/* 
 * Checkout Page JavaScript - Imperial Watches
 * College project by Maulik Joshi and team
 * Features: Multi-step checkout, form validation, React components
 */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initCheckoutPage();
    initReactCheckoutComponents();
});

// Global variables
let currentStep = 1;
let checkoutData = {
    shipping: {},
    payment: {},
    order: {}
};
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

// Initialize checkout page
function initCheckoutPage() {
    if (cartItems.length === 0) {
        // Redirect to cart if empty
        window.location.href = 'Cart.html';
        return;
    }

    renderOrderSummary();
    bindCheckoutEventListeners();
    updateStepDisplay();
}

// Render order summary
function renderOrderSummary() {
    const summaryItems = document.getElementById('summaryItems');
    if (!summaryItems) return;

    let subtotal = 0;
    
    summaryItems.innerHTML = cartItems.map(item => {
        const priceValue = parseFloat(item.price.replace(/[$,]/g, ''));
        subtotal += priceValue * item.quantity;
        
        return `
            <div class="summary-item">
                <div class="item-info">
                    <img src="${item.image}" alt="${item.name}" class="item-image">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <span class="item-quantity">Qty: ${item.quantity}</span>
                    </div>
                </div>
                <div class="item-price">${item.price}</div>
            </div>
        `;
    }).join('');

    // Update totals
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    const subtotalEl = document.getElementById('summarySubtotal');
    const taxEl = document.getElementById('summaryTax');
    const totalEl = document.getElementById('summaryTotal');

    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    if (taxEl) taxEl.textContent = formatPrice(tax);
    if (totalEl) totalEl.textContent = formatPrice(total);
}

// Bind checkout event listeners
function bindCheckoutEventListeners() {
    // Navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (prevBtn) {
        prevBtn.addEventListener('click', goToPreviousStep);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', goToNextStep);
    }

    // Payment method selection
    document.addEventListener('change', function(e) {
        if (e.target.name === 'paymentMethod') {
            const method = e.target.value;
            const cardDetails = document.getElementById('cardDetails');
            const paypalDetails = document.getElementById('paypalDetails');

            if (method === 'card') {
                cardDetails.style.display = 'block';
                paypalDetails.style.display = 'none';
            } else if (method === 'paypal') {
                cardDetails.style.display = 'none';
                paypalDetails.style.display = 'block';
            }
        }
    });

    // Form validation
    document.addEventListener('input', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
            validateField(e.target);
        }
    });

    // Card number formatting
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', formatCardNumber);
    }

    // Expiry date formatting
    const expiryDate = document.getElementById('expiryDate');
    if (expiryDate) {
        expiryDate.addEventListener('input', formatExpiryDate);
    }
}

// Go to next step
function goToNextStep() {
    if (validateCurrentStep()) {
        if (currentStep < 4) {
            currentStep++;
            updateStepDisplay();
            updateStepContent();
        }
    }
}

// Go to previous step
function goToPreviousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepDisplay();
        updateStepContent();
    }
}

// Validate current step
function validateCurrentStep() {
    const currentStepEl = document.getElementById(`step${currentStep}`);
    if (!currentStepEl) return true;

    const requiredFields = currentStepEl.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    if (!isValid) {
        showNotification('Please fill in all required fields', 'warning');
    }

    return isValid;
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;

    // Remove previous error styling
    field.classList.remove('error');

    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
    }

    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
        }
    }

    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
        }
    }

    // Card number validation
    if (field.id === 'cardNumber' && value) {
        const cardNumber = value.replace(/\s/g, '');
        if (cardNumber.length < 13 || cardNumber.length > 19) {
            isValid = false;
        }
    }

    // CVV validation
    if (field.id === 'cvv' && value) {
        if (value.length < 3 || value.length > 4) {
            isValid = false;
        }
    }

    if (!isValid) {
        field.classList.add('error');
    }

    return isValid;
}

// Update step display
function updateStepDisplay() {
    const steps = document.querySelectorAll('.step');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    steps.forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.toggle('active', stepNumber === currentStep);
        step.classList.toggle('completed', stepNumber < currentStep);
    });

    // Update navigation buttons
    if (prevBtn) {
        prevBtn.style.display = currentStep > 1 ? 'block' : 'none';
    }

    if (nextBtn) {
        if (currentStep === 4) {
            nextBtn.textContent = 'Complete Order';
            nextBtn.onclick = completeOrder;
        } else {
            nextBtn.textContent = 'Continue';
            nextBtn.onclick = goToNextStep;
        }
    }
}

// Update step content
function updateStepContent() {
    // Hide all steps
    for (let i = 1; i <= 4; i++) {
        const stepEl = document.getElementById(`step${i}`);
        if (stepEl) {
            stepEl.style.display = 'none';
        }
    }

    // Show current step
    const currentStepEl = document.getElementById(`step${currentStep}`);
    if (currentStepEl) {
        currentStepEl.style.display = 'block';
    }

    // Populate review step
    if (currentStep === 3) {
        populateReviewStep();
    }
}

// Populate review step
function populateReviewStep() {
    const shippingForm = document.getElementById('shippingForm');
    const paymentForm = document.getElementById('paymentForm');
    
    // Populate shipping review
    const shippingReview = document.getElementById('shippingReview');
    if (shippingForm && shippingReview) {
        const formData = new FormData(shippingForm);
        shippingReview.innerHTML = `
            <p><strong>${formData.get('firstName')} ${formData.get('lastName')}</strong></p>
            <p>${formData.get('address')}</p>
            <p>${formData.get('city')}, ${formData.get('state')} ${formData.get('zipCode')}</p>
            <p>${formData.get('country')}</p>
            <p>${formData.get('email')}</p>
            <p>${formData.get('phone')}</p>
        `;
    }

    // Populate payment review
    const paymentReview = document.getElementById('paymentReview');
    if (paymentForm && paymentReview) {
        const paymentMethod = paymentForm.querySelector('input[name="paymentMethod"]:checked').value;
        if (paymentMethod === 'card') {
            const cardNumber = document.getElementById('cardNumber').value;
            const maskedCard = '**** **** **** ' + cardNumber.slice(-4);
            paymentReview.innerHTML = `
                <p><strong>Credit/Debit Card</strong></p>
                <p>${maskedCard}</p>
                <p>${document.getElementById('cardName').value}</p>
            `;
        } else {
            paymentReview.innerHTML = `
                <p><strong>PayPal</strong></p>
                <p>Payment will be processed through PayPal</p>
            `;
        }
    }

    // Populate order items
    const orderItems = document.getElementById('orderItems');
    if (orderItems) {
        orderItems.innerHTML = cartItems.map(item => `
            <div class="order-item">
                <img src="${item.image}" alt="${item.name}" class="order-item-image">
                <div class="order-item-details">
                    <h4>${item.name}</h4>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Price: ${item.price}</p>
                </div>
            </div>
        `).join('');
    }
}

// Complete order
function completeOrder() {
    if (validateCurrentStep()) {
        // Generate order number
        const orderNumber = 'IW-' + Date.now();
        
        // Save order data
        const orderData = {
            orderNumber: orderNumber,
            items: cartItems,
            shipping: getFormData('shippingForm'),
            payment: getFormData('paymentForm'),
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('lastOrder', JSON.stringify(orderData));
        
        // Clear cart
        localStorage.removeItem('cartItems');
        
        // Show success step
        currentStep = 4;
        updateStepDisplay();
        updateStepContent();
        
        // Update order number
        const orderNumberEl = document.getElementById('orderNumber');
        if (orderNumberEl) {
            orderNumberEl.textContent = orderNumber;
        }

        showNotification('Order placed successfully!', 'success');
    }
}

// Get form data
function getFormData(formId) {
    const form = document.getElementById(formId);
    if (!form) return {};
    
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    return data;
}

// Format card number
function formatCardNumber(e) {
    let value = e.target.value.replace(/\s/g, '');
    let formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
    e.target.value = formattedValue;
}

// Format expiry date
function formatExpiryDate(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
}

// React Components for checkout
function initReactCheckoutComponents() {
    // Checkout Form Component
    const CheckoutForm = () => {
        const [formData, setFormData] = React.useState({});
        const [errors, setErrors] = React.useState({});

        const handleInputChange = (field, value) => {
            setFormData(prev => ({ ...prev, [field]: value }));
            // Clear error when user starts typing
            if (errors[field]) {
                setErrors(prev => ({ ...prev, [field]: null }));
            }
        };

        const validateForm = () => {
            const newErrors = {};
            // Add validation logic here
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        };

        return React.createElement('div', { className: 'react-checkout-form' },
            React.createElement('h3', null, 'React Checkout Form'),
            React.createElement('p', null, 'This is a React component for enhanced form handling')
        );
    };

    // Order Summary Component
    const OrderSummary = () => {
        const [items] = React.useState(cartItems);

        const calculateTotal = () => {
            let total = 0;
            items.forEach(item => {
                const priceValue = parseFloat(item.price.replace(/[$,]/g, ''));
                total += priceValue * item.quantity;
            });
            return total + (total * 0.08);
        };

        return React.createElement('div', { className: 'react-order-summary' },
            React.createElement('h3', null, 'React Order Summary'),
            React.createElement('div', { className: 'react-items' },
                items.map((item, index) => 
                    React.createElement('div', { key: index, className: 'react-item' },
                        React.createElement('span', null, `${item.name} x${item.quantity}`),
                        React.createElement('span', null, item.price)
                    )
                )
            ),
            React.createElement('div', { className: 'react-total' },
                React.createElement('strong', null, `Total: ${formatPrice(calculateTotal())}`)
            )
        );
    };

    // Render React components if containers exist
    const formContainer = document.getElementById('reactCheckoutForm');
    if (formContainer) {
        ReactDOM.render(React.createElement(CheckoutForm), formContainer);
    }

    const summaryContainer = document.getElementById('reactOrderSummary');
    if (summaryContainer) {
        ReactDOM.render(React.createElement(OrderSummary), summaryContainer);
    }
}

// Format price for display
function formatPrice(price) {
    return '$' + price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

// Utility function to show notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize page when loaded
console.log('Checkout page initialized - Imperial Watches');
