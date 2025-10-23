/**
 * Trading Guide - Keyboard Shortcuts
 * Provides keyboard navigation and shortcuts
 */

const KEYBOARD_SHORTCUTS = {
    'Ctrl+K': 'Focus search box',
    'Escape': 'Clear search / Close menus',
    'Ctrl+H': 'Go to home page',
    '/': 'Focus search box',
    '?': 'Show keyboard shortcuts help'
};

// Show keyboard shortcuts modal
function showKeyboardShortcuts() {
    // Remove existing modal if present
    const existing = document.getElementById('keyboardShortcutsModal');
    if (existing) existing.remove();
    
    const modal = document.createElement('div');
    modal.id = 'keyboardShortcutsModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div style="background: var(--bg-secondary); border: 2px solid var(--accent-blue); 
                    border-radius: 12px; padding: 2rem; max-width: 500px; width: 90%;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h2 style="color: var(--accent-blue); margin: 0;">⌨️ Keyboard Shortcuts</h2>
                <button onclick="this.closest('#keyboardShortcutsModal').remove()" 
                        style="background: none; border: none; color: var(--text-secondary); 
                               font-size: 1.5rem; cursor: pointer; padding: 0.5rem;">✕</button>
            </div>
            <div style="display: grid; gap: 1rem;">
                ${Object.entries(KEYBOARD_SHORTCUTS).map(([key, description]) => `
                    <div style="display: flex; justify-content: space-between; align-items: center; 
                                padding: 0.75rem; background: var(--bg-tertiary); border-radius: 6px;">
                        <span style="color: var(--text-secondary);">${description}</span>
                        <kbd style="background: var(--bg-primary); color: var(--accent-blue); 
                                    padding: 0.25rem 0.75rem; border-radius: 4px; 
                                    font-family: monospace; font-size: 0.9rem; font-weight: bold;
                                    border: 1px solid var(--border-color);">${key}</kbd>
                    </div>
                `).join('')}
            </div>
            <div style="margin-top: 1.5rem; text-align: center; color: var(--text-tertiary); font-size: 0.9rem;">
                Press <kbd style="background: var(--bg-primary); padding: 0.2rem 0.5rem; 
                                 border-radius: 3px;">Escape</kbd> to close
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on click outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Handle keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Show shortcuts help (? key)
    if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        const activeElement = document.activeElement;
        if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            showKeyboardShortcuts();
        }
    }
    
    // Focus search (Ctrl+K or /)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }
    
    if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        const activeElement = document.activeElement;
        if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
            }
        }
    }
    
    // Go to home (Ctrl+H)
    if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        const isInPagesFolder = window.location.pathname.includes('/pages/');
        window.location.href = isInPagesFolder ? '../index.html' : 'index.html';
    }
    
    // Close modals/menus (Escape)
    if (e.key === 'Escape') {
        // Close keyboard shortcuts modal
        const modal = document.getElementById('keyboardShortcutsModal');
        if (modal) {
            modal.remove();
            return;
        }
        
        // Clear search
        const searchInput = document.getElementById('searchInput');
        if (searchInput && searchInput.value) {
            searchInput.value = '';
            searchInput.blur();
            // Trigger search clear
            const event = new Event('input', { bubbles: true });
            searchInput.dispatchEvent(event);
            return;
        }
        
        // Close mobile menu
        const sidebar = document.getElementById('sidebar');
        const toggleButton = document.getElementById('mobileMenuToggle');
        if (sidebar && sidebar.classList.contains('mobile-open')) {
            sidebar.classList.remove('mobile-open');
            if (toggleButton) {
                toggleButton.setAttribute('aria-expanded', 'false');
                toggleButton.innerHTML = '☰';
            }
            document.body.style.overflow = '';
        }
    }
});

// Add keyboard shortcuts button to sidebar header
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const navHeader = document.querySelector('.nav-header');
        if (navHeader && !document.getElementById('keyboardShortcutsBtn')) {
            const shortcutsBtn = document.createElement('button');
            shortcutsBtn.id = 'keyboardShortcutsBtn';
            shortcutsBtn.innerHTML = '⌨️';
            shortcutsBtn.title = 'Keyboard Shortcuts (?)';
            shortcutsBtn.style.cssText = `
                position: absolute;
                right: 1.5rem;
                top: 1.5rem;
                background: var(--bg-tertiary);
                border: 1px solid var(--border-color);
                color: var(--text-secondary);
                width: 35px;
                height: 35px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 1.2rem;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            `;
            shortcutsBtn.addEventListener('click', showKeyboardShortcuts);
            shortcutsBtn.addEventListener('mouseenter', function() {
                this.style.background = 'var(--accent-blue)';
                this.style.transform = 'scale(1.1)';
            });
            shortcutsBtn.addEventListener('mouseleave', function() {
                this.style.background = 'var(--bg-tertiary)';
                this.style.transform = 'scale(1)';
            });
            navHeader.style.position = 'relative';
            navHeader.appendChild(shortcutsBtn);
        }
    }, 500); // Wait for navigation to load
});

console.log('✅ Keyboard Shortcuts Loaded - Press ? for help');
