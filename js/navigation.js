/**
 * ============================================
 * TRADING GUIDE - ULTRA-FAST NAVIGATION v3.0
 * ============================================
 * Optimized for zero flicker, instant load
 * Built: October 2025
 */

'use strict';

// ============================================
// NAVIGATION DATA
// ============================================

const NAV_STRUCTURE = [
    {
        category: 'FOUNDATION',
        icon: '🎯',
        items: [
            { icon: '🏠', text: 'Home', file: 'index.html', home: true },
            { icon: '🧠', text: 'Core Philosophy', file: 'core-philosophy.html' },
            { icon: '💭', text: 'Trading Psychology', file: 'trading-psychology.html' },
            { icon: '⚡', text: 'Quick Reference', file: 'quick-reference.html' }
        ]
    },
    {
        category: 'CYCLE THEORY',
        icon: '📊',
        items: [
            { icon: '🌐', text: 'Yearly Cycle', file: 'yearly-cycle.html' },
            { icon: '📅', text: 'Monthly Cycle', file: 'monthly-cycle.html' },
            { icon: '📊', text: 'Weekly Schedule', file: 'weekly-schedule.html' },
            { icon: '🌍', text: 'Daily Sessions', file: 'daily-sessions.html' },
            { icon: '⏱️', text: 'Micro Quarters', file: 'micro-quarters.html' },
            { icon: '🔄', text: 'BTMM Cycle', file: 'btmm-cycle.html' }
        ]
    },
    {
        category: 'TRADE EXECUTION',
        icon: '🎯',
        items: [
            { icon: '🎯', text: 'Trade Execution', file: 'trade-execution.html' },
            { icon: '📊', text: 'Intra-Day Bias', file: 'intraday-bias.html' },
            { icon: '🔧', text: 'Technical Setup', file: 'technical-setup.html' },
            { icon: '📐', text: 'Chart Models', file: 'chart-models.html' },
            { icon: '🎯', text: 'Entry & Exit Rules', file: 'entry-rules.html' },
            { icon: '🛡️', text: 'Risk Management', file: 'risk-management.html' }
        ]
    },
    {
        category: 'PRACTICAL',
        icon: '💡',
        items: [
            { icon: '📡', text: 'Live Trading Guide', file: 'live-session-guide.html' },
            { icon: '✅', text: 'Daily Checklist', file: 'checklist.html' },
            { icon: '💡', text: 'Trade Examples', file: 'examples.html' }
        ]
    },
    {
        category: 'TOOLS',
        icon: '🛠️',
        items: [
            { icon: '📊', text: 'Trading Journal', file: 'trading-journal.html' },
            { icon: '🧮', text: 'Calculators', file: 'calculators.html' },
            { icon: '🎓', text: 'Pattern Trainer', file: 'pattern-trainer.html' },
            { icon: '📈', text: 'Visual Market', file: 'market-visuals.html' }
        ]
    }
];

// ============================================
// CORE FUNCTIONS
// ============================================

function getCurrentContext() {
    const path = window.location.pathname;
    const inPages = path.includes('/pages/');
    const fileName = path.split('/').pop() || 'index.html';
    
    return { inPages, fileName, path };
}

function buildLink(item, context) {
    if (item.home) {
        return context.inPages ? '../index.html' : 'index.html';
    }
    return context.inPages ? item.file : `pages/${item.file}`;
}

function isActive(item, context) {
    if (item.home && (context.fileName === 'index.html' || context.fileName === '')) {
        return true;
    }
    return item.file === context.fileName;
}

