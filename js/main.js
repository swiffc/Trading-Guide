// Trading Guide - Main JavaScript

// Store interval IDs for cleanup
let timeInterval = null;
let sentimentInterval = null;

// Cleanup function to prevent memory leaks
function cleanupIntervals() {
    if (timeInterval) {
        clearInterval(timeInterval);
        timeInterval = null;
    }
    if (sentimentInterval) {
        clearInterval(sentimentInterval);
        sentimentInterval = null;
    }
}

// Call cleanup before page unload
window.addEventListener('beforeunload', cleanupIntervals);

// Clock and Session Indicator
function updateTime() {
    const now = new Date();
    
    // Convert to EST/EDT (America/New_York timezone) - FIXED
    const estTimeString = now.toLocaleString('en-US', { 
        timeZone: 'America/New_York',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    // Parse the time string
    const [hours, minutes, seconds] = estTimeString.split(':').map(Number);
    
    const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} EST`;
    const timeEl = document.getElementById('currentTime');
    if (timeEl) {
        timeEl.textContent = timeStr;
    }
    
    // Determine session (standardized times)
    let session = '';
    let sessionClass = '';
    if (hours >= 17 || hours < 0) {
        session = '🌙 ASIAN SESSION (Q1 - Accumulation)';
        sessionClass = 'session-active';
    } else if (hours >= 0 && hours < 9) {
        session = '🌍 LONDON SESSION (Q2 - Manipulation)';
        sessionClass = 'session-active';
    } else if (hours >= 9 && hours < 12) {
        session = '🗽 NY AM SESSION (Q3 - Distribution) ⭐';
        sessionClass = 'session-active';
    } else {
        session = '🌆 NY PM SESSION (Q4 - Reversal)';
        sessionClass = '';
    }
    
    const sessionEl = document.getElementById('sessionIndicator');
    if (sessionEl) {
        sessionEl.textContent = session;
        sessionEl.className = 'session-indicator ' + sessionClass;
    }
}

// Initialize clock with proper cleanup
cleanupIntervals(); // Clean any existing intervals first
timeInterval = setInterval(updateTime, 1000);
updateTime();

// Live Market Sentiment Panel
function updateMarketSentiment() {
    const now = new Date();
    
    // Convert to EST/EDT - FIXED
    const estTimeString = now.toLocaleString('en-US', { 
        timeZone: 'America/New_York',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    const [hours, minutes, seconds] = estTimeString.split(':').map(Number);
    
    // Get day of week in EST
    const estDateString = now.toLocaleDateString('en-US', { timeZone: 'America/New_York', weekday: 'long' });
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = dayNames.indexOf(estDateString);
    
    // Update live time display
    const liveTimeEl = document.getElementById('liveTimeDisplay');
    if (liveTimeEl) {
        liveTimeEl.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} EST`;
    }
    
    // Determine current session
    let sessionName = '';
    let sessionTime = '';
    let sessionColor = '';
    
    if (hours >= 17 && hours <= 23) {
        sessionName = '🌙 Asian Session';
        sessionTime = '5:00 PM - 12:00 AM EST';
        sessionColor = 'var(--accent-yellow)';
    } else if (hours >= 0 && hours < 9) {
        sessionName = '🌍 London Session';
        sessionTime = '12:00 AM - 9:00 AM EST';
        sessionColor = 'var(--accent-blue)';
    } else if (hours >= 9 && hours < 16) {
        sessionName = '🗽 New York Session';
        sessionTime = '9:00 AM - 4:00 PM EST';
        sessionColor = 'var(--accent-green)';
    } else {
        sessionName = '🌆 After Hours';
        sessionTime = '4:00 PM - 5:00 PM EST';
        sessionColor = 'var(--text-tertiary)';
    }
    
    const sessionEl = document.getElementById('currentSession');
    const sessionTimeEl = document.getElementById('sessionTime');
    if (sessionEl) {
        sessionEl.textContent = sessionName;
        sessionEl.style.color = sessionColor;
    }
    if (sessionTimeEl) sessionTimeEl.textContent = sessionTime;
    
    // Calculate current quarter (22.5-minute cycles within 90-minute sessions)
    const totalMinutes = hours * 60 + minutes;
    const minutesSinceMidnight = totalMinutes % 90; // 90-minute cycle
    let quarter = '';
    let quarterPhase = '';
    let quarterColor = '';
    
    if (minutesSinceMidnight < 22.5) {
        quarter = 'Q1 - Accumulation';
        quarterPhase = 'Observe, tight range expected';
        quarterColor = 'var(--text-tertiary)';
    } else if (minutesSinceMidnight < 45) {
        quarter = 'Q2 - Manipulation';
        quarterPhase = 'Mark levels, stop hunt occurring';
        quarterColor = 'var(--accent-yellow)';
    } else if (minutesSinceMidnight < 67.5) {
        quarter = 'Q3 - Distribution';
        quarterPhase = 'TRADE NOW - Real move happening!';
        quarterColor = 'var(--accent-green)';
    } else {
        quarter = 'Q4 - Reversal/Continuation';
        quarterPhase = 'Caution, preparing for next cycle';
        quarterColor = 'var(--accent-red)';
    }
    
    const quarterEl = document.getElementById('currentQuarter');
    const quarterPhaseEl = document.getElementById('quarterPhase');
    if (quarterEl) {
        quarterEl.textContent = quarter;
        quarterEl.style.color = quarterColor;
    }
    if (quarterPhaseEl) quarterPhaseEl.textContent = quarterPhase;
    
    // Day of week and weekly phase
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[day];
    let weeklyPhase = '';
    let weeklyColor = '';
    
    if (day === 0 || day === 6) {
        weeklyPhase = 'Weekend - Market Closed';
        weeklyColor = 'var(--text-tertiary)';
    } else if (day === 1) {
        weeklyPhase = 'Q1 - Accumulation Phase';
        weeklyColor = 'var(--text-tertiary)';
    } else if (day === 2) {
        weeklyPhase = 'Q2 - Manipulation Phase';
        weeklyColor = 'var(--accent-yellow)';
    } else if (day === 3) {
        weeklyPhase = 'Q3 - Distribution (BEST DAY!)';
        weeklyColor = 'var(--accent-green)';
    } else if (day === 4) {
        weeklyPhase = 'Q3 Continuation';
        weeklyColor = 'var(--accent-green)';
    } else if (day === 5) {
        weeklyPhase = 'Q4 - End of Week Setup';
        weeklyColor = 'var(--accent-red)';
    }
    
    const dayEl = document.getElementById('dayOfWeek');
    const weeklyPhaseEl = document.getElementById('weeklyPhase');
    if (dayEl) {
        dayEl.textContent = dayName;
        dayEl.style.color = weeklyColor;
    }
    if (weeklyPhaseEl) weeklyPhaseEl.textContent = weeklyPhase;
    
    // Generate detailed anticipation content
    updateAnticipationContent(hours, minutes, day, quarter);
    
    // Generate action checklist
    updateActionChecklist(hours, minutes, day, quarter);
    
    // Calculate next key time
    calculateNextKeyTime(hours, minutes);
}

