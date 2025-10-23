// Trading Alerts & Notifications System
// Provides browser notifications for key trading times and events

class TradingAlertsSystem {
    constructor() {
        this.alerts = [];
        this.notificationPermission = 'default';
        this.activeAlerts = new Set();
        this.checkInterval = null;
        
        // Load saved alert preferences
        this.loadAlertSettings();
        
        // Initialize
        this.init();
    }
    
    init() {
        // Request notification permission if not already granted
        if ('Notification' in window) {
            this.notificationPermission = Notification.permission;
            
            // DISABLED: Auto-prompt for alerts (can be manually enabled via settings)
            // if (this.notificationPermission === 'default') {
            //     this.showPermissionPrompt();
            // }
        }
        
        // Start monitoring for alerts (only if permission already granted)
        if (this.notificationPermission === 'granted') {
            this.startMonitoring();
        }
        
        // Add alert settings panel to page
        this.createAlertPanel();
    }
    
    async requestPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            this.notificationPermission = permission;
            
            if (permission === 'granted') {
                this.showNotification('🔔 Alerts Enabled!', 'You will now receive trading alerts', 'success');
                this.startMonitoring();
            } else {
                alert('⚠️ Notifications blocked. You won\'t receive trading alerts.\n\nTo enable:\n1. Click the lock icon in address bar\n2. Allow notifications\n3. Refresh the page');
            }
        }
    }
    
    showPermissionPrompt() {
        const prompt = document.createElement('div');
        prompt.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, var(--accent-blue), var(--accent-green));
            color: white;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            max-width: 350px;
            animation: slideIn 0.3s ease;
        `;
        
        prompt.innerHTML = `
            <h3 style="margin: 0 0 0.75rem 0; font-size: 1.1rem;">🔔 Enable Trading Alerts?</h3>
            <p style="margin: 0 0 1rem 0; font-size: 0.9rem; line-height: 1.5;">
                Get notified for:
                • Session openings (London/NY)
                • Brinks Trade times
                • Quarter changes (Q3 distribution)
                • Custom reminders
            </p>
            <div style="display: flex; gap: 0.5rem;">
                <button onclick="tradingAlerts.requestPermission(); this.parentElement.parentElement.remove();" style="flex: 1; padding: 0.75rem; background: white; color: var(--accent-blue); border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
                    ✅ Enable Alerts
                </button>
                <button onclick="this.parentElement.parentElement.remove();" style="padding: 0.75rem; background: rgba(255,255,255,0.2); color: white; border: none; border-radius: 6px; cursor: pointer;">
                    ✕
                </button>
            </div>
        `;
        
        document.body.appendChild(prompt);
        
        // Auto-remove after 15 seconds if no action
        setTimeout(() => {
            if (prompt.parentElement) {
                prompt.remove();
            }
        }, 15000);
    }
    
    startMonitoring() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }
        
        // Check every 30 seconds
        this.checkInterval = setInterval(() => {
            this.checkForAlerts();
        }, 30000);
        
        // Check immediately
        this.checkForAlerts();
    }
    
    checkForAlerts() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const currentTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        
        const settings = this.getAlertSettings();
        
        // Session Alerts
        if (settings.sessionAlerts) {
            // London Session (15 min warning at 2:45 AM)
            if (currentTime === '02:45' && !this.activeAlerts.has('london-warning')) {
                this.sendAlert(
                    '🌍 London Session Opening Soon!',
                    '15 minutes until London session (3:00 AM EST)\nPrepare for high volatility and reversals!',
                    'london-warning'
                );
            }
            
            // NY Session (15 min warning at 9:15 AM)
            if (currentTime === '09:15' && !this.activeAlerts.has('ny-warning')) {
                this.sendAlert(
                    '🗽 NY Session Opening Soon!',
                    '15 minutes until NY session (9:30 AM EST)\nBest trading opportunities ahead!',
                    'ny-warning'
                );
            }
        }
        
        // Brinks Trade Alerts
        if (settings.brinksAlerts) {
            // Brinks 1: 9:45 PM (21:45)
            if (currentTime === '21:45' && !this.activeAlerts.has('brinks-1')) {
                this.sendAlert(
                    '⚡ BRINKS TRADE TIME!',
                    'Asian Session Brinks (9:45 PM EST)\nWatch for M/W pattern second leg entries!',
                    'brinks-1'
                );
            }
            
            // Brinks 2: 3:45 AM
            if (currentTime === '03:45' && !this.activeAlerts.has('brinks-2')) {
                this.sendAlert(
                    '⚡ BRINKS TRADE TIME!',
                    'London Session Brinks (3:45 AM EST)\nWatch for M/W pattern second leg entries!',
                    'brinks-2'
                );
            }
            
            // Brinks 3: 9:45 AM
            if (currentTime === '09:45' && !this.activeAlerts.has('brinks-3')) {
                this.sendAlert(
                    '⚡ BRINKS TRADE TIME!',
                    'NY Session Brinks (9:45 AM EST)\nWatch for M/W pattern second leg entries!',
                    'brinks-3'
                );
            }
        }
        
        // Quarter Change Alerts
        if (settings.quarterAlerts) {
            // Check for Q3 entry (distribution phase)
            const totalMinutes = hours * 60 + minutes;
            const minutesSinceMidnight = totalMinutes % 90;
            
            // Q3 starts at 45 minutes into each 90-minute cycle
            if (minutesSinceMidnight === 45) {
                const alertId = `q3-${hours}-${Math.floor(minutes / 90)}`;
                if (!this.activeAlerts.has(alertId)) {
                    this.sendAlert(
                        '🎯 Q3 DISTRIBUTION PHASE!',
                        'Entering Q3 - BEST TRADING TIME!\nLook for trend continuation and breakouts.',
                        alertId
                    );
                }
            }
        }
        
        // Tuesday True Week Open
        if (settings.trueOpenAlerts) {
            const day = now.getDay(); // 0 = Sunday, 2 = Tuesday
            if (day === 2 && currentTime === '00:00' && !this.activeAlerts.has('true-week-open')) {
                this.sendAlert(
                    '📅 TRUE WEEK OPEN!',
                    'Tuesday Midnight (12:00 AM EST)\nThe real trading week begins NOW!',
                    'true-week-open'
                );
            }
        }
        
        // Wednesday Alert
        if (settings.wednesdayAlert) {
            const day = now.getDay();
            if (day === 3 && currentTime === '08:00' && !this.activeAlerts.has('wednesday')) {
                this.sendAlert(
                    '🔥 WEDNESDAY - BEST DAY TO TRADE!',
                    'It\'s Wednesday - Day 3 Distribution!\nHighest probability setups today!',
                    'wednesday'
                );
            }
        }
        
        // Daily Pre-Market Reminder
        if (settings.preMarketReminder) {
            if (currentTime === '08:30' && !this.activeAlerts.has('pre-market-' + now.getDate())) {
                this.sendAlert(
                    '📋 Pre-Market Checklist!',
                    '30 minutes until NY session\n✅ Mark True Opens\n✅ Note PDH/PDL\n✅ Check PSR Zone\n✅ Review yesterday\'s trades',
                    'pre-market-' + now.getDate()
                );
            }
        }
        
        // Clear old alerts after 5 minutes
        this.cleanupOldAlerts();
    }
    
    sendAlert(title, body, alertId) {
        // Add to active alerts
        this.activeAlerts.add(alertId);
        
        // Browser notification
        if (this.notificationPermission === 'granted') {
            const notification = new Notification(title, {
                body: body,
                // icon: '../favicon.ico', // Optional - add if you create one
                // badge: '../favicon.ico',
                tag: alertId,
                requireInteraction: false,
                vibrate: [200, 100, 200]
            });
            
            // Auto-close after 10 seconds
            setTimeout(() => notification.close(), 10000);
            
            // Play sound
            this.playAlertSound();
        }
        
        // In-app notification (always show)
        this.showInAppNotification(title, body);
        
        // Log to console
        console.log(`🔔 ALERT: ${title} - ${body}`);
    }
    
    showInAppNotification(title, body) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, var(--accent-green), var(--accent-blue));
            color: white;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
            z-index: 10001;
            max-width: 350px;
            animation: slideIn 0.3s ease, pulse 2s infinite;
            border: 2px solid rgba(255, 255, 255, 0.3);
        `;
        
        notification.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                <h3 style="margin: 0; font-size: 1.1rem;">${title}</h3>
                <button onclick="this.parentElement.parentElement.remove()" style="background: rgba(255,255,255,0.2); border: none; color: white; border-radius: 4px; padding: 0.25rem 0.5rem; cursor: pointer; font-size: 1rem;">✕</button>
            </div>
            <p style="margin: 0; font-size: 0.9rem; line-height: 1.5; white-space: pre-line;">${body}</p>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 10000);
    }
    
    playAlertSound() {
        // Create a simple beep using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            // Silent fail if audio not supported
        }
    }
    
    cleanupOldAlerts() {
        // Reset alerts every hour to allow repeats
        const now = new Date();
        if (now.getMinutes() === 0) {
            this.activeAlerts.clear();
        }
    }
    
    getAlertSettings() {
        const saved = localStorage.getItem('alertSettings');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // Defaults
        return {
            sessionAlerts: true,
            brinksAlerts: true,
            quarterAlerts: false, // Can be noisy
            trueOpenAlerts: true,
            wednesdayAlert: true,
            preMarketReminder: true
        };
    }
    
    saveAlertSettings(settings) {
        localStorage.setItem('alertSettings', JSON.stringify(settings));
    }
    
    loadAlertSettings() {
        // Settings loaded in getAlertSettings()
    }
    
    createAlertPanel() {
        // Add alert settings to any existing settings panel
        // Or create a floating settings button
        const settingsButton = document.createElement('button');
        settingsButton.id = 'alertSettingsButton';
        settingsButton.style.cssText = `
            position: fixed;
            top: 150px;
            right: 20px;
            z-index: 9998;
            background: var(--bg-tertiary);
            border: 2px solid var(--border-color);
            border-radius: 50%;
            width: 50px;
            height: 50px;
            cursor: pointer;
            font-size: 1.5rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        settingsButton.innerHTML = '🔔';
        settingsButton.title = 'Alert Settings';
        settingsButton.onclick = () => this.showAlertSettingsModal();
        
        document.body.appendChild(settingsButton);
    }
    
    showAlertSettingsModal() {
        const settings = this.getAlertSettings();
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10002;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div style="background: var(--bg-secondary); border-radius: 12px; padding: 2rem; max-width: 500px; width: 90%; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5); border: 2px solid var(--border-color);">
                <h2 style="margin: 0 0 1.5rem 0; color: var(--accent-green);">🔔 Alert Settings</h2>
                
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer; padding: 0.75rem; background: var(--bg-tertiary); border-radius: 6px;">
                        <input type="checkbox" id="sessionAlerts" ${settings.sessionAlerts ? 'checked' : ''} style="width: 20px; height: 20px; cursor: pointer;">
                        <div>
                            <div style="font-weight: bold;">Session Alerts</div>
                            <div style="font-size: 0.85rem; color: var(--text-secondary);">London & NY session warnings (15 min before)</div>
                        </div>
                    </label>
                    
                    <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer; padding: 0.75rem; background: var(--bg-tertiary); border-radius: 6px;">
                        <input type="checkbox" id="brinksAlerts" ${settings.brinksAlerts ? 'checked' : ''} style="width: 20px; height: 20px; cursor: pointer;">
                        <div>
                            <div style="font-weight: bold;">Brinks Trade Alerts</div>
                            <div style="font-size: 0.85rem; color: var(--text-secondary);">9:45 PM, 3:45 AM, 9:45 AM EST</div>
                        </div>
                    </label>
                    
                    <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer; padding: 0.75rem; background: var(--bg-tertiary); border-radius: 6px;">
                        <input type="checkbox" id="quarterAlerts" ${settings.quarterAlerts ? 'checked' : ''} style="width: 20px; height: 20px; cursor: pointer;">
                        <div>
                            <div style="font-weight: bold;">Q3 Distribution Alerts</div>
                            <div style="font-size: 0.85rem; color: var(--text-secondary);">Notify when entering Q3 phase (can be frequent)</div>
                        </div>
                    </label>
                    
                    <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer; padding: 0.75rem; background: var(--bg-tertiary); border-radius: 6px;">
                        <input type="checkbox" id="trueOpenAlerts" ${settings.trueOpenAlerts ? 'checked' : ''} style="width: 20px; height: 20px; cursor: pointer;">
                        <div>
                            <div style="font-weight: bold;">True Week Open Alert</div>
                            <div style="font-size: 0.85rem; color: var(--text-secondary);">Tuesday midnight (true trading week begins)</div>
                        </div>
                    </label>
                    
                    <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer; padding: 0.75rem; background: var(--bg-tertiary); border-radius: 6px;">
                        <input type="checkbox" id="wednesdayAlert" ${settings.wednesdayAlert ? 'checked' : ''} style="width: 20px; height: 20px; cursor: pointer;">
                        <div>
                            <div style="font-weight: bold;">Wednesday Trading Alert</div>
                            <div style="font-size: 0.85rem; color: var(--text-secondary);">Reminder that it's the best day to trade</div>
                        </div>
                    </label>
                    
                    <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer; padding: 0.75rem; background: var(--bg-tertiary); border-radius: 6px;">
                        <input type="checkbox" id="preMarketReminder" ${settings.preMarketReminder ? 'checked' : ''} style="width: 20px; height: 20px; cursor: pointer;">
                        <div>
                            <div style="font-weight: bold;">Daily Pre-Market Checklist</div>
                            <div style="font-size: 0.85rem; color: var(--text-secondary);">8:30 AM reminder to prepare for trading</div>
                        </div>
                    </label>
                </div>
                
                <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color);">
                    <div style="display: flex; gap: 0.75rem;">
                        <button onclick="tradingAlerts.saveSettingsFromModal()" style="flex: 1; padding: 0.75rem; background: var(--accent-green); color: var(--bg-primary); border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
                            💾 Save Settings
                        </button>
                        <button onclick="document.getElementById('alertSettingsModal').remove()" style="flex: 1; padding: 0.75rem; background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer;">
                            Cancel
                        </button>
                    </div>
                </div>
                
                ${this.notificationPermission !== 'granted' ? `
                    <div style="margin-top: 1rem; padding: 1rem; background: rgba(255, 193, 7, 0.1); border-left: 3px solid var(--accent-yellow); border-radius: 4px;">
                        <strong style="color: var(--accent-yellow);">⚠️ Browser Notifications Disabled</strong>
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem;">Click "Enable Notifications" to receive browser alerts</p>
                        <button onclick="tradingAlerts.requestPermission()" style="margin-top: 0.5rem; padding: 0.5rem 1rem; background: var(--accent-yellow); color: var(--bg-primary); border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
                            Enable Notifications
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
        
        modal.id = 'alertSettingsModal';
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        };
        
        document.body.appendChild(modal);
    }
    
    saveSettingsFromModal() {
        const settings = {
            sessionAlerts: document.getElementById('sessionAlerts').checked,
            brinksAlerts: document.getElementById('brinksAlerts').checked,
            quarterAlerts: document.getElementById('quarterAlerts').checked,
            trueOpenAlerts: document.getElementById('trueOpenAlerts').checked,
            wednesdayAlert: document.getElementById('wednesdayAlert').checked,
            preMarketReminder: document.getElementById('preMarketReminder').checked
        };
        
        this.saveAlertSettings(settings);
        
        // Show success message
        this.showInAppNotification(
            '✅ Settings Saved!',
            'Your alert preferences have been updated.'
        );
        
        // Close modal
        document.getElementById('alertSettingsModal').remove();
    }
    
    showNotification(title, message, type = 'info') {
        const colors = {
            success: 'var(--accent-green)',
            warning: 'var(--accent-yellow)',
            error: 'var(--accent-red)',
            info: 'var(--accent-blue)'
        };
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;
        
        notification.innerHTML = `
            <strong style="display: block; margin-bottom: 0.25rem;">${title}</strong>
            <div style="font-size: 0.9rem;">${message}</div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize the alerts system globally
let tradingAlerts;

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    tradingAlerts = new TradingAlertsSystem();
    console.log('🔔 Trading Alerts System Initialized');
});

