// Trading Guide - Global Error Handler
// Catches and displays user-friendly error messages

// Global error handler for uncaught errors
window.addEventListener('error', function(event) {
    console.error('Global Error:', event.error);
    showUserFriendlyError('Something went wrong. The app will continue working, but please refresh if issues persist.');
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled Promise Rejection:', event.reason);
    showUserFriendlyError('A background task failed. The app continues to work normally.');
});

// Display user-friendly error messages
function showUserFriendlyError(message) {
    // Check if error toast already exists
    if (document.querySelector('.error-toast')) {
        return;
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-toast';
    errorDiv.innerHTML = `
        <div class="error-notification">
            <div class="error-icon">⚠️</div>
            <div class="error-content">
                <div class="error-title">Notice</div>
                <div class="error-message">${message}</div>
            </div>
            <button class="error-close" onclick="this.closest('.error-toast').remove()">✕</button>
        </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
        if (errorDiv && errorDiv.parentNode) {
            errorDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => errorDiv.remove(), 300);
        }
    }, 8000);
}

// Add error notification styles
const errorStyles = document.createElement('style');
errorStyles.textContent = `
    .error-toast {
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    }
    
    .error-notification {
        background: linear-gradient(135deg, #ff4a4a, #ff6b6b);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 8px 24px rgba(255, 74, 74, 0.4);
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        min-width: 300px;
    }
    
    .error-icon {
        font-size: 1.5rem;
        flex-shrink: 0;
    }
    
    .error-content {
        flex: 1;
    }
    
    .error-title {
        font-weight: bold;
        font-size: 1rem;
        margin-bottom: 0.25rem;
    }
    
    .error-message {
        font-size: 0.9rem;
        opacity: 0.95;
        line-height: 1.4;
    }
    
    .error-close {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
        flex-shrink: 0;
    }
    
    .error-close:hover {
        background: rgba(255, 255, 255, 0.3);
    }
    
    @media (max-width: 768px) {
        .error-toast {
            right: 10px;
            left: 10px;
        }
        
        .error-notification {
            min-width: auto;
        }
    }
`;
document.head.appendChild(errorStyles);

// Success notification helper
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-toast';
    successDiv.innerHTML = `
        <div style="position: fixed; top: 100px; right: 20px; z-index: 10000;
                    background: linear-gradient(135deg, var(--accent-green), #00d97e);
                    color: white; padding: 1rem 1.5rem; border-radius: 10px;
                    box-shadow: 0 8px 24px rgba(0, 255, 136, 0.4);
                    display: flex; align-items: center; gap: 1rem;
                    animation: slideIn 0.3s ease;">
            <span style="font-size: 1.5rem;">✅</span>
            <span style="font-weight: 500;">${message}</span>
        </div>
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => successDiv.remove(), 300);
    }, 3000);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { showUserFriendlyError, showSuccessMessage };
}

console.log('✅ Error handler initialized');
