// Blog Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initCategoryFilter();
    initArticleInteractions();
    initScrollAnimations();
    initNewsletterForms();
    initLoadMore();
    initShareFunctionality();
    initSearchFunctionality();
});

// Category Filter
function initCategoryFilter() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const articleCards = document.querySelectorAll('.article-card');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedCategory = this.dataset.category;
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter articles
            filterArticles(selectedCategory, articleCards);
            
            // Update URL
            updateURL(selectedCategory);
        });
    });
    
    // Check for category in URL on load
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromURL = urlParams.get('category');
    if (categoryFromURL) {
        const button = document.querySelector(`[data-category="${categoryFromURL}"]`);
        if (button) {
            button.click();
        }
    }
}

function filterArticles(category, articleCards) {
    let visibleCount = 0;
    
    articleCards.forEach(card => {
        const cardCategory = card.dataset.category;
        
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            card.classList.remove('filtered-out');
            card.classList.add('filtered-in');
            visibleCount++;
        } else {
            card.classList.add('filtered-out');
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
    
    // Update results count
    updateResultsCount(visibleCount);
    
    // Show notification
    const categoryName = getCategoryName(category);
    showNotification(`Showing ${categoryName} articles`, 'info');
}

function getCategoryName(category) {
    const names = {
        'all': 'all',
        'reviews': 'watch review',
        'news': 'industry news',
        'guides': 'buying guide',
        'heritage': 'heritage',
        'investment': 'investment'
    };
    return names[category] || category;
}

function updateResultsCount(count) {
    const loadMoreText = document.querySelector('.load-more-text');
    if (loadMoreText) {
        loadMoreText.textContent = `Showing ${count} of ${count} articles`;
    }
}

function updateURL(category) {
    const url = new URL(window.location);
    if (category === 'all') {
        url.searchParams.delete('category');
    } else {
        url.searchParams.set('category', category);
    }
    window.history.pushState({}, '', url);
}

// Article Interactions
function initArticleInteractions() {
    const articleCards = document.querySelectorAll('.article-card');
    const readButtons = document.querySelectorAll('.read-btn');
    
    // Article card click
    articleCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.article-actions') && !e.target.closest('.article-footer')) {
                showArticleModal(this);
            }
        });
    });
    
    // Read button click
    readButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const articleCard = this.closest('.article-card');
            showArticleModal(articleCard);
        });
    });
}

function showArticleModal(articleCard) {
    const articleImage = articleCard.querySelector('.article-image img').src;
    const articleTitle = articleCard.querySelector('h3').textContent;
    const articleMeta = articleCard.querySelector('.article-meta').innerHTML;
    const articleContent = articleCard.querySelector('p').textContent;
    const authorInfo = articleCard.querySelector('.author-info').innerHTML;
    const articleStats = articleCard.querySelector('.article-stats').innerHTML;
    
    // Create article modal
    const modal = document.createElement('div');
    modal.className = 'article-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content article-modal-content">
            <button class="modal-close">&times;</button>
            <div class="modal-header">
                <div class="modal-image">
                    <img src="${articleImage}" alt="${articleTitle}">
                </div>
                <div class="modal-meta">
                    ${articleMeta}
                    <h2>${articleTitle}</h2>
                    <div class="modal-author">
                        ${authorInfo}
                    </div>
                </div>
            </div>
            <div class="modal-body">
                <p>${articleContent}</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <blockquote>
                    "The beauty of a luxury timepiece lies not just in its appearance, but in the centuries of craftsmanship and innovation that brought it to life."
                </blockquote>
                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
            </div>
            <div class="modal-footer">
                <div class="modal-actions">
                    <button class="btn-primary">Read Full Article</button>
                    <button class="btn-secondary share-article-btn">
                        <i class="icon-share"></i> Share
                    </button>
                    <button class="btn-secondary bookmark-btn">
                        <i class="icon-heart"></i> Bookmark
                    </button>
                </div>
                <div class="modal-stats">
                    ${articleStats}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-overlay').addEventListener('click', () => modal.remove());
    modal.querySelector('.share-article-btn').addEventListener('click', () => shareArticle(articleTitle));
    modal.querySelector('.bookmark-btn').addEventListener('click', () => bookmarkArticle(articleTitle));
    
    // Show modal
    setTimeout(() => modal.classList.add('show'), 10);
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 100);
            }
        });
    }, observerOptions);
    
    // Observe article cards
    const articleCards = document.querySelectorAll('.article-card');
    articleCards.forEach(card => {
        observer.observe(card);
    });
}

// Newsletter Forms
function initNewsletterForms() {
    const newsletterForms = document.querySelectorAll('.newsletter-form, .sidebar-newsletter');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (validateEmail(email)) {
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                this.reset();
            } else {
                showNotification('Please enter a valid email address', 'error');
            }
        });
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Load More
function initLoadMore() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            loadMoreArticles();
        });
    }
}

