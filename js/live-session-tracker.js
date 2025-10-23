/**
 * Live Session Tracker
 * Highlights current cycle and shows what to look for based on real-time
 */

class LiveSessionTracker {
    constructor() {
        this.updateInterval = null;
        this.init();
    }

    init() {
        // Wait for tabs to be ready
        setTimeout(() => {
            this.attachTabListeners();
            this.startTracking();
        }, 1000);
    }

    getESTTime() {
        // Get current time in EST - FIXED TO RETURN ACTUAL EST TIME
        const now = new Date();
        
        // Get EST time string with proper timezone
        const estTimeString = now.toLocaleString('en-US', { 
            timeZone: 'America/New_York',
            hour12: false,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        // Parse into Date object properly
        const [datePart, timePart] = estTimeString.split(', ');
        const [month, day, year] = datePart.split('/');
        const [hours, minutes, seconds] = timePart.split(':');
        
        // Create new Date in local timezone but with EST values
        const estDate = new Date(year, month - 1, day, hours, minutes, seconds);
        return estDate;
    }

    getCurrentSession() {
        const now = this.getESTTime();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const totalMinutes = hours * 60 + minutes;

        // Session times in minutes from midnight EST
        // Asian: 7:00 PM - 2:00 AM (next day)
        // London: 2:00 AM - 11:00 AM
        // NY: 7:30 AM - 5:00 PM
        // PM: 12:00 PM - 6:00 PM

        // Check Asian session (crosses midnight)
        if (totalMinutes >= 19 * 60 || totalMinutes < 2 * 60) {
            return { start: 19 * 60, end: 2 * 60, name: 'asian', label: 'Asian Session' };
        }
        // London session
        else if (totalMinutes >= 2 * 60 && totalMinutes < 11 * 60) {
            return { start: 2 * 60, end: 11 * 60, name: 'london', label: 'London Session' };
        }
        // NY session (7:30 AM - 5 PM)
        else if (totalMinutes >= 450 && totalMinutes < 17 * 60) {
            return { start: 450, end: 17 * 60, name: 'ny', label: 'NY Session' };
        }
        // PM session overlaps with NY but we'll check for active PM period
        else if (totalMinutes >= 12 * 60 && totalMinutes < 18 * 60) {
            return { start: 12 * 60, end: 18 * 60, name: 'pm', label: 'PM Session' };
        }

        return null;
    }

    get90MinCycle(sessionStart, currentMinutes) {
        const minutesSinceStart = currentMinutes - sessionStart;
        if (minutesSinceStart < 0) return null;
        
        const cycleNumber = Math.floor(minutesSinceStart / 90);
        const cycleMinute = minutesSinceStart % 90;
        
        let quarter;
        if (cycleMinute < 22.5) quarter = 'Q1';
        else if (cycleMinute < 45) quarter = 'Q2';
        else if (cycleMinute < 67.5) quarter = 'Q3';
        else quarter = 'Q4';
        
        return { cycleNumber, quarter, minuteInQuarter: cycleMinute };
    }

    getMicroCycle(minuteIn90Min) {
        if (minuteIn90Min < 22.5) return { quarter: 'Q1', phase: 'Accumulation', progress: (minuteIn90Min / 22.5) * 100 };
        else if (minuteIn90Min < 45) return { quarter: 'Q2', phase: 'Manipulation', progress: ((minuteIn90Min - 22.5) / 22.5) * 100 };
        else if (minuteIn90Min < 67.5) return { quarter: 'Q3', phase: 'Distribution', progress: ((minuteIn90Min - 45) / 22.5) * 100 };
        else return { quarter: 'Q4', phase: 'Reversal', progress: ((minuteIn90Min - 67.5) / 22.5) * 100 };
    }

    updateSessionIndicator(tabName) {
        const currentSession = this.getCurrentSession();
        const estNow = this.getESTTime(); // Use EST time
        
        // Format EST time for display
        const displayNow = new Date();
        const estTimeDisplay = displayNow.toLocaleString('en-US', { 
            timeZone: 'America/New_York',
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        // Find or create the live indicator container
        let container = document.getElementById(`live-indicator-${tabName}`);
        if (!container) {
            // Create container at the top of the tab
            const tabContent = document.getElementById(tabName);
            if (!tabContent) return;
            
            container = document.createElement('div');
            container.id = `live-indicator-${tabName}`;
            container.style.cssText = `
                background: linear-gradient(135deg, rgba(74, 158, 255, 0.2), rgba(138, 43, 226, 0.2));
                border: 2px solid var(--accent-blue);
                border-radius: 12px;
                padding: 1.5rem;
                margin-bottom: 2rem;
                position: sticky;
                top: 0;
                z-index: 100;
                backdrop-filter: blur(10px);
            `;
            
            // Insert at the top of tab content
            const firstChild = tabContent.querySelector('h3');
            if (firstChild) {
                firstChild.parentNode.insertBefore(container, firstChild.nextSibling);
            } else {
                tabContent.insertBefore(container, tabContent.firstChild);
            }
        }

        // Check if current tab matches current session
        const sessionMap = {
            'asian': 'asian',
            'london': 'london',
            'ny': 'ny',
            'pm': 'pm',
            'overview': 'overview',
            'timing': 'timing'
        };

        if (!currentSession || (sessionMap[tabName] !== currentSession.name && tabName !== 'overview' && tabName !== 'timing')) {
            // Out of session
            container.innerHTML = `
                <div style="text-align: center;">
                    <h3 style="color: var(--text-tertiary); margin: 0 0 0.5rem 0;">
                        ⏸️ ${tabName.charAt(0).toUpperCase() + tabName.slice(1)} Session Currently Inactive
                    </h3>
                    <p style="margin: 0; color: var(--text-secondary); font-size: 0.95rem;">
                        ${currentSession ? `Currently in ${currentSession.label}` : 'No active session'}
                    </p>
                    <p style="margin: 0.5rem 0 0 0; color: var(--text-tertiary); font-size: 0.9rem;">
                        Current Time: ${estTimeDisplay} EST
                    </p>
                </div>
            `;
            return;
        }

        // Session is active - show detailed info
        const hours = estNow.getHours();
        const minutes = estNow.getMinutes();
        const totalMinutes = hours * 60 + minutes;

        let sessionInfo = this.getSessionInfo(tabName, totalMinutes);
        
        container.innerHTML = `
            <div style="display: grid; gap: 1rem;">
                <div style="text-align: center;">
                    <h3 style="color: var(--accent-green); margin: 0 0 0.5rem 0; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                        <span style="display: inline-block; width: 12px; height: 12px; background: var(--accent-green); border-radius: 50%; animation: pulse 2s infinite;"></span>
                        ${sessionInfo.sessionName}
                    </h3>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
                    <!-- Daily Cycle Card -->
                    <div style="background: linear-gradient(135deg, rgba(74, 158, 255, 0.1), rgba(74, 158, 255, 0.05)); padding: 1rem; border-radius: 8px; border: 2px solid var(--accent-blue);">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                            <div style="font-size: 0.75rem; color: var(--text-secondary); font-weight: bold;">🌍 DAILY CYCLE</div>
                            <div style="font-size: 0.7rem; padding: 0.15rem 0.4rem; background: rgba(74, 158, 255, 0.25); border-radius: 4px; color: var(--accent-blue); font-weight: bold;">${sessionInfo.dailyCycle}</div>
                        </div>
                        <div style="font-weight: bold; color: var(--accent-blue); font-size: 1rem; margin-bottom: 0.5rem;">${sessionInfo.dailyCycleName}</div>
                        <div style="background: rgba(255, 255, 255, 0.1); height: 6px; border-radius: 3px; overflow: hidden; margin-bottom: 0.5rem;">
                            <div style="background: var(--accent-blue); height: 100%; width: ${sessionInfo.dailyProgress}%; transition: width 0.5s;"></div>
                        </div>
                        <div style="font-size: 0.7rem; color: var(--text-secondary);">${sessionInfo.dailyPhase}</div>
                    </div>
                    
                    <!-- 90-Min Cycle Card -->
                    <div style="background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.05)); padding: 1rem; border-radius: 8px; border: 2px solid var(--accent-yellow);">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                            <div style="font-size: 0.75rem; color: var(--text-secondary); font-weight: bold;">⏱️ 90-MIN CYCLE</div>
                            <div style="font-size: 0.7rem; padding: 0.15rem 0.4rem; background: rgba(255, 215, 0, 0.25); border-radius: 4px; color: var(--accent-yellow); font-weight: bold;">${sessionInfo.ninetyMinCycle}</div>
                        </div>
                        <div style="font-weight: bold; color: var(--accent-yellow); font-size: 1rem; margin-bottom: 0.5rem;">${sessionInfo.ninetyMinName}</div>
                        <div style="background: rgba(255, 255, 255, 0.1); height: 6px; border-radius: 3px; overflow: hidden; margin-bottom: 0.5rem;">
                            <div style="background: var(--accent-yellow); height: 100%; width: ${sessionInfo.ninetyMinProgress}%; transition: width 0.5s;"></div>
                        </div>
                        <div style="font-size: 0.7rem; color: var(--text-secondary);">${sessionInfo.ninetyMinPhase}</div>
                    </div>
                    
                    <!-- Micro Cycle Card -->
                    <div style="background: linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 255, 136, 0.05)); padding: 1rem; border-radius: 8px; border: 2px solid var(--accent-green);">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                            <div style="font-size: 0.75rem; color: var(--text-secondary); font-weight: bold;">⚡ MICRO (22.5min)</div>
                            <div style="font-size: 0.7rem; padding: 0.15rem 0.4rem; background: rgba(0, 255, 136, 0.25); border-radius: 4px; color: var(--accent-green); font-weight: bold;">${sessionInfo.microCycle}</div>
                        </div>
                        <div style="font-weight: bold; color: var(--accent-green); font-size: 1rem; margin-bottom: 0.5rem;">${sessionInfo.microName}</div>
                        <div style="background: rgba(255, 255, 255, 0.1); height: 6px; border-radius: 3px; overflow: hidden; margin-bottom: 0.5rem;">
                            <div style="background: var(--accent-green); height: 100%; width: ${sessionInfo.microProgress}%; transition: width 0.5s;"></div>
                        </div>
                        <div style="font-size: 0.7rem; color: var(--text-secondary);">${sessionInfo.microPhase} • ${Math.round(sessionInfo.microProgress)}% done</div>
                    </div>
                </div>

                <div style="background: ${sessionInfo.actionColor}; padding: 1rem; border-radius: 8px; border: 2px solid ${sessionInfo.actionBorder};">
                    <div style="font-weight: bold; color: ${sessionInfo.actionBorder}; margin-bottom: 0.5rem; font-size: 1.05rem;">
                        ${sessionInfo.actionIcon} ${sessionInfo.actionTitle}
                    </div>
                    <div style="color: var(--text-primary); line-height: 1.6;">
                        ${sessionInfo.actionText}
                    </div>
                </div>
            </div>
        `;

        // Add pulse animation
        if (!document.getElementById('pulse-animation')) {
            const style = document.createElement('style');
            style.id = 'pulse-animation';
            style.textContent = `
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.2); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    getSessionInfo(tabName, currentMinutes) {
        const now = this.getESTTime();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        
        // Calculate total minutes from midnight
        const currentTotalMinutes = hours * 60 + minutes;

        let info = {
            sessionName: '',
            dailyCycle: '',
            dailyCycleName: '',
            dailyPhase: '',
            dailyProgress: 0,
            ninetyMinCycle: '',
            ninetyMinName: '',
            ninetyMinPhase: '',
            ninetyMinProgress: 0,
            microCycle: '',
            microName: '',
            microPhase: '',
            microProgress: 0,
            cycle90: '',
            progress: 0,
            actionIcon: '',
            actionTitle: '',
            actionText: '',
            actionColor: '',
            actionBorder: ''
        };

        switch(tabName) {
            case 'asian':
                info.sessionName = 'Asian Session Active';
                info.dailyCycle = 'Q1';
                info.dailyCycleName = 'Asian Session';
                info.dailyPhase = 'Accumulation - Mark levels';
                
                // Calculate session progress (7 PM - 2 AM = 7 hours)
                let asianStart = 19 * 60; // 7 PM = 1140 minutes
                let minutesSinceAsianStart = currentTotalMinutes >= asianStart 
                    ? currentTotalMinutes - asianStart 
                    : (24 * 60 - asianStart) + currentTotalMinutes;
                let asianDuration = 7 * 60; // 7 hours
                info.dailyProgress = Math.min((minutesSinceAsianStart / asianDuration) * 100, 100);
                
                let asian90 = this.get90MinCycle(0, minutesSinceAsianStart);
                
                if (asian90) {
                    info.cycle90 = `Asian ${asian90.quarter}`;
                    info.ninetyMinCycle = asian90.quarter;
                    info.ninetyMinName = `Cycle ${asian90.cycleNumber + 1} of 4`;
                    info.ninetyMinPhase = 'Observe range formation';
                    info.ninetyMinProgress = ((asian90.cycleNumber * 90 + asian90.minuteInQuarter) / (4 * 90)) * 100;
                    
                    let micro = this.getMicroCycle(asian90.minuteInQuarter);
                    info.microCycle = micro.quarter;
                    info.microName = `${micro.phase} Quarter`;
                    info.microPhase = micro.phase;
                    info.microProgress = micro.progress;
                    info.progress = micro.progress;
                }
                
                info.actionIcon = '👀';
                info.actionTitle = 'OBSERVE ONLY';
                info.actionText = 'Mark Asian High and Low on your chart. Calculate the 50% midpoint. DO NOT TRADE. This range will be swept by London.';
                info.actionColor = 'rgba(74, 158, 255, 0.1)';
                info.actionBorder = 'var(--accent-blue)';
                break;

            case 'london':
                info.sessionName = 'London Session Active';
                info.dailyCycle = 'Q2';
                info.dailyCycleName = 'London Session';
                info.dailyPhase = 'Manipulation - Watch for PF';
                
                // Calculate session progress (2 AM - 9 AM = 7 hours)
                let londonStart = 2 * 60; // 2 AM = 120 minutes
                let minutesSinceLondonStart = currentTotalMinutes >= londonStart 
                    ? currentTotalMinutes - londonStart 
                    : (24 * 60 - londonStart) + currentTotalMinutes;
                let londonDuration = 7 * 60; // 7 hours
                info.dailyProgress = Math.min((minutesSinceLondonStart / londonDuration) * 100, 100);
                
                // Calculate 90-min cycle (starting from 2 AM)
                let london90 = this.get90MinCycle(0, minutesSinceLondonStart);
                
                if (london90) {
                    info.cycle90 = `London ${london90.quarter}`;
                    info.ninetyMinCycle = london90.quarter;
                    info.ninetyMinName = `Cycle ${london90.cycleNumber + 1} of 4`;
                    info.ninetyMinPhase = london90.quarter === 'Q2' ? 'Peak Formation Window' : 'Manipulation phase';
                    info.ninetyMinProgress = ((london90.cycleNumber * 90 + london90.minuteInQuarter) / (4 * 90)) * 100;
                    
                    let micro = this.getMicroCycle(london90.minuteInQuarter);
                    info.microCycle = micro.quarter;
                    info.microName = `${micro.phase} Quarter`;
                    info.microPhase = micro.phase;
                    info.microProgress = micro.progress;
                    info.progress = micro.progress;
                    
                    // Special actions based on cycle
                    if (london90.quarter === 'Q2' && hours >= 3 && hours < 5) {
                        info.actionIcon = '⭐';
                        info.actionTitle = 'PEAK FORMATION WINDOW';
                        info.actionText = 'London PF is forming NOW! Mark the extreme high or low. This is the level NY will trade against. Watch for rejection candle.';
                        info.actionColor = 'rgba(255, 215, 0, 0.15)';
                        info.actionBorder = 'var(--accent-yellow)';
                    } else {
                        info.actionIcon = '📍';
                        info.actionTitle = 'MARK LEVELS';
                        info.actionText = 'Watch for Asian range sweep. Mark Peak Formation (PF) high or low. Note the direction - NY will reverse it. DO NOT CHASE!';
                        info.actionColor = 'rgba(255, 215, 0, 0.1)';
                        info.actionBorder = 'var(--accent-yellow)';
                    }
                }
                break;

            case 'ny':
                info.sessionName = 'NY Session Active';
                info.dailyCycle = 'Q3';
                info.dailyCycleName = 'NY AM Session ⭐⭐⭐';
                info.dailyPhase = 'Distribution - TRADE NOW';
                
                // Calculate session progress (9 AM - 12 PM = 3 hours)
                let nyStart = 9 * 60; // 9 AM = 540 minutes
                let minutesSinceNYStart = currentTotalMinutes >= nyStart 
                    ? currentTotalMinutes - nyStart 
                    : 0;
                let nyDuration = 3 * 60; // 3 hours (prime trading window)
                info.dailyProgress = Math.min((minutesSinceNYStart / nyDuration) * 100, 100);
                
                // Calculate 90-min cycle (starting from 9 AM)
                let ny90 = this.get90MinCycle(0, minutesSinceNYStart);
                
                if (ny90) {
                    info.cycle90 = `NY ${ny90.quarter}`;
                    info.ninetyMinCycle = ny90.quarter;
                    info.ninetyMinName = `Cycle ${ny90.cycleNumber + 1} of 2`;
                    info.ninetyMinPhase = ny90.quarter === 'Q3' ? 'Distribution - Prime time!' : 'Accumulation phase';
                    info.ninetyMinProgress = ((ny90.cycleNumber * 90 + ny90.minuteInQuarter) / (2 * 90)) * 100;
                    
                    let micro = this.getMicroCycle(ny90.minuteInQuarter);
                    info.microCycle = micro.quarter;
                    info.microName = `${micro.phase} Quarter`;
                    info.microPhase = micro.phase;
                    info.microProgress = micro.progress;
                    info.progress = micro.progress;
                    
                    // Critical trading windows
                    if (hours === 9 && minutes >= 22 && minutes <= 45) {
                        info.actionIcon = '🔥';
                        info.actionTitle = 'PRIME ENTRY WINDOW - BRINKS TIME!';
                        info.actionText = 'THIS IS IT! 9:30 AM NYSE Open + 9:45 AM Brinks Time. Enter on sweep rejection opposite to London direction. All cycles aligned!';
                        info.actionColor = 'rgba(0, 255, 136, 0.2)';
                        info.actionBorder = 'var(--accent-green)';
                    } else if (hours === 9 && minutes >= 45 || (hours === 10 && minutes <= 7)) {
                        info.actionIcon = '🎯';
                        info.actionTitle = 'MICRO Q3 - DISTRIBUTION!';
                        info.actionText = 'Real move is happening NOW! If you entered at 9:45, watch for TP1. Trail stops to breakeven. Ride the trend!';
                        info.actionColor = 'rgba(0, 255, 136, 0.2)';
                        info.actionBorder = 'var(--accent-green)';
                    } else if (hours >= 9 && hours < 12) {
                        info.actionIcon = '✅';
                        info.actionTitle = 'ACTIVE TRADING WINDOW';
                        info.actionText = 'Still in optimal window. Look for M/W pattern completion. Enter on pullbacks. Confirm with EMA alignment (13, 50, 200).';
                        info.actionColor = 'rgba(0, 255, 136, 0.15)';
                        info.actionBorder = 'var(--accent-green)';
                    } else {
                        info.actionIcon = '⚠️';
                        info.actionTitle = 'MANAGE POSITIONS';
                        info.actionText = 'Past prime window. Trail stops on open trades. Avoid new entries unless pristine Level 3 setup. Prepare for PM session.';
                        info.actionColor = 'rgba(255, 215, 0, 0.1)';
                        info.actionBorder = 'var(--accent-yellow)';
                    }
                }
                break;

            case 'pm':
                info.sessionName = 'PM Session Active';
                info.dailyCycle = 'Q4';
                info.dailyCycleName = 'NY PM Session';
                info.dailyPhase = 'Reversal - Close positions';
                
                // Calculate session progress (12 PM - 7 PM = 7 hours)
                let pmStart = 12 * 60; // 12 PM = 720 minutes
                let minutesSincePMStart = currentTotalMinutes >= pmStart 
                    ? currentTotalMinutes - pmStart 
                    : 0;
                let pmDuration = 7 * 60; // 7 hours
                info.dailyProgress = Math.min((minutesSincePMStart / pmDuration) * 100, 100);
                
                // Calculate 90-min cycle (starting from 12 PM)
                let pm90 = this.get90MinCycle(0, minutesSincePMStart);
                
                if (pm90) {
                    info.cycle90 = `PM ${pm90.quarter}`;
                    info.ninetyMinCycle = pm90.quarter;
                    info.ninetyMinName = `PM Cycle ${pm90.cycleNumber + 1}`;
                    info.ninetyMinPhase = 'Reversal - Consolidation';
                    info.ninetyMinProgress = ((pm90.cycleNumber * 90 + pm90.minuteInQuarter) / (4 * 90)) * 100;
                    
                    let micro = this.getMicroCycle(pm90.minuteInQuarter);
                    info.microCycle = micro.quarter;
                    info.microName = `${micro.phase} Quarter`;
                    info.microPhase = micro.phase;
                    info.microProgress = micro.progress;
                    info.progress = micro.progress;
                }
                
                info.actionIcon = '📊';
                info.actionTitle = 'MANAGE & ANALYZE';
                info.actionText = 'Trail stops to breakeven. Take profits at TP2 if not hit. Close all positions by 4 PM (day traders). Analyze today\'s trades.';
                info.actionColor = 'rgba(255, 152, 0, 0.1)';
                info.actionBorder = 'var(--accent-red)';
                break;
        }

        return info;
    }

    attachTabListeners() {
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.getAttribute('data-tab');
                setTimeout(() => {
                    this.updateSessionIndicator(tabName);
                }, 100);
            });
        });

        // Update the currently active tab on load
        const activeTab = document.querySelector('.tab-button.active');
        if (activeTab) {
            const tabName = activeTab.getAttribute('data-tab');
            this.updateSessionIndicator(tabName);
        }
    }

    startTracking() {
        // Update every second
        this.updateInterval = setInterval(() => {
            const activeTab = document.querySelector('.tab-button.active');
            if (activeTab) {
                const tabName = activeTab.getAttribute('data-tab');
                this.updateSessionIndicator(tabName);
            }
        }, 1000);
    }

    stop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.liveSessionTracker = new LiveSessionTracker();
    });
} else {
    window.liveSessionTracker = new LiveSessionTracker();
}

console.log('✅ Live Session Tracker Loaded');