function renderNavigation() {
    const container = document.getElementById('navLinks');
    if (!container) {
        console.warn('Navigation container #navLinks not found');
        return;
    }
    
    const context = getCurrentContext();
    console.log('Navigation context:', context);
    let html = '';
    
    // Breadcrumb (only on sub-pages)
    if (context.inPages) {
        const title = context.fileName.replace('.html', '').split('-').map(w => 
            w.charAt(0).toUpperCase() + w.slice(1)
        ).join(' ');
        
        html += `
            <nav class="nav-breadcrumb">
                <a href="../index.html" class="nav-bread-link">🏠 Home</a>
                <span class="nav-bread-sep">→</span>
                <span class="nav-bread-current">${title}</span>
            </nav>
        `;
        
        // Back button
        html += `
            <button class="nav-back" onclick="history.back()" title="Go back">
                ← Back
            </button>
        `;
    }
    
    // Navigation sections
    html += '<div class="nav-sections">';
    
    NAV_STRUCTURE.forEach(section => {
        const isTools = section.category === 'TOOLS';
        const sectionClass = isTools ? 'nav-section nav-tools' : 'nav-section';
        
        html += `
            <div class="${sectionClass}">
                <div class="nav-section-header">
                    <span class="nav-section-icon">${section.icon}</span>
                    <span class="nav-section-title">${section.category}</span>
                </div>
                <ul class="nav-list">
        `;
        
        section.items.forEach(item => {
            const link = buildLink(item, context);
            const active = isActive(item, context);
            const activeClass = active ? 'nav-item-active' : '';
            const ariaCurrent = active ? 'aria-current="page"' : '';
            
            // Log to help debug
            if (section.category === 'TRADE EXECUTION') {
                console.log(`Building link for ${item.text}:`, link);
            }
            
            html += `
                <li class="nav-item">
                    <a href="${link}" class="nav-link ${activeClass}" ${ariaCurrent} data-file="${item.file}" onclick="console.log('Navigating to: ${link}')">
                        <span class="nav-icon">${item.icon}</span>
                        <span class="nav-text">${item.text}</span>
                    </a>
                </li>
            `;
        });
        
        html += '</ul></div>';
    });
    
    html += '</div>';
    
    container.innerHTML = html;
    
    // Initialize mobile menu
    initMobileMenu();
}

// ============================================
// MOBILE MENU
// ============================================

function initMobileMenu() {
    // Remove existing toggle if any
    const existing = document.querySelector('.nav-mobile-toggle');
    if (existing) existing.remove();
    
    // Create toggle button
    const toggle = document.createElement('button');
    toggle.className = 'nav-mobile-toggle';
    toggle.innerHTML = '☰';
    toggle.setAttribute('aria-label', 'Toggle menu');
    toggle.setAttribute('aria-expanded', 'false');
    
    document.body.appendChild(toggle);
    
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    
    // Toggle click
    toggle.addEventListener('click', () => {
        const isOpen = sidebar.classList.toggle('nav-mobile-open');
        toggle.innerHTML = isOpen ? '✕' : '☰';
        toggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    
    // Close on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            sidebar.classList.remove('nav-mobile-open');
            toggle.innerHTML = '☰';
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
            if (sidebar.classList.contains('nav-mobile-open')) {
                sidebar.classList.remove('nav-mobile-open');
                toggle.innerHTML = '☰';
                toggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        }
    });
    
    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('nav-mobile-open')) {
            sidebar.classList.remove('nav-mobile-open');
            toggle.innerHTML = '☰';
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
}

// ============================================
// ACCESSIBILITY
// ============================================

function initAccessibility() {
    // Skip link
    if (!document.querySelector('.nav-skip')) {
        const skip = document.createElement('a');
        skip.href = '#mainContent';
        skip.className = 'nav-skip';
        skip.textContent = 'Skip to main content';
        document.body.insertBefore(skip, document.body.firstChild);
    }
    
    // Main content ID
    const main = document.querySelector('.content, main');
    if (main && !main.id) {
        main.id = 'mainContent';
    }
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const links = document.querySelectorAll('.nav-item');
        
        links.forEach(item => {
            const text = item.textContent.toLowerCase();
            const match = text.includes(query);
            item.style.display = match ? '' : 'none';
        });
        
        // Show/hide section headers based on visible items
        document.querySelectorAll('.nav-section').forEach(section => {
            const visibleItems = section.querySelectorAll('.nav-item[style=""]').length;
            section.style.display = visibleItems > 0 ? '' : 'none';
        });
    });
}

// ============================================
// INITIALIZATION
// ============================================

// ============================================
// PREVENT SIDEBAR SCROLL RESET
// ============================================

// Disable scroll restoration for navigation
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Save sidebar scroll position before page navigation
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.classList.contains('nav-link')) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sessionStorage.setItem('sidebarScrollPos', sidebar.scrollTop.toString());
        }
    }
});

// Restore sidebar scroll position after navigation loads
function restoreSidebarScroll() {
    const sidebar = document.getElementById('sidebar');
    const savedPos = sessionStorage.getItem('sidebarScrollPos');
    
    if (sidebar && savedPos) {
        sidebar.scrollTop = parseInt(savedPos);
        sessionStorage.removeItem('sidebarScrollPos');
    }
}

function init() {
    renderNavigation();
    initAccessibility();
    initSearch();
    
    // Restore sidebar scroll position
    setTimeout(restoreSidebarScroll, 10);
    
    console.log('✅ Navigation v3.0 loaded');
}

// Instant load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Reload on back/forward
window.addEventListener('popstate', renderNavigation);