function updateAnticipationContent(hours, minutes, day, quarter) {
    const contentEl = document.getElementById('anticipationContent');
    const weeklyContextEl = document.getElementById('weeklyContext');
    if (!contentEl) return;
    
    let content = '';
    
    // Add "What Has Likely Happened" section to weeklyContext div
    let weeklyContext = '';
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[day];
    
    if (day === 1) { // Monday
        weeklyContext = `
            <div style="padding: 1.5rem; background: rgba(255, 255, 255, 0.05); border-radius: 8px; margin-bottom: 1.5rem; border-left: 4px solid var(--text-tertiary);">
                <h4 style="color: var(--text-tertiary); margin-bottom: 1rem;">📊 Quarterly Theory Setup (Monday - Q1 Accumulation Phase)</h4>
                <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 0.5rem;"><strong>What Has Likely Happened (Higher Timeframe):</strong></p>
                <ul style="padding-left: 1.5rem; line-height: 1.8; color: var(--text-secondary);">
                    <li><strong>Weekend:</strong> 48-hour gap - market makers reset positions, liquidity imbalances created</li>
                    <li><strong>Q1 Begins (Sunday 5PM-Monday):</strong> Accumulation phase started - tight range, low conviction</li>
                    <li><strong>True Weekly Open established:</strong> This becomes the manipulation reference for Q2 (Tuesday)</li>
                    <li><strong>Liquidity pools identified:</strong> Stops placed above/below Monday range (retail trapped)</li>
                    <li><strong>Institution positioning:</strong> NOT committed yet - building positions quietly in Q1</li>
                </ul>
                <p style="color: var(--text-secondary); line-height: 1.8; margin-top: 1rem;"><strong>⚠️ Quarterly Theory Strategy:</strong> This is Q1 (Accumulation) - market makers are OBSERVING and ACCUMULATING. They need to establish range before Q2 manipulation can begin. Don't trade the chop - mark your levels!</p>
            </div>
        `;
    } else if (day === 2) { // Tuesday
        weeklyContext = `
            <div style="padding: 1.5rem; background: rgba(255, 193, 7, 0.08); border-radius: 8px; margin-bottom: 1.5rem; border-left: 4px solid var(--accent-yellow);">
                <h4 style="color: var(--accent-yellow); margin-bottom: 1rem;">📊 Quarterly Theory Setup (Tuesday - Q2 Manipulation Phase)</h4>
                <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 0.5rem;"><strong>What Has Likely Happened (Quarterly Cycle):</strong></p>
                <ul style="padding-left: 1.5rem; line-height: 1.8; color: var(--text-secondary);">
                    <li><strong>Q1 Complete (Monday):</strong> Accumulation range established - True Open set at Monday's range</li>
                    <li><strong>Q2 Begins (Tuesday):</strong> MANIPULATION phase - market makers now violate the True Open</li>
                    <li><strong>Stop Hunt in Progress:</strong> Price sweeping liquidity above/below Monday's range (trapping retail)</li>
                    <li><strong>False Breakout:</strong> Creating "higher highs" or "lower lows" that will FAIL (this is the trap!)</li>
                    <li><strong>Peak Formation (PF):</strong> Tuesday's high/low becomes the manipulation extreme for Q3 reversal</li>
                </ul>
                <p style="color: var(--text-secondary); line-height: 1.8; margin-top: 1rem;"><strong>🎯 Quarterly Theory Strategy:</strong> Q2 = MANIPULATION! Market makers are TRAPPING retail with false moves. Mark Tuesday's PF High/Low - this will be your reversal reference for Q3 (Wednesday). Don't chase the breakout!</p>
            </div>
        `;
    } else if (day === 3) { // Wednesday
        weeklyContext = `
            <div style="padding: 1.5rem; background: rgba(0, 255, 136, 0.1); border-radius: 8px; margin-bottom: 1.5rem; border: 2px solid var(--accent-green);">
                <h4 style="color: var(--accent-green); margin-bottom: 1rem;">📊 Quarterly Theory Setup (Wednesday - Q3 DISTRIBUTION!) 🔥</h4>
                <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 0.5rem;"><strong>What Has Likely Happened (Complete A-M-D Cycle):</strong></p>
                <ul style="padding-left: 1.5rem; line-height: 1.8; color: var(--text-secondary);">
                    <li><strong>Q1 Complete (Monday):</strong> Accumulation ✅ - True Open established, tight range</li>
                    <li><strong>Q2 Complete (Tuesday):</strong> Manipulation ✅ - PF High/Low set, retail trapped above/below True Open</li>
                    <li><strong>Q3 Begins (Wednesday):</strong> DISTRIBUTION phase starts - THE REAL MOVE!</li>
                    <li><strong>Reversal from PF:</strong> Tuesday's manipulation high/low now FAILS - price reverses through True Open</li>
                    <li><strong>Market Maker Objective Complete:</strong> Trapped retail now liquidated, institutions distribute at optimal prices</li>
                    <li><strong>This is the 22.5-67.5 minute window of the WEEK!</strong></li>
                </ul>
                <p style="color: var(--accent-green); line-height: 1.8; margin-top: 1rem; font-weight: bold;">🚀 Quarterly Theory Strategy: Q3 = DISTRIBUTION! If Tuesday made HIGH, Wednesday distributes DOWN. If Tuesday made LOW, Wednesday distributes UP. The manipulation has trapped retail - NOW we trade the reversal WITH the institutions. This is your BEST day!</p>
            </div>
        `;
    } else if (day === 4) { // Thursday
        weeklyContext = `
            <div style="padding: 1.5rem; background: rgba(0, 255, 136, 0.08); border-radius: 8px; margin-bottom: 1.5rem; border-left: 4px solid var(--accent-green);">
                <h4 style="color: var(--accent-green); margin-bottom: 1rem;">📊 Quarterly Theory Setup (Thursday - Q3 Continuation/Exhaustion)</h4>
                <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 0.5rem;"><strong>What Has Likely Happened (Distribution Extension):</strong></p>
                <ul style="padding-left: 1.5rem; line-height: 1.8; color: var(--text-secondary);">
                    <li><strong>A-M-D Cycle:</strong> Mon Q1 ✅, Tue Q2 ✅, Wed Q3 ✅ - Full distribution move occurred</li>
                    <li><strong>Q3 Extension (Thursday):</strong> Continuation of Wednesday's distribution OR early exhaustion</li>
                    <li><strong>Target Zones:</strong> ADR (Average Daily Range) from Wednesday likely hit or approaching</li>
                    <li><strong>Fractal Repetition:</strong> Same Q1-Q2-Q3 pattern may occur INTRADAY (watch session quarters)</li>
                    <li><strong>Approaching Q4:</strong> Friday is Q4 (reversal/continuation) - institutions preparing for week-end</li>
                </ul>
                <p style="color: var(--text-secondary); line-height: 1.8; margin-top: 1rem;"><strong>🎯 Quarterly Theory Strategy:</strong> Still in Q3 but approaching Q4. Look for continuation trades if Wednesday's move hasn't hit targets. If ADR exceeded, watch for exhaustion/reversal signs. Good day but not as clean as Wednesday!</p>
            </div>
        `;
    } else if (day === 5) { // Friday
        weeklyContext = `
            <div style="padding: 1.5rem; background: rgba(255, 77, 77, 0.1); border-radius: 8px; margin-bottom: 1.5rem; border-left: 4px solid var(--accent-red);">
                <h4 style="color: var(--accent-red); margin-bottom: 1rem;">📊 Quarterly Theory Setup (Friday - Q4 Reversal/Exhaustion/X-Factor)</h4>
                <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 0.5rem;"><strong>What Has Likely Happened (Complete A-M-D-X Cycle):</strong></p>
                <ul style="padding-left: 1.5rem; line-height: 1.8; color: var(--text-secondary);">
                    <li><strong>Full Weekly Quarterly Cycle:</strong> Q1 (Mon) ✅ → Q2 (Tue) ✅ → Q3 (Wed-Thu) ✅ → Q4 (Fri)</li>
                    <li><strong>Q4 = X-Factor:</strong> The "unknown" - can reverse, continue, or consolidate (unpredictable!)</li>
                    <li><strong>Distribution Complete:</strong> Wednesday-Thursday move exhausted - targets hit (ADR, PWH/PWL)</li>
                    <li><strong>Week-End Positioning:</strong> Institutions closing positions - don't want weekend risk exposure</li>
                    <li><strong>Fractal Reset Coming:</strong> Next Monday starts NEW Q1 accumulation (the cycle repeats)</li>
                    <li><strong>"Special Function":</strong> Friday often creates setup for next week's Monday gap</li>
                </ul>
                <p style="color: var(--accent-red); line-height: 1.8; margin-top: 1rem; font-weight: bold;">⚠️ Quarterly Theory Strategy: Q4 = X-FACTOR! Friday is Q4 (the reversal/exhaustion phase). Most reliable action is to CLOSE positions from Wed-Thu or trade very defensively. Let Friday set up Monday's gap. The cycle completes and RESETS!</p>
            </div>
        `;
    }
    
    // Update weekly context in its own div
    if (weeklyContextEl) {
        weeklyContextEl.innerHTML = weeklyContext;
    }
    
    // Add news warning banner (will be at top of all sessions)
    const newsWarning = `
        <div class="alert alert-warning" style="margin-bottom: 1rem; border-left: 4px solid var(--accent-yellow); background: rgba(255, 193, 7, 0.15);">
            <strong>📰 NEWS CHECK:</strong> Before trading, check the <a href="#" onclick="document.getElementById('tradingview-chart').scrollIntoView({behavior: 'smooth'}); return false;" style="color: var(--accent-blue);">Forex News Calendar below</a>!
            <div style="margin-top: 0.5rem; font-size: 0.9rem;">
                🔴 Red folder = AVOID trading 30 min before + 30 min after | 
                🟠 Orange = Reduce size | 
                🟡 Yellow = Trade normally
            </div>
        </div>
    `;
    
    // Detailed guidance based on current time (session-specific only)
    if (hours >= 17 && hours <= 23) {
        // Asian Session
        content = newsWarning + `
            <div style="padding: 1rem; background: rgba(255, 193, 7, 0.1); border-radius: 8px; margin-bottom: 1rem;">
                <h4 style="color: var(--accent-yellow); margin-bottom: 0.75rem;">🌙 Asian Session - What to Anticipate NOW</h4>
                <ul style="padding-left: 1.5rem; line-height: 1.8; color: var(--text-secondary);">
                    <li><strong>Primary Focus:</strong> Mark Asian High and Asian Low - these are critical reference points!</li>
                    <li><strong>Range Monitoring:</strong> Asian session typically has 40-80 pip range. Mark the midpoint (50%).</li>
                    <li><strong>Low Liquidity:</strong> Avoid trading unless you're scalping the range. This is accumulation phase.</li>
                    <li><strong>Preparation:</strong> Set alerts at Asian High/Low for London session breakout.</li>
                    <li><strong>Key Levels:</strong> Mark PDH, PDL, PWH, PWL on your chart now.</li>
                    <li><strong>📰 News Watch:</strong> Check for overnight Asian news (China data, BOJ, RBA) - can create gaps.</li>
                    ${hours >= 23 ? '<li><strong>⚠️ Near Midnight:</strong> Asian session ending soon. Lock your AR levels!</li>' : ''}
                </ul>
            </div>
        `;
    } else if (hours >= 0 && hours < 4) {
        // London Early (12AM-4 AM)
        content = newsWarning + `
            <div style="padding: 1rem; background: rgba(74, 158, 255, 0.1); border-radius: 8px; margin-bottom: 1rem;">
                <h4 style="color: var(--accent-blue); margin-bottom: 0.75rem;">🌍 London Open - What to Anticipate NOW</h4>
                <ul style="padding-left: 1.5rem; line-height: 1.8; color: var(--text-secondary);">
                    <li><strong>HIGH VOLATILITY ZONE!</strong> London open typically creates liquidity sweep of Asian range.</li>
                    <li><strong>Stop Hunt Expected:</strong> Watch for sweep of Asian High or Asian Low, then reversal.</li>
                    <li><strong>2nd Leg Out of Asia:</strong> If M/W pattern forms now, this is your setup! First leg was in Asian session.</li>
                    <li><strong>Brinks Time (3:45 AM):</strong> Major liquidity spike - precise entry window!</li>
                    <li><strong>Pattern to Watch:</strong> M-Top at Asian High or W-Bottom at Asian Low.</li>
                    <li><strong>📰 News Watch:</strong> Check for UK/EU news (GBP, EUR data) - major volatility events!</li>
                    <li><strong>⚠️ Wait for Confirmation:</strong> Don't trade immediately at open. Let the stop hunt complete first.</li>
                </ul>
            </div>
        `;
    } else if (hours >= 4 && hours < 9) {
        // London Mid to Late
        content = newsWarning + `
            <div style="padding: 1rem; background: rgba(74, 158, 255, 0.1); border-radius: 8px; margin-bottom: 1rem;">
                <h4 style="color: var(--accent-blue); margin-bottom: 0.75rem;">🌍 London Session - What to Anticipate NOW</h4>
                <ul style="padding-left: 1.5rem; line-height: 1.8; color: var(--text-secondary);">
                    <li><strong>Peak Formation Time:</strong> London PF (Peak Formation) typically occurs 4-6 AM EST.</li>
                    <li><strong>Day 2 of BTMM:</strong> If today is Tue/Wed, this might be your Level A1/V1 setup forming.</li>
                    <li><strong>Key Patterns:</strong> Look for M/W patterns at 200 EMA (Mayo), 50 EMA, or key levels.</li>
                    <li><strong>Direction for NY:</strong> The London move often sets up the NY reversal. Note the direction!</li>
                    <li><strong>📰 News Watch:</strong> 8:30 AM is prime US data time - check calendar before NY open!</li>
                    ${hours >= 7 ? '<li><strong>⚠️ NY Open Approaching:</strong> London exhaustion likely soon. Prepare for NY Q3 distribution!</li>' : ''}
                    <li><strong>If Ranging:</strong> Wait for NY open (9:30 AM EST) for better setups.</li>
                </ul>
            </div>
        `;
    } else if (hours >= 9 && hours < 12) {
        // NY Morning (Best Time!)
        content = newsWarning + `
            <div style="padding: 1rem; background: rgba(0, 255, 136, 0.15); border-radius: 8px; margin-bottom: 1rem; border: 2px solid var(--accent-green);">
                <h4 style="color: var(--accent-green); margin-bottom: 0.75rem;">🗽 NY SESSION - What to Anticipate NOW! ⭐</h4>
                <ul style="padding-left: 1.5rem; line-height: 1.8; color: var(--text-secondary);">
                    <li><strong>🔥 THIS IS YOUR WINDOW!</strong> Highest probability trades occur 9:00-11:00 AM EST.</li>
                    <li><strong>9:30 AM Open:</strong> Watch for initial sweep, then reversal. Don't chase the open move!</li>
                    <li><strong>9:45 AM (Brinks):</strong> Major liquidity spike - precise entry opportunity!</li>
                    <li><strong>915 Rule:</strong> Multiple timeframes align at 9:15 AM - watch for setups here too.</li>
                    <li><strong>London → NY Pattern:</strong> If London made HIGH, NY distributes DOWN (70%+ probability).</li>
                    <li><strong>If Wednesday (Day 3):</strong> This is your BEST DAY! Level A2/V2 setup likely forming.</li>
                    <li><strong>📰 CRITICAL NEWS CHECK:</strong> NFP (1st Fri), CPI, FOMC, Jobless Claims - stay flat if news within 30 min!</li>
                    <li><strong>Patterns:</strong> M/W at session highs/lows, EMA bounces (ID 50, 50/50), Type 4 breakout continuations.</li>
                    <li><strong>⚠️ Risk Management:</strong> Only 1-2% risk per trade. Max 3 positions. Scale out at targets!</li>
                </ul>
            </div>
        `;
    } else if (hours >= 12 && hours < 16) {
        // NY Afternoon
        content = newsWarning + `
            <div style="padding: 1rem; background: rgba(74, 158, 255, 0.1); border-radius: 8px; margin-bottom: 1rem;">
                <h4 style="color: var(--accent-blue); margin-bottom: 0.75rem;">🌆 NY Afternoon - What to Anticipate NOW</h4>
                <ul style="padding-left: 1.5rem; line-height: 1.8; color: var(--text-secondary);">
                    <li><strong>Lower Probability:</strong> Lunch hour (12-2 PM) often has choppy price action.</li>
                    <li><strong>2-3 PM Window:</strong> Mid-afternoon reversal zone. Look for session exhaustion reversals.</li>
                    <li><strong>Trail Positions:</strong> If you have morning trades running, consider trailing stops to lock profits.</li>
                    <li><strong>📰 News Watch:</strong> Fed speakers, FOMC minutes (2 PM) - check calendar!</li>
                    <li><strong>Day Trading Close:</strong> Most day traders close positions 3-4 PM, creating potential reversals.</li>
                    <li><strong>⚠️ Avoid New Entries:</strong> Unless you see clear Level 3 setup with all confirmations.</li>
                    ${hours >= 15 ? '<li><strong>Market Close (4 PM):</strong> Be flat or have tight stops. Overnight risk increases!</li>' : ''}
                </ul>
            </div>
        `;
    } else {
        // After Hours
        content = newsWarning + `
            <div style="padding: 1rem; background: rgba(255, 255, 255, 0.05); border-radius: 8px; margin-bottom: 1rem;">
                <h4 style="color: var(--text-tertiary); margin-bottom: 0.75rem;">🌙 After Hours - What to Do NOW</h4>
                <ul style="padding-left: 1.5rem; line-height: 1.8; color: var(--text-secondary);">
                    <li><strong>Market Closed:</strong> Major US markets are closed until tomorrow 9:30 AM EST.</li>
                    <li><strong>Review Your Trades:</strong> Journal today's trades. What worked? What didn't?</li>
                    <li><strong>Preparation:</strong> Mark tomorrow's key levels: PDH, PDL, PWH, PWL, monthly levels.</li>
                    <li><strong>Calculate ADR:</strong> Note the 5-day average daily range for tomorrow's targets.</li>
                    <li><strong>📰 Check Tomorrow's News:</strong> Look at calendar for high-impact events - plan around them!</li>
                    <li><strong>Asian Session Starts:</strong> 5:00 PM EST - low liquidity, only scalp if experienced.</li>
                    <li><strong>Plan Tomorrow:</strong> Check the weekly schedule. Is it Mon (Q1), Wed (Q3), or Fri (Q4)?</li>
                </ul>
            </div>
        `;
    }
    
    contentEl.innerHTML = content;
}

