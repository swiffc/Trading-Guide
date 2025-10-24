/**
 * Gann Timing Methods
 * Core functions for W.D. Gann timing calculations
 * Integrates with Quarterly Theory for enhanced timing precision
 */

// ==========================================
// 144-DAY CYCLE CALCULATIONS
// ==========================================

/**
 * Calculate 144-day cycle targets from a major swing
 * @param {Date} swingDate - Date of major swing high/low
 * @param {Date} currentDate - Current date (optional, defaults to now)
 * @returns {Object} Cycle information
 */
function calculate144DayCycle(swingDate, currentDate = new Date()) {
    const swing = new Date(swingDate);
    const current = new Date(currentDate);
    
    // Calculate days since swing
    const daysSince = Math.floor((current - swing) / (1000 * 60 * 60 * 24));
    
    // Calculate target dates
    const halfCycle = new Date(swing);
    halfCycle.setDate(halfCycle.getDate() + 72);
    
    const fullCycle = new Date(swing);
    fullCycle.setDate(fullCycle.getDate() + 144);
    
    const doubleCycle = new Date(swing);
    doubleCycle.setDate(doubleCycle.getDate() + 288);
    
    // Calculate days remaining to each target
    const daysToHalf = Math.max(0, 72 - daysSince);
    const daysToFull = Math.max(0, 144 - daysSince);
    const daysToDouble = Math.max(0, 288 - daysSince);
    
    // Determine status
    let status = '';
    let inReversalZone = false;
    
    if (daysSince >= 140 && daysSince <= 148) {
        status = 'ACTIVE REVERSAL ZONE';
        inReversalZone = true;
    } else if (daysSince >= 68 && daysSince <= 76) {
        status = 'HALF-CYCLE ZONE';
        inReversalZone = true;
    } else if (daysSince >= 284 && daysSince <= 292) {
        status = 'DOUBLE-CYCLE ZONE';
        inReversalZone = true;
    } else if (daysToFull <= 7 && daysToFull > 0) {
        status = 'APPROACHING REVERSAL';
    } else if (daysToFull > 0) {
        status = 'ACCUMULATING';
    } else {
        status = 'POST-CYCLE';
    }
    
    return {
        daysSinceSwing: daysSince,
        halfCycleDate: halfCycle,
        fullCycleDate: fullCycle,
        doubleCycleDate: doubleCycle,
        daysToHalf,
        daysToFull,
        daysToDouble,
        status,
        inReversalZone,
        progress: Math.min((daysSince / 144) * 100, 100)
    };
}

/**
 * Check if currently in 144-day reversal zone (±4 days)
 * @param {number} daysSince - Days since major swing
 * @returns {boolean}
 */
function is144DayReversalZone(daysSince) {
    return (daysSince >= 140 && daysSince <= 148) ||
           (daysSince >= 68 && daysSince <= 76) ||
           (daysSince >= 284 && daysSince <= 292);
}

// ==========================================
// TIME = PRICE CALCULATIONS
// ==========================================

/**
 * Calculate Time = Price balance points
 * @param {number} pips - PIPs moved
 * @param {number} timeElapsed - Time elapsed in specified units
 * @param {string} timeframe - 'minutes', 'hours', or 'days'
 * @returns {Object} Balance information
 */
function calculateTimePriceBalance(pips, timeElapsed, timeframe = 'hours') {
    // Convert time to standard unit (hours)
    let timeInHours = timeElapsed;
    if (timeframe === 'minutes') {
        timeInHours = timeElapsed / 60;
    } else if (timeframe === 'days') {
        timeInHours = timeElapsed * 24;
    }
    
    // Calculate balance points
    const timeEqualsPips = pips; // When time reaches this value
    const pipsEqualTime = timeElapsed; // When PIPs reach this value
    
    // Calculate current balance ratio
    const balanceRatio = timeElapsed / pips;
    
    // Determine balance status
    let status = '';
    let isBalanced = false;
    
    if (Math.abs(balanceRatio - 1) < 0.05) { // Within 5% of perfect balance
        status = 'PERFECTLY BALANCED';
        isBalanced = true;
    } else if (Math.abs(balanceRatio - 1) < 0.15) { // Within 15%
        status = 'APPROACHING BALANCE';
        isBalanced = true;
    } else if (balanceRatio > 1) {
        status = 'TIME EXCEEDS PRICE';
    } else {
        status = 'PRICE EXCEEDS TIME';
    }
    
    return {
        pips,
        timeElapsed,
        timeframe,
        timeInHours,
        timeEqualsPips,
        pipsEqualTime,
        balanceRatio: balanceRatio.toFixed(2),
        status,
        isBalanced,
        percentToBalance: Math.abs((1 - balanceRatio) * 100).toFixed(1)
    };
}

