// About Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initTeamInteractions();
    initAchievementCounters();
    initParallaxEffects();
    initContactForm();
});

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.value-card, .team-member, .achievement-item, .highlight-item');
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
    
    // Staggered animation for grid items
    const gridItems = document.querySelectorAll('.values-grid .value-card, .team-grid .team-member, .achievements-grid .achievement-item');
    gridItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
}

// Team Member Interactions
function initTeamInteractions() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        const memberImage = member.querySelector('.member-image');
        const memberOverlay = member.querySelector('.member-overlay');
        const socialLinks = member.querySelectorAll('.member-social a');
        
        // Add hover effects
        member.addEventListener('mouseenter', function() {
            memberImage.style.transform = 'scale(1.02)';
        });
        
        member.addEventListener('mouseleave', function() {
            memberImage.style.transform = 'scale(1)';
        });
        
        // Add click handlers for social links
        socialLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const platform = this.getAttribute('aria-label');
                showNotification(`Opening ${platform} profile...`, 'info');
            });
        });
        
        // Add member card click handler
        member.addEventListener('click', function() {
            showMemberDetails(this);
        });
    });
}

function showMemberDetails(memberElement) {
    const memberName = memberElement.querySelector('.member-info h4').textContent;
    const memberTitle = memberElement.querySelector('.member-title').textContent;
    const memberBio = memberElement.querySelector('.member-bio').textContent;
    const memberImage = memberElement.querySelector('.member-image img').src;
    
    // Create member detail modal
    const modal = document.createElement('div');
    modal.className = 'member-detail-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content member-modal-content">
            <button class="modal-close">&times;</button>
            <div class="member-detail-header">
                <div class="member-detail-image">
                    <img src="${memberImage}" alt="${memberName}">
                </div>
                <div class="member-detail-info">
                    <h3>${memberName}</h3>
                    <p class="member-detail-title">${memberTitle}</p>
                    <div class="member-detail-social">
                        <a href="#" aria-label="LinkedIn"><i class="icon-linkedin"></i></a>
                        <a href="#" aria-label="Twitter"><i class="icon-twitter"></i></a>
                        <a href="#" aria-label="Email"><i class="icon-email"></i></a>
                    </div>
                </div>
            </div>
            <div class="member-detail-bio">
                <h4>About</h4>
                <p>${memberBio}</p>
                <h4>Expertise</h4>
                <div class="expertise-list">
                    <span class="expertise-item">Luxury Watch Authentication</span>
                    <span class="expertise-item">Vintage Timepiece Restoration</span>
                    <span class="expertise-item">Investment Advisory</span>
                    <span class="expertise-item">Brand Partnerships</span>
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

// Achievement Counters
function initAchievementCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format the number
        if (element.textContent.includes('K+')) {
            element.textContent = Math.floor(current / 1000) + 'K+';
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Parallax Effects
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.about-hero .hero-background img');
    
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const rate = scrolled * -0.5;
            element.style.transform = `translateY(${rate}px)`;
        });
    }, 16));
}

// Contact Form
function initContactForm() {
    // Create contact form modal if consultation button is clicked
    const consultationBtn = document.querySelector('.btn-secondary');
    if (consultationBtn && consultationBtn.textContent.includes('Consultation')) {
        consultationBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showConsultationForm();
        });
    }
}

