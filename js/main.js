// Trading Guide - Main JavaScript

// Clock and Session Indicator
function updateTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} EST`;
    const timeEl = document.getElementById('currentTime');
    if (timeEl) {
        timeEl.textContent = timeStr;
    }
    
    // Determine session
    let session = '';
    let sessionClass = '';
    if (hours >= 18 || hours < 0) {
        session = '🌙 ASIAN SESSION (Q1 - Accumulation)';
        sessionClass = 'session-active';
    } else if (hours >= 0 && hours < 6) {
        session = '🌍 LONDON SESSION (Q2 - Manipulation)';
        sessionClass = 'session-active';
    } else if (hours >= 6 && hours < 12) {
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

// Initialize clock
setInterval(updateTime, 1000);
updateTime();

// Live Market Sentiment Panel
function updateMarketSentiment() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Update live time display
    const liveTimeEl = document.getElementById('liveTimeDisplay');
    if (liveTimeEl) {
        liveTimeEl.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} EST`;
    }
    
    // Determine current session
    let sessionName = '';
    let sessionTime = '';
    let sessionColor = '';
    
    if (hours >= 17 || hours < 2) {
        sessionName = '🌙 Asian Session';
        sessionTime = '5:00 PM - 2:00 AM EST';
        sessionColor = 'var(--accent-yellow)';
    } else if (hours >= 2 && hours < 9) {
        sessionName = '🌍 London Session';
        sessionTime = '2:00 AM - 9:00 AM EST';
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
    if (!contentEl) return;
    
    let content = '';
    
    // Add "What Has Likely Happened" section based on higher timeframe
    let weeklyContext = '';
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[day];
    
    if (day === 1) { // Monday
        weeklyContext = `
            <div style="padding: 1.5rem; background: rgba(255, 255, 255, 0.05); border-radius: 8px; margin-bottom: 1.5rem; border-left: 4px solid var(--text-tertiary);">
                <h4 style="color: var(--text-tertiary); margin-bottom: 1rem;">📊 Weekly Context (Monday - Q1 Accumulation)</h4>
                <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 0.5rem;"><strong>What Has Likely Happened:</strong></p>
                <ul style="padding-left: 1.5rem; line-height: 1.8; color: var(--text-secondary);">
                    <li>Weekend gap may have occurred at Sunday 5 PM open</li>
                    <li>Market makers are establishing the weekly range (accumulation phase)</li>
                    <li>True weekly open is being set - this is a KEY reference level for the week</li>
                    <li>Low conviction moves - institutions are NOT committed yet</li>
                </ul>
                <p style="color: var(--text-secondary); line-height: 1.8; margin-top: 1rem;"><strong>⚠️ Monday Strategy:</strong> OBSERVE more than trade. Mark levels, study structure, prepare for Tuesday-Wednesday action!</p>
            </div>
        `;
    } else if (day === 2) { // Tuesday
        weeklyContext = `
            <div style="padding: 1.5rem; background: rgba(255, 193, 7, 0.08); border-radius: 8px; margin-bottom: 1.5rem; border-left: 4px solid var(--accent-yellow);">
                <h4 style="color: var(--accent-yellow); margin-bottom: 1rem;">📊 Weekly Context (Tuesday - Q2 Manipulation)</h4>
                <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 0.5rem;"><strong>What Has Likely Happened:</strong></p>
                <ul style="padding-left: 1.5rem; line-height: 1.8; color: var(--text-secondary);">
                    <li>Monday established the weekly accumulation range</li>
                    <li>Weekly True Open (Monday's range) is now a key reference</li>
                    <li>Market makers have identified liquidity pools above/below Monday's range</li>
                    <li>We're now in Q2 (Manipulation) - expect stop hunts and false moves!</li>
                </ul>
                <p style="color: var(--text-secondary); line-height: 1.8; margin-top: 1rem;"><strong>🎯 Tuesday Strategy:</strong> This is Day 2 of BTMM cycle. Look for Level A1/V1 setups. Mark the manipulation levels - they'll reverse tomorrow!</p>
            </div>
        `;
    } else if (day === 3) { // Wednesday
        weeklyContext = `
            <div style="padding: 1.5rem; background: rgba(0, 255, 136, 0.1); border-radius: 8px; margin-bottom: 1.5rem; border: 2px solid var(--accent-green);">
                <h4 style="color: var(--accent-green); margin-bottom: 1rem;">📊 Weekly Context (Wednesday - Q3 DISTRIBUTION!) 🔥</h4>
                <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 0.5rem;"><strong>What Has Likely Happened:</strong></p>
                <ul style="padding-left: 1.5rem; line-height: 1.8; color: var(--text-secondary);">
                    <li>Monday = Accumulation (Q1), Tuesday = Manipulation (Q2) ✅</li>
                    <li>Weekly Peak Formation (PF) likely established Mon-Tue</li>
                    <li>Stop hunts above/below key levels have trapped retail traders</li>
                    <li>Market makers NOW have their positions and liquidity</li>
                    <li><strong>THIS IS DAY 3 - REAL MOVE HAPPENS TODAY!</strong></li>
                </ul>
                <p style="color: var(--accent-green); line-height: 1.8; margin-top: 1rem; font-weight: bold;">🚀 Wednesday Strategy: BEST TRADING DAY! Level A2/V2 setups with Level III EMA confirmation. If Tuesday made HIGH, Wednesday distributes DOWN (or vice versa). Trade WITH the distribution move!</p>
            </div>
        `;
    } else if (day === 4) { // Thursday
        weeklyContext = `
            <div style="padding: 1.5rem; background: rgba(0, 255, 136, 0.08); border-radius: 8px; margin-bottom: 1.5rem; border-left: 4px solid var(--accent-green);">
                <h4 style="color: var(--accent-green); margin-bottom: 1rem;">📊 Weekly Context (Thursday - Q3 Continuation)</h4>
                <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 0.5rem;"><strong>What Has Likely Happened:</strong></p>
                <ul style="padding-left: 1.5rem; line-height: 1.8; color: var(--text-secondary);">
                    <li>Mon-Tue established range and manipulation</li>
                    <li>Wednesday Q3 distribution move has occurred</li>
                    <li>Major directional move from Wed may be continuing or exhausting</li>
                    <li>We're still in Q3 but approaching Q4 (Friday)</li>
                </ul>
                <p style="color: var(--text-secondary); line-height: 1.8; margin-top: 1rem;"><strong>🎯 Thursday Strategy:</strong> Continuation of Wednesday's move OR early reversal signs. Good trading day but not as reliable as Wednesday. Watch for exhaustion!</p>
            </div>
        `;
    } else if (day === 5) { // Friday
        weeklyContext = `
            <div style="padding: 1.5rem; background: rgba(255, 77, 77, 0.1); border-radius: 8px; margin-bottom: 1.5rem; border-left: 4px solid var(--accent-red);">
                <h4 style="color: var(--accent-red); margin-bottom: 1rem;">📊 Weekly Context (Friday - Q4 Reversal/Exhaustion)</h4>
                <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 0.5rem;"><strong>What Has Likely Happened:</strong></p>
                <ul style="padding-left: 1.5rem; line-height: 1.8; color: var(--text-secondary);">
                    <li>Full weekly cycle: Mon Q1 → Tue Q2 → Wed Q3 → Thu Q3 ✅</li>
                    <li>Major directional move (Wed-Thu) has likely exhausted</li>
                    <li>Weekly targets may have been reached (ADR, PWH/PWL)</li>
                    <li>Institutions are closing positions for the weekend</li>
                    <li>Friday has "special function" - can reverse or continue unpredictably</li>
                </ul>
                <p style="color: var(--accent-red); line-height: 1.8; margin-top: 1rem; font-weight: bold;">⚠️ Friday Strategy: CAUTION! Trade defensively. Tighter stops, smaller size. Many professionals close Friday AM to avoid weekend risk. Consider doing the same!</p>
            </div>
        `;
    }
    
    content += weeklyContext;
    
    // Detailed guidance based on current time
    if (hours >= 17 || hours < 2) {
        // Asian Session
        content += `
            <div style="padding: 1rem; background: rgba(255, 193, 7, 0.1); border-radius: 8px; margin-bottom: 1rem;">
                <h4 style="color: var(--accent-yellow); margin-bottom: 0.75rem;">🌙 Asian Session - What to Anticipate NOW</h4>
                <ul style="padding-left: 1.5rem; line-height: 1.8; color: var(--text-secondary);">
                    <li><strong>Primary Focus:</strong> Mark Asian High and Asian Low - these are critical reference points!</li>
                    <li><strong>Range Monitoring:</strong> Asian session typically has 40-80 pip range. Mark the midpoint (50%).</li>
                    <li><strong>Low Liquidity:</strong> Avoid trading unless you're scalping the range. This is accumulation phase.</li>
                    <li><strong>Preparation:</strong> Set alerts at Asian High/Low for London session breakout.</li>
                    <li><strong>Key Levels:</strong> Mark PDH, PDL, PWH, PWL on your chart now.</li>
                    ${hours >= 23 || hours < 2 ? '<li><strong>⚠️ Near London Open:</strong> Expect volatility increase in next 1-2 hours! Be ready.</li>' : ''}
                </ul>
            </div>
        `;
    } else if (hours >= 2 && hours < 4) {
        // London Early (2-4 AM)
        content += `
            <div style="padding: 1rem; background: rgba(74, 158, 255, 0.1); border-radius: 8px; margin-bottom: 1rem;">
                <h4 style="color: var(--accent-blue); margin-bottom: 0.75rem;">🌍 London Open - What to Anticipate NOW</h4>
                <ul style="padding-left: 1.5rem; line-height: 1.8; color: var(--text-secondary);">
                    <li><strong>HIGH VOLATILITY ZONE!</strong> London open typically creates liquidity sweep of Asian range.</li>
                    <li><strong>Stop Hunt Expected:</strong> Watch for sweep of Asian High or Asian Low, then reversal.</li>
                    <li><strong>2nd Leg Out of Asia:</strong> If M/W pattern forms now, this is your setup! First leg was in Asian session.</li>
                    <li><strong>Brinks Time (3:45 AM):</strong> Major liquidity spike - precise entry window!</li>
                    <li><strong>Pattern to Watch:</strong> M-Top at Asian High or W-Bottom at Asian Low.</li>
                    <li><strong>⚠️ Wait for Confirmation:</strong> Don't trade immediately at open. Let the stop hunt complete first.</li>
                </ul>
            </div>
        `;
    } else if (hours >= 4 && hours < 9) {
        // London Mid to Late
        content += `
            <div style="padding: 1rem; background: rgba(74, 158, 255, 0.1); border-radius: 8px; margin-bottom: 1rem;">
                <h4 style="color: var(--accent-blue); margin-bottom: 0.75rem;">🌍 London Session - What to Anticipate NOW</h4>
                <ul style="padding-left: 1.5rem; line-height: 1.8; color: var(--text-secondary);">
                    <li><strong>Peak Formation Time:</strong> London PF (Peak Formation) typically occurs 4-6 AM EST.</li>
                    <li><strong>Day 2 of BTMM:</strong> If today is Tue/Wed, this might be your Level A1/V1 setup forming.</li>
                    <li><strong>Key Patterns:</strong> Look for M/W patterns at 200 EMA (Mayo), 50 EMA, or key levels.</li>
                    <li><strong>Direction for NY:</strong> The London move often sets up the NY reversal. Note the direction!</li>
                    ${hours >= 7 ? '<li><strong>⚠️ NY Open Approaching:</strong> London exhaustion likely soon. Prepare for NY Q3 distribution!</li>' : ''}
                    <li><strong>If Ranging:</strong> Wait for NY open (9:30 AM EST) for better setups.</li>
                </ul>
            </div>
        `;
    } else if (hours >= 9 && hours < 12) {
        // NY Morning (Best Time!)
        content += `
            <div style="padding: 1rem; background: rgba(0, 255, 136, 0.15); border-radius: 8px; margin-bottom: 1rem; border: 2px solid var(--accent-green);">
                <h4 style="color: var(--accent-green); margin-bottom: 0.75rem;">🗽 NY SESSION - What to Anticipate NOW! ⭐</h4>
                <ul style="padding-left: 1.5rem; line-height: 1.8; color: var(--text-secondary);">
                    <li><strong>🔥 THIS IS YOUR WINDOW!</strong> Highest probability trades occur 9:00-11:00 AM EST.</li>
                    <li><strong>9:30 AM Open:</strong> Watch for initial sweep, then reversal. Don't chase the open move!</li>
                    <li><strong>9:45 AM (Brinks):</strong> Major liquidity spike - precise entry opportunity!</li>
                    <li><strong>915 Rule:</strong> Multiple timeframes align at 9:15 AM - watch for setups here too.</li>
                    <li><strong>London → NY Pattern:</strong> If London made HIGH, NY distributes DOWN (70%+ probability).</li>
                    <li><strong>If Wednesday (Day 3):</strong> This is your BEST DAY! Level A2/V2 setup likely forming.</li>
                    <li><strong>Patterns:</strong> M/W at session highs/lows, EMA bounces (ID 50, 50/50), Type 4 breakout continuations.</li>
                    <li><strong>⚠️ Risk Management:</strong> Only 1-2% risk per trade. Max 3 positions. Scale out at targets!</li>
                </ul>
            </div>
        `;
    } else if (hours >= 12 && hours < 16) {
        // NY Afternoon
        content += `
            <div style="padding: 1rem; background: rgba(74, 158, 255, 0.1); border-radius: 8px; margin-bottom: 1rem;">
                <h4 style="color: var(--accent-blue); margin-bottom: 0.75rem;">🌆 NY Afternoon - What to Anticipate NOW</h4>
                <ul style="padding-left: 1.5rem; line-height: 1.8; color: var(--text-secondary);">
                    <li><strong>Lower Probability:</strong> Lunch hour (12-2 PM) often has choppy price action.</li>
                    <li><strong>2-3 PM Window:</strong> Mid-afternoon reversal zone. Look for session exhaustion reversals.</li>
                    <li><strong>Trail Positions:</strong> If you have morning trades running, consider trailing stops to lock profits.</li>
                    <li><strong>Day Trading Close:</strong> Most day traders close positions 3-4 PM, creating potential reversals.</li>
                    <li><strong>⚠️ Avoid New Entries:</strong> Unless you see clear Level 3 setup with all confirmations.</li>
                    ${hours >= 15 ? '<li><strong>Market Close (4 PM):</strong> Be flat or have tight stops. Overnight risk increases!</li>' : ''}
                </ul>
            </div>
        `;
    } else {
        // After Hours
        content += `
            <div style="padding: 1rem; background: rgba(255, 255, 255, 0.05); border-radius: 8px; margin-bottom: 1rem;">
                <h4 style="color: var(--text-tertiary); margin-bottom: 0.75rem;">🌙 After Hours - What to Do NOW</h4>
                <ul style="padding-left: 1.5rem; line-height: 1.8; color: var(--text-secondary);">
                    <li><strong>Market Closed:</strong> Major US markets are closed until tomorrow 9:30 AM EST.</li>
                    <li><strong>Review Your Trades:</strong> Journal today's trades. What worked? What didn't?</li>
                    <li><strong>Preparation:</strong> Mark tomorrow's key levels: PDH, PDL, PWH, PWL, monthly levels.</li>
                    <li><strong>Calculate ADR:</strong> Note the 5-day average daily range for tomorrow's targets.</li>
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
    if (hours >= 17 || hours < 2) {
        checklist = [
            '✅ Mark Asian High and Asian Low on chart',
            '✅ Calculate and mark Asian 50% (midpoint)',
            '✅ Note Asian range size (HOW-LOW pips)',
            '✅ Mark PDH, PDL, PWH, PWL key levels',
            '✅ Calculate 5-day ADR for tomorrow',
            '✅ Set alerts for London open (2 AM EST)'
        ];
    } else if (hours >= 2 && hours < 9) {
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
    
    if (hours < 2) {
        nextTime = '2:00 AM EST';
        description = 'London Open - Major volatility spike expected';
    } else if (hours < 3 || (hours === 3 && minutes < 45)) {
        nextTime = '3:45 AM EST';
        description = 'Brinks Trade Time - Liquidity spike window';
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
    } else {
        nextTime = '2:00 AM EST (Tomorrow)';
        description = 'London Open - New trading day';
    }
    
    nextKeyTimeEl.textContent = nextTime;
    nextTimeDescEl.textContent = description;
}

// Initialize and update market sentiment
if (document.getElementById('liveMarketPanel')) {
    setInterval(updateMarketSentiment, 1000);
    updateMarketSentiment();
}

// Highlight active navigation
function highlightActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkHref = link.getAttribute('href');
        const linkPage = linkHref.split('/').pop();
        
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Call on page load
highlightActiveNav();

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

