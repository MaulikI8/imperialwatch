// Product Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initProductFilters();
    initProductSorting();
    initViewToggle();
    initProductComparison();
    initLoadMore();
    initProductInteractions();
});

// Product Filters
function initProductFilters() {
    const filtersSidebar = document.querySelector('.filters-sidebar');
    const productsGrid = document.getElementById('productsGrid');
    const clearFiltersBtn = document.querySelector('.clear-filters');
    const priceSlider = document.getElementById('priceSlider');
    const priceMin = document.querySelector('.price-min');
    const priceMax = document.querySelector('.price-max');
    
    // Price filter
    if (priceSlider) {
        priceSlider.addEventListener('input', function() {
            const maxPrice = parseInt(this.value);
            priceMax.textContent = `$${maxPrice.toLocaleString()}`;
            filterProducts();
        });
    }
    
    // Checkbox filters
    const checkboxes = filtersSidebar.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterProducts);
    });
    
    // Clear filters
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            priceSlider.value = priceSlider.max;
            priceMax.textContent = `$${parseInt(priceSlider.max).toLocaleString()}`;
            filterProducts();
            showNotification('Filters cleared', 'info');
        });
    }
}

function filterProducts() {
    const products = document.querySelectorAll('.product-card');
    const selectedBrands = getSelectedValues('input[type="checkbox"][value="rolex"], input[type="checkbox"][value="omega"], input[type="checkbox"][value="patek"], input[type="checkbox"][value="cartier"], input[type="checkbox"][value="audemars"], input[type="checkbox"][value="apple"], input[type="checkbox"][value="seiko"], input[type="checkbox"][value="samsung"]');
    const selectedCategories = getSelectedValues('input[type="checkbox"][value="luxury"], input[type="checkbox"][value="smart"], input[type="checkbox"][value="sports"], input[type="checkbox"][value="dress"], input[type="checkbox"][value="diving"]');
    const selectedFeatures = getSelectedValues('input[type="checkbox"][value="chronograph"], input[type="checkbox"][value="waterproof"], input[type="checkbox"][value="automatic"], input[type="checkbox"][value="limited"]');
    const maxPrice = parseInt(document.getElementById('priceSlider').value);
    
    let visibleCount = 0;
    
    products.forEach(product => {
        const productPrice = parseInt(product.dataset.price);
        const productBrand = product.dataset.brand;
        const productCategory = product.dataset.category;
        const productFeatures = getProductFeatures(product);
        
        let shouldShow = true;
        
        // Price filter
        if (productPrice > maxPrice) {
            shouldShow = false;
        }
        
        // Brand filter
        if (selectedBrands.length > 0 && !selectedBrands.includes(productBrand)) {
            shouldShow = false;
        }
        
        // Category filter
        if (selectedCategories.length > 0 && !selectedCategories.includes(productCategory)) {
            shouldShow = false;
        }
        
        // Features filter
        if (selectedFeatures.length > 0) {
            const hasFeature = selectedFeatures.some(feature => productFeatures.includes(feature));
            if (!hasFeature) {
                shouldShow = false;
            }
        }
        
        // Show/hide product with animation
        if (shouldShow) {
            product.style.display = 'block';
            product.classList.remove('filtered-out');
            product.classList.add('filtered-in');
            visibleCount++;
        } else {
            product.classList.add('filtered-out');
            setTimeout(() => {
                product.style.display = 'none';
            }, 300);
        }
    });
    
    // Update results count
    updateResultsCount(visibleCount);
}

function getSelectedValues(selector) {
    const checkboxes = document.querySelectorAll(selector);
    return Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
}

function getProductFeatures(product) {
    const featureElements = product.querySelectorAll('.feature');
    return Array.from(featureElements).map(el => el.textContent.toLowerCase());
}

function updateResultsCount(count) {
    const resultsCount = document.querySelector('.results-count');
    if (resultsCount) {
        resultsCount.textContent = `Showing ${count} luxury watches`;
    }
}

// Product Sorting
function initProductSorting() {
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortProducts(this.value);
        });
    }
}

