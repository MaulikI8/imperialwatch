/* 
 * Favorites Page JavaScript - Imperial Watches
 * College project by Maulik Joshi and team
 * Features: Wishlist management, React components, localStorage integration
 */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initFavoritesPage();
    initReactComponents();
});

// Global variables
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let selectedFavorites = [];

// Initialize favorites page functionality
function initFavoritesPage() {
    updateWishlistCount();
    renderFavorites();
    bindEventListeners();
}

// Update wishlist count in header
function updateWishlistCount() {
    const wishlistCount = document.getElementById('wishlistCount');
    if (wishlistCount) {
        wishlistCount.textContent = favorites.length;
    }
}

// Render favorites grid
function renderFavorites() {
    const favoritesGrid = document.getElementById('favoritesGrid');
    const emptyFavorites = document.getElementById('emptyFavorites');
    const favoritesActions = document.getElementById('favoritesActions');

    if (favorites.length === 0) {
        emptyFavorites.style.display = 'block';
        favoritesGrid.style.display = 'none';
        favoritesActions.style.display = 'none';
        return;
    }

    emptyFavorites.style.display = 'none';
    favoritesGrid.style.display = 'grid';
    favoritesActions.style.display = 'flex';

    favoritesGrid.innerHTML = favorites.map((item, index) => `
        <div class="favorite-item" data-index="${index}">
            <input type="checkbox" class="favorite-checkbox" data-index="${index}">
            <div class="favorite-content">
                <div class="favorite-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                </div>
                <div class="favorite-details">
                    <div class="favorite-brand">${item.brand}</div>
                    <h3 class="favorite-name">${item.name}</h3>
                    <p class="favorite-description">${item.description}</p>
                    <div class="favorite-price">${item.price}</div>
                    <div class="favorite-actions">
                        <button class="btn-primary" onclick="buyNow('${item.name}')">Buy Now</button>
                        <button class="btn-secondary add-to-cart" onclick="addToCartFromFavorites('${item.name}')">Add to Cart</button>
                        <button class="remove-favorite" onclick="removeFavorite(${index})">Remove</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Bind event listeners
function bindEventListeners() {
    // Clear all favorites
    const clearAllBtn = document.getElementById('clearAllFavorites');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', clearAllFavorites);
    }

    // Select all favorites
    const selectAllBtn = document.getElementById('selectAllFavorites');
    if (selectAllBtn) {
        selectAllBtn.addEventListener('click', selectAllFavorites);
    }

    // Add selected to cart
    const addSelectedBtn = document.getElementById('addSelectedToCart');
    if (addSelectedBtn) {
        addSelectedBtn.addEventListener('click', addSelectedToCart);
    }

    // Individual checkbox change
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('favorite-checkbox')) {
            const index = parseInt(e.target.dataset.index);
            const isChecked = e.target.checked;
            
            if (isChecked) {
                selectedFavorites.push(index);
                e.target.closest('.favorite-item').classList.add('selected');
            } else {
                selectedFavorites = selectedFavorites.filter(i => i !== index);
                e.target.closest('.favorite-item').classList.remove('selected');
            }
        }
    });
}

// Remove favorite item
function removeFavorite(index) {
    if (confirm('Remove this item from your favorites?')) {
        favorites.splice(index, 1);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        
        // Animate removal
        const favoriteItem = document.querySelector(`[data-index="${index}"]`);
        if (favoriteItem) {
            favoriteItem.classList.add('removing');
            setTimeout(() => {
                renderFavorites();
                updateWishlistCount();
            }, 500);
        }
    }
}

// Clear all favorites
function clearAllFavorites() {
    if (confirm('Remove all items from your favorites?')) {
        favorites = [];
        selectedFavorites = [];
        localStorage.setItem('favorites', JSON.stringify(favorites));
        renderFavorites();
        updateWishlistCount();
        showNotification('All favorites cleared', 'success');
    }
}

// Select all favorites
function selectAllFavorites() {
    const checkboxes = document.querySelectorAll('.favorite-checkbox');
    selectedFavorites = [];
    
    checkboxes.forEach((checkbox, index) => {
        checkbox.checked = true;
        selectedFavorites.push(index);
        checkbox.closest('.favorite-item').classList.add('selected');
    });
}

// Add selected favorites to cart
function addSelectedToCart() {
    if (selectedFavorites.length === 0) {
        showNotification('Please select items to add to cart', 'warning');
        return;
    }

    selectedFavorites.forEach(index => {
        const item = favorites[index];
        addToCart(item);
    });

    showNotification(`${selectedFavorites.length} items added to cart`, 'success');
    selectedFavorites = [];
    
    // Clear selections
    document.querySelectorAll('.favorite-checkbox').forEach(checkbox => {
        checkbox.checked = false;
        checkbox.closest('.favorite-item').classList.remove('selected');
    });
}

// Add to cart from favorites
function addToCartFromFavorites(productName) {
    const item = favorites.find(fav => fav.name === productName);
    if (item) {
        addToCart(item);
        showNotification('Item added to cart', 'success');
    }
}

// Buy now from favorites
function buyNow(productName) {
    const item = favorites.find(fav => fav.name === productName);
    if (item) {
        addToCart(item);
        // Redirect to checkout
        window.location.href = 'Checkout.html';
    }
}

// React Components for dynamic functionality
function initReactComponents() {
    // Create a React component for favorite item management
    const FavoriteManager = () => {
        const [favorites, setFavorites] = React.useState(JSON.parse(localStorage.getItem('favorites')) || []);
        
        const handleRemoveFavorite = (index) => {
            const newFavorites = favorites.filter((_, i) => i !== index);
            setFavorites(newFavorites);
            localStorage.setItem('favorites', JSON.stringify(newFavorites));
        };

        const handleAddToCart = (item) => {
            // Add to cart logic
            const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            const existingItem = cartItems.find(cartItem => cartItem.name === item.name);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cartItems.push({
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    quantity: 1
                });
            }
            
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            updateCartCount();
            showNotification('Item added to cart', 'success');
        };

        return React.createElement('div', { className: 'react-favorite-manager' },
            React.createElement('div', { className: 'favorites-stats' },
                React.createElement('p', null, `You have ${favorites.length} favorite items`)
            )
        );
    };

    // Render React component if container exists
    const reactContainer = document.getElementById('reactFavoritesManager');
    if (reactContainer) {
        ReactDOM.render(React.createElement(FavoriteManager), reactContainer);
    }
}

// Utility function to show notifications
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize page when loaded
console.log('Favorites page initialized - Imperial Watches');