function updateActionChecklist(hours, minutes, day, quarter) {
    const checklistEl = document.getElementById('actionChecklist');
    if (!checklistEl) return;
    
    let checklist = [];
    
    // Generate checklist based on current time
    if (hours >= 17 && hours <= 23) {
        checklist = [
            '✅ Mark Asian High and Asian Low on chart',
            '✅ Calculate and mark Asian 50% (midpoint)',
            '✅ Note Asian range size (HOW-LOW pips)',
            '✅ Mark PDH, PDL, PWH, PWL key levels',
            '✅ Calculate 5-day ADR for tomorrow',
            '✅ Set alerts for London open (12:00 AM Midnight EST)'
        ];
    } else if (hours >= 0 && hours < 9) {
        checklist = [
            '✅ Watch for Asian High/Low liquidity sweep',
            '✅ Identify 2nd Leg Out of Asia M/W pattern',
            '✅ Wait for Brinks time (3:45 AM) if near',
            '✅ Mark London PF (Peak Formation) 4-6 AM',
            '✅ Check EMA positions (13, 50, 200)',
            '✅ Note London direction for NY reversal',
            '✅ Prepare for NY open (9:30 AM EST)'
        ];
    } else if (hours >= 9 && hours < 12) {
        checklist = [
            '✅ Check London→NY pattern (if London HIGH, NY goes LOW)',
            '✅ Watch 9:30 AM open for initial sweep',
            '✅ Wait for 9:45 AM Brinks time if setup present',
            '✅ Look for M/W patterns at session extremes',
            '✅ Confirm with EMA close (above/below 13 EMA)',
            '✅ Check TDI (RSI must cross MBL)',
            '✅ Risk only 1-2% per trade, max 3 positions',
            '✅ Set TP1 (1:2), TP2 (1:3), TP3 (trail)'
        ];
    } else if (hours >= 12 && hours < 16) {
        checklist = [
            '✅ Trail stops on open positions',
            '✅ Watch 2-3 PM for reversal setups',
            '✅ Avoid new entries unless Level 3 setup',
            '✅ Close day trades before 4 PM market close',
            '✅ Journal today\'s trades (win/loss reasons)',
            '✅ Calculate P&L and risk for the day'
        ];
    } else {
        checklist = [
            '✅ Review and journal today\'s performance',
            '✅ Mark tomorrow\'s key levels (PDH, PDL, etc.)',
            '✅ Calculate 5-day ADR for tomorrow\'s targets',
            '✅ Check weekly phase (Mon/Wed/Fri?)',
            '✅ Plan tomorrow\'s strategy based on day',
            '✅ Rest and prepare mentally for next session'
        ];
    }
    
    checklistEl.innerHTML = checklist.map(item => `<div style="color: var(--text-secondary);">${item}</div>`).join('');
}