function sortProducts(sortBy) {
    const productsGrid = document.getElementById('productsGrid');
    const products = Array.from(document.querySelectorAll('.product-card'));
    
    products.sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return parseInt(a.dataset.price) - parseInt(b.dataset.price);
            case 'price-high':
                return parseInt(b.dataset.price) - parseInt(a.dataset.price);
            case 'newest':
                // For demo, we'll sort by a random order
                return Math.random() - 0.5;
            case 'popular':
                // Sort by rating count (simulated)
                const aReviews = parseInt(a.querySelector('.rating-count').textContent.match(/\d+/)[0]);
                const bReviews = parseInt(b.querySelector('.rating-count').textContent.match(/\d+/)[0]);
                return bReviews - aReviews;
            case 'rating':
                // All products have 5 stars, so we'll sort by review count
                const aRating = parseInt(a.querySelector('.rating-count').textContent.match(/\d+/)[0]);
                const bRating = parseInt(b.querySelector('.rating-count').textContent.match(/\d+/)[0]);
                return bRating - aRating;
            default: // featured
                return 0;
        }
    });
    
    // Clear grid and re-append sorted products
    productsGrid.innerHTML = '';
    products.forEach(product => {
        productsGrid.appendChild(product);
    });
    
    showNotification(`Products sorted by ${getSortLabel(sortBy)}`, 'info');
}

function getSortLabel(sortBy) {
    const labels = {
        'price-low': 'Price: Low to High',
        'price-high': 'Price: High to Low',
        'newest': 'Newest First',
        'popular': 'Most Popular',
        'rating': 'Highest Rated',
        'featured': 'Featured'
    };
    return labels[sortBy] || 'Featured';
}

// View Toggle
function initViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const productsGrid = document.getElementById('productsGrid');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const view = this.dataset.view;
            
            // Update active button
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update grid view
            if (view === 'list') {
                productsGrid.classList.add('list-view');
            } else {
                productsGrid.classList.remove('list-view');
            }
            
            showNotification(`Switched to ${view} view`, 'info');
        });
    });
}

// Product Comparison
let comparisonProducts = [];

function initProductComparison() {
    const compareButtons = document.querySelectorAll('.compare-btn');
    
    compareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            toggleProductComparison(productCard, this);
        });
    });
    
    // Add comparison bar
    createComparisonBar();
}

function toggleProductComparison(productCard, button) {
    const productName = productCard.querySelector('.product-name').textContent;
    const productId = productCard.dataset.id || productName.toLowerCase().replace(/\s+/g, '-');
    
    if (button.classList.contains('active')) {
        // Remove from comparison
        comparisonProducts = comparisonProducts.filter(id => id !== productId);
        button.classList.remove('active');
        showNotification(`${productName} removed from comparison`, 'info');
    } else {
        // Add to comparison (max 3 products)
        if (comparisonProducts.length >= 3) {
            showNotification('You can compare maximum 3 products', 'error');
            return;
        }
        
        comparisonProducts.push(productId);
        button.classList.add('active');
        showNotification(`${productName} added to comparison`, 'success');
    }
    
    updateComparisonBar();
}

