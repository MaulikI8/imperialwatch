/* 
 * Imperial Watches - Interactive JavaScript
 * College project by Maulik Joshi and team
 * Features: Cart management, search, animations, responsive interactions
 */

// Wait for DOM to load before initializing everything
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all website functionality
    initCart();
    initWishlist();
    initSearch();
    initNewsletter();
    initSmoothScrolling();
    initMobileMenu();
    initAnimations();
    initProductInteractions();
    initDropdowns();
    initNotifications();
});

// Global cart variables - using localStorage for persistence
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
let cartCount = 0;
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

function initCart() {
    updateCartCount();
    
    // Add to cart functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart') || 
            e.target.closest('.add-to-cart')) {
            e.preventDefault();
            addToCart(e.target);
        }
        
        // Buy now functionality
        if (e.target.classList.contains('buy-now') || 
            e.target.closest('.buy-now')) {
            e.preventDefault();
            buyNow(e.target);
        }
    });
}

// Initialize wishlist functionality
function initWishlist() {
    updateWishlistCount();
    
    // Wishlist functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('wishlist-btn') || 
            e.target.closest('.wishlist-btn')) {
            e.preventDefault();
            toggleWishlist(e.target);
        }
    });
}

function addToCart(button) {
    const productCard = button.closest('.product-card');
    const productName = productCard.querySelector('.product-name')?.textContent || productCard.querySelector('.product-title')?.textContent;
    const productPrice = productCard.querySelector('.current-price')?.textContent || productCard.querySelector('.product-price')?.textContent;
    const productImage = productCard.querySelector('.product-image img').src;
    
    const existingItem = cartItems.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            id: Date.now(),
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
    showNotification(`${productName} added to cart!`, 'success');
    
    // Dispatch event for React components
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    // Add animation to cart icon
    animateCartIcon();
}

// Buy now functionality
function buyNow(button) {
    const productCard = button.closest('.product-card');
    const productName = productCard.querySelector('.product-name')?.textContent || productCard.querySelector('.product-title')?.textContent;
    const productPrice = productCard.querySelector('.current-price')?.textContent || productCard.querySelector('.product-price')?.textContent;
    const productImage = productCard.querySelector('.product-image img').src;
    
    // Clear cart and add this item
    cartItems = [{
        id: Date.now(),
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: 1
    }];
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
    
    // Redirect to checkout
    window.location.href = '../pages/Checkout.html';
}

function updateCartCount() {
    cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        cartCountElement.style.display = cartCount > 0 ? 'block' : 'none';
    }
}

// Toggle wishlist item
function toggleWishlist(button) {
    const productCard = button.closest('.product-card');
    const productName = productCard.querySelector('.product-name').textContent;
    const productPrice = productCard.querySelector('.current-price').textContent;
    const productImage = productCard.querySelector('.product-image img').src;
    const productBrand = productCard.querySelector('.product-brand').textContent;
    
    const existingItem = favorites.find(item => item.name === productName);
    
    if (existingItem) {
        // Remove from wishlist
        favorites = favorites.filter(item => item.name !== productName);
        showNotification('Removed from wishlist', 'info');
        button.style.color = '#ccc';
    } else {
        // Add to wishlist
        favorites.push({
            name: productName,
            price: productPrice,
            image: productImage,
            brand: productBrand,
            description: productCard.querySelector('.product-description')?.textContent || 'Premium luxury timepiece'
        });
        showNotification('Added to wishlist', 'success');
        button.style.color = '#dc3545';
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateWishlistCount();
    
    // Dispatch event for React components
    window.dispatchEvent(new CustomEvent('wishlistUpdated'));
}

// Update wishlist count
function updateWishlistCount() {
    const wishlistCountElement = document.getElementById('wishlistCount');
    if (wishlistCountElement) {
        wishlistCountElement.textContent = favorites.length;
    }
}

function animateCartIcon() {
    const cartIcon = document.querySelector('.cart-action');
    if (cartIcon) {
        cartIcon.classList.add('animate-pulse');
        setTimeout(() => {
            cartIcon.classList.remove('animate-pulse');
        }, 1000);
    }
}

// Search Functionality
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            if (query.length > 2) {
                showSearchSuggestions(query);
            } else {
                hideSearchSuggestions();
            }
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const query = searchInput.value;
            if (query) {
                performSearch(query);
            }
        });
    }
}