/**
 * Check if time equals price (within tolerance)
 * @param {number} currentPips - Current PIPs moved
 * @param {number} currentTime - Current time elapsed
 * @param {number} tolerance - Tolerance percentage (default 15%)
 * @returns {boolean}
 */
function isTimeEqualsPrice(currentPips, currentTime, tolerance = 0.15) {
    const ratio = currentTime / currentPips;
    return Math.abs(ratio - 1) <= tolerance;
}

// ==========================================
// ANNIVERSARY DATE CALCULATIONS
// ==========================================

/**
 * Calculate anniversary dates from a major event
 * @param {Date} eventDate - Date of major swing/event
 * @param {Date} currentDate - Current date (optional)
 * @returns {Object} Anniversary information
 */
function calculateAnniversaries(eventDate, currentDate = new Date()) {
    const event = new Date(eventDate);
    const current = new Date(currentDate);
    
    // Calculate anniversary dates
    const oneMonth = new Date(event);
    oneMonth.setMonth(oneMonth.getMonth() + 1);
    
    const oneQuarter = new Date(event);
    oneQuarter.setDate(oneQuarter.getDate() + 90);
    
    const twoQuarters = new Date(event);
    twoQuarters.setDate(twoQuarters.getDate() + 180);
    
    const oneYear = new Date(event);
    oneYear.setFullYear(oneYear.getFullYear() + 1);
    
    // Calculate days to each anniversary
    const daysToOneMonth = Math.ceil((oneMonth - current) / (1000 * 60 * 60 * 24));
    const daysToOneQuarter = Math.ceil((oneQuarter - current) / (1000 * 60 * 60 * 24));
    const daysToTwoQuarters = Math.ceil((twoQuarters - current) / (1000 * 60 * 60 * 24));
    const daysToOneYear = Math.ceil((oneYear - current) / (1000 * 60 * 60 * 24));
    
    // Find next upcoming anniversary
    const anniversaries = [
        { type: '1-Month', date: oneMonth, daysAway: daysToOneMonth },
        { type: '1-Quarter (90 days)', date: oneQuarter, daysAway: daysToOneQuarter },
        { type: '2-Quarters (180 days)', date: twoQuarters, daysAway: daysToTwoQuarters },
        { type: '1-Year', date: oneYear, daysAway: daysToOneYear }
    ].filter(a => a.daysAway > 0).sort((a, b) => a.daysAway - b.daysAway);
    
    const nextAnniversary = anniversaries[0] || null;
    
    return {
        eventDate: event,
        oneMonth,
        oneQuarter,
        twoQuarters,
        oneYear,
        daysToOneMonth,
        daysToOneQuarter,
        daysToTwoQuarters,
        daysToOneYear,
        nextAnniversary,
        allUpcoming: anniversaries
    };
}

/**
 * Check if today is an anniversary date (±2 days tolerance)
 * @param {Date} eventDate - Original event date
 * @param {Date} currentDate - Current date (optional)
 * @returns {Object} Anniversary status
 */
function isAnniversaryDate(eventDate, currentDate = new Date()) {
    const anniversaries = calculateAnniversaries(eventDate, currentDate);
    const tolerance = 2; // ±2 days
    
    const isOneMonth = Math.abs(anniversaries.daysToOneMonth) <= tolerance;
    const isOneQuarter = Math.abs(anniversaries.daysToOneQuarter) <= tolerance;
    const isTwoQuarters = Math.abs(anniversaries.daysToTwoQuarters) <= tolerance;
    const isOneYear = Math.abs(anniversaries.daysToOneYear) <= tolerance;
    
    const isAnniversary = isOneMonth || isOneQuarter || isTwoQuarters || isOneYear;
    
    let type = '';
    if (isOneMonth) type = '1-Month Anniversary';
    else if (isOneQuarter) type = '1-Quarter Anniversary';
    else if (isTwoQuarters) type = '2-Quarter Anniversary';
    else if (isOneYear) type = '1-Year Anniversary';
    
    return {
        isAnniversary,
        type,
        isOneMonth,
        isOneQuarter,
        isTwoQuarters,
        isOneYear
    };
}

