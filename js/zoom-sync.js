/**
 * ============================================
 * ZOOM SYNCHRONIZATION SYSTEM
 * ============================================
 * Keeps zoom level consistent across all pages
 */

'use strict';

(function() {
    const ZOOM_KEY = 'tradingGuideZoom';
    const DEFAULT_ZOOM = 1.0;
    const MIN_ZOOM = 0.5;
    const MAX_ZOOM = 2.0;
    
    // IMMEDIATELY apply zoom before anything else loads
    const savedZoom = parseFloat(localStorage.getItem(ZOOM_KEY)) || DEFAULT_ZOOM;
    document.documentElement.style.zoom = savedZoom;
    document.body.style.zoom = savedZoom;
    
    // Get current zoom level
    function getCurrentZoom() {
        return parseFloat(localStorage.getItem(ZOOM_KEY)) || DEFAULT_ZOOM;
    }
    
    // Set zoom level
    function setZoom(level) {
        // Clamp between min and max
        level = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, level));
        
        // Apply zoom
        document.body.style.zoom = level;
        
        // Save to localStorage
        localStorage.setItem(ZOOM_KEY, level.toString());
        
        return level;
    }
    
    // Apply saved zoom on page load
    function applyInitialZoom() {
        const savedZoom = getCurrentZoom();
        // ALWAYS apply the zoom, even if it's the default
        document.body.style.zoom = savedZoom;
    }
    
    // Listen for zoom changes (Ctrl + Mouse Wheel, Ctrl + Plus/Minus)
    function monitorZoomChanges() {
        let lastZoom = getCurrentZoom();
        
        // Check for zoom changes every 100ms
        setInterval(() => {
            const currentZoom = parseFloat(getComputedStyle(document.body).zoom) || 1.0;
            
            if (Math.abs(currentZoom - lastZoom) > 0.01) {
                setZoom(currentZoom);
                lastZoom = currentZoom;
            }
        }, 100);
    }
    
    // Keyboard shortcuts (Ctrl + Plus/Minus/0)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            if (e.key === '+' || e.key === '=') {
                e.preventDefault();
                const current = getCurrentZoom();
                setZoom(current + 0.1);
            } else if (e.key === '-' || e.key === '_') {
                e.preventDefault();
                const current = getCurrentZoom();
                setZoom(current - 0.1);
            } else if (e.key === '0') {
                e.preventDefault();
                setZoom(DEFAULT_ZOOM);
            }
        }
    });
    
    // Mouse wheel zoom (Ctrl + Wheel)
    document.addEventListener('wheel', (e) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const current = getCurrentZoom();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            setZoom(current + delta);
        }
    }, { passive: false });
    
    // Initialize immediately
    applyInitialZoom();
    monitorZoomChanges();
    
    console.log('✅ Zoom sync enabled - Current zoom:', getCurrentZoom());
})();

