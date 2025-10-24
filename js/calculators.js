// Trading Calculators JavaScript
// Handles all calculator logic

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Format currency
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

// Format number with commas
function formatNumber(value, decimals = 2) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value);
}

// Validate positive number
function validatePositiveNumber(value, fieldName) {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
        return { valid: false, message: `${fieldName} must be a positive number` };
    }
    return { valid: true, value: num };
}

// Add keyboard support for calculators
function addKeyboardSupport(inputIds, calculateFunction) {
    inputIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    calculateFunction();
                }
            });
        }
    });
}

// Clear calculator result
function clearResult(resultId) {
    const resultDiv = document.getElementById(resultId);
    if (resultDiv) {
        resultDiv.style.display = 'none';
        resultDiv.innerHTML = '';
    }
}

// Show error message
function showError(message, resultId) {
    const resultDiv = document.getElementById(resultId);
    if (resultDiv) {
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <div style="padding: 1rem; background: rgba(255, 74, 74, 0.1); border-left: 4px solid var(--accent-red); border-radius: 4px;">
                <strong style="color: var(--accent-red);">❌ Error:</strong>
                <div style="margin-top: 0.5rem; font-size: 0.9rem;">${message}</div>
            </div>
        `;
    }
}

// Copy to clipboard
function copyToClipboard(text, buttonElement) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = buttonElement.innerHTML;
        buttonElement.innerHTML = '✅ Copied!';
        buttonElement.style.background = 'var(--accent-green)';
        
        setTimeout(() => {
            buttonElement.innerHTML = originalText;
            buttonElement.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard');
    });
}

// ==========================================
// CALCULATOR FUNCTIONS
// ==========================================

// Position Size Calculator
function calculatePositionSize() {
    const accountBalance = parseFloat(document.getElementById('psAccountBalance').value);
    const riskPercent = parseFloat(document.getElementById('psRiskPercent').value);
    const stopPips = parseFloat(document.getElementById('psStopPips').value);
    
    // Validate inputs
    if (!accountBalance || !riskPercent || !stopPips) {
        alert('❌ Please fill in all fields!');
        return;
    }
    
    if (riskPercent > 5) {
        alert('⚠️ Warning: Risking more than 5% per trade is extremely dangerous!');
    }
    
    // Calculate risk amount in dollars
    const riskAmount = accountBalance * (riskPercent / 100);
    
    // Assume standard lot (100,000 units) and $10/pip
    const pipValue = 10; // Standard for most pairs
    
    // Calculate position size
    const positionSize = riskAmount / (stopPips * pipValue);
    
    // Display result
    const resultDiv = document.getElementById('psResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <h4 style="color: var(--accent-green); margin-bottom: 0.75rem;">📊 Position Size Results</h4>
        <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.95rem;">
            <div style="display: flex; justify-content: space-between;">
                <span>Risk Amount:</span>
                <strong style="color: var(--accent-yellow);">$${riskAmount.toFixed(2)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Stop Loss:</span>
                <strong>${stopPips} pips</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding-top: 0.5rem; border-top: 1px solid var(--border-color);">
                <span style="font-weight: bold;">Position Size:</span>
                <strong style="color: var(--accent-green); font-size: 1.2rem;">${positionSize.toFixed(2)} lots</strong>
            </div>
            <div style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--text-tertiary);">
                ≈ ${(positionSize * 100000).toFixed(0)} units
            </div>
        </div>
        <div style="margin-top: 1rem; padding: 0.75rem; background: rgba(255, 193, 7, 0.1); border-radius: 4px;">
            <strong style="color: var(--accent-yellow);">💡 Recommendation:</strong>
            <div style="font-size: 0.85rem; margin-top: 0.25rem; line-height: 1.6;">
                ${positionSize < 0.01 ? '⚠️ Position size very small - consider larger account or less stops' : 
                  positionSize > 2 ? '⚠️ Large position - ensure proper margin and leverage' :
                  '✅ Position size looks good!'}
            </div>
        </div>
    `;
}

// Risk/Reward Calculator
function calculateRR() {
    const entry = parseFloat(document.getElementById('rrEntry').value);
    const stop = parseFloat(document.getElementById('rrStop').value);
    const target = parseFloat(document.getElementById('rrTarget').value);
    const lots = parseFloat(document.getElementById('rrLots').value);
    
    // Validate inputs
    if (!entry || !stop || !target) {
        alert('❌ Please fill in Entry, Stop Loss, and Take Profit!');
        return;
    }
    
    // Calculate risk and reward
    const risk = Math.abs(entry - stop);
    const reward = Math.abs(target - entry);
    const rrRatio = (reward / risk).toFixed(2);
    
    // Calculate in pips
    const riskPips = Math.round(risk * 10000);
    const rewardPips = Math.round(reward * 10000);
    
    // Calculate P/L if lots provided
    let plHTML = '';
    if (lots && lots > 0) {
        const pipValue = 10; // Standard
        const potentialProfit = rewardPips * pipValue * lots;
        const potentialLoss = riskPips * pipValue * lots;
        
        plHTML = `
            <div style="margin-top: 1rem; padding: 0.75rem; background: var(--bg-tertiary); border-radius: 4px;">
                <h5 style="margin-bottom: 0.5rem;">Potential P/L (${lots} lots):</h5>
                <div style="display: flex; justify-content: space-between; margin-top: 0.5rem;">
                    <span>Max Profit:</span>
                    <strong style="color: var(--accent-green);">+$${potentialProfit.toFixed(2)}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 0.25rem;">
                    <span>Max Loss:</span>
                    <strong style="color: var(--accent-red);">-$${potentialLoss.toFixed(2)}</strong>
                </div>
            </div>
        `;
    }
    
    // Determine if R:R is acceptable
    const isGood = parseFloat(rrRatio) >= 2;
    const color = isGood ? 'var(--accent-green)' : parseFloat(rrRatio) >= 1.5 ? 'var(--accent-yellow)' : 'var(--accent-red)';
    
    // Display result
    const resultDiv = document.getElementById('rrResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <h4 style="color: var(--accent-blue); margin-bottom: 0.75rem;">🎯 Risk/Reward Results</h4>
        <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.95rem;">
            <div style="display: flex; justify-content: space-between;">
                <span>Risk:</span>
                <strong style="color: var(--accent-red);">${riskPips} pips</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Reward:</span>
                <strong style="color: var(--accent-green);">${rewardPips} pips</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding-top: 0.5rem; border-top: 1px solid var(--border-color);">
                <span style="font-weight: bold;">R:R Ratio:</span>
                <strong style="color: ${color}; font-size: 1.3rem;">${rrRatio}:1</strong>
            </div>
        </div>
        ${plHTML}
        <div style="margin-top: 1rem; padding: 0.75rem; background: rgba(${isGood ? '0, 255, 136' : '255, 193, 7'}, 0.1); border-radius: 4px;">
            <strong style="color: ${color};">${isGood ? '✅' : '⚠️'} Assessment:</strong>
            <div style="font-size: 0.85rem; margin-top: 0.25rem; line-height: 1.6;">
                ${parseFloat(rrRatio) >= 2 ? 'Excellent R:R! This meets the minimum 1:2 requirement.' :
                  parseFloat(rrRatio) >= 1.5 ? 'Acceptable R:R, but aim for 1:2 or better when possible.' :
                  parseFloat(rrRatio) >= 1 ? 'Poor R:R - Risk more than reward. Consider adjusting targets/stops.' :
                  '❌ Bad trade - You\'re risking MORE than you could gain!'}
            </div>
        </div>
    `;
}

// Pip Calculator
function calculatePips() {
    const price1 = parseFloat(document.getElementById('pipPrice1').value);
    const price2 = parseFloat(document.getElementById('pipPrice2').value);
    const pairType = document.getElementById('pipPairType').value;
    
    // Validate inputs
    if (!price1 || !price2) {
        alert('❌ Please enter both prices!');
        return;
    }
    
    // Calculate pip difference
    const difference = Math.abs(price2 - price1);
    const pips = pairType === '4' ? Math.round(difference * 10000) : Math.round(difference * 100);
    
    const direction = price2 > price1 ? 'UP' : 'DOWN';
    const directionColor = price2 > price1 ? 'var(--accent-green)' : 'var(--accent-red)';
    const directionIcon = price2 > price1 ? '📈' : '📉';
    
    // Display result
    const resultDiv = document.getElementById('pipResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <h4 style="color: var(--accent-yellow); margin-bottom: 0.75rem;">📏 Pip Distance Results</h4>
        <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.95rem;">
            <div style="display: flex; justify-content: space-between;">
                <span>From:</span>
                <strong>${price1.toFixed(pairType === '4' ? 5 : 3)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>To:</span>
                <strong>${price2.toFixed(pairType === '4' ? 5 : 3)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding-top: 0.5rem; border-top: 1px solid var(--border-color);">
                <span style="font-weight: bold;">Distance:</span>
                <strong style="color: var(--accent-yellow); font-size: 1.3rem;">${pips} pips</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Direction:</span>
                <strong style="color: ${directionColor};">${directionIcon} ${direction}</strong>
            </div>
        </div>
    `;
}

// ADR Calculator
function calculateADR() {
    // Get all values
    const day1High = parseFloat(document.getElementById('adrD1High').value);
    const day1Low = parseFloat(document.getElementById('adrD1Low').value);
    const day2High = parseFloat(document.getElementById('adrD2High').value);
    const day2Low = parseFloat(document.getElementById('adrD2Low').value);
    const day3High = parseFloat(document.getElementById('adrD3High').value);
    const day3Low = parseFloat(document.getElementById('adrD3Low').value);
    const day4High = parseFloat(document.getElementById('adrD4High').value);
    const day4Low = parseFloat(document.getElementById('adrD4Low').value);
    const day5High = parseFloat(document.getElementById('adrD5High').value);
    const day5Low = parseFloat(document.getElementById('adrD5Low').value);
    
    // Validate inputs
    if (!day1High || !day1Low || !day2High || !day2Low || !day3High || !day3Low || 
        !day4High || !day4Low || !day5High || !day5Low) {
        alert('❌ Please fill in all high and low values for 5 days!');
        return;
    }
    
    // Calculate daily ranges in pips
    const day1Range = Math.abs(day1High - day1Low) * 10000;
    const day2Range = Math.abs(day2High - day2Low) * 10000;
    const day3Range = Math.abs(day3High - day3Low) * 10000;
    const day4Range = Math.abs(day4High - day4Low) * 10000;
    const day5Range = Math.abs(day5High - day5Low) * 10000;
    
    // Calculate average
    const adr = (day1Range + day2Range + day3Range + day4Range + day5Range) / 5;
    
    // Find min and max
    const ranges = [day1Range, day2Range, day3Range, day4Range, day5Range];
    const minRange = Math.min(...ranges);
    const maxRange = Math.max(...ranges);
    
    // Display result
    const resultDiv = document.getElementById('adrResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <h4 style="color: #8b2be2; margin-bottom: 0.75rem;">📊 ADR Results</h4>
        <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.95rem;">
            <div style="display: flex; justify-content: space-between;">
                <span>Day 1 Range:</span>
                <strong>${day1Range.toFixed(1)} pips</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Day 2 Range:</span>
                <strong>${day2Range.toFixed(1)} pips</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Day 3 Range:</span>
                <strong>${day3Range.toFixed(1)} pips</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Day 4 Range:</span>
                <strong>${day4Range.toFixed(1)} pips</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Day 5 Range:</span>
                <strong>${day5Range.toFixed(1)} pips</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding-top: 0.5rem; margin-top: 0.5rem; border-top: 2px solid var(--border-color);">
                <span style="font-weight: bold;">5-Day ADR:</span>
                <strong style="color: #8b2be2; font-size: 1.3rem;">${adr.toFixed(1)} pips</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-tertiary);">
                <span>Min Range:</span>
                <span>${minRange.toFixed(1)} pips</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-tertiary);">
                <span>Max Range:</span>
                <span>${maxRange.toFixed(1)} pips</span>
            </div>
        </div>
        <div style="margin-top: 1rem; padding: 0.75rem; background: rgba(138, 43, 226, 0.1); border-radius: 4px;">
            <strong style="color: #8b2be2;">💡 How to Use:</strong>
            <div style="font-size: 0.85rem; margin-top: 0.25rem; line-height: 1.6;">
                • Set profit targets within ${adr.toFixed(0)} pips<br>
                • Expect price to move ${adr.toFixed(0)} pips daily<br>
                • Use ADR for take profit placement<br>
                • Trade during distribution when near ADR limit
            </div>
        </div>
    `;
}

// Session Time Converter
function convertSessionTimes() {
    let timezone = document.getElementById('userTimezone').value;
    
    // Auto-detect timezone
    if (timezone === 'auto') {
        timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    
    // Define EST times
    const sessions = [
        { name: 'Asian Session', start: '20:00', end: '00:00' },
        { name: 'London Session', start: '03:00', end: '09:00' },
        { name: 'NY Session', start: '09:00', end: '17:00' },
        { name: 'Brinks 1 (Asian)', start: '21:45', end: '21:45' },
        { name: 'Brinks 2 (London)', start: '03:45', end: '03:45' },
        { name: 'Brinks 3 (NY)', start: '09:45', end: '09:45' }
    ];
    
    // Convert times
    const resultHTML = sessions.map(session => {
        const startTime = convertTime(session.start, timezone);
        const endTime = session.start === session.end ? startTime : convertTime(session.end, timezone);
        
        return `
            <div style="padding: 0.75rem; background: var(--bg-tertiary); border-radius: 4px; margin-bottom: 0.5rem;">
                <div style="font-weight: bold; color: var(--accent-green); margin-bottom: 0.25rem;">${session.name}</div>
                <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                    <span style="color: var(--text-tertiary);">EST:</span>
                    <span>${session.start}${session.start === session.end ? '' : ' - ' + session.end}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-top: 0.25rem;">
                    <span style="color: var(--text-tertiary);">Your Time:</span>
                    <strong style="color: var(--accent-yellow);">${startTime}${session.start === session.end ? '' : ' - ' + endTime}</strong>
                </div>
            </div>
        `;
    }).join('');
    
    // Display result
    const resultDiv = document.getElementById('timeResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <h4 style="color: var(--accent-green); margin-bottom: 0.75rem;">🌍 Converted Times (${timezone})</h4>
        ${resultHTML}
        <div style="margin-top: 1rem; font-size: 0.85rem; color: var(--text-tertiary); text-align: center;">
            All times converted from EST to your timezone
        </div>
    `;
}

// Helper function to convert time
function convertTime(timeStr, targetTimezone) {
    const now = new Date();
    const [hours, minutes] = timeStr.split(':');
    
    // Create date in EST
    const estDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    estDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    // Convert to target timezone
    const targetTime = estDate.toLocaleTimeString('en-US', { 
        timeZone: targetTimezone, 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
    });
    
    return targetTime;
}

// P/L Calculator
function calculatePL() {
    const entry = parseFloat(document.getElementById('plEntry').value);
    const exit = parseFloat(document.getElementById('plExit').value);
    const lots = parseFloat(document.getElementById('plLots').value);
    const direction = document.getElementById('plDirection').value;
    
    // Validate inputs
    if (!entry || !exit || !lots) {
        alert('❌ Please fill in all fields!');
        return;
    }
    
    // Calculate pips
    const pipDifference = Math.abs(exit - entry) * 10000;
    
    // Calculate P/L
    const pipValue = 10; // Standard
    let pl;
    
    if (direction === 'long') {
        pl = (exit > entry) ? pipDifference * pipValue * lots : -pipDifference * pipValue * lots;
    } else {
        pl = (entry > exit) ? pipDifference * pipValue * lots : -pipDifference * pipValue * lots;
    }
    
    const isProfit = pl > 0;
    const color = isProfit ? 'var(--accent-green)' : 'var(--accent-red)';
    const outcome = isProfit ? 'PROFIT' : pl < 0 ? 'LOSS' : 'BREAKEVEN';
    const icon = isProfit ? '📈' : pl < 0 ? '📉' : '➖';
    
    // Display result
    const resultDiv = document.getElementById('plResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <h4 style="color: var(--accent-blue); margin-bottom: 0.75rem;">💰 P/L Results</h4>
        <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.95rem;">
            <div style="display: flex; justify-content: space-between;">
                <span>Entry Price:</span>
                <strong>${entry.toFixed(5)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Exit Price:</span>
                <strong>${exit.toFixed(5)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Direction:</span>
                <strong style="text-transform: capitalize;">${direction}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Position Size:</span>
                <strong>${lots} lots</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Pip Movement:</span>
                <strong>${pipDifference.toFixed(1)} pips</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding-top: 0.5rem; margin-top: 0.5rem; border-top: 2px solid var(--border-color);">
                <span style="font-weight: bold;">P/L:</span>
                <strong style="color: ${color}; font-size: 1.4rem;">${icon} ${pl >= 0 ? '+' : ''}$${pl.toFixed(2)}</strong>
            </div>
            <div style="text-align: center; padding: 0.5rem; background: ${isProfit ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 74, 74, 0.1)'}; border-radius: 4px; margin-top: 0.5rem;">
                <strong style="color: ${color};">${outcome}</strong>
            </div>
        </div>
    `;
}

// ==========================================
// PSR ZONE CALCULATOR
// ==========================================

// Get current PSR zone status
function getCurrentPSRZone() {
    const now = new Date();
    const estTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const day = estTime.getDay(); // 0 = Sunday, 6 = Saturday
    const hours = estTime.getHours();
    const minutes = estTime.getMinutes();
    const timeInMinutes = hours * 60 + minutes;
    
    // Weekly PSR: Sunday 5pm → Friday Midnight (00:00 Saturday)
    if (day === 0 && timeInMinutes >= 1020) { // Sunday 5pm (17:00) onwards
        return {
            zone: 'Weekly PSR - Q1 Consolidation',
            phase: 'Q1 Consolidation',
            color: '#4a9eff',
            description: 'Tracking weekly high/low range (8-hour period)',
            nextPhase: 'Q2 Manipulation (Tuesday)',
            status: 'active',
            advice: 'Observe price action, identify PSR/PSS levels'
        };
    }
    
    if (day === 1 && timeInMinutes < 60) { // Monday before 1am
        return {
            zone: 'Weekly PSR - Q1 Consolidation',
            phase: 'Q1 Consolidation',
            color: '#4a9eff',
            description: 'Final consolidation period - ends 1:00 AM EST',
            nextPhase: 'Q2 Manipulation (Tuesday)',
            status: 'active',
            advice: 'Q1 ending soon - PSR/PSS levels being established'
        };
    }
    
    if ((day === 1 && timeInMinutes >= 60) || day === 2) { // Monday 1am through Tuesday
        return {
            zone: 'Weekly PSR - Q2 Manipulation',
            phase: 'Q2 Manipulation',
            color: '#ff4a4a',
            description: 'Judas Swing phase - Watch for fake breakouts and stop hunts',
            nextPhase: 'Q3 Distribution (Wednesday)',
            status: 'active',
            advice: 'Avoid emotional trades! Wait for confirmation before entries'
        };
    }
    
    if (day === 3) { // Wednesday
        return {
            zone: 'Weekly PSR - Q3 Distribution',
            phase: 'Q3 Distribution',
            color: '#00ff88',
            description: 'True directional move - BEST TRADING OPPORTUNITIES',
            nextPhase: 'Q4 X-Phase (Thursday)',
            status: 'active',
            advice: 'Prime trading window! High probability setups available'
        };
    }
    
    if (day === 4 || (day === 5 && timeInMinutes < 1440)) { // Thursday + Friday before midnight
        return {
            zone: 'Weekly PSR - Q4 X-Phase',
            phase: 'Q4 X-Phase',
            color: '#ffc107',
            description: 'Continuation or Reversal phase - Week completion',
            nextPhase: 'New Week (Sunday 5pm)',
            status: 'active',
            advice: 'Monitor for continuation or reversal signals'
        };
    }
    
    // Weekend (Saturday + Early Sunday)
    return {
        zone: 'Market Closed - Weekend',
        phase: 'Weekend',
        color: '#999',
        description: 'No trading - Markets reopen Sunday 5:00 PM EST',
        nextPhase: 'Weekly Q1 (Sunday 5pm)',
        status: 'closed',
        advice: 'Review past week, plan trades for next week'
    };
}

// Get current trading session
function getCurrentSession() {
    const now = new Date();
    const estTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const hours = estTime.getHours();
    const minutes = estTime.getMinutes();
    const timeInMinutes = hours * 60 + minutes;
    
    // Session definitions (in minutes from midnight)
    // Asian: 8pm-12am (1200-1440) + 12am-3am (0-180)
    // London: 3am-9am (180-540)
    // NY: 9am-5pm (540-1020)
    
    if ((timeInMinutes >= 1200 && timeInMinutes < 1440) || (timeInMinutes >= 0 && timeInMinutes < 180)) {
        const endTime = timeInMinutes >= 1200 ? 1440 : 180;
        const minutesLeft = endTime - (timeInMinutes >= 1200 ? timeInMinutes : timeInMinutes);
        return {
            current: 'Asian Session',
            color: '#ffc107',
            timeLeft: `${Math.floor(minutesLeft / 60)}h ${minutesLeft % 60}m`,
            next: 'London Session',
            brinks: '9:45 PM EST'
        };
    }
    
    if (timeInMinutes >= 180 && timeInMinutes < 540) {
        const minutesLeft = 540 - timeInMinutes;
        return {
            current: 'London Session',
            color: '#4a9eff',
            timeLeft: `${Math.floor(minutesLeft / 60)}h ${minutesLeft % 60}m`,
            next: 'NY Session',
            brinks: '3:45 AM EST'
        };
    }
    
    if (timeInMinutes >= 540 && timeInMinutes < 1020) {
        const minutesLeft = 1020 - timeInMinutes;
        return {
            current: 'NY Session',
            color: '#00ff88',
            timeLeft: `${Math.floor(minutesLeft / 60)}h ${minutesLeft % 60}m`,
            next: 'Asian Session',
            brinks: '9:45 AM EST'
        };
    }
    
    return {
        current: 'Between Sessions',
        color: '#999',
        timeLeft: '---',
        next: 'Check timing',
        brinks: 'N/A'
    };
}

// PSR Zone Status Display
function showPSRStatus() {
    const psrZone = getCurrentPSRZone();
    const session = getCurrentSession();
    const now = new Date();
    const estTime = now.toLocaleString('en-US', { 
        timeZone: 'America/New_York',
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    
    const resultDiv = document.getElementById('psrResult');
    if (!resultDiv) {
        console.error('PSR result div not found');
        return;
    }
    
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <h4 style="color: var(--accent-blue); margin-bottom: 0.75rem;">⏰ Live PSR Zone Status</h4>
        
        <!-- Current Time -->
        <div style="text-align: center; padding: 1rem; background: var(--bg-tertiary); border-radius: 6px; margin-bottom: 1rem;">
            <div style="font-size: 0.85rem; color: var(--text-tertiary); margin-bottom: 0.25rem;">Current EST Time</div>
            <div style="font-size: 1.3rem; font-weight: bold; color: var(--accent-yellow);">${estTime}</div>
        </div>
        
        <!-- Weekly PSR Zone -->
        <div style="padding: 1rem; background: rgba(74, 158, 255, 0.1); border-left: 4px solid ${psrZone.color}; border-radius: 4px; margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <strong style="color: ${psrZone.color}; font-size: 1.1rem;">${psrZone.zone}</strong>
                <span style="padding: 0.25rem 0.75rem; background: ${psrZone.color}; color: #fff; border-radius: 12px; font-size: 0.75rem; font-weight: bold;">
                    ${psrZone.phase.toUpperCase()}
                </span>
            </div>
            <div style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
                📊 ${psrZone.description}
            </div>
            <div style="font-size: 0.85rem; color: var(--text-tertiary); margin-bottom: 0.5rem;">
                <strong>Next Phase:</strong> ${psrZone.nextPhase}
            </div>
            <div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.85rem; background: rgba(0,0,0,0.2); padding: 0.5rem; border-radius: 4px;">
                <strong style="color: var(--accent-yellow);">💡 Trading Advice:</strong> ${psrZone.advice}
            </div>
        </div>
        
        <!-- Current Trading Session -->
        <div style="padding: 1rem; background: var(--bg-tertiary); border-radius: 4px; margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <div>
                    <div style="font-size: 0.85rem; color: var(--text-tertiary); margin-bottom: 0.25rem;">Current Session</div>
                    <strong style="color: ${session.color}; font-size: 1.1rem;">${session.current}</strong>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 0.85rem; color: var(--text-tertiary); margin-bottom: 0.25rem;">Time Left</div>
                    <strong style="color: var(--accent-yellow);">${session.timeLeft}</strong>
                </div>
            </div>
            <div style="display: flex; justify-content: space-between; padding-top: 0.75rem; border-top: 1px solid var(--border-color); font-size: 0.85rem;">
                <div>
                    <span style="color: var(--text-tertiary);">Next Session:</span>
                    <strong style="margin-left: 0.5rem;">${session.next}</strong>
                </div>
                <div>
                    <span style="color: var(--text-tertiary);">Brinks Time:</span>
                    <strong style="margin-left: 0.5rem; color: #8b2be2;">${session.brinks}</strong>
                </div>
            </div>
        </div>
        
        <!-- PSR Timeline -->
        <div style="padding: 1rem; background: rgba(138, 43, 226, 0.1); border-radius: 4px; margin-bottom: 1rem;">
            <strong style="color: #8b2be2;">📅 Weekly PSR Cycle:</strong>
            <div style="font-size: 0.85rem; margin-top: 0.75rem; line-height: 2;">
                <div style="display: flex; align-items: center; padding: 0.25rem 0;">
                    <span style="width: 30%; color: var(--text-tertiary);">Sun 5pm-Mon 1am:</span>
                    <span style="color: #4a9eff; font-weight: bold;">Q1 Consolidation</span>
                </div>
                <div style="display: flex; align-items: center; padding: 0.25rem 0;">
                    <span style="width: 30%; color: var(--text-tertiary);">Mon 1am-Tue:</span>
                    <span style="color: #ff4a4a; font-weight: bold;">Q2 Manipulation</span>
                </div>
                <div style="display: flex; align-items: center; padding: 0.25rem 0;">
                    <span style="width: 30%; color: var(--text-tertiary);">Wednesday:</span>
                    <span style="color: #00ff88; font-weight: bold;">Q3 Distribution ⭐</span>
                </div>
                <div style="display: flex; align-items: center; padding: 0.25rem 0;">
                    <span style="width: 30%; color: var(--text-tertiary);">Thu-Fri 12am:</span>
                    <span style="color: #ffc107; font-weight: bold;">Q4 X-Phase</span>
                </div>
            </div>
        </div>
        
        <!-- Quick Actions -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
            <button onclick="showPSRStatus()" style="padding: 0.75rem; background: var(--accent-blue); color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.9rem;">
                🔄 Refresh
            </button>
            <button onclick="alert('Set alerts at PSR/PSS levels for optimal entries!')" style="padding: 0.75rem; background: #8b2be2; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.9rem;">
                🔔 Set Alert
            </button>
        </div>
    `;
}

// Calculate PSR/PSS levels from weekly high/low
function calculatePSRLevels() {
    const weekHigh = parseFloat(document.getElementById('psrWeekHigh')?.value);
    const weekLow = parseFloat(document.getElementById('psrWeekLow')?.value);
    
    if (!weekHigh || !weekLow) {
        alert('❌ Please enter both Weekly High and Weekly Low!');
        return;
    }
    
    if (weekHigh <= weekLow) {
        alert('❌ Weekly High must be greater than Weekly Low!');
        return;
    }
    
    const range = weekHigh - weekLow;
    const rangePips = Math.round(range * 10000);
    const midpoint = (weekHigh + weekLow) / 2;
    
    // Calculate Fibonacci levels
    const fibonacci = {
        '0% (PSS)': weekLow,
        '23.6%': weekLow + (range * 0.236),
        '38.2%': weekLow + (range * 0.382),
        '50% (Equilibrium)': midpoint,
        '61.8%': weekLow + (range * 0.618),
        '76.4%': weekLow + (range * 0.764),
        '100% (PSR)': weekHigh
    };
    
    const resultDiv = document.getElementById('psrLevelsResult');
    if (!resultDiv) {
        console.error('PSR levels result div not found');
        return;
    }
    
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <h4 style="color: #8b2be2; margin-bottom: 0.75rem;">📊 PSR/PSS Levels & Targets</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <div style="padding: 0.75rem; background: rgba(255, 74, 74, 0.1); border: 2px solid var(--accent-red); border-radius: 6px; text-align: center;">
                <div style="font-size: 0.85rem; color: var(--text-tertiary); margin-bottom: 0.25rem;">PSR (Resistance)</div>
                <strong style="color: var(--accent-red); font-size: 1.3rem;">${weekHigh.toFixed(5)}</strong>
            </div>
            <div style="padding: 0.75rem; background: rgba(0, 255, 136, 0.1); border: 2px solid var(--accent-green); border-radius: 6px; text-align: center;">
                <div style="font-size: 0.85rem; color: var(--text-tertiary); margin-bottom: 0.25rem;">PSS (Support)</div>
                <strong style="color: var(--accent-green); font-size: 1.3rem;">${weekLow.toFixed(5)}</strong>
            </div>
        </div>
        
        <div style="padding: 0.75rem; background: var(--bg-tertiary); border-radius: 4px; margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>Weekly Range:</span>
                <strong style="color: var(--accent-yellow);">${rangePips} pips</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Midpoint (50%):</span>
                <strong style="color: var(--accent-blue);">${midpoint.toFixed(5)}</strong>
            </div>
        </div>
        
        <div style="padding: 1rem; background: var(--bg-tertiary); border-radius: 4px; margin-bottom: 1rem;">
            <strong style="color: #8b2be2; margin-bottom: 0.75rem; display: block;">Fibonacci Retracement Levels:</strong>
            <div style="max-height: 300px; overflow-y: auto;">
                ${Object.entries(fibonacci).map(([level, price]) => `
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem; margin-bottom: 0.25rem; background: ${level.includes('PSS') ? 'rgba(0, 255, 136, 0.05)' : level.includes('PSR') ? 'rgba(255, 74, 74, 0.05)' : level.includes('50%') ? 'rgba(74, 158, 255, 0.05)' : 'transparent'}; border-radius: 4px; border-left: 3px solid ${level.includes('PSS') ? 'var(--accent-green)' : level.includes('PSR') ? 'var(--accent-red)' : level.includes('50%') ? 'var(--accent-blue)' : 'var(--border-color)'};">
                        <span style="color: var(--text-tertiary); font-weight: ${level.includes('PSS') || level.includes('PSR') || level.includes('50%') ? 'bold' : 'normal'};">${level}</span>
                        <strong style="color: ${level.includes('PSS') ? 'var(--accent-green)' : level.includes('PSR') ? 'var(--accent-red)' : level.includes('50%') ? 'var(--accent-blue)' : 'var(--text-primary)'}; font-family: monospace;">
                            ${price.toFixed(5)}
                        </strong>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div style="padding: 0.75rem; background: rgba(74, 158, 255, 0.1); border-radius: 4px; margin-bottom: 1rem;">
            <strong style="color: var(--accent-blue);">💡 Trading Strategy:</strong>
            <div style="font-size: 0.85rem; margin-top: 0.5rem; line-height: 1.8;">
                • <strong style="color: var(--accent-green);">BUY</strong> near PSS (${weekLow.toFixed(5)}) in bullish trend<br>
                • <strong style="color: var(--accent-red);">SELL</strong> near PSR (${weekHigh.toFixed(5)}) in bearish trend<br>
                • <strong style="color: var(--accent-blue);">Watch 50%</strong> (${midpoint.toFixed(5)}) for reversals<br>
                • <strong style="color: #00ff88);">Best entries</strong> during Q3 (Wednesday)
            </div>
        </div>
        
        <div style="padding: 0.75rem; background: rgba(255, 193, 7, 0.1); border-radius: 4px;">
            <strong style="color: var(--accent-yellow);">⚠️ Important Notes:</strong>
            <div style="font-size: 0.85rem; margin-top: 0.5rem; line-height: 1.8;">
                • Q1 (Sun 5pm-Mon 1am): Consolidation tracking<br>
                • Q2 (Mon 1am-Tue): Manipulation - Judas swings<br>
                • Q3 (Wednesday): Distribution - Prime trading<br>
                • Q4 (Thu-Fri 12am): X-Phase - Continuation/Reversal<br>
                • Weekly ends: <strong>Friday Midnight EST</strong> ✅
            </div>
        </div>
    `;
}

// ==========================================
// ADDITIONAL CALCULATORS
// ==========================================

// Leverage Calculator
function calculateLeverage() {
    const accountBalance = parseFloat(document.getElementById('levAccountBalance')?.value);
    const positionSize = parseFloat(document.getElementById('levPositionSize')?.value);
    const leverage = parseFloat(document.getElementById('levLeverage')?.value);
    
    if (!accountBalance || !positionSize || !leverage) {
        alert('❌ Please fill in all fields!');
        return;
    }
    
    // Calculate required margin
    const positionValue = positionSize * 100000; // Convert lots to units
    const requiredMargin = positionValue / leverage;
    const marginPercent = (requiredMargin / accountBalance) * 100;
    const freeMargin = accountBalance - requiredMargin;
    
    // Risk assessment
    let riskLevel = 'Low';
    let riskColor = 'var(--accent-green)';
    if (marginPercent > 50) {
        riskLevel = 'EXTREME';
        riskColor = 'var(--accent-red)';
    } else if (marginPercent > 30) {
        riskLevel = 'High';
        riskColor = '#ff6b35';
    } else if (marginPercent > 15) {
        riskLevel = 'Moderate';
        riskColor = 'var(--accent-yellow)';
    }
    
    const resultDiv = document.getElementById('levResult');
    if (!resultDiv) return;
    
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <h4 style="color: var(--accent-blue); margin-bottom: 0.75rem;">⚖️ Leverage Analysis</h4>
        <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.95rem;">
            <div style="display: flex; justify-content: space-between;">
                <span>Position Value:</span>
                <strong>${formatCurrency(positionValue)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Leverage:</span>
                <strong>${leverage}:1</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding-top: 0.5rem; border-top: 1px solid var(--border-color);">
                <span>Required Margin:</span>
                <strong style="color: var(--accent-red);">${formatCurrency(requiredMargin)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Margin %:</span>
                <strong style="color: ${riskColor};">${marginPercent.toFixed(2)}%</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Free Margin:</span>
                <strong style="color: ${freeMargin > 0 ? 'var(--accent-green)' : 'var(--accent-red)'};">
                    ${formatCurrency(freeMargin)}
                </strong>
            </div>
        </div>
        <div style="margin-top: 1rem; padding: 0.75rem; background: rgba(${riskLevel === 'EXTREME' ? '255, 74, 74' : riskLevel === 'High' ? '255, 107, 53' : riskLevel === 'Moderate' ? '255, 193, 7' : '0, 255, 136'}, 0.1); border-radius: 4px;">
            <strong style="color: ${riskColor};">⚠️ Risk Level: ${riskLevel}</strong>
            <div style="font-size: 0.85rem; margin-top: 0.5rem; line-height: 1.6;">
                ${marginPercent > 50 ? '🚨 DANGER! Using over 50% of account as margin - high risk of margin call!' :
                  marginPercent > 30 ? '⚠️ High margin usage - monitor position closely to avoid margin call' :
                  marginPercent > 15 ? '⚡ Moderate usage - acceptable but monitor closely' :
                  '✅ Safe margin usage - good risk management'}
            </div>
        </div>
    `;
}

// Breakeven Calculator
function calculateBreakeven() {
    const winRate = parseFloat(document.getElementById('beWinRate')?.value);
    const avgWin = parseFloat(document.getElementById('beAvgWin')?.value);
    const avgLoss = parseFloat(document.getElementById('beAvgLoss')?.value);
    
    if (!winRate || !avgWin || !avgLoss) {
        alert('❌ Please fill in all fields!');
        return;
    }
    
    if (winRate > 100 || winRate < 0) {
        alert('❌ Win rate must be between 0 and 100!');
        return;
    }
    
    const lossRate = 100 - winRate;
    const expectedValue = (winRate / 100 * avgWin) - (lossRate / 100 * avgLoss);
    const profitFactor = (winRate / 100 * avgWin) / (lossRate / 100 * avgLoss);
    const breakevenWinRate = (avgLoss / (avgWin + avgLoss)) * 100;
    
    const isProfitable = expectedValue > 0;
    const color = isProfitable ? 'var(--accent-green)' : 'var(--accent-red)';
    
    const resultDiv = document.getElementById('beResult');
    if (!resultDiv) return;
    
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <h4 style="color: var(--accent-blue); margin-bottom: 0.75rem;">📈 Breakeven Analysis</h4>
        <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.95rem;">
            <div style="display: flex; justify-content: space-between;">
                <span>Current Win Rate:</span>
                <strong>${winRate.toFixed(1)}%</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Required Win Rate:</span>
                <strong style="color: var(--accent-yellow);">${breakevenWinRate.toFixed(1)}%</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding-top: 0.5rem; border-top: 1px solid var(--border-color);">
                <span>Expected Value:</span>
                <strong style="color: ${color}; font-size: 1.2rem;">
                    ${expectedValue >= 0 ? '+' : ''}${formatCurrency(expectedValue)}
                </strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Profit Factor:</span>
                <strong style="color: ${profitFactor >= 1.5 ? 'var(--accent-green)' : profitFactor >= 1 ? 'var(--accent-yellow)' : 'var(--accent-red)'};">
                    ${profitFactor.toFixed(2)}
                </strong>
            </div>
        </div>
        <div style="margin-top: 1rem; padding: 0.75rem; background: rgba(${isProfitable ? '0, 255, 136' : '255, 74, 74'}, 0.1); border-radius: 4px;">
            <strong style="color: ${color};">${isProfitable ? '✅' : '❌'} Assessment:</strong>
            <div style="font-size: 0.85rem; margin-top: 0.5rem; line-height: 1.6;">
                ${isProfitable ? 
                    `Your strategy is profitable! With a ${winRate.toFixed(1)}% win rate, you expect to make ${formatCurrency(expectedValue)} per trade on average.` :
                    `Your strategy is not profitable. You need at least ${breakevenWinRate.toFixed(1)}% win rate to break even, or improve your R:R ratio.`
                }
            </div>
        </div>
        <div style="margin-top: 1rem; padding: 0.75rem; background: var(--bg-tertiary); border-radius: 4px;">
            <strong>💡 Profit Factor Guide:</strong>
            <div style="font-size: 0.85rem; margin-top: 0.5rem; line-height: 1.6;">
                • <strong>Below 1.0:</strong> Losing system ❌<br>
                • <strong>1.0 - 1.5:</strong> Barely profitable ⚠️<br>
                • <strong>1.5 - 2.0:</strong> Good system ✅<br>
                • <strong>Above 2.0:</strong> Excellent system 🌟
            </div>
        </div>
    `;
}

// Compound Interest Calculator
function calculateCompound() {
    const principal = parseFloat(document.getElementById('compPrincipal')?.value);
    const monthlyReturn = parseFloat(document.getElementById('compReturn')?.value);
    const months = parseInt(document.getElementById('compMonths')?.value);
    const monthlyDeposit = parseFloat(document.getElementById('compDeposit')?.value) || 0;
    
    if (!principal || !monthlyReturn || !months) {
        alert('❌ Please fill in Principal, Monthly Return %, and Time Period!');
        return;
    }
    
    // Calculate compound growth
    let balance = principal;
    let totalDeposits = principal;
    const monthlyRate = monthlyReturn / 100;
    
    for (let i = 0; i < months; i++) {
        balance = balance * (1 + monthlyRate) + monthlyDeposit;
        if (i < months - 1) totalDeposits += monthlyDeposit;
    }
    
    const totalGain = balance - totalDeposits;
    const percentGain = ((balance - totalDeposits) / totalDeposits) * 100;
    const avgMonthlyProfit = totalGain / months;
    
    const resultDiv = document.getElementById('compResult');
    if (!resultDiv) return;
    
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <h4 style="color: var(--accent-green); margin-bottom: 0.75rem;">📊 Compound Growth Projection</h4>
        <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.95rem;">
            <div style="display: flex; justify-content: space-between;">
                <span>Starting Balance:</span>
                <strong>${formatCurrency(principal)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Total Deposits:</span>
                <strong>${formatCurrency(totalDeposits)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Time Period:</span>
                <strong>${months} months</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding-top: 0.5rem; border-top: 1px solid var(--border-color);">
                <span style="font-weight: bold;">Final Balance:</span>
                <strong style="color: var(--accent-green); font-size: 1.4rem;">${formatCurrency(balance)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Total Profit:</span>
                <strong style="color: var(--accent-green);">+${formatCurrency(totalGain)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Return:</span>
                <strong style="color: var(--accent-yellow);">+${percentGain.toFixed(2)}%</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Avg Monthly Profit:</span>
                <strong>${formatCurrency(avgMonthlyProfit)}</strong>
            </div>
        </div>
        <div style="margin-top: 1rem; padding: 0.75rem; background: rgba(0, 255, 136, 0.1); border-radius: 4px;">
            <strong style="color: var(--accent-green);">💰 Growth Summary:</strong>
            <div style="font-size: 0.85rem; margin-top: 0.5rem; line-height: 1.6;">
                At ${monthlyReturn}% monthly return, your ${formatCurrency(principal)} will grow to ${formatCurrency(balance)} in ${months} months.
                ${monthlyDeposit > 0 ? ` With additional ${formatCurrency(monthlyDeposit)} monthly deposits, you'll have contributed ${formatCurrency(totalDeposits)} total.` : ''}
            </div>
        </div>
        <div style="margin-top: 1rem; padding: 0.75rem; background: rgba(255, 193, 7, 0.1); border-radius: 4px;">
            <strong style="color: var(--accent-yellow);">⚠️ Reality Check:</strong>
            <div style="font-size: 0.85rem; margin-top: 0.5rem; line-height: 1.6;">
                ${monthlyReturn > 10 ? '🚨 Returns above 10% monthly are extremely rare and unsustainable long-term!' :
                  monthlyReturn > 5 ? '⚠️ Returns above 5% monthly are very difficult to maintain consistently.' :
                  '✅ This is a realistic return target with proper risk management and strategy.'}
            </div>
        </div>
    `;
}

// ==========================================
// QUARTER POINT CALCULATOR
// ==========================================

// Asset-class specific ADR values (in PIPs)
const QUARTER_POINT_ADR = {
    'EURUSD': 80,   // Major - High Liquidity
    'GBPUSD': 100,  // Major - High Liquidity
    'USDJPY': 70,   // Major - High Liquidity
    'AUDUSD': 60,   // Major - Medium Liquidity
    'GBPJPY': 150,  // Cross - High Volatility
    'EURJPY': 120,  // Cross - High Volatility
    'EURGBP': 50    // Cross - Low Volatility
};

// Update ADR field based on selected pair
function updateQuarterPointADR() {
    const pairSelect = document.getElementById('qpPair');
    const adrInput = document.getElementById('qpADR');
    const selectedPair = pairSelect.value;
    
    if (selectedPair !== 'CUSTOM' && QUARTER_POINT_ADR[selectedPair]) {
        adrInput.value = QUARTER_POINT_ADR[selectedPair];
        adrInput.disabled = true;
        adrInput.style.opacity = '0.7';
    } else {
        adrInput.disabled = false;
        adrInput.style.opacity = '1';
        if (selectedPair === 'CUSTOM') {
            adrInput.value = '';
            adrInput.placeholder = 'Enter custom ADR in PIPs';
        }
    }
}

// Calculate Quarter Points based on ADR
function calculateQuarterPoints() {
    const pairSelect = document.getElementById('qpPair');
    const adrInput = document.getElementById('qpADR');
    const currentPriceInput = document.getElementById('qpCurrentPrice');
    const resultDiv = document.getElementById('qpResult');
    
    const selectedPair = pairSelect.options[pairSelect.selectedIndex].text;
    const adr = parseFloat(adrInput.value);
    const currentPrice = parseFloat(currentPriceInput.value);
    
    // Validate ADR
    if (!adr || adr <= 0) {
        showError('Please enter a valid ADR value', 'qpResult');
        return;
    }
    
    // Calculate Quarter Points using the formula from QUARTER_POINTS_BY_ASSET_CLASS.md
    const largeQuarter = Math.round(adr * 0.75); // 75% of ADR
    const smallQuarter = Math.round(largeQuarter / 5); // 1/5 of Large Quarter
    const hesitationZone = Math.round(smallQuarter / 2); // 1/2 of Small Quarter
    
    // Build result HTML
    let resultHTML = `
        <div style="margin-bottom: 1rem;">
            <strong style="color: #ff6b35; font-size: 1.1rem;">📊 ${selectedPair}</strong>
            <div style="font-size: 0.9rem; color: var(--text-tertiary); margin-top: 0.25rem;">
                ADR: ${adr} PIPs
            </div>
        </div>
        
        <div style="display: grid; gap: 1rem; margin-bottom: 1.5rem;">
            <div style="padding: 0.75rem; background: rgba(255, 107, 53, 0.15); border-radius: 6px; border-left: 4px solid #ff6b35;">
                <div style="font-size: 0.85rem; color: var(--text-tertiary); margin-bottom: 0.25rem;">🎯 Large Quarter (LQ)</div>
                <div style="font-size: 1.3rem; font-weight: bold; color: #ff6b35;">${largeQuarter} PIPs</div>
                <div style="font-size: 0.8rem; color: var(--text-tertiary); margin-top: 0.25rem;">Primary target for swing trades</div>
            </div>
            
            <div style="padding: 0.75rem; background: rgba(74, 158, 255, 0.15); border-radius: 6px; border-left: 4px solid var(--accent-blue);">
                <div style="font-size: 0.85rem; color: var(--text-tertiary); margin-bottom: 0.25rem;">📍 Small Quarter (SQ)</div>
                <div style="font-size: 1.3rem; font-weight: bold; color: var(--accent-blue);">${smallQuarter} PIPs</div>
                <div style="font-size: 0.8rem; color: var(--text-tertiary); margin-top: 0.25rem;">Intraday target zones</div>
            </div>
            
            <div style="padding: 0.75rem; background: rgba(255, 193, 7, 0.15); border-radius: 6px; border-left: 4px solid var(--accent-yellow);">
                <div style="font-size: 0.85rem; color: var(--text-tertiary); margin-bottom: 0.25rem;">⚠️ Hesitation Zone (HZ)</div>
                <div style="font-size: 1.3rem; font-weight: bold; color: var(--accent-yellow);">${hesitationZone} PIPs</div>
                <div style="font-size: 0.8rem; color: var(--text-tertiary); margin-top: 0.25rem;">Consolidation/reversal zone</div>
            </div>
        </div>
    `;
    
    // If current price provided, calculate nearest quarter points
    if (currentPrice && currentPrice > 0) {
        const pipValue = selectedPair.includes('JPY') ? 0.01 : 0.0001;
        const largeQuarterPrice = largeQuarter * pipValue;
        const smallQuarterPrice = smallQuarter * pipValue;
        
        // Find nearest .00, .25, .50, .75 levels
        const wholePart = Math.floor(currentPrice);
        const decimalPart = currentPrice - wholePart;
        
        const quarterLevels = [0.00, 0.0025, 0.0050, 0.0075];
        let nearestQuarters = quarterLevels.map(q => wholePart + q);
        
        // Add next whole number quarters
        nearestQuarters.push(wholePart + 1.0000);
        nearestQuarters.push(wholePart + 1.0025);
        
        // Sort by distance from current price
        nearestQuarters.sort((a, b) => Math.abs(a - currentPrice) - Math.abs(b - currentPrice));
        
        // Get closest 5 levels
        const closestLevels = nearestQuarters.slice(0, 5);
        
        resultHTML += `
            <div style="padding: 1rem; background: rgba(0, 255, 136, 0.1); border-radius: 6px; margin-top: 1rem;">
                <strong style="color: var(--accent-green);">📍 Nearest Quarter Points from ${currentPrice.toFixed(5)}:</strong>
                <div style="margin-top: 0.75rem; display: grid; gap: 0.5rem;">
        `;
        
        closestLevels.forEach((level, index) => {
            const distance = Math.abs(level - currentPrice);
            const distancePips = Math.round(distance / pipValue);
            const direction = level > currentPrice ? '↑' : level < currentPrice ? '↓' : '●';
            const color = level > currentPrice ? 'var(--accent-green)' : level < currentPrice ? 'var(--accent-red)' : 'var(--accent-yellow)';
            
            resultHTML += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background: var(--bg-tertiary); border-radius: 4px;">
                    <span style="color: ${color}; font-weight: bold;">${direction} ${level.toFixed(5)}</span>
                    <span style="font-size: 0.85rem; color: var(--text-tertiary);">${distancePips} PIPs ${level > currentPrice ? 'above' : level < currentPrice ? 'below' : 'current'}</span>
                </div>
            `;
        });
        
        resultHTML += `
                </div>
            </div>
        `;
    }
    
    // Add trading strategy tips
    resultHTML += `
        <div style="margin-top: 1rem; padding: 0.75rem; background: rgba(74, 158, 255, 0.1); border-radius: 4px;">
            <strong style="color: var(--accent-blue);">💡 Trading Strategy:</strong>
            <div style="font-size: 0.85rem; margin-top: 0.5rem; line-height: 1.6;">
                <div style="margin-bottom: 0.5rem;">
                    <strong>Large Quarter (${largeQuarter} PIPs):</strong> Use for swing trade targets and major S/R levels
                </div>
                <div style="margin-bottom: 0.5rem;">
                    <strong>Small Quarter (${smallQuarter} PIPs):</strong> Intraday targets, partial profit zones
                </div>
                <div>
                    <strong>Hesitation Zone (${hesitationZone} PIPs):</strong> Watch for consolidation, reversals, or breakouts
                </div>
            </div>
        </div>
        
        <div style="margin-top: 1rem; padding: 0.75rem; background: rgba(255, 193, 7, 0.1); border-radius: 4px;">
            <strong style="color: var(--accent-yellow);">⚠️ Three-Day Rule:</strong>
            <div style="font-size: 0.85rem; margin-top: 0.5rem; line-height: 1.6;">
                If price stays within a ${hesitationZone} PIP range for 3+ days, expect a breakout move of ${largeQuarter}+ PIPs!
            </div>
        </div>
    `;
    
    // Display result
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = resultHTML;
}

// ==========================================
// 144-DAY CYCLE CALCULATOR (GANN TIMING)
// ==========================================

// Calculate 144-day cycle from major swing
function calculate144Cycle() {
    const swingDateInput = document.getElementById('gann144SwingDate');
    const swingTypeSelect = document.getElementById('gann144SwingType');
    const priceInput = document.getElementById('gann144Price');
    const resultDiv = document.getElementById('gann144Result');
    
    const swingDate = swingDateInput.value;
    const swingType = swingTypeSelect.value;
    const price = priceInput.value;
    
    // Validate swing date
    if (!swingDate) {
        showError('Please select a major swing date', 'gann144Result');
        return;
    }
    
    // Calculate cycle
    const cycleData = calculate144DayCycle(new Date(swingDate));
    
    // Build result HTML
    let resultHTML = `
        <div style="margin-bottom: 1rem;">
            <strong style="color: #8b2be2; font-size: 1.1rem;">🔮 144-Day Cycle Analysis</strong>
            <div style="font-size: 0.9rem; color: var(--text-tertiary); margin-top: 0.25rem;">
                From ${swingType} on ${formatGannDate(new Date(swingDate))}
                ${price ? ` at ${parseFloat(price).toFixed(5)}` : ''}
            </div>
        </div>
        
        <div style="padding: 1rem; background: ${cycleData.inReversalZone ? 'rgba(0, 255, 136, 0.2)' : 'rgba(138, 43, 226, 0.1)'}; border-radius: 6px; margin-bottom: 1rem; border: 2px solid ${cycleData.inReversalZone ? 'var(--accent-green)' : '#8b2be2'};">
            <div style="font-size: 0.85rem; color: var(--text-tertiary); margin-bottom: 0.25rem;">Current Status</div>
            <div style="font-size: 1.3rem; font-weight: bold; color: ${cycleData.inReversalZone ? 'var(--accent-green)' : '#8b2be2'};">
                ${cycleData.inReversalZone ? '🔥 ' : ''}${cycleData.status}
            </div>
            <div style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.25rem;">
                Day ${cycleData.daysSinceSwing} of 144 (${cycleData.progress.toFixed(0)}% complete)
            </div>
        </div>
        
        <div style="display: grid; gap: 1rem; margin-bottom: 1.5rem;">
            <div style="padding: 0.75rem; background: rgba(255, 193, 7, 0.15); border-radius: 6px; border-left: 4px solid var(--accent-yellow);">
                <div style="font-size: 0.85rem; color: var(--text-tertiary); margin-bottom: 0.25rem;">📅 Half Cycle (72 days)</div>
                <div style="font-size: 1.1rem; font-weight: bold; color: var(--accent-yellow);">${formatGannDate(cycleData.halfCycleDate)}</div>
                <div style="font-size: 0.8rem; color: var(--text-tertiary); margin-top: 0.25rem;">
                    ${cycleData.daysToHalf > 0 ? `${formatDaysRemaining(cycleData.daysToHalf)} remaining` : 'Passed'}
                </div>
            </div>
            
            <div style="padding: 0.75rem; background: rgba(138, 43, 226, 0.15); border-radius: 6px; border-left: 4px solid #8b2be2;">
                <div style="font-size: 0.85rem; color: var(--text-tertiary); margin-bottom: 0.25rem;">🎯 Full Cycle (144 days) ⭐</div>
                <div style="font-size: 1.1rem; font-weight: bold; color: #8b2be2;">${formatGannDate(cycleData.fullCycleDate)}</div>
                <div style="font-size: 0.8rem; color: var(--text-tertiary); margin-top: 0.25rem;">
                    ${cycleData.daysToFull > 0 ? `${formatDaysRemaining(cycleData.daysToFull)} remaining` : 'Passed'}
                </div>
            </div>
            
            <div style="padding: 0.75rem; background: rgba(74, 158, 255, 0.15); border-radius: 6px; border-left: 4px solid var(--accent-blue);">
                <div style="font-size: 0.85rem; color: var(--text-tertiary); margin-bottom: 0.25rem;">🔄 Double Cycle (288 days)</div>
                <div style="font-size: 1.1rem; font-weight: bold; color: var(--accent-blue);">${formatGannDate(cycleData.doubleCycleDate)}</div>
                <div style="font-size: 0.8rem; color: var(--text-tertiary); margin-top: 0.25rem;">
                    ${cycleData.daysToDouble > 0 ? `${formatDaysRemaining(cycleData.daysToDouble)} remaining` : 'Passed'}
                </div>
            </div>
        </div>
    `;
    
    // Add trading strategy tips
    if (cycleData.inReversalZone) {
        resultHTML += `
            <div style="margin-top: 1rem; padding: 0.75rem; background: rgba(0, 255, 136, 0.2); border-radius: 4px; border: 2px solid var(--accent-green);">
                <strong style="color: var(--accent-green);">🔥 HIGH PROBABILITY REVERSAL ZONE!</strong>
                <div style="font-size: 0.85rem; margin-top: 0.5rem; line-height: 1.6;">
                    <div style="margin-bottom: 0.5rem;">
                        ✅ Watch for reversal patterns (engulfing, pin bars)
                    </div>
                    <div style="margin-bottom: 0.5rem;">
                        ✅ Look for divergence on indicators
                    </div>
                    <div style="margin-bottom: 0.5rem;">
                        ✅ Check Weekly Q3 confluence (Wednesday)
                    </div>
                    <div>
                        ✅ Tighten stops and prepare for trend change
                    </div>
                </div>
            </div>
        `;
    } else if (cycleData.daysToFull <= 7 && cycleData.daysToFull > 0) {
        resultHTML += `
            <div style="margin-top: 1rem; padding: 0.75rem; background: rgba(255, 193, 7, 0.15); border-radius: 4px;">
                <strong style="color: var(--accent-yellow);">⚠️ Approaching Reversal Zone</strong>
                <div style="font-size: 0.85rem; margin-top: 0.5rem; line-height: 1.6;">
                    Reversal zone begins in ${formatDaysRemaining(cycleData.daysToFull)}. Start monitoring for reversal signals!
                </div>
            </div>
        `;
    } else {
        resultHTML += `
            <div style="margin-top: 1rem; padding: 0.75rem; background: rgba(74, 158, 255, 0.1); border-radius: 4px;">
                <strong style="color: var(--accent-blue);">💡 Trading Strategy:</strong>
                <div style="font-size: 0.85rem; margin-top: 0.5rem; line-height: 1.6;">
                    <div style="margin-bottom: 0.5rem;">
                        <strong>72-Day Target:</strong> First potential reversal zone
                    </div>
                    <div style="margin-bottom: 0.5rem;">
                        <strong>144-Day Target:</strong> Primary high-probability reversal (±4 days)
                    </div>
                    <div>
                        <strong>288-Day Target:</strong> Extended cycle reversal
                    </div>
                </div>
            </div>
        `;
    }
    
    // Display result
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = resultHTML;
}

// Save 144-day swing to localStorage
function save144Swing() {
    const swingDateInput = document.getElementById('gann144SwingDate');
    const swingTypeSelect = document.getElementById('gann144SwingType');
    const priceInput = document.getElementById('gann144Price');
    
    const swingDate = swingDateInput.value;
    const swingType = swingTypeSelect.value;
    const price = priceInput.value;
    
    if (!swingDate) {
        alert('Please select a swing date first');
        return;
    }
    
    // Save using gann-timing.js function
    saveMajorSwing(
        new Date(swingDate),
        swingType,
        price ? parseFloat(price) : 0,
        'EURUSD' // Default pair
    );
    
    // Show success message
    alert('✅ Swing saved successfully!');
    
    // Refresh saved swings display
    displaySaved144Swings();
}

// Display saved 144-day swings
function displaySaved144Swings() {
    const savedSwingsDiv = document.getElementById('saved144Swings');
    const savedSwingsList = document.getElementById('saved144SwingsList');
    
    if (!savedSwingsDiv || !savedSwingsList) return;
    
    const swings = getMajorSwings();
    
    if (swings.length === 0) {
        savedSwingsDiv.style.display = 'none';
        return;
    }
    
    savedSwingsDiv.style.display = 'block';
    
    let swingsHTML = '';
    swings.forEach((swing, index) => {
        const swingDate = new Date(swing.date);
        const cycleData = calculate144DayCycle(swingDate);
        
        swingsHTML += `
            <div style="padding: 0.75rem; background: var(--bg-tertiary); border-radius: 4px; border-left: 3px solid ${cycleData.inReversalZone ? 'var(--accent-green)' : '#8b2be2'};">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong style="color: ${cycleData.inReversalZone ? 'var(--accent-green)' : 'var(--text-primary)'};">
                            ${swing.type === 'high' ? '📈' : '📉'} ${swing.type.toUpperCase()} - ${formatGannDate(swingDate)}
                        </strong>
                        <div style="font-size: 0.8rem; color: var(--text-tertiary); margin-top: 0.25rem;">
                            Day ${cycleData.daysSinceSwing}/144 • ${cycleData.status}
                            ${cycleData.daysToFull > 0 ? ` • ${formatDaysRemaining(cycleData.daysToFull)} to reversal` : ''}
                        </div>
                    </div>
                    <button onclick="loadSaved144Swing(${index})" style="padding: 0.25rem 0.5rem; background: rgba(138, 43, 226, 0.2); color: #8b2be2; border: 1px solid #8b2be2; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                        Load
                    </button>
                </div>
            </div>
        `;
    });
    
    savedSwingsList.innerHTML = swingsHTML;
}

// Load a saved swing into the calculator
function loadSaved144Swing(index) {
    const swings = getMajorSwings();
    const swing = swings[index];
    
    if (!swing) return;
    
    document.getElementById('gann144SwingDate').value = swing.date.split('T')[0];
    document.getElementById('gann144SwingType').value = swing.type;
    document.getElementById('gann144Price').value = swing.price || '';
    
    // Auto-calculate
    calculate144Cycle();
}

// ==========================================
// INITIALIZATION
// ==========================================

// Initialize keyboard support when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add keyboard support to all calculators
    const calculators = [
        { inputs: ['psAccountBalance', 'psRiskPercent', 'psStopPips'], func: calculatePositionSize },
        { inputs: ['rrEntry', 'rrStop', 'rrTarget', 'rrLots'], func: calculateRR },
        { inputs: ['pipPrice1', 'pipPrice2'], func: calculatePips },
        { inputs: ['plEntry', 'plExit', 'plLots'], func: calculatePL },
        { inputs: ['psrWeekHigh', 'psrWeekLow'], func: calculatePSRLevels },
        { inputs: ['levAccountBalance', 'levPositionSize', 'levLeverage'], func: calculateLeverage },
        { inputs: ['beWinRate', 'beAvgWin', 'beAvgLoss'], func: calculateBreakeven },
        { inputs: ['compPrincipal', 'compReturn', 'compMonths', 'compDeposit'], func: calculateCompound },
        { inputs: ['qpADR', 'qpCurrentPrice'], func: calculateQuarterPoints },
        { inputs: ['tpPips', 'tpTime'], func: calculateTimePrice },
        { inputs: ['annivDate'], func: calculateAnniversary }
    ];
    
    calculators.forEach(calc => {
        if (calc.inputs && calc.func) {
            addKeyboardSupport(calc.inputs, calc.func);
        }
    });
    
    // Initialize Quarter Point Calculator with default ADR
    const qpPair = document.getElementById('qpPair');
    if (qpPair) {
        updateQuarterPointADR();
    }
    
    // Initialize 144-Day Calculator with saved swings
    const saved144Swings = document.getElementById('saved144Swings');
    if (saved144Swings) {
        displaySaved144Swings();
    }
    
    // Initialize Anniversary saved events
    const savedAnniv = document.getElementById('savedAnniversaries');
    if (savedAnniv) {
        displaySavedAnniversaries();
    }
    
    console.log('✅ Trading Calculators initialized - All systems ready!');
    console.log('📊 PSR Zone Calculator: Weekly ends Friday Midnight EST');
    console.log('🎯 Quarter Point Calculator: ADR-based targets loaded');
    console.log('🔮 144-Day Cycle Calculator: Gann timing ready');
});

// ==========================================
// TIME = PRICE CALCULATOR
// ==========================================

function calculateTimePrice() {
    const pipsInput = document.getElementById('tpPips');
    const timeInput = document.getElementById('tpTime');
    const timeframeSelect = document.getElementById('tpTimeframe');
    const resultDiv = document.getElementById('timePriceResult');
    
    const pips = parseFloat(pipsInput.value);
    const time = parseFloat(timeInput.value);
    const timeframe = timeframeSelect.value;
    
    // Validate inputs
    if (isNaN(pips) || pips <= 0) {
        showError('Please enter valid PIPs moved', 'timePriceResult');
        return;
    }
    
    if (isNaN(time) || time <= 0) {
        showError('Please enter valid time elapsed', 'timePriceResult');
        return;
    }
    
    // Calculate balance
    const balanceData = calculateTimePriceBalance(pips, time, timeframe);
    
    // Build result HTML
    let resultHTML = `
        <div style="margin-bottom: 1rem;">
            <strong style="color: #ff6b35; font-size: 1.1rem;">⚖️ Time = Price Balance Analysis</strong>
            <div style="font-size: 0.9rem; color: var(--text-tertiary); margin-top: 0.25rem;">
                ${pips} PIPs in ${time} ${timeframe}
            </div>
        </div>
        
        <div style="padding: 1rem; background: ${balanceData.isBalanced ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 107, 53, 0.1)'}; border-radius: 6px; margin-bottom: 1rem; border: 2px solid ${balanceData.isBalanced ? 'var(--accent-green)' : '#ff6b35'};">
            <div style="font-size: 0.85rem; color: var(--text-tertiary); margin-bottom: 0.25rem;">Current Status</div>
            <div style="font-size: 1.3rem; font-weight: bold; color: ${balanceData.isBalanced ? 'var(--accent-green)' : '#ff6b35'};">
                ${balanceData.isBalanced ? '✅ ' : ''}${balanceData.status}
            </div>
            <div style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.25rem;">
                Balance Ratio: ${balanceData.balanceRatio} (Target: 1.00)
            </div>
        </div>
        
        <div style="display: grid; gap: 1rem; margin-bottom: 1.5rem;">
            <div style="padding: 0.75rem; background: rgba(74, 158, 255, 0.15); border-radius: 6px; border-left: 4px solid var(--accent-blue);">
                <div style="font-size: 0.85rem; color: var(--text-tertiary); margin-bottom: 0.25rem;">🎯 Time Equals PIPs</div>
                <div style="font-size: 1.1rem; font-weight: bold; color: var(--accent-blue);">${balanceData.timeEqualsPips} ${timeframe}</div>
                <div style="font-size: 0.8rem; color: var(--text-tertiary); margin-top: 0.25rem;">
                    When time reaches ${balanceData.timeEqualsPips} ${timeframe} (reversal zone)
                </div>
            </div>
            
            <div style="padding: 0.75rem; background: rgba(255, 193, 7, 0.15); border-radius: 6px; border-left: 4px solid var(--accent-yellow);">
                <div style="font-size: 0.85rem; color: var(--text-tertiary); margin-bottom: 0.25rem;">📏 PIPs Equal Time</div>
                <div style="font-size: 1.1rem; font-weight: bold; color: var(--accent-yellow);">${balanceData.pipsEqualTime} PIPs</div>
                <div style="font-size: 0.8rem; color: var(--text-tertiary); margin-top: 0.25rem;">
                    When PIPs reach ${balanceData.pipsEqualTime} (reversal zone)
                </div>
            </div>
        </div>
    `;
    
    // Add balance meter
    const percentToBalance = Math.min(Math.abs(parseFloat(balanceData.percentToBalance)), 100);
    const direction = balanceData.balanceRatio > 1 ? 'Time ahead' : 'Price ahead';
    resultHTML += `
        <div style="padding: 1rem; background: rgba(255, 107, 53, 0.1); border-radius: 6px; margin-bottom: 1rem;">
            <div style="text-align: center; margin-bottom: 0.5rem;">
                <strong>Balance Meter</strong>
            </div>
            <div style="background: rgba(255, 255, 255, 0.1); height: 8px; border-radius: 4px; overflow: hidden;">
                <div style="background: linear-gradient(to right, #ff6b35, var(--accent-green)); height: 100%; width: ${percentToBalance}%"></div>
            </div>
            <div style="font-size: 0.8rem; color: var(--text-tertiary); text-align: center; margin-top: 0.25rem;">
                ${percentToBalance}% to perfect balance (${direction})
            </div>
        </div>
    `;
    
    // Add trading tips
    if (balanceData.isBalanced) {
        resultHTML += `
            <div style="margin-top: 1rem; padding: 0.75rem; background: rgba(0, 255, 136, 0.2); border-radius: 4px; border: 2px solid var(--accent-green);">
                <strong style="color: var(--accent-green);">🔥 BALANCE REACHED - REVERSAL ZONE!</strong>
                <div style="font-size: 0.85rem; margin-top: 0.5rem; line-height: 1.6;">
                    <div style="margin-bottom: 0.5rem;">
                        ✅ Expect potential reversal or acceleration
                    </div>
                    <div style="margin-bottom: 0.5rem;">
                        ✅ Watch for rejection at key levels
                    </div>
                    <div style="margin-bottom: 0.5rem;">
                        ✅ Check 144-day cycle confluence
                    </div>
                    <div>
                        ✅ Tighten stops - momentum may change
                    </div>
                </div>
            </div>
        `;
    } else {
        resultHTML += `
            <div style="margin-top: 1rem; padding: 0.75rem; background: rgba(74, 158, 255, 0.1); border-radius: 4px;">
                <strong style="color: var(--accent-blue);">💡 Gann Trading Insight:</strong>
                <div style="font-size: 0.85rem; margin-top: 0.5rem; line-height: 1.6;">
                    <div style="margin-bottom: 0.5rem;">
                        <strong>Balance Rule:</strong> When time = PIPs, markets often reverse or accelerate
                    </div>
                    <div style="margin-bottom: 0.5rem;">
                        <strong>Example:</strong> 50 PIPs in 10 hours → Watch hour 50 or 10 PIPs in hour 10
                    </div>
                    <div>
                        <strong>Strategy:</strong> Use with 144-day cycle for maximum confluence
                    </div>
                </div>
            </div>
        `;
    }
    
    // Display result
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = resultHTML;
}

// ==========================================
// ANNIVERSARY DATE TRACKER
// ==========================================

function calculateAnniversary() {
    const dateInput = document.getElementById('annivDate');
    const typeSelect = document.getElementById('annivType');
    const resultDiv = document.getElementById('anniversaryResult');
    
    const eventDate = dateInput.value;
    const eventType = typeSelect.value;
    
    if (!eventDate) {
        showError('Please select an event date', 'anniversaryResult');
        return;
    }
    
    const annivData = calculateAnniversaries(new Date(eventDate));
    
    // Check if today is anniversary
    const todayStatus = isAnniversaryDate(new Date(eventDate));
    
    let resultHTML = `
        <div style="margin-bottom: 1rem;">
            <strong style="color: #00ff88; font-size: 1.1rem;">📅 Anniversary Analysis</strong>
            <div style="font-size: 0.9rem; color: var(--text-tertiary); margin-top: 0.25rem;">
                ${eventType} on ${formatGannDate(new Date(eventDate))}
            </div>
        </div>
    `;
    
    if (todayStatus.isAnniversary) {
        resultHTML += `
            <div style="padding: 1rem; background: rgba(0, 255, 136, 0.2); border-radius: 6px; margin-bottom: 1rem; border: 2px solid var(--accent-green);">
                <div style="font-size: 1.3rem; font-weight: bold; color: var(--accent-green); margin-bottom: 0.25rem;">
                    🎉 TODAY IS AN ANNIVERSARY! ${todayStatus.type}
                </div>
                <div style="font-size: 0.9rem; color: var(--text-secondary);">
                    Markets often repeat behavior on anniversary dates. Watch for reversal or continuation!
                </div>
            </div>
        `;
    }
    
    resultHTML += `
        <div style="display: grid; gap: 1rem; margin-bottom: 1.5rem;">
            <div style="padding: 0.75rem; background: rgba(255, 193, 7, 0.15); border-radius: 6px; border-left: 4px solid var(--accent-yellow);">
                <div style="font-size: 0.85rem; color: var(--text-tertiary); margin-bottom: 0.25rem;">📅 1-Month Anniversary</div>
                <div style="font-size: 1.1rem; font-weight: bold; color: var(--accent-yellow);">${formatGannDate(annivData.oneMonth)}</div>
                <div style="font-size: 0.8rem; color: var(--text-tertiary); margin-top: 0.25rem;">
                    ${annivData.daysToOneMonth > 0 ? `${formatDaysRemaining(annivData.daysToOneMonth)} remaining` : 'Today!'}
                </div>
            </div>
            
            <div style="padding: 0.75rem; background: rgba(74, 158, 255, 0.15); border-radius: 6px; border-left: 4px solid var(--accent-blue);">
                <div style="font-size: 0.85rem; color: var(--text-tertiary); margin-bottom: 0.25rem;">🔄 1-Quarter (90 days)</div>
                <div style="font-size: 1.1rem; font-weight: bold; color: var(--accent-blue);">${formatGannDate(annivData.oneQuarter)}</div>
                <div style="font-size: 0.8rem; color: var(--text-tertiary); margin-top: 0.25rem;">
                    ${annivData.daysToOneQuarter > 0 ? `${formatDaysRemaining(annivData.daysToOneQuarter)} remaining` : 'Today!'}
                </div>
            </div>
            
            <div style="padding: 0.75rem; background: rgba(255, 107, 53, 0.15); border-radius: 6px; border-left: 4px solid #ff6b35;">
                <div style="font-size: 0.85rem; color: var(--text-tertiary); margin-bottom: 0.25rem;">⚠️ 2-Quarters (180 days)</div>
                <div style="font-size: 1.1rem; font-weight: bold; color: #ff6b35;">${formatGannDate(annivData.twoQuarters)}</div>
                <div style="font-size: 0.8rem; color: var(--text-tertiary); margin-top: 0.25rem;">
                    ${annivData.daysToTwoQuarters > 0 ? `${formatDaysRemaining(annivData.daysToTwoQuarters)} remaining` : 'Today!'}
                </div>
            </div>
            
            <div style="padding: 0.75rem; background: rgba(0, 255, 136, 0.15); border-radius: 6px; border-left: 4px solid var(--accent-green);">
                <div style="font-size: 0.85rem; color: var(--text-tertiary); margin-bottom: 0.25rem;">🎯 1-Year Anniversary</div>
                <div style="font-size: 1.1rem; font-weight: bold; color: var(--accent-green);">${formatGannDate(annivData.oneYear)}</div>
                <div style="font-size: 0.8rem; color: var(--text-tertiary); margin-top: 0.25rem;">
                    ${annivData.daysToOneYear > 0 ? `${formatDaysRemaining(annivData.daysToOneYear)} remaining` : 'Today!'}
                </div>
            </div>
        </div>
    `;
    
    if (annivData.nextAnniversary) {
        resultHTML += `
            <div style="padding: 1rem; background: rgba(74, 158, 255, 0.1); border-radius: 6px; margin-bottom: 1rem;">
                <strong style="color: var(--accent-blue);">📅 Next Anniversary:</strong>
                <div style="font-size: 1rem; font-weight: bold; margin-top: 0.25rem;">
                    ${annivData.nextAnniversary.type} - ${formatGannDate(annivData.nextAnniversary.date)}
                </div>
                <div style="font-size: 0.9rem; color: var(--text-secondary);">
                    ${formatDaysRemaining(annivData.nextAnniversary.daysAway)} remaining
                </div>
            </div>
        `;
    }
    
    // Add strategy tips
    resultHTML += `
        <div style="margin-top: 1rem; padding: 0.75rem; background: rgba(0, 255, 136, 0.1); border-radius: 4px;">
            <strong style="color: var(--accent-green);">💡 Gann Anniversary Strategy:</strong>
            <div style="font-size: 0.85rem; margin-top: 0.5rem; line-height: 1.6;">
                <div style="margin-bottom: 0.5rem;">
                    <strong>Rule:</strong> Markets repeat behavior on anniversary dates (1-month, 90-days, 180-days, 1-year)
                </div>
                <div style="margin-bottom: 0.5rem;">
                    <strong>Action:</strong> Watch for reversal or continuation at these dates
                </div>
                <div>
                    <strong>Confluence:</strong> Combine with 144-day cycle and Weekly Q3 for maximum edge
                </div>
            </div>
        </div>
    `;
    
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = resultHTML;
}

function saveAnniversaryEvent() {
    const dateInput = document.getElementById('annivDate');
    const typeSelect = document.getElementById('annivType');
    
    const eventDate = dateInput.value;
    const eventType = typeSelect.value;
    
    if (!eventDate) {
        alert('Please select an event date first');
        return;
    }
    
    saveAnniversary(
        new Date(eventDate),
        eventType,
        `${eventType} event on ${formatGannDate(new Date(eventDate))}`
    );
    
    alert('✅ Event saved successfully!');
    displaySavedAnniversaries();
}

function displaySavedAnniversaries() {
    const savedDiv = document.getElementById('savedAnniversaries');
    const listDiv = document.getElementById('savedAnnivList');
    
    if (!savedDiv || !listDiv) return;
    
    const events = getAnniversaries();
    
    if (events.length === 0) {
        savedDiv.style.display = 'none';
        return;
    }
    
    savedDiv.style.display = 'block';
    
    let html = '';
    events.forEach((event, index) => {
        const eventDate = new Date(event.date);
        const annivData = calculateAnniversaries(eventDate);
        const status = isAnniversaryDate(eventDate);
        
        const color = status.isAnniversary ? 'var(--accent-green)' : '#00ff88';
        const icon = status.isAnniversary ? '🎉' : '📅';
        
        html += `
            <div style="padding: 0.75rem; background: var(--bg-tertiary); border-radius: 4px; border-left: 3px solid ${color};">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong style="color: ${color};">
                            ${icon} ${event.type.toUpperCase()} - ${formatGannDate(eventDate)}
                        </strong>
                        <div style="font-size: 0.8rem; color: var(--text-tertiary); margin-top: 0.25rem;">
                            Next: ${annivData.nextAnniversary ? annivData.nextAnniversary.type : 'Passed'}
                            ${annivData.nextAnniversary ? formatDaysRemaining(annivData.nextAnniversary.daysAway) : ''}
                        </div>
                    </div>
                    <button onclick="loadSavedAnniv(${index})" style="padding: 0.25rem 0.5rem; background: rgba(0, 255, 136, 0.2); color: #00ff88; border: 1px solid #00ff88; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                        Load
                    </button>
                </div>
            </div>
        `;
    });
    
    listDiv.innerHTML = html;
}

function loadSavedAnniv(index) {
    const events = getAnniversaries();
    const event = events[index];
    
    if (!event) return;
    
    document.getElementById('annivDate').value = event.date.split('T')[0];
    document.getElementById('annivType').value = event.type;
    
    calculateAnniversary();
}
