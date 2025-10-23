/**
 * Trading Guide - Mobile Menu Handler
 * Handles mobile navigation menu toggle
 */

// Create and add mobile menu toggle button
function initMobileMenu() {
    // Check if already initialized
    if (document.getElementById('mobileMenuToggle')) return;
    
    // Create toggle button
    const toggleButton = document.createElement('button');
    toggleButton.id = 'mobileMenuToggle';
    toggleButton.className = 'mobile-menu-toggle';
    toggleButton.innerHTML = '☰';
    toggleButton.setAttribute('aria-label', 'Toggle navigation menu');
    toggleButton.setAttribute('aria-expanded', 'false');
    
    document.body.appendChild(toggleButton);
    
    // Get sidebar
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    
    // Toggle menu on button click
    toggleButton.addEventListener('click', function() {
        const isOpen = sidebar.classList.toggle('mobile-open');
        toggleButton.setAttribute('aria-expanded', isOpen);
        toggleButton.innerHTML = isOpen ? '✕' : '☰';
        
        // Prevent body scroll when menu is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!sidebar.contains(e.target) && e.target !== toggleButton) {
            if (sidebar.classList.contains('mobile-open')) {
                sidebar.classList.remove('mobile-open');
                toggleButton.setAttribute('aria-expanded', 'false');
                toggleButton.innerHTML = '☰';
                document.body.style.overflow = '';
            }
        }
    });
    
    // Close menu when clicking on a nav link
    sidebar.addEventListener('click', function(e) {
        if (e.target.classList.contains('nav-link')) {
            sidebar.classList.remove('mobile-open');
            toggleButton.setAttribute('aria-expanded', 'false');
            toggleButton.innerHTML = '☰';
            document.body.style.overflow = '';
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 968) {
            sidebar.classList.remove('mobile-open');
            toggleButton.setAttribute('aria-expanded', 'false');
            toggleButton.innerHTML = '☰';
            document.body.style.overflow = '';
        }
    });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
} else {
    initMobileMenu();
}

console.log('✅ Mobile Menu Handler Loaded');