function calculateNextKeyTime(hours, minutes) {
    const nextKeyTimeEl = document.getElementById('nextKeyTime');
    const nextTimeDescEl = document.getElementById('nextTimeDescription');
    if (!nextKeyTimeEl || !nextTimeDescEl) return;
    
    let nextTime = '';
    let description = '';
    
    if (hours < 3 || (hours === 3 && minutes < 45)) {
        nextTime = '3:45 AM EST';
        description = 'London Brinks Time - Liquidity spike window';
    } else if (hours < 9) {
        nextTime = '9:30 AM EST';
        description = 'NY Open - Prime trading window begins';
    } else if (hours < 9 || (hours === 9 && minutes < 45)) {
        nextTime = '9:45 AM EST';
        description = 'NY Brinks Time - Best entry window';
    } else if (hours < 14) {
        nextTime = '2:00 PM EST';
        description = 'Mid-Afternoon Reversal Window';
    } else if (hours < 16) {
        nextTime = '4:00 PM EST';
        description = 'Market Close - Close day trades';
    } else if (hours < 17) {
        nextTime = '5:00 PM EST';
        description = 'Asian Session Open - New cycle begins';
    } else if (hours < 21 || (hours === 21 && minutes < 45)) {
        nextTime = '9:45 PM EST';
        description = 'Asian Brinks Time - Liquidity window';
    } else if (hours >= 21) {
        nextTime = '12:00 AM Midnight EST';
        description = 'Asian session ends, London begins';
    } else {
        nextTime = '12:00 AM Midnight EST';
        description = 'Asian session ends, London begins';
    }
    
    nextKeyTimeEl.textContent = nextTime;
    nextTimeDescEl.textContent = description;
}

