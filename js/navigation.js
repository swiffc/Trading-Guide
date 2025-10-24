/**
 * Trading Guide - World-Class Navigation System v2.0
 * Synchronized across all pages with loading states, breadcrumbs, and error handling
 * Author: Cascade AI
 * Last Updated: October 2025
 */

// ============================================
// CONFIGURATION
// ============================================

const NAV_CONFIG = {
    loadingDelay: 0, // milliseconds - SET TO 0 TO PREVENT NAVIGATION RESET
    enableBreadcrumbs: true,
    enableBackButton: true,
    enableLoadingState: false, // DISABLED - Prevents navigation flickering
    debug: false // Disable debug mode
};

// Navigation structure - single source of truth
const NAVIGATION_STRUCTURE = [
    {
        category: 'FOUNDATION',
        items: [
            { icon: '🏠', label: 'Home', file: 'index.html', isHome: true },
            { icon: '🧠', label: 'Core Philosophy', file: 'core-philosophy.html' },
            { icon: '💭', label: 'Trading Psychology', file: 'trading-psychology.html' },
            { icon: '⚡', label: 'Quick Reference', file: 'quick-reference.html' }
        ]
    },
    {
        category: 'CYCLE THEORY',
        items: [
            { icon: '🌐', label: 'Yearly Cycle (12-Mo)', file: 'yearly-cycle.html' },
            { icon: '📅', label: 'Monthly Cycle (30-Day)', file: 'monthly-cycle.html' },
            { icon: '📊', label: 'Weekly Cycle (7-Day)', file: 'weekly-schedule.html' },
            { icon: '🌍', label: 'Daily Sessions + Cycles', file: 'daily-sessions.html' }
        ]
    },
    {
        category: 'TRADE EXECUTION',
        items: [
            { icon: '🎯', label: 'Trade Execution Guide', file: 'trade-execution.html' },
            { icon: '📊', label: 'Intra-Day Bias (M15)', file: 'intraday-bias.html' },
            { icon: '🔧', label: 'Technical Setup', file: 'technical-setup.html' },
            { icon: '📐', label: 'Patterns (31+)', file: 'patterns.html' },
            { icon: '🎯', label: 'Entry & Exit Rules', file: 'entry-rules.html' },
            { icon: '🛡️', label: 'Risk Management', file: 'risk-management.html' }
        ]
    },
    {
        category: 'PRACTICAL',
        items: [
            { icon: '📡', label: 'Live Trading Guide', file: 'live-session-guide.html' },
            { icon: '✅', label: 'Daily Checklist', file: 'checklist.html' },
            { icon: '💡', label: 'Trade Examples', file: 'examples.html' }
        ]
    },
    {
        category: 'TOOLS',
        isTools: true,
        items: [
            { icon: '📊', label: 'Trading Journal', file: 'trading-journal.html' },
            { icon: '🧮', label: 'Calculators', file: 'calculators.html' },
            { icon: '🎓', label: 'Pattern Trainer', file: 'pattern-trainer.html' },
            { icon: '📈', label: 'Visual Market', file: 'market-visuals.html' }
        ]
    }
];

// ============================================
// MAIN NAVIGATION LOADER
// ============================================

function loadUnifiedNavigation() {
    const navLinks = document.getElementById('navLinks');
    
    if (!navLinks) {
        logDebug('Navigation container #navLinks not found');
        return;
    }
    
    try {
        // Show loading state if enabled
        if (NAV_CONFIG.enableLoadingState) {
            showLoadingState(navLinks);
        }
        
        // Render navigation immediately (no delay)
        try {
            renderNavigation(navLinks);
            logDebug('Navigation loaded successfully');
        } catch (error) {
            handleNavigationError(navLinks, error);
        }
        
    } catch (error) {
        handleNavigationError(navLinks, error);
    }
}

// ============================================
// NAVIGATION RENDERER
// ============================================

function renderNavigation(navLinks) {
    const context = getNavigationContext();
    const html = buildNavigationHTML(context);
    
    navLinks.innerHTML = html;
    
    // Post-render actions
    highlightActiveNav(context);
    attachNavigationEvents();
}