function showSearchSuggestions(query) {
    // Sample suggestions - in real app, this would come from API
    const suggestions = [
        'Rolex Submariner',
        'Omega Seamaster',
        'Apple Watch',
        'Patek Philippe',
        'Cartier Santos',
        'Seiko Marinemaster'
    ];
    
    const filteredSuggestions = suggestions.filter(item => 
        item.toLowerCase().includes(query)
    );
    
    if (filteredSuggestions.length > 0) {
        createSuggestionsDropdown(filteredSuggestions);
    }
}

function createSuggestionsDropdown(suggestions) {
    // Remove existing dropdown
    hideSearchSuggestions();
    
    const searchSection = document.querySelector('.search-section');
    const dropdown = document.createElement('div');
    dropdown.className = 'search-suggestions';
    dropdown.innerHTML = suggestions.map(suggestion => 
        `<div class="suggestion-item" data-suggestion="${suggestion}">${suggestion}</div>`
    ).join('');
    
    searchSection.appendChild(dropdown);
    
    // Add click handlers
    dropdown.addEventListener('click', function(e) {
        if (e.target.classList.contains('suggestion-item')) {
            const suggestion = e.target.dataset.suggestion;
            document.querySelector('.search-input').value = suggestion;
            performSearch(suggestion);
            hideSearchSuggestions();
        }
    });
}

function hideSearchSuggestions() {
    const existing = document.querySelector('.search-suggestions');
    if (existing) {
        existing.remove();
    }
}

function performSearch(query) {
    showNotification(`Searching for "${query}"...`, 'info');
    // In real app, this would redirect to search results page
    setTimeout(() => {
        showNotification(`Found 12 results for "${query}"`, 'success');
    }, 1000);
}

// Newsletter
function initNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (validateEmail(email)) {
                showNotification('Thank you for subscribing!', 'success');
                this.reset();
            } else {
                showNotification('Please enter a valid email address', 'error');
            }
        });
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
}

// Mobile Menu
function initMobileMenu() {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
}

// Premium Animations
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered animation
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                    entry.target.classList.add('animate-in');
                }, index * 100);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.scroll-reveal, .product-card, .feature-card, .testimonial-card, .luxury-item').forEach(el => {
        observer.observe(el);
    });
    
    // Add premium hover effects
    document.querySelectorAll('.premium-hover').forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add shimmer effect to buttons
    document.querySelectorAll('.btn-primary').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.classList.add('animate-shimmer');
        });
        
        button.addEventListener('mouseleave', function() {
            this.classList.remove('animate-shimmer');
        });
    });
}

// Product Interactions
function initProductInteractions() {
    // Wishlist functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('wishlist-btn') || 
            e.target.closest('.wishlist-btn')) {
            e.preventDefault();
            toggleWishlist(e.target);
        }
    });
    
    // Quick view functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('quick-view-btn') || 
            e.target.closest('.quick-view-btn')) {
            e.preventDefault();
            showQuickView(e.target);
        }
    });
}

function toggleWishlist(button) {
    const productCard = button.closest('.product-card');
    const productName = productCard.querySelector('.product-name').textContent;
    
    button.classList.toggle('active');
    
    if (button.classList.contains('active')) {
        showNotification(`${productName} added to wishlist!`, 'success');
    } else {
        showNotification(`${productName} removed from wishlist!`, 'info');
    }
}