function showConsultationForm() {
    const modal = document.createElement('div');
    modal.className = 'consultation-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content consultation-modal-content">
            <button class="modal-close">&times;</button>
            <h3>Schedule a Consultation</h3>
            <p>Let our experts guide you to the perfect timepiece</p>
            <form class="consultation-form">
                <div class="form-group">
                    <label for="consultation-name">Full Name</label>
                    <input type="text" id="consultation-name" required>
                </div>
                <div class="form-group">
                    <label for="consultation-email">Email Address</label>
                    <input type="email" id="consultation-email" required>
                </div>
                <div class="form-group">
                    <label for="consultation-phone">Phone Number</label>
                    <input type="tel" id="consultation-phone" required>
                </div>
                <div class="form-group">
                    <label for="consultation-interest">Area of Interest</label>
                    <select id="consultation-interest" required>
                        <option value="">Select an option</option>
                        <option value="luxury">Luxury Watches</option>
                        <option value="vintage">Vintage Collection</option>
                        <option value="investment">Investment Pieces</option>
                        <option value="smart">Smart Watches</option>
                        <option value="custom">Custom Consultation</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="consultation-message">Additional Notes</label>
                    <textarea id="consultation-message" rows="4" placeholder="Tell us about your preferences, budget, or any specific questions..."></textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Schedule Consultation</button>
                    <button type="button" class="btn-secondary modal-close">Cancel</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-overlay').addEventListener('click', () => modal.remove());
    
    // Form submission
    modal.querySelector('.consultation-form').addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('Thank you! We will contact you within 24 hours to schedule your consultation.', 'success');
        modal.remove();
    });
    
    // Show modal
    setTimeout(() => modal.classList.add('show'), 10);
}

// Utility Functions
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

// Add CSS for modals and animations
const aboutStyles = document.createElement('style');
aboutStyles.textContent = `
    .member-detail-modal,
    .consultation-modal {
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
    
    .member-detail-modal.show,
    .consultation-modal.show {
        opacity: 1;
        visibility: visible;
    }
    
    .member-modal-content {
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    }
    
    .member-detail-header {
        display: grid;
        grid-template-columns: 150px 1fr;
        gap: 30px;
        margin-bottom: 30px;
        padding-bottom: 30px;
        border-bottom: 1px solid #eee;
    }
    
    .member-detail-image img {
        width: 100%;
        height: 150px;
        object-fit: cover;
        border-radius: 12px;
    }
    
    .member-detail-info h3 {
        margin-bottom: 8px;
        color: #1a1a1a;
    }
    
    .member-detail-title {
        color: #666;
        margin-bottom: 16px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-size: 14px;
    }
    
    .member-detail-social {
        display: flex;
        gap: 12px;
    }
    
    .member-detail-social a {
        width: 36px;
        height: 36px;
        background: #f8f9fa;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        color: #666;
        transition: all 0.3s ease;
    }
    
    .member-detail-social a:hover {
        background: #1a1a1a;
        color: white;
    }
    
    .member-detail-bio h4 {
        margin-bottom: 12px;
        color: #1a1a1a;
    }
    
    .expertise-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 12px;
    }
    
    .expertise-item {
        background: #f8f9fa;
        color: #666;
        padding: 6px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
    }
    
    .consultation-modal-content {
        max-width: 500px;
        width: 90%;
    }
    
    .consultation-form {
        margin-top: 20px;
    }
    
    .consultation-form .form-group {
        margin-bottom: 20px;
    }
    
    .consultation-form label {
        display: block;
        margin-bottom: 8px;
        font-weight: 600;
        color: #1a1a1a;
    }
    
    .consultation-form input,
    .consultation-form select,
    .consultation-form textarea {
        width: 100%;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-size: 14px;
        transition: border-color 0.3s ease;
    }
    
    .consultation-form input:focus,
    .consultation-form select:focus,
    .consultation-form textarea:focus {
        outline: none;
        border-color: #1a1a1a;
    }
    
    .consultation-form textarea {
        resize: vertical;
        min-height: 100px;
    }
    
    .form-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        margin-top: 30px;
    }
    
    .form-actions .btn-primary,
    .form-actions .btn-secondary {
        padding: 12px 24px;
    }
    
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .animate-on-scroll.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    @media (max-width: 768px) {
        .member-detail-header {
            grid-template-columns: 1fr;
            text-align: center;
        }
        
        .member-detail-image {
            width: 120px;
            margin: 0 auto;
        }
        
        .form-actions {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(aboutStyles);