function buildNavigationHTML(context) {
    let html = '';
    
    // Add breadcrumbs (only on sub-pages)
    if (NAV_CONFIG.enableBreadcrumbs && context.isInPagesFolder) {
        html += generateBreadcrumb(context);
    }
    
    // Add back button (only on sub-pages)
    if (NAV_CONFIG.enableBackButton && context.isInPagesFolder) {
        html += generateBackButton();
    }
    
    // Build navigation menu
    html += '<div class="nav-main">';
    html += '<h3 class="nav-section-title">📚 Navigation</h3>';
    
    NAVIGATION_STRUCTURE.forEach(section => {
        if (section.isTools) {
            html += '</div><div class="nav-section-tools">';
            html += `<h3 class="nav-section-title">🛠️ ${section.category}</h3>`;
        } else {
            html += `<div class="nav-category">${section.category}</div>`;
        }
        
        html += '<ul class="nav-menu">';
        section.items.forEach(item => {
            html += generateNavLink(item, context);
        });
        html += '</ul>';
    });
    
    html += '</div>';
    
    return html;
}

function generateNavLink(item, context) {
    let href;
    
    if (item.isHome) {
        // Home link: if in pages folder, go up one level
        href = context.isInPagesFolder ? '../index.html' : 'index.html';
    } else {
        // Other pages: if in pages folder, same directory; if on home, go into pages/
        href = context.isInPagesFolder ? item.file : `pages/${item.file}`;
    }
    
    const classes = ['nav-link'];
    if (item.file === 'trading-journal.html') classes.push('tool-journal');
    if (item.file === 'calculators.html') classes.push('tool-calculators');
    if (item.file === 'pattern-trainer.html') classes.push('tool-trainer');
    if (item.file === 'market-visuals.html') classes.push('tool-visuals');
    
    // Debug logging
    logDebug(`Generated link for ${item.label}: ${href} (isInPages: ${context.isInPagesFolder})`);
    
    return `<li><a href="${href}" class="${classes.join(' ')}" data-page="${item.file}">${item.icon} ${item.label}</a></li>`;
}

// ============================================
// BREADCRUMB GENERATION
// ============================================

function generateBreadcrumb(context) {
    if (!context.isInPagesFolder) return '';
    
    const title = getReadablePageTitle(context.currentFile);
    
    return `
        <nav class="breadcrumb" aria-label="Breadcrumb">
            <a href="../index.html" class="breadcrumb-link">
                🏠 Home
            </a>
            <span class="breadcrumb-sep" aria-hidden="true">→</span>
            <span class="breadcrumb-current">${title}</span>
        </nav>
    `;
}

function generateBackButton() {
    return `
        <button class="nav-back-btn" onclick="history.back()" 
                title="Go back to previous page" 
                aria-label="Go back">
            ← Back
        </button>
    `;
}

// ============================================
// ACTIVE PAGE HIGHLIGHTING
// ============================================

function highlightActiveNav(context) {
    const currentPage = context.currentPage;
    
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkPage = link.getAttribute('data-page');
        const isHome = linkPage === 'index.html' && (currentPage === 'index.html' || currentPage === '');
        const isMatch = linkPage === currentPage;
        
        if (isHome || isMatch) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}

// ============================================
// LOADING & ERROR STATES
// ============================================

function showLoadingState(container) {
    container.innerHTML = `
        <div class="nav-loading" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
            <div class="loading" style="margin: 0 auto 1rem;"></div>
            <p style="font-size: 0.9rem; margin: 0;">Loading navigation...</p>
        </div>
    `;
}