function createComparisonBar() {
    const comparisonBar = document.createElement('div');
    comparisonBar.className = 'comparison-bar';
    comparisonBar.innerHTML = `
        <div class="comparison-content">
            <span class="comparison-text">Compare Products</span>
            <div class="comparison-products"></div>
            <div class="comparison-actions">
                <button class="btn-secondary clear-comparison">Clear All</button>
                <button class="btn-primary compare-now">Compare Now</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(comparisonBar);
    
    // Add event listeners
    comparisonBar.querySelector('.clear-comparison').addEventListener('click', clearComparison);
    comparisonBar.querySelector('.compare-now').addEventListener('click', showComparison);
}

function updateComparisonBar() {
    const comparisonBar = document.querySelector('.comparison-bar');
    const comparisonProductsDiv = comparisonBar.querySelector('.comparison-products');
    const compareNowBtn = comparisonBar.querySelector('.compare-now');
    
    if (comparisonProducts.length > 0) {
        comparisonBar.classList.add('active');
        comparisonProductsDiv.innerHTML = comparisonProducts.map(id => 
            `<span class="comparison-product">${id}</span>`
        ).join('');
        
        compareNowBtn.textContent = `Compare ${comparisonProducts.length} Product${comparisonProducts.length > 1 ? 's' : ''}`;
    } else {
        comparisonBar.classList.remove('active');
    }
}

function clearComparison() {
    comparisonProducts = [];
    document.querySelectorAll('.compare-btn.active').forEach(btn => {
        btn.classList.remove('active');
    });
    updateComparisonBar();
    showNotification('Comparison cleared', 'info');
}

function showComparison() {
    if (comparisonProducts.length < 2) {
        showNotification('Please select at least 2 products to compare', 'error');
        return;
    }
    
    // Create comparison modal
    createComparisonModal();
}

function createComparisonModal() {
    const modal = document.createElement('div');
    modal.className = 'comparison-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content comparison-modal-content">
            <button class="modal-close">&times;</button>
            <h3>Product Comparison</h3>
            <div class="comparison-table">
                <div class="comparison-header">
                    <div class="comparison-cell">Features</div>
                    ${comparisonProducts.map(id => `<div class="comparison-cell">${id}</div>`).join('')}
                </div>
                <div class="comparison-row">
                    <div class="comparison-cell">Price</div>
                    ${comparisonProducts.map(id => `<div class="comparison-cell">$XXX,XXX</div>`).join('')}
                </div>
                <div class="comparison-row">
                    <div class="comparison-cell">Brand</div>
                    ${comparisonProducts.map(id => `<div class="comparison-cell">Brand Name</div>`).join('')}
                </div>
                <div class="comparison-row">
                    <div class="comparison-cell">Rating</div>
                    ${comparisonProducts.map(id => `<div class="comparison-cell">★★★★★</div>`).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-overlay').addEventListener('click', () => modal.remove());
    
    // Show modal
    setTimeout(() => modal.classList.add('show'), 10);
}

// Load More
function initLoadMore() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            loadMoreProducts();
        });
    }
}

function loadMoreProducts() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const loadMoreText = document.querySelector('.load-more-text');
    
    // Show loading state
    loadMoreBtn.textContent = 'Loading...';
    loadMoreBtn.disabled = true;
    
    // Simulate loading
    setTimeout(() => {
        // In a real app, this would fetch more products from an API
        showNotification('No more products to load', 'info');
        
        // Reset button
        loadMoreBtn.textContent = 'Load More Products';
        loadMoreBtn.disabled = false;
        
        // Update text
        if (loadMoreText) {
            loadMoreText.textContent = 'Showing all 83 products';
        }
    }, 1500);
}

// Enhanced Product Interactions
function initProductInteractions() {
    // Quick view enhancement
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('quick-view-btn') || 
            e.target.closest('.quick-view-btn')) {
            e.preventDefault();
            showEnhancedQuickView(e.target);
        }
    });
    
    // Wishlist enhancement
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('wishlist-btn') || 
            e.target.closest('.wishlist-btn')) {
            e.preventDefault();
            toggleWishlistEnhanced(e.target);
        }
    });
}

function showEnhancedQuickView(button) {
    const productCard = button.closest('.product-card');
    const productName = productCard.querySelector('.product-name').textContent;
    const productBrand = productCard.querySelector('.product-brand').textContent;
    const productPrice = productCard.querySelector('.current-price').textContent;
    const productImage = productCard.querySelector('.product-image img').src;
    const productDescription = productCard.querySelector('.product-description').textContent;
    const productRating = productCard.querySelector('.product-rating').innerHTML;
    const productFeatures = Array.from(productCard.querySelectorAll('.feature')).map(el => el.textContent);
    
    // Create enhanced quick view modal
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal enhanced';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content enhanced-quick-view">
            <button class="modal-close">&times;</button>
            <div class="modal-body">
                <div class="modal-image">
                    <img src="${productImage}" alt="${productName}">
                    <div class="image-zoom-hint">Click to zoom</div>
                </div>
                <div class="modal-info">
                    <div class="product-brand">${productBrand}</div>
                    <h3>${productName}</h3>
                    <div class="product-rating">${productRating}</div>
                    <p class="modal-description">${productDescription}</p>
                    <div class="product-features">
                        ${productFeatures.map(feature => `<span class="feature">${feature}</span>`).join('')}
                    </div>
                    <div class="modal-price">${productPrice}</div>
                    <div class="modal-actions">
                        <button class="btn-primary">Buy Now</button>
                        <button class="btn-secondary add-to-cart">Add to Cart</button>
                        <button class="action-btn wishlist-btn">
                            <i class="icon-heart"></i>
                        </button>
                        <button class="action-btn compare-btn">
                            <i class="icon-compare"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-overlay').addEventListener('click', () => modal.remove());
    modal.querySelector('.add-to-cart').addEventListener('click', () => {
        addToCart(modal.querySelector('.add-to-cart'));
        modal.remove();
    });
    
    // Image zoom functionality
    const image = modal.querySelector('.modal-image img');
    image.addEventListener('click', function() {
        this.style.transform = this.style.transform === 'scale(2)' ? 'scale(1)' : 'scale(2)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    // Show modal
    setTimeout(() => modal.classList.add('show'), 10);
}

function toggleWishlistEnhanced(button) {
    const productCard = button.closest('.product-card');
    const productName = productCard.querySelector('.product-name').textContent;
    
    button.classList.toggle('active');
    
    if (button.classList.contains('active')) {
        showNotification(`${productName} added to wishlist!`, 'success');
        // Add to wishlist storage
        addToWishlist(productName);
    } else {
        showNotification(`${productName} removed from wishlist`, 'info');
        // Remove from wishlist storage
        removeFromWishlist(productName);
    }
}

function addToWishlist(productName) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (!wishlist.includes(productName)) {
        wishlist.push(productName);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistCount();
    }
}

function removeFromWishlist(productName) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist = wishlist.filter(item => item !== productName);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
}

function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistBadge = document.querySelector('.user-action .badge');
    if (wishlistBadge) {
        wishlistBadge.textContent = wishlist.length;
        wishlistBadge.style.display = wishlist.length > 0 ? 'block' : 'none';
    }
}

// Add CSS for enhanced features
const enhancedStyles = document.createElement('style');
enhancedStyles.textContent = `
    .comparison-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #1a1a1a;
        color: white;
        padding: 16px;
        transform: translateY(100%);
        transition: transform 0.3s ease;
        z-index: 1000;
    }
    
    .comparison-bar.active {
        transform: translateY(0);
    }
    
    .comparison-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        max-width: 1200px;
        margin: 0 auto;
    }
    
    .comparison-products {
        display: flex;
        gap: 8px;
        flex: 1;
        margin: 0 20px;
    }
    
    .comparison-product {
        background: #333;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
    }
    
    .comparison-actions {
        display: flex;
        gap: 12px;
    }
    
    .comparison-modal-content {
        max-width: 800px;
        width: 90%;
    }
    
    .comparison-table {
        display: grid;
        grid-template-columns: 1fr repeat(3, 1fr);
        gap: 1px;
        background: #ddd;
        border-radius: 8px;
        overflow: hidden;
    }
    
    .comparison-header,
    .comparison-row {
        display: contents;
    }
    
    .comparison-cell {
        background: white;
        padding: 16px;
        text-align: center;
        font-weight: 500;
    }
    
    .comparison-header .comparison-cell {
        background: #f8f9fa;
        font-weight: 600;
    }
    
    .enhanced-quick-view .modal-body {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
        padding: 30px;
    }
    
    .enhanced-quick-view .modal-image {
        position: relative;
        cursor: zoom-in;
    }
    
    .enhanced-quick-view .modal-image img {
        width: 100%;
        height: 400px;
        object-fit: cover;
        border-radius: 12px;
    }
    
    .image-zoom-hint {
        position: absolute;
        bottom: 12px;
        right: 12px;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
    }
    
    .enhanced-quick-view .modal-actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
    }
    
    .enhanced-quick-view .modal-actions .action-btn {
        width: 40px;
        height: 40px;
        border: 2px solid #ddd;
        background: white;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    }
    
    .enhanced-quick-view .modal-actions .action-btn:hover {
        border-color: #1a1a1a;
        background: #f8f9fa;
    }
    
    .enhanced-quick-view .modal-actions .action-btn.active {
        border-color: #1a1a1a;
        background: #1a1a1a;
        color: white;
    }
    
    @media (max-width: 768px) {
        .comparison-content {
            flex-direction: column;
            gap: 12px;
        }
        
        .comparison-products {
            margin: 0;
            justify-content: center;
        }
        
        .enhanced-quick-view .modal-body {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 20px;
        }
        
        .enhanced-quick-view .modal-actions {
            justify-content: center;
        }
    }
`;
document.head.appendChild(enhancedStyles);
