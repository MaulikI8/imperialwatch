/* 
 * Cart Page JavaScript - Imperial Watches
 * College project by Maulik Joshi and team
 * Features: Cart management, quantity controls, React components
 */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initCartPage();
    initReactCartComponents();
});

// Global variables
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

// Initialize cart page functionality
function initCartPage() {
    renderCartItems();
    updateCartSummary();
    bindCartEventListeners();
}

// Render cart items
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartWithItems = document.getElementById('cartWithItems');

    console.log('Cart items:', cartItems); // Debug log

    if (!cartItems || cartItems.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartWithItems) cartWithItems.style.display = 'none';
        return;
    }

    if (emptyCart) emptyCart.style.display = 'none';
    if (cartWithItems) cartWithItems.style.display = 'block';

    cartItemsContainer.innerHTML = cartItems.map((item, index) => `
        <div class="cart-item" data-index="${index}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-info">
                    <div class="cart-item-brand">${item.brand || 'Luxury Brand'}</div>
                    <h3 class="cart-item-name">${item.name}</h3>
                    <p class="cart-item-description">Premium luxury timepiece</p>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10" onchange="setQuantity(${index}, this.value)">
                        <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                    <div class="cart-item-price">${item.price}</div>
                    <button class="remove-item" onclick="removeFromCart(${index})">Remove</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Update quantity
function updateQuantity(index, change) {
    const item = cartItems[index];
    const newQuantity = Math.max(1, Math.min(10, item.quantity + change));
    
    if (newQuantity !== item.quantity) {
        item.quantity = newQuantity;
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        renderCartItems();
        updateCartSummary();
        updateCartCount();
        showNotification(`Quantity updated to ${newQuantity}`, 'info');
    }
}

// Set quantity directly
function setQuantity(index, quantity) {
    const newQuantity = Math.max(1, Math.min(10, parseInt(quantity) || 1));
    cartItems[index].quantity = newQuantity;
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    renderCartItems();
    updateCartSummary();
    updateCartCount();
}

// Remove item from cart
function removeFromCart(index) {
    if (confirm('Remove this item from your cart?')) {
        const item = cartItems[index];
        cartItems.splice(index, 1);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
        // Animate removal
        const cartItem = document.querySelector(`[data-index="${index}"]`);
        if (cartItem) {
            cartItem.classList.add('removing');
            setTimeout(() => {
                renderCartItems();
                updateCartSummary();
                updateCartCount();
                showNotification('Item removed from cart', 'success');
            }, 500);
        }
    }
}

// Clear entire cart
function clearCart() {
    if (confirm('Remove all items from your cart?')) {
        cartItems = [];
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        renderCartItems();
        updateCartSummary();
        updateCartCount();
        showNotification('Cart cleared', 'success');
    }
}

// Update cart summary
function updateCartSummary() {
    let subtotal = 0;
    
    cartItems.forEach(item => {
        // Extract numeric value from price string (remove $ and commas)
        const priceValue = parseFloat(item.price.replace(/[$,]/g, ''));
        subtotal += priceValue * item.quantity;
    });
    
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;
    
    // Update summary elements
    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');
    
    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    if (taxEl) taxEl.textContent = formatPrice(tax);
    if (totalEl) totalEl.textContent = formatPrice(total);
}

// Format price for display
function formatPrice(price) {
    return '$' + price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

// Bind cart event listeners
function bindCartEventListeners() {
    // Clear cart button
    const clearCartBtn = document.getElementById('clearCart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }

    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cartItems.length === 0) {
                showNotification('Your cart is empty', 'warning');
                return;
            }
            window.location.href = 'Checkout.html';
        });
    }

    // Add to cart buttons in recommended section
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
            e.preventDefault();
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                const productName = productCard.querySelector('.product-name').textContent;
                const productPrice = productCard.querySelector('.current-price').textContent;
                const productImage = productCard.querySelector('.product-image img').src;
                const productBrand = productCard.querySelector('.product-brand').textContent;
                
                addToCart({
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    brand: productBrand,
                    quantity: 1
                });
            }
        }
    });
}

// Add item to cart
function addToCart(item) {
    const existingItem = cartItems.find(cartItem => cartItem.name === item.name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push(item);
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    renderCartItems();
    updateCartSummary();
    updateCartCount();
    showNotification('Item added to cart', 'success');
}

// React Components for cart functionality
function initReactCartComponents() {
    // Cart Summary Component
    const CartSummary = () => {
        const [items, setItems] = React.useState(JSON.parse(localStorage.getItem('cartItems')) || []);
        
        const calculateTotal = () => {
            let total = 0;
            items.forEach(item => {
                const priceValue = parseFloat(item.price.replace(/[$,]/g, ''));
                total += priceValue * item.quantity;
            });
            return total + (total * 0.08); // Add 8% tax
        };

        return React.createElement('div', { className: 'react-cart-summary' },
            React.createElement('div', { className: 'summary-header' },
                React.createElement('h3', null, 'React Cart Summary')
            ),
            React.createElement('div', { className: 'summary-details' },
                React.createElement('div', { className: 'summary-row' },
                    React.createElement('span', null, 'Items:'),
                    React.createElement('span', null, items.length)
                ),
                React.createElement('div', { className: 'summary-row total' },
                    React.createElement('span', null, 'Total:'),
                    React.createElement('span', null, formatPrice(calculateTotal()))
                )
            )
        );
    };

    // Cart Item Component
    const CartItem = ({ item, index, onUpdate, onRemove }) => {
        const [quantity, setQuantity] = React.useState(item.quantity);
        
        const handleQuantityChange = (newQuantity) => {
            setQuantity(newQuantity);
            onUpdate(index, newQuantity);
        };

        return React.createElement('div', { className: 'react-cart-item' },
            React.createElement('img', { src: item.image, alt: item.name, className: 'item-image' }),
            React.createElement('div', { className: 'item-details' },
                React.createElement('h4', null, item.name),
                React.createElement('p', null, item.price)
            ),
            React.createElement('div', { className: 'item-controls' },
                React.createElement('button', { 
                    onClick: () => handleQuantityChange(quantity - 1),
                    disabled: quantity <= 1
                }, '-'),
                React.createElement('span', { className: 'quantity' }, quantity),
                React.createElement('button', { 
                    onClick: () => handleQuantityChange(quantity + 1),
                    disabled: quantity >= 10
                }, '+'),
                React.createElement('button', { 
                    onClick: () => onRemove(index),
                    className: 'remove-btn'
                }, 'Remove')
            )
        );
    };

    // Render React components if containers exist
    const summaryContainer = document.getElementById('reactCartSummary');
    if (summaryContainer) {
        ReactDOM.render(React.createElement(CartSummary), summaryContainer);
    }

    const itemsContainer = document.getElementById('reactCartItems');
    if (itemsContainer) {
        const cartItemsComponents = cartItems.map((item, index) => 
            React.createElement(CartItem, {
                key: index,
                item: item,
                index: index,
                onUpdate: updateQuantity,
                onRemove: removeFromCart
            })
        );
        ReactDOM.render(
            React.createElement('div', { className: 'react-cart-items' }, ...cartItemsComponents),
            itemsContainer
        );
    }
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
console.log('Cart page initialized - Imperial Watches');