function handleNavigationError(container, error) {
    console.error('Navigation Error:', error);
    
    container.innerHTML = `
        <div class="alert alert-danger" style="padding: 1rem; border-radius: 8px; margin: 1rem 0;">
            <strong>❌ Navigation Error</strong>
            <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem;">Unable to load navigation menu.</p>
            <a href="../index.html" style="color: var(--accent-blue); text-decoration: underline; font-size: 0.9rem;">
                Return to Home
            </a>
        </div>
    `;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getNavigationContext() {
    const pathname = window.location.pathname;
    const isInPagesFolder = pathname.includes('/pages/');
    
    // Get current file
    const parts = pathname.split('/').filter(p => p);
    const currentFile = parts[parts.length - 1] || 'index.html';
    const currentPage = currentFile.split('?')[0].split('#')[0];
    
    const context = {
        pathname,
        isInPagesFolder,
        currentFile,
        currentPage
    };
    
    // Debug logging
    logDebug('Navigation Context:', context);
    logDebug(`Current location: ${window.location.href}`);
    logDebug(`Is in pages folder: ${isInPagesFolder}`);
    
    return context;
}

function getReadablePageTitle(filename) {
    const pageName = filename.replace('.html', '');
    
    return pageName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function attachNavigationEvents() {
    // Add smooth scroll for anchor links
    document.querySelectorAll('.nav-link[href*="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.includes('#') && href.split('#')[0] === window.location.pathname.split('/').pop()) {
                e.preventDefault();
                const anchor = href.split('#')[1];
                const element = document.getElementById(anchor);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
}

function logDebug(...args) {
    if (NAV_CONFIG.debug) {
        console.log('[Navigation]', ...args);
    }
}

// ============================================
// INITIALIZATION
// ============================================

// SCROLL POSITION PRESERVATION - PREVENT RESET TO TOP
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'; // Disable browser's auto-scroll
}

// Save scroll position before clicking any link
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.href && !link.href.includes('#')) {
        sessionStorage.setItem('scrollPos', window.pageYOffset.toString());
    }
});

// Restore scroll position IMMEDIATELY on page load
const savedScrollPos = sessionStorage.getItem('scrollPos');
if (savedScrollPos) {
    window.scrollTo(0, parseInt(savedScrollPos));
    sessionStorage.removeItem('scrollPos');
}

// Initialize navigation when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadUnifiedNavigation);
} else {
    loadUnifiedNavigation();
}

// Reload navigation on back/forward button
window.addEventListener('popstate', loadUnifiedNavigation);

// ============================================
// MOBILE MENU FUNCTIONALITY
// ============================================

function initializeMobileMenu() {
    // Create mobile menu toggle button
    const existingToggle = document.querySelector('.mobile-menu-toggle');
    if (existingToggle) return; // Already exists
    
    const mobileToggle = document.createElement('button');
    mobileToggle.className = 'mobile-menu-toggle';
    mobileToggle.innerHTML = '☰';
    mobileToggle.setAttribute('aria-label', 'Toggle navigation menu');
    mobileToggle.setAttribute('aria-expanded', 'false');
    
    document.body.appendChild(mobileToggle);
    
    // Toggle functionality
    mobileToggle.addEventListener('click', () => {
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) return;
        
        const isOpen = sidebar.classList.toggle('mobile-open');
        mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        mobileToggle.innerHTML = isOpen ? '✕' : '☰';
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) return;
        
        const isClickInsideSidebar = sidebar.contains(e.target);
        const isClickOnToggle = mobileToggle.contains(e.target);
        
        if (!isClickInsideSidebar && !isClickOnToggle && sidebar.classList.contains('mobile-open')) {
            sidebar.classList.remove('mobile-open');
            mobileToggle.setAttribute('aria-expanded', 'false');
            mobileToggle.innerHTML = '☰';
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const sidebar = document.getElementById('sidebar');
            if (sidebar && sidebar.classList.contains('mobile-open')) {
                sidebar.classList.remove('mobile-open');
                mobileToggle.setAttribute('aria-expanded', 'false');
                mobileToggle.innerHTML = '☰';
                document.body.style.overflow = '';
            }
        });
    });
    
    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const sidebar = document.getElementById('sidebar');
            if (sidebar && sidebar.classList.contains('mobile-open')) {
                sidebar.classList.remove('mobile-open');
                mobileToggle.setAttribute('aria-expanded', 'false');
                mobileToggle.innerHTML = '☰';
                document.body.style.overflow = '';
            }
        }
    });
}

// ============================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================

function initializeAccessibility() {
    // Add skip link if it doesn't exist
    const existingSkipLink = document.querySelector('.skip-link');
    if (!existingSkipLink) {
        const skipLink = document.createElement('a');
        skipLink.href = '#mainContent';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    // Ensure main content has ID
    const mainContent = document.querySelector('.content, main');
    if (mainContent && !mainContent.id) {
        mainContent.id = 'mainContent';
    }
}

// Log initialization
console.log('✅ World-Class Navigation System Loaded');

// Initialize mobile menu and accessibility features
document.addEventListener('DOMContentLoaded', () => {
    initializeMobileMenu();
    initializeAccessibility();
});