// Initialize and update market sentiment with proper cleanup
if (document.getElementById('liveMarketPanel')) {
    sentimentInterval = setInterval(updateMarketSentiment, 1000);
    updateMarketSentiment();
}

// Note: highlightActiveNav() is now handled by navigation.js
// Removed duplicate function to avoid collision

// Collapsible Sections
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.collapsible').forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            if (content && content.classList.contains('collapsible-content')) {
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            }
        });
    });
});

// Tabs
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            if (!targetTab) return;
            
            const tabGroup = this.closest('.section') || this.closest('.content');
            
            // Remove active from all tabs in this group
            tabGroup.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            tabGroup.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Add active to clicked tab
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
});

// Checklist persistence
const checklistKey = 'tradingGuideChecklist';

function saveChecklistState() {
    const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const states = {};
    
    checkboxes.forEach((cb, index) => {
        const key = `${currentPage}-${index}`;
        states[key] = cb.checked;
    });
    
    // Get existing states
    const existingStates = JSON.parse(localStorage.getItem(checklistKey) || '{}');
    // Merge with new states
    const mergedStates = { ...existingStates, ...states };
    
    localStorage.setItem(checklistKey, JSON.stringify(mergedStates));
}

function loadChecklistState() {
    const saved = localStorage.getItem(checklistKey);
    if (!saved) return;
    
    const states = JSON.parse(saved);
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
    
    checkboxes.forEach((cb, index) => {
        const key = `${currentPage}-${index}`;
        if (states[key]) {
            cb.checked = true;
        }
    });
}

