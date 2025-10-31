/**
 * ============================================
 * ZOOM CONTROL BUTTONS
 * ============================================
 * Adds visible zoom buttons to the header
 */

'use strict';

(function() {
    const ZOOM_KEY = 'tradingGuideZoom';
    const DEFAULT_ZOOM = 1.0;
    
    // Create zoom controls
    function createZoomControls() {
        // Check if controls already exist
        if (document.getElementById('zoomControls')) return;
        
        // Find the header
        const header = document.querySelector('.header-content');
        if (!header) return;
        
        // Create zoom controls container
        const controls = document.createElement('div');
        controls.id = 'zoomControls';
        controls.style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: var(--bg-tertiary);
            padding: 0.5rem;
            border-radius: 10px;
            border: 2px solid var(--border-color);
        `;
        
        // Create zoom out button
        const zoomOut = document.createElement('button');
        zoomOut.innerHTML = '➖';
        zoomOut.title = 'Zoom Out (Ctrl + -)';
        zoomOut.style.cssText = `
            width: 40px;
            height: 40px;
            border: none;
            background: var(--bg-primary);
            color: var(--text-primary);
            border-radius: 8px;
            font-size: 1.2rem;
            cursor: pointer;
            transition: all 0.2s ease;
        `;
        zoomOut.onmouseover = () => zoomOut.style.background = 'var(--accent-red)';
        zoomOut.onmouseout = () => zoomOut.style.background = 'var(--bg-primary)';
        zoomOut.onclick = () => changeZoom(-0.1);
        
        // Create zoom display
        const zoomDisplay = document.createElement('div');
        zoomDisplay.id = 'zoomDisplay';
        zoomDisplay.style.cssText = `
            min-width: 70px;
            padding: 0.5rem 1rem;
            background: var(--accent-blue);
            color: white;
            border-radius: 8px;
            font-weight: bold;
            text-align: center;
            font-size: 1rem;
        `;
        updateZoomDisplay();
        
        // Create zoom in button
        const zoomIn = document.createElement('button');
        zoomIn.innerHTML = '➕';
        zoomIn.title = 'Zoom In (Ctrl + +)';
        zoomIn.style.cssText = `
            width: 40px;
            height: 40px;
            border: none;
            background: var(--bg-primary);
            color: var(--text-primary);
            border-radius: 8px;
            font-size: 1.2rem;
            cursor: pointer;
            transition: all 0.2s ease;
        `;
        zoomIn.onmouseover = () => zoomIn.style.background = 'var(--accent-green)';
        zoomIn.onmouseout = () => zoomIn.style.background = 'var(--bg-primary)';
        zoomIn.onclick = () => changeZoom(0.1);
        
        // Create reset button
        const zoomReset = document.createElement('button');
        zoomReset.innerHTML = '↻';
        zoomReset.title = 'Reset Zoom (Ctrl + 0)';
        zoomReset.style.cssText = `
            width: 40px;
            height: 40px;
            border: none;
            background: var(--bg-primary);
            color: var(--text-primary);
            border-radius: 8px;
            font-size: 1.5rem;
            cursor: pointer;
            transition: all 0.2s ease;
        `;
        zoomReset.onmouseover = () => zoomReset.style.background = 'var(--accent-yellow)';
        zoomReset.onmouseout = () => zoomReset.style.background = 'var(--bg-primary)';
        zoomReset.onclick = () => {
            changeZoom(0, true);
        };
        
        // Add separator line
        const separator = document.createElement('div');
        separator.style.cssText = `
            width: 2px;
            height: 30px;
            background: var(--border-color);
            margin: 0 0.25rem;
        `;
        
        // Assemble controls
        controls.appendChild(zoomOut);
        controls.appendChild(zoomDisplay);
        controls.appendChild(zoomIn);
        controls.appendChild(separator);
        controls.appendChild(zoomReset);
        
        // Add to header
        header.appendChild(controls);
    }
    
    // Change zoom level
    function changeZoom(delta, reset = false) {
        let currentZoom = parseFloat(localStorage.getItem(ZOOM_KEY)) || DEFAULT_ZOOM;
        
        if (reset) {
            currentZoom = DEFAULT_ZOOM;
        } else {
            currentZoom = Math.max(0.5, Math.min(2.0, currentZoom + delta));
        }
        
        // Apply zoom
        document.body.style.zoom = currentZoom;
        document.documentElement.style.zoom = currentZoom;
        
        // Save to localStorage
        localStorage.setItem(ZOOM_KEY, currentZoom.toString());
        
        // Update display
        updateZoomDisplay();
        
        // Show toast notification
        showZoomToast(currentZoom);
    }
    
    // Update zoom display
    function updateZoomDisplay() {
        const display = document.getElementById('zoomDisplay');
        if (display) {
            const zoom = parseFloat(localStorage.getItem(ZOOM_KEY)) || DEFAULT_ZOOM;
            display.textContent = Math.round(zoom * 100) + '%';
        }
    }
    
    // Show toast notification
    function showZoomToast(zoom) {
        // Remove existing toast
        const existingToast = document.getElementById('zoomToast');
        if (existingToast) existingToast.remove();
        
        // Create toast
        const toast = document.createElement('div');
        toast.id = 'zoomToast';
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--accent-blue);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            font-weight: bold;
            font-size: 1.1rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10001;
            animation: slideIn 0.3s ease;
        `;
        toast.textContent = `Zoom: ${Math.round(zoom * 100)}%`;
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(toast);
        
        // Remove after 2 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createZoomControls);
    } else {
        createZoomControls();
    }
    
    // Also initialize after a short delay to ensure header is loaded
    setTimeout(createZoomControls, 100);
    
    // Update display every second
    setInterval(updateZoomDisplay, 1000);
    
    console.log('✅ Zoom controls loaded');
})();