// ==========================================
// 90-DAY CYCLE CALCULATIONS
// ==========================================

/**
 * Get current position in 90-day cycle
 * @param {Date} currentDate - Current date (optional)
 * @returns {Object} 90-day cycle information
 */
function get90DayPosition(currentDate = new Date()) {
    const current = new Date(currentDate);
    const yearStart = new Date(current.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((current - yearStart) / (1000 * 60 * 60 * 24)) + 1;
    
    // Determine which quarter (Q1-Q4)
    let quarter = '';
    let quarterDay = 0;
    let quarterStart = null;
    let quarterEnd = null;
    
    if (dayOfYear <= 90) {
        quarter = 'Q1';
        quarterDay = dayOfYear;
        quarterStart = new Date(current.getFullYear(), 0, 1);
        quarterEnd = new Date(current.getFullYear(), 2, 31); // Mar 31
    } else if (dayOfYear <= 180) {
        quarter = 'Q2';
        quarterDay = dayOfYear - 90;
        quarterStart = new Date(current.getFullYear(), 3, 1); // Apr 1
        quarterEnd = new Date(current.getFullYear(), 5, 30); // Jun 30
    } else if (dayOfYear <= 270) {
        quarter = 'Q3';
        quarterDay = dayOfYear - 180;
        quarterStart = new Date(current.getFullYear(), 6, 1); // Jul 1
        quarterEnd = new Date(current.getFullYear(), 8, 30); // Sep 30
    } else {
        quarter = 'Q4';
        quarterDay = dayOfYear - 270;
        quarterStart = new Date(current.getFullYear(), 9, 1); // Oct 1
        quarterEnd = new Date(current.getFullYear(), 11, 31); // Dec 31
    }
    
    const daysRemainingInQuarter = 90 - quarterDay;
    const progress = (quarterDay / 90) * 100;
    
    // Determine phase
    let phase = '';
    if (quarter === 'Q1') phase = 'Accumulation';
    else if (quarter === 'Q2') phase = 'Manipulation';
    else if (quarter === 'Q3') phase = 'Distribution';
    else phase = 'Reversal';
    
    return {
        dayOfYear,
        quarter,
        quarterDay,
        daysRemainingInQuarter,
        progress: progress.toFixed(1),
        phase,
        quarterStart,
        quarterEnd,
        isQ3: quarter === 'Q3' // Best trading quarter
    };
}

// ==========================================
// CONFLUENCE SCORING
// ==========================================

/**
 * Calculate Gann timing confluence score
 * @param {Object} params - Parameters for confluence calculation
 * @returns {Object} Confluence information
 */
function calculateGannConfluence(params = {}) {
    const {
        daysSinceSwing = 0,
        currentPips = 0,
        currentTime = 0,
        isAnniversary = false,
        isWeeklyQ3 = false,
        isDailyQ3 = false,
        is90MinQ3 = false
    } = params;
    
    let score = 0;
    const factors = [];
    
    // Check 144-day cycle (2 points)
    if (is144DayReversalZone(daysSinceSwing)) {
        score += 2;
        factors.push({ name: '144-Day Reversal Zone', points: 2, icon: '🔮' });
    }
    
    // Check Time = Price (2 points)
    if (isTimeEqualsPrice(currentPips, currentTime)) {
        score += 2;
        factors.push({ name: 'Time = Price Balance', points: 2, icon: '⚖️' });
    }
    
    // Check Anniversary (1 point)
    if (isAnniversary) {
        score += 1;
        factors.push({ name: 'Anniversary Date', points: 1, icon: '📅' });
    }
    
    // Check 90-Day Cycle Q3 (1 point)
    const ninetyDay = get90DayPosition();
    if (ninetyDay.isQ3) {
        score += 1;
        factors.push({ name: '90-Day Q3 (Best Quarter)', points: 1, icon: '🌐' });
    }
    
    // Check Weekly Q3 (1 point)
    if (isWeeklyQ3) {
        score += 1;
        factors.push({ name: 'Weekly Q3 (Wednesday)', points: 1, icon: '📅' });
    }
    
    // Check Daily Q3 (1 point)
    if (isDailyQ3) {
        score += 1;
        factors.push({ name: 'Daily Q3 (NY Session)', points: 1, icon: '🗽' });
    }
    
    // Check 90-Min Q3 (1 point)
    if (is90MinQ3) {
        score += 1;
        factors.push({ name: '90-Min Q3 (Distribution)', points: 1, icon: '⏱️' });
    }
    
    // Determine confluence level
    let level = '';
    let color = '';
    
    if (score >= 5) {
        level = 'MAXIMUM EDGE';
        color = 'var(--accent-green)';
    } else if (score >= 3) {
        level = 'HIGH CONFLUENCE';
        color = 'var(--accent-yellow)';
    } else if (score >= 2) {
        level = 'MODERATE';
        color = 'var(--accent-blue)';
    } else {
        level = 'LOW';
        color = 'var(--text-tertiary)';
    }
    
    return {
        score,
        level,
        color,
        factors,
        factorCount: factors.length
    };
}

// ==========================================
// STORAGE FUNCTIONS
// ==========================================

/**
 * Save a major swing to localStorage
 * @param {Date} date - Swing date
 * @param {string} type - 'high' or 'low'
 * @param {number} price - Price level
 * @param {string} pair - Currency pair (optional)
 */
function saveMajorSwing(date, type, price, pair = 'EURUSD') {
    const swings = getMajorSwings();
    swings.push({
        date: date.toISOString(),
        type,
        price,
        pair,
        timestamp: new Date().toISOString()
    });
    
    // Keep only last 10 swings
    if (swings.length > 10) {
        swings.shift();
    }
    
    localStorage.setItem('gann_major_swings', JSON.stringify(swings));
}

/**
 * Get all saved major swings
 * @returns {Array} Array of major swings
 */
function getMajorSwings() {
    const stored = localStorage.getItem('gann_major_swings');
    return stored ? JSON.parse(stored) : [];
}

/**
 * Get the most recent major swing
 * @returns {Object|null} Most recent swing or null
 */
function getLastMajorSwing() {
    const swings = getMajorSwings();
    return swings.length > 0 ? swings[swings.length - 1] : null;
}

/**
 * Save an anniversary event
 * @param {Date} date - Event date
 * @param {string} type - Event type
 * @param {string} description - Event description
 */
function saveAnniversary(date, type, description) {
    const anniversaries = getAnniversaries();
    anniversaries.push({
        date: date.toISOString(),
        type,
        description,
        timestamp: new Date().toISOString()
    });
    
    // Keep only last 20 anniversaries
    if (anniversaries.length > 20) {
        anniversaries.shift();
    }
    
    localStorage.setItem('gann_anniversaries', JSON.stringify(anniversaries));
}

/**
 * Get all saved anniversaries
 * @returns {Array} Array of anniversaries
 */
function getAnniversaries() {
    const stored = localStorage.getItem('gann_anniversaries');
    return stored ? JSON.parse(stored) : [];
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Format date for display
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
function formatGannDate(date) {
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

/**
 * Format days remaining
 * @param {number} days - Number of days
 * @returns {string} Formatted string
 */
function formatDaysRemaining(days) {
    if (days === 0) return 'Today';
    if (days === 1) return '1 day';
    if (days < 0) return `${Math.abs(days)} days ago`;
    return `${days} days`;
}

/**
 * Get color for cycle status
 * @param {string} status - Status string
 * @returns {string} CSS color variable
 */
function getStatusColor(status) {
    if (status.includes('ACTIVE') || status.includes('ZONE')) {
        return 'var(--accent-green)';
    } else if (status.includes('APPROACHING')) {
        return 'var(--accent-yellow)';
    } else {
        return 'var(--accent-blue)';
    }
}

// ==========================================
// INITIALIZATION
// ==========================================

console.log('✅ Gann Timing Module Loaded');
console.log('🔮 144-Day Cycle, Time=Price, Anniversaries, 90-Day Cycle ready');

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculate144DayCycle,
        is144DayReversalZone,
        calculateTimePriceBalance,
        isTimeEqualsPrice,
        calculateAnniversaries,
        isAnniversaryDate,
        get90DayPosition,
        calculateGannConfluence,
        saveMajorSwing,
        getMajorSwings,
        getLastMajorSwing,
        saveAnniversary,
        getAnniversaries,
        formatGannDate,
        formatDaysRemaining,
        getStatusColor
    };
}