// Initialize checklist
document.addEventListener('DOMContentLoaded', function() {
    loadChecklistState();
    
    document.querySelectorAll('.checklist input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', saveChecklistState);
    });
});

// Search functionality (basic - searches current page)
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const content = document.getElementById('mainContent');
            if (!content) return;
            
            const sections = content.querySelectorAll('.section');
            
            if (searchTerm === '') {
                sections.forEach(section => {
                    section.style.display = 'block';
                    section.querySelectorAll('p, li, td').forEach(el => {
                        el.style.background = '';
                    });
                });
                return;
            }
            
            let hasResults = false;
            sections.forEach(section => {
                const text = section.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    section.style.display = 'block';
                    hasResults = true;
                    // Highlight search term
                    section.querySelectorAll('p, li, td').forEach(el => {
                        const content = el.textContent;
                        if (content.toLowerCase().includes(searchTerm)) {
                            el.style.background = 'rgba(255, 215, 0, 0.1)';
                        }
                    });
                } else {
                    section.style.display = 'none';
                }
            });
            
            // Show message if no results
            if (!hasResults) {
                // Could add a "no results" message here
            }
        });
        
        // Clear highlighting on blur
        searchInput.addEventListener('blur', function() {
            setTimeout(() => {
                document.querySelectorAll('p, li, td').forEach(el => {
                    el.style.background = '';
                });
            }, 3000);
        });
    }
});

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Escape to clear search
    if (e.key === 'Escape') {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
            searchInput.blur();
            const sections = document.querySelectorAll('.section');
            sections.forEach(s => s.style.display = 'block');
        }
    }
});