function loadMoreArticles() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const loadMoreText = document.querySelector('.load-more-text');
    
    // Show loading state
    loadMoreBtn.textContent = 'Loading...';
    loadMoreBtn.disabled = true;
    
    // Simulate loading
    setTimeout(() => {
        showNotification('No more articles to load', 'info');
        
        // Reset button
        loadMoreBtn.textContent = 'Load More Articles';
        loadMoreBtn.disabled = false;
        
        // Update text
        if (loadMoreText) {
            loadMoreText.textContent = 'Showing all 24 articles';
        }
    }, 1500);
}

// Share Functionality
function initShareFunctionality() {
    const shareButtons = document.querySelectorAll('.share-btn, .share-article-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const articleTitle = this.closest('.article-card')?.querySelector('h3')?.textContent || 
                               this.closest('.modal-content')?.querySelector('h2')?.textContent ||
                               'Imperial Watches Article';
            shareArticle(articleTitle);
        });
    });
}

function shareArticle(title) {
    if (navigator.share) {
        navigator.share({
            title: title,
            url: window.location.href
        }).then(() => {
            showNotification('Article shared successfully!', 'success');
        }).catch(() => {
            showNotification('Share cancelled', 'info');
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            showNotification('Article link copied to clipboard!', 'success');
        }).catch(() => {
            showNotification('Unable to share article', 'error');
        });
    }
}

// Bookmark Functionality
function bookmarkArticle(title) {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    
    if (bookmarks.includes(title)) {
        bookmarks = bookmarks.filter(item => item !== title);
        showNotification('Article removed from bookmarks', 'info');
    } else {
        bookmarks.push(title);
        showNotification('Article bookmarked!', 'success');
    }
    
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    updateBookmarkButton(title);
}

function updateBookmarkButton(title) {
    const bookmarkBtn = document.querySelector('.bookmark-btn');
    if (bookmarkBtn) {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
        if (bookmarks.includes(title)) {
            bookmarkBtn.classList.add('bookmarked');
            bookmarkBtn.innerHTML = '<i class="icon-heart"></i> Bookmarked';
        } else {
            bookmarkBtn.classList.remove('bookmarked');
            bookmarkBtn.innerHTML = '<i class="icon-heart"></i> Bookmark';
        }
    }
}

// Search Functionality
function initSearchFunctionality() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            const query = this.value.toLowerCase();
            if (query.length > 2) {
                searchArticles(query);
            } else if (query.length === 0) {
                clearSearch();
            }
        }, 300));
    }
}

function searchArticles(query) {
    const articleCards = document.querySelectorAll('.article-card');
    let visibleCount = 0;
    
    articleCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const content = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(query) || content.includes(query)) {
            card.style.display = 'block';
            card.classList.remove('filtered-out');
            card.classList.add('filtered-in');
            visibleCount++;
        } else {
            card.classList.add('filtered-out');
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
    
    updateResultsCount(visibleCount);
}

function clearSearch() {
    const articleCards = document.querySelectorAll('.article-card');
    articleCards.forEach(card => {
        card.style.display = 'block';
        card.classList.remove('filtered-out');
        card.classList.add('filtered-in');
    });
    
    updateResultsCount(articleCards.length);
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

// Add CSS for modals and animations
const blogStyles = document.createElement('style');
blogStyles.textContent = `
    .article-modal {
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
    
    .article-modal.show {
        opacity: 1;
        visibility: visible;
    }
    
    .article-modal-content {
        max-width: 800px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        background: white;
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }
    
    .modal-header {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 30px;
        padding: 30px;
        border-bottom: 1px solid #eee;
    }
    
    .modal-image img {
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: 12px;
    }
    
    .modal-meta {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    
    .modal-meta h2 {
        font-size: 1.5rem;
        margin: 16px 0;
        color: #1a1a1a;
    }
    
    .modal-author {
        margin-top: 16px;
    }
    
    .modal-body {
        padding: 30px;
        line-height: 1.8;
        color: #555;
    }
    
    .modal-body blockquote {
        background: #f8f9fa;
        border-left: 4px solid #1a1a1a;
        padding: 20px;
        margin: 30px 0;
        font-style: italic;
        color: #666;
    }
    
    .modal-footer {
        padding: 30px;
        border-top: 1px solid #eee;
    }
    
    .modal-actions {
        display: flex;
        gap: 12px;
        margin-bottom: 20px;
        flex-wrap: wrap;
    }
    
    .modal-stats {
        color: #999;
        font-size: 14px;
    }
    
    .bookmark-btn.bookmarked {
        background: #ff4757;
        color: white;
        border-color: #ff4757;
    }
    
    .bookmark-btn.bookmarked:hover {
        background: #ff3742;
        border-color: #ff3742;
    }
    
    @media (max-width: 768px) {
        .modal-header {
            grid-template-columns: 1fr;
            gap: 20px;
        }
        
        .modal-actions {
            flex-direction: column;
        }
        
        .modal-actions .btn-primary,
        .modal-actions .btn-secondary {
            width: 100%;
        }
    }
`;
document.head.appendChild(blogStyles);