function showQuickView(button) {
    const productCard = button.closest('.product-card');
    const productName = productCard.querySelector('.product-name').textContent;
    const productPrice = productCard.querySelector('.current-price').textContent;
    const productImage = productCard.querySelector('.product-image img').src;
    const productDescription = productCard.querySelector('.product-description').textContent;
    
    // Create quick view modal
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <div class="modal-body">
                <div class="modal-image">
                    <img src="${productImage}" alt="${productName}">
                </div>
                <div class="modal-info">
                    <h3>${productName}</h3>
                    <p class="modal-description">${productDescription}</p>
                    <div class="modal-price">${productPrice}</div>
                    <div class="modal-actions">
                        <button class="btn-primary">Buy Now</button>
                        <button class="btn-secondary add-to-cart">Add to Cart</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.querySelector('.modal-overlay').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.querySelector('.add-to-cart').addEventListener('click', () => {
        addToCart(modal.querySelector('.add-to-cart'));
        modal.remove();
    });
    
    // Show modal with animation
    setTimeout(() => modal.classList.add('show'), 10);
}

// Dropdown Menus
function initDropdowns() {
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        const link = dropdown.querySelector('.category-link');
        const menu = dropdown.querySelector('.mega-menu');
        
        if (link && menu) {
            let timeout;
            
            dropdown.addEventListener('mouseenter', () => {
                clearTimeout(timeout);
                menu.style.opacity = '1';
                menu.style.visibility = 'visible';
                menu.style.transform = 'translateY(0)';
            });
            
            dropdown.addEventListener('mouseleave', () => {
                timeout = setTimeout(() => {
                    menu.style.opacity = '0';
                    menu.style.visibility = 'hidden';
                    menu.style.transform = 'translateY(-10px)';
                }, 100);
            });
        }
    });
}

// Notification System
function initNotifications() {
    // Create notification container if it doesn't exist
    if (!document.querySelector('.notification-container')) {
        const container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
}

function showNotification(message, type = 'info') {
    const container = document.querySelector('.notification-container');
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    container.appendChild(notification);
    
    // Add close functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
    
    // Show notification with animation
    setTimeout(() => notification.classList.add('show'), 10);
}

// Utility Functions
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Add CSS for animations and notifications
const style = document.createElement('style');
style.textContent = `
    .animate-pulse {
        animation: pulse 0.5s ease-in-out;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .product-card, .feature-card, .testimonial-card, .luxury-item {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .product-card.animate-in, .feature-card.animate-in, .testimonial-card.animate-in, .luxury-item.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .search-suggestions {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        max-height: 200px;
        overflow-y: auto;
    }
    
    .suggestion-item {
        padding: 12px 16px;
        cursor: pointer;
        border-bottom: 1px solid #f0f0f0;
        transition: background 0.2s ease;
    }
    
    .suggestion-item:hover {
        background: #f8f9fa;
    }
    
    .quick-view-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }
    
    .quick-view-modal.show {
        opacity: 1;
        visibility: visible;
    }
    
    .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
    }
    
    .modal-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 16px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    }
    
    .modal-close {
        position: absolute;
        top: 16px;
        right: 16px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        z-index: 1;
    }
    
    .modal-body {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
        padding: 30px;
    }
    
    .modal-image img {
        width: 100%;
        height: 300px;
        object-fit: cover;
        border-radius: 12px;
    }
    
    .modal-info h3 {
        margin-bottom: 16px;
    }
    
    .modal-description {
        margin-bottom: 20px;
        color: #666;
    }
    
    .modal-price {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 24px;
    }
    
    .modal-actions {
        display: flex;
        gap: 12px;
    }
    
    .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 3000;
        max-width: 400px;
    }
    
    .notification {
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        margin-bottom: 12px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        border-left: 4px solid #2ed573;
    }
    
    .notification-error {
        border-left: 4px solid #ff4757;
    }
    
    .notification-info {
        border-left: 4px solid #3742fa;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
    }
    
    .notification-message {
        color: #333;
        font-weight: 500;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #999;
        margin-left: 12px;
    }
    
    .wishlist-btn.active {
        background: #ff4757 !important;
        color: white !important;
    }
    
    @media (max-width: 768px) {
        .modal-body {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 20px;
        }
        
        .modal-actions {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(style);