// Console welcome message
console.log('%c🚀 Trading Guide Loaded Successfully! ', 'background: #4a9eff; color: white; font-size: 16px; padding: 10px;');
console.log('%cKeyboard Shortcuts: Ctrl+K to search, ESC to clear', 'color: #ffd700;');

// Navigation is now loaded from navigation.js
// This ensures consistency across all pages

// Theme Switcher
function initializeTheme() {
    // Check if user has a saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButton(newTheme);
    
    // Show feedback
    showThemeNotification(newTheme);
}

function updateThemeButton(theme) {
    const button = document.getElementById('themeToggle');
    if (!button) return;
    
    if (theme === 'light') {
        button.innerHTML = '🌙 Dark Mode';
        button.title = 'Switch to Dark Mode';
    } else {
        button.innerHTML = '☀️ Light Mode';
        button.title = 'Switch to Light Mode';
    }
}

function showThemeNotification(theme) {
    // Create notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 150px;
        right: 20px;
        background: var(--accent-green);
        color: var(--bg-primary);
        padding: 1rem 1.5rem;
        border-radius: 8px;
        font-weight: bold;
        z-index: 10001;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = `${theme === 'light' ? '☀️ Light' : '🌙 Dark'} Mode Activated!`;
    
    document.body.appendChild(notification);
    
    // Remove after 2 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add theme toggle button to page
function addThemeToggle() {
    // Check if button already exists
    if (document.getElementById('themeToggle')) return;
    
    const button = document.createElement('button');
    button.id = 'themeToggle';
    button.className = 'theme-toggle';
    button.onclick = toggleTheme;
    button.title = 'Toggle Theme';
    
    document.body.appendChild(button);
    
    // Initialize theme
    initializeTheme();
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', function() {
    addThemeToggle();
    initializeTheme();
});

// Add CSS animations for notifications
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

