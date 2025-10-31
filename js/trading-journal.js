// Trading Journal JavaScript
// Handles trade logging, analytics, and performance tracking

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadTrades();
    updateDashboard();
    setupTabSwitching();
    setDefaultDateTime();
    renderCalendar();
});

// Calendar variables
let currentCalendarMonth = new Date().getMonth();
let currentCalendarYear = new Date().getFullYear();

// Data Storage
function getTrades() {
    const trades = localStorage.getItem('tradingJournalTrades');
    return trades ? JSON.parse(trades) : [];
}

function saveTrades(trades) {
    localStorage.setItem('tradingJournalTrades', JSON.stringify(trades));
}

// Set current date/time as default
function setDefaultDateTime() {
    const now = new Date();
    // Format for datetime-local input
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    const dateTimeInput = document.getElementById('tradeDateTime');
    if (dateTimeInput) {
        dateTimeInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
    }
}

// Modal Functions
function showAddTradeModal() {
    document.getElementById('addTradeModal').style.display = 'block';
    setDefaultDateTime();
}

function closeAddTradeModal() {
    document.getElementById('addTradeModal').style.display = 'none';
    document.getElementById('addTradeForm').reset();
}

// Save Trade
function saveTrade(event) {
    event.preventDefault();
    
    const trade = {
        id: Date.now(),
        dateTime: document.getElementById('tradeDateTime').value,
        pair: document.getElementById('tradePair').value,
        direction: document.getElementById('tradeDirection').value,
        pattern: document.getElementById('tradePattern').value,
        entry: parseFloat(document.getElementById('tradeEntry').value),
        exit: parseFloat(document.getElementById('tradeExit').value),
        stop: parseFloat(document.getElementById('tradeStop').value),
        tp: parseFloat(document.getElementById('tradeTP').value) || null,
        size: parseFloat(document.getElementById('tradeSize').value),
        pl: parseFloat(document.getElementById('tradePL').value),
        session: document.getElementById('tradeSession').value,
        quarter: document.getElementById('tradeQuarter').value,
        notes: document.getElementById('tradeNotes').value
    };
    
    // Calculate R:R
    const risk = Math.abs(trade.entry - trade.stop);
    const reward = Math.abs(trade.exit - trade.entry);
    trade.rr = risk > 0 ? (reward / risk).toFixed(2) : 0;
    
    // Determine outcome
    if (trade.pl > 0) {
        trade.outcome = 'Win';
    } else if (trade.pl < 0) {
        trade.outcome = 'Loss';
    } else {
        trade.outcome = 'Breakeven';
    }
    
    // Get day of week
    const date = new Date(trade.dateTime);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    trade.dayOfWeek = days[date.getDay()];
    
    // Save trade
    const trades = getTrades();
    trades.unshift(trade); // Add to beginning
    saveTrades(trades);
    
    // Update UI
    loadTrades();
    updateDashboard();
    closeAddTradeModal();
    
    // Show success message
    alert('✅ Trade logged successfully!');
}

// Load and Display Trades
function loadTrades() {
    const trades = getTrades();
    const tbody = document.getElementById('tradesTableBody');
    
    if (trades.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="padding: 3rem; text-align: center; color: var(--text-tertiary);">
                    No trades logged yet. Click "➕ Log New Trade" to add your first trade!
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = trades.map(trade => {
        const outcomeColor = trade.outcome === 'Win' ? 'var(--accent-green)' : 
                            trade.outcome === 'Loss' ? 'var(--accent-red)' : 
                            'var(--accent-yellow)';
        
        const plColor = trade.pl > 0 ? 'var(--accent-green)' : 
                       trade.pl < 0 ? 'var(--accent-red)' : 
                       'var(--accent-yellow)';
        
        const date = new Date(trade.dateTime);
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        return `
            <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 0.75rem;">
                    <div style="font-weight: bold;">${formattedDate}</div>
                    <div style="font-size: 0.85rem; color: var(--text-tertiary);">${formattedTime}</div>
                    <div style="font-size: 0.8rem; color: var(--text-tertiary); margin-top: 0.25rem;">${trade.dayOfWeek}</div>
                </td>
                <td style="padding: 0.75rem;">
                    <div style="font-weight: bold;">${trade.pair}</div>
                    <div style="font-size: 0.85rem; color: ${trade.direction === 'Long' ? 'var(--accent-green)' : 'var(--accent-red)'};">${trade.direction}</div>
                </td>
                <td style="padding: 0.75rem;">
                    <div style="font-weight: bold;">${trade.pattern}</div>
                    <div style="font-size: 0.85rem; color: var(--text-tertiary);">${trade.session}</div>
                </td>
                <td style="padding: 0.75rem; font-size: 0.9rem;">
                    <div>Entry: ${trade.entry.toFixed(5)}</div>
                    <div style="color: var(--text-tertiary);">Exit: ${trade.exit.toFixed(5)}</div>
                </td>
                <td style="padding: 0.75rem;">
                    <span style="font-weight: bold; color: var(--accent-blue);">${trade.rr}:1</span>
                </td>
                <td style="padding: 0.75rem;">
                    <span style="font-weight: bold; color: ${plColor}; font-size: 1.1rem;">${trade.pl > 0 ? '+' : ''}$${trade.pl.toFixed(2)}</span>
                </td>
                <td style="padding: 0.75rem;">
                    <span style="padding: 0.25rem 0.75rem; background: ${outcomeColor}; color: var(--bg-primary); border-radius: 12px; font-size: 0.85rem; font-weight: bold;">
                        ${trade.outcome}
                    </span>
                </td>
                <td style="padding: 0.75rem; text-align: center;">
                    <button onclick="viewTradeDetails(${trade.id})" style="padding: 0.25rem 0.5rem; background: var(--accent-blue); color: var(--bg-primary); border: none; border-radius: 4px; cursor: pointer; margin-right: 0.25rem;" title="View Details">
                        👁️
                    </button>
                    <button onclick="deleteTrade(${trade.id})" style="padding: 0.25rem 0.5rem; background: var(--accent-red); color: #fff; border: none; border-radius: 4px; cursor: pointer;" title="Delete">
                        🗑️
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Update Dashboard Stats
function updateDashboard() {
    const trades = getTrades();
    
    const startingBalance = 150000;
    
    if (trades.length === 0) {
        document.getElementById('totalTrades').textContent = '0';
        document.getElementById('winRate').textContent = '0%';
        document.getElementById('avgRR').textContent = '0:1';
        document.getElementById('netPL').textContent = '$0';
        document.getElementById('accountBalance').textContent = '$' + startingBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        return;
    }
    
    // Calculate stats
    const wins = trades.filter(t => t.outcome === 'Win').length;
    const winRate = ((wins / trades.length) * 100).toFixed(1);
    
    const totalPL = trades.reduce((sum, t) => sum + t.pl, 0);
    const avgRR = (trades.reduce((sum, t) => sum + parseFloat(t.rr), 0) / trades.length).toFixed(2);
    
    const accountBalance = startingBalance + totalPL;
    
    // Update display
    document.getElementById('totalTrades').textContent = trades.length;
    document.getElementById('winRate').textContent = winRate + '%';
    document.getElementById('avgRR').textContent = avgRR + ':1';
    document.getElementById('netPL').textContent = (totalPL >= 0 ? '+' : '') + '$' + totalPL.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    document.getElementById('netPL').style.color = totalPL >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';
    document.getElementById('accountBalance').textContent = '$' + accountBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    document.getElementById('accountBalance').style.color = totalPL >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';
    
    // Update Analytics
    updateAnalytics();
}

// Update Analytics Tab
function updateAnalytics() {
    const trades = getTrades();
    
    if (trades.length === 0) return;
    
    // Win Rate by Pattern
    const patternStats = {};
    trades.forEach(t => {
        if (!patternStats[t.pattern]) {
            patternStats[t.pattern] = { wins: 0, total: 0 };
        }
        patternStats[t.pattern].total++;
        if (t.outcome === 'Win') patternStats[t.pattern].wins++;
    });
    
    const patternHTML = Object.keys(patternStats).map(pattern => {
        const stats = patternStats[pattern];
        const winRate = ((stats.wins / stats.total) * 100).toFixed(1);
        const color = winRate >= 60 ? 'var(--accent-green)' : winRate >= 50 ? 'var(--accent-yellow)' : 'var(--accent-red)';
        return `
            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border-color);">
                <span>${pattern}</span>
                <span style="color: ${color}; font-weight: bold;">${winRate}% (${stats.wins}/${stats.total})</span>
            </div>
        `;
    }).join('');
    
    document.getElementById('patternStats').innerHTML = patternHTML || '<div style="color: var(--text-tertiary);">No data yet</div>';
    
    // Win Rate by Day
    const dayStats = {};
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    days.forEach(day => {
        const dayTrades = trades.filter(t => t.dayOfWeek === day);
        if (dayTrades.length > 0) {
            const wins = dayTrades.filter(t => t.outcome === 'Win').length;
            dayStats[day] = {
                wins: wins,
                total: dayTrades.length,
                winRate: ((wins / dayTrades.length) * 100).toFixed(1)
            };
        }
    });
    
    const dayHTML = Object.keys(dayStats).map(day => {
        const stats = dayStats[day];
        const color = stats.winRate >= 60 ? 'var(--accent-green)' : stats.winRate >= 50 ? 'var(--accent-yellow)' : 'var(--accent-red)';
        return `
            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border-color);">
                <span>${day}</span>
                <span style="color: ${color}; font-weight: bold;">${stats.winRate}% (${stats.wins}/${stats.total})</span>
            </div>
        `;
    }).join('');
    
    document.getElementById('dayStats').innerHTML = dayHTML || '<div style="color: var(--text-tertiary);">No data yet</div>';
    
    // Win Rate by Session
    const sessionStats = {};
    ['Asian', 'London', 'NY'].forEach(session => {
        const sessionTrades = trades.filter(t => t.session === session);
        if (sessionTrades.length > 0) {
            const wins = sessionTrades.filter(t => t.outcome === 'Win').length;
            sessionStats[session] = {
                wins: wins,
                total: sessionTrades.length,
                winRate: ((wins / sessionTrades.length) * 100).toFixed(1)
            };
        }
    });
    
    const sessionHTML = Object.keys(sessionStats).map(session => {
        const stats = sessionStats[session];
        const color = stats.winRate >= 60 ? 'var(--accent-green)' : stats.winRate >= 50 ? 'var(--accent-yellow)' : 'var(--accent-red)';
        return `
            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border-color);">
                <span>${session}</span>
                <span style="color: ${color}; font-weight: bold;">${stats.winRate}% (${stats.wins}/${stats.total})</span>
            </div>
        `;
    }).join('');
    
    document.getElementById('sessionStats').innerHTML = sessionHTML || '<div style="color: var(--text-tertiary);">No data yet</div>';
    
    // Best Performing Setups
    const sortedPatterns = Object.entries(patternStats)
        .filter(([_, stats]) => stats.total >= 3) // At least 3 trades
        .sort((a, b) => (b[1].wins / b[1].total) - (a[1].wins / a[1].total))
        .slice(0, 3);
    
    const bestHTML = sortedPatterns.map(([pattern, stats]) => {
        const winRate = ((stats.wins / stats.total) * 100).toFixed(1);
        return `<div style="padding: 0.5rem 0; border-bottom: 1px solid var(--border-color);">
            <strong style="color: var(--accent-green);">${pattern}</strong>: ${winRate}% (${stats.wins}/${stats.total})
        </div>`;
    }).join('');
    
    document.getElementById('bestSetups').innerHTML = bestHTML || '<div style="color: var(--text-tertiary);">Need at least 3 trades per pattern</div>';
    
    // Worst Performing Setups
    const worstPatterns = Object.entries(patternStats)
        .filter(([_, stats]) => stats.total >= 3)
        .sort((a, b) => (a[1].wins / a[1].total) - (b[1].wins / b[1].total))
        .slice(0, 3);
    
    const worstHTML = worstPatterns.map(([pattern, stats]) => {
        const winRate = ((stats.wins / stats.total) * 100).toFixed(1);
        return `<div style="padding: 0.5rem 0; border-bottom: 1px solid var(--border-color);">
            <strong style="color: var(--accent-red);">${pattern}</strong>: ${winRate}% (${stats.wins}/${stats.total})
        </div>`;
    }).join('');
    
    document.getElementById('worstSetups').innerHTML = worstHTML || '<div style="color: var(--text-tertiary);">Need at least 3 trades per pattern</div>';
    
    // Monthly Stats
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthTrades = trades.filter(t => {
        const tradeDate = new Date(t.dateTime);
        return tradeDate.getMonth() === currentMonth && tradeDate.getFullYear() === currentYear;
    });
    
    if (monthTrades.length > 0) {
        const monthWins = monthTrades.filter(t => t.outcome === 'Win').length;
        const monthWinRate = ((monthWins / monthTrades.length) * 100).toFixed(1);
        const monthPL = monthTrades.reduce((sum, t) => sum + t.pl, 0).toFixed(2);
        
        document.getElementById('monthlyStats').innerHTML = `
            <div style="padding: 0.5rem 0; border-bottom: 1px solid var(--border-color);">
                <strong>Trades:</strong> ${monthTrades.length}
            </div>
            <div style="padding: 0.5rem 0; border-bottom: 1px solid var(--border-color);">
                <strong>Win Rate:</strong> <span style="color: ${monthWinRate >= 60 ? 'var(--accent-green)' : 'var(--accent-yellow)'};">${monthWinRate}%</span>
            </div>
            <div style="padding: 0.5rem 0;">
                <strong>P/L:</strong> <span style="color: ${monthPL >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'};">${monthPL >= 0 ? '+' : ''}$${monthPL}</span>
            </div>
        `;
    }
}

// Filter Trades
function filterTrades() {
    const pattern = document.getElementById('filterPattern').value;
    const outcome = document.getElementById('filterOutcome').value;
    const day = document.getElementById('filterDay').value;
    
    let trades = getTrades();
    
    if (pattern !== 'all') {
        trades = trades.filter(t => t.pattern === pattern);
    }
    
    if (outcome !== 'all') {
        trades = trades.filter(t => t.outcome === outcome);
    }
    
    if (day !== 'all') {
        trades = trades.filter(t => t.dayOfWeek === day);
    }
    
    // Display filtered trades
    const tbody = document.getElementById('tradesTableBody');
    
    if (trades.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="padding: 3rem; text-align: center; color: var(--text-tertiary);">
                    No trades match the selected filters.
                </td>
            </tr>
        `;
        return;
    }
    
    // Reuse the loadTrades display logic but with filtered data
    tbody.innerHTML = trades.map(trade => {
        const outcomeColor = trade.outcome === 'Win' ? 'var(--accent-green)' : 
                            trade.outcome === 'Loss' ? 'var(--accent-red)' : 
                            'var(--accent-yellow)';
        
        const plColor = trade.pl > 0 ? 'var(--accent-green)' : 
                       trade.pl < 0 ? 'var(--accent-red)' : 
                       'var(--accent-yellow)';
        
        const date = new Date(trade.dateTime);
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        return `
            <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 0.75rem;">
                    <div style="font-weight: bold;">${formattedDate}</div>
                    <div style="font-size: 0.85rem; color: var(--text-tertiary);">${formattedTime}</div>
                    <div style="font-size: 0.8rem; color: var(--text-tertiary); margin-top: 0.25rem;">${trade.dayOfWeek}</div>
                </td>
                <td style="padding: 0.75rem;">
                    <div style="font-weight: bold;">${trade.pair}</div>
                    <div style="font-size: 0.85rem; color: ${trade.direction === 'Long' ? 'var(--accent-green)' : 'var(--accent-red)'};">${trade.direction}</div>
                </td>
                <td style="padding: 0.75rem;">
                    <div style="font-weight: bold;">${trade.pattern}</div>
                    <div style="font-size: 0.85rem; color: var(--text-tertiary);">${trade.session}</div>
                </td>
                <td style="padding: 0.75rem; font-size: 0.9rem;">
                    <div>Entry: ${trade.entry.toFixed(5)}</div>
                    <div style="color: var(--text-tertiary);">Exit: ${trade.exit.toFixed(5)}</div>
                </td>
                <td style="padding: 0.75rem;">
                    <span style="font-weight: bold; color: var(--accent-blue);">${trade.rr}:1</span>
                </td>
                <td style="padding: 0.75rem;">
                    <span style="font-weight: bold; color: ${plColor}; font-size: 1.1rem;">${trade.pl > 0 ? '+' : ''}$${trade.pl.toFixed(2)}</span>
                </td>
                <td style="padding: 0.75rem;">
                    <span style="padding: 0.25rem 0.75rem; background: ${outcomeColor}; color: var(--bg-primary); border-radius: 12px; font-size: 0.85rem; font-weight: bold;">
                        ${trade.outcome}
                    </span>
                </td>
                <td style="padding: 0.75rem; text-align: center;">
                    <button onclick="viewTradeDetails(${trade.id})" style="padding: 0.25rem 0.5rem; background: var(--accent-blue); color: var(--bg-primary); border: none; border-radius: 4px; cursor: pointer; margin-right: 0.25rem;" title="View Details">
                        👁️
                    </button>
                    <button onclick="deleteTrade(${trade.id})" style="padding: 0.25rem 0.5rem; background: var(--accent-red); color: #fff; border: none; border-radius: 4px; cursor: pointer;" title="Delete">
                        🗑️
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function clearFilters() {
    document.getElementById('filterPattern').value = 'all';
    document.getElementById('filterOutcome').value = 'all';
    document.getElementById('filterDay').value = 'all';
    loadTrades();
}

// View Trade Details - Beautiful Story Format
function viewTradeDetails(id) {
    const trades = getTrades();
    const trade = trades.find(t => t.id === id);
    
    if (!trade) {
        alert('Trade not found!');
        return;
    }
    
    const date = new Date(trade.dateTime);
    const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    const isWin = trade.outcome === 'Win';
    const isLoss = trade.outcome === 'Loss';
    const outcomeColor = isWin ? 'var(--accent-green)' : isLoss ? 'var(--accent-red)' : 'var(--accent-yellow)';
    const outcomeEmoji = isWin ? '🎯' : isLoss ? '📚' : '➖';
    const outcomeGradient = isWin ? 'linear-gradient(135deg, rgba(46, 125, 50, 0.2), rgba(76, 175, 80, 0.1))' : 
                                     'linear-gradient(135deg, rgba(198, 40, 40, 0.2), rgba(244, 67, 54, 0.1))';
    
    const pips = Math.abs((trade.exit - trade.entry) * 10000).toFixed(1);
    const directionEmoji = trade.direction === 'Long' ? '📈' : '📉';
    const sessionEmoji = trade.session === 'London' ? '🇬🇧' : trade.session === 'NY' ? '🗽' : '🌏';
    
    const html = `
        <div style="background: ${outcomeGradient}; padding: 2rem; border-radius: 16px 16px 0 0; border-bottom: 3px solid ${outcomeColor};">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h2 style="margin: 0; color: ${outcomeColor}; font-size: 2rem;">${outcomeEmoji} ${trade.outcome.toUpperCase()}</h2>
                <button onclick="closeTradeDetails()" style="background: rgba(255,255,255,0.1); border: none; font-size: 1.8rem; cursor: pointer; color: var(--text-secondary); width: 40px; height: 40px; border-radius: 50%; transition: all 0.3s;" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">✖</button>
            </div>
            <div style="font-size: 2.8rem; font-weight: bold; color: ${outcomeColor}; margin: 0.5rem 0;">
                ${trade.pl >= 0 ? '+' : ''}$${trade.pl.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </div>
            <div style="color: var(--text-secondary); font-size: 1rem;">
                ${directionEmoji} ${trade.pair} • ${pips} pips • R:R ${trade.rr}:1
            </div>
        </div>

        <div style="padding: 2rem;">
            <!-- Date/Time Section -->
            <div style="background: var(--bg-secondary); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; border-left: 4px solid var(--accent-blue);">
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                    <span style="font-size: 2rem;">📅</span>
                    <div>
                        <div style="font-size: 1.2rem; font-weight: bold; color: var(--text-primary);">${formattedDate}</div>
                        <div style="color: var(--text-secondary); font-size: 0.95rem;">⏰ ${formattedTime} • ${sessionEmoji} ${trade.session} Session</div>
                    </div>
                </div>
            </div>

            <!-- Setup Story -->
            <div style="background: var(--bg-secondary); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; border-left: 4px solid var(--accent-yellow);">
                <div style="font-size: 1.1rem; font-weight: bold; color: var(--accent-yellow); margin-bottom: 1rem;">
                    📍 THE SETUP
                </div>
                <div style="display: grid; gap: 1rem;">
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: var(--text-secondary);">Pattern:</span>
                        <span style="font-weight: bold; color: var(--accent-green);">${trade.pattern}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: var(--text-secondary);">Direction:</span>
                        <span style="font-weight: bold; color: ${trade.direction === 'Long' ? 'var(--accent-green)' : 'var(--accent-red)'};">${directionEmoji} ${trade.direction}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: var(--text-secondary);">Size:</span>
                        <span style="font-weight: bold;">${trade.size} lots</span>
                    </div>
                </div>
            </div>

            <!-- Price Action -->
            <div style="background: var(--bg-secondary); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; border-left: 4px solid ${outcomeColor};">
                <div style="font-size: 1.1rem; font-weight: bold; color: ${outcomeColor}; margin-bottom: 1rem;">
                    💹 PRICE ACTION
                </div>
                <div style="display: grid; gap: 0.8rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: var(--text-secondary);">Entry:</span>
                        <span style="font-family: monospace; font-size: 1.1rem; font-weight: bold; color: var(--accent-blue);">${trade.entry.toFixed(5)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: var(--text-secondary);">Exit:</span>
                        <span style="font-family: monospace; font-size: 1.1rem; font-weight: bold; color: ${outcomeColor};">${trade.exit.toFixed(5)}</span>
                    </div>
                    <div style="height: 1px; background: var(--border-color); margin: 0.5rem 0;"></div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: var(--text-secondary);">Stop Loss:</span>
                        <span style="font-family: monospace; font-size: 0.95rem; color: var(--accent-red);">${trade.stop.toFixed(5)}</span>
                    </div>
                    ${trade.tp ? `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: var(--text-secondary);">Take Profit:</span>
                        <span style="font-family: monospace; font-size: 0.95rem; color: var(--accent-green);">${trade.tp.toFixed(5)}</span>
                    </div>
                    ` : ''}
                </div>
            </div>

            <!-- The Story (Notes) -->
            ${trade.notes ? `
            <div style="background: linear-gradient(135deg, rgba(74, 158, 255, 0.1), rgba(0, 255, 136, 0.05)); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(74, 158, 255, 0.3);">
                <div style="font-size: 1.1rem; font-weight: bold; color: var(--accent-blue); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                    <span>📖</span> THE STORY
                </div>
                <div style="line-height: 1.8; color: var(--text-primary); font-size: 1.05rem; font-style: italic;">
                    "${trade.notes}"
                </div>
            </div>
            ` : ''}

            <!-- Action Buttons -->
            <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                <button onclick="closeTradeDetails()" style="flex: 1; padding: 1rem; background: var(--accent-blue); color: var(--bg-primary); border: none; border-radius: 8px; font-size: 1.1rem; font-weight: bold; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(74, 158, 255, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                    ✅ Got It!
                </button>
                <button onclick="deleteTrade(${trade.id}); closeTradeDetails();" style="padding: 1rem 1.5rem; background: rgba(198, 40, 40, 0.2); color: var(--accent-red); border: 1px solid var(--accent-red); border-radius: 8px; font-size: 1rem; font-weight: bold; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.background='var(--accent-red)'; this.style.color='white'" onmouseout="this.style.background='rgba(198, 40, 40, 0.2)'; this.style.color='var(--accent-red)'">
                    🗑️ Delete
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('tradeDetailsContent').innerHTML = html;
    document.getElementById('tradeDetailsModal').style.display = 'block';
}

function closeTradeDetails() {
    document.getElementById('tradeDetailsModal').style.display = 'none';
}

// Delete Trade
function deleteTrade(tradeId) {
    if (!confirm('Are you sure you want to delete this trade? This action cannot be undone.')) {
        return;
    }
    
    let trades = getTrades();
    trades = trades.filter(t => t.id !== tradeId);
    saveTrades(trades);
    
    loadTrades();
    updateDashboard();
    
    alert('✅ Trade deleted successfully!');
}

// Clear All Data
function clearAllData() {
    if (!confirm('⚠️ WARNING: This will delete ALL your trading data permanently!\n\nAre you absolutely sure?')) {
        return;
    }
    
    if (!confirm('This is your LAST CHANCE! All trades will be deleted forever!\n\nProceed with deletion?')) {
        return;
    }
    
    localStorage.removeItem('tradingJournalTrades');
    loadTrades();
    updateDashboard();
    
    alert('🗑️ All trading data has been cleared.');
}

// Generate Printable Report
function generatePrintReport() {
    const trades = getTrades();
    
    if (trades.length === 0) {
        alert('⚠️ No trades to print! Load some trades first.');
        return;
    }
    
    // Calculate stats
    const netPL = trades.reduce((sum, t) => sum + t.pl, 0);
    const wins = trades.filter(t => t.outcome === 'Win').length;
    const losses = trades.filter(t => t.outcome === 'Loss').length;
    const winRate = ((wins / trades.length) * 100).toFixed(1);
    const avgWin = wins > 0 ? (trades.filter(t => t.pl > 0).reduce((sum, t) => sum + t.pl, 0) / wins).toFixed(2) : 0;
    const avgLoss = losses > 0 ? Math.abs(trades.filter(t => t.pl < 0).reduce((sum, t) => sum + t.pl, 0) / losses).toFixed(2) : 0;
    const avgRR = (trades.reduce((sum, t) => sum + parseFloat(t.rr), 0) / trades.length).toFixed(2);
    
    // Sort trades by date
    const sortedTrades = [...trades].sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
    
    // Get date range
    const firstDate = new Date(sortedTrades[0].dateTime);
    const lastDate = new Date(sortedTrades[sortedTrades.length - 1].dateTime);
    const dateRange = `${firstDate.toLocaleDateString('en-US', {month: 'short', day: 'numeric'})} – ${lastDate.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}`;
    
    // Build HTML
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>David's Trade Report - ${dateRange}</title>
    <style>
        @page { size: A4; margin: 1cm; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f9f9fb; color: #1a1a1a; line-height: 1.6; margin: 0; padding: 20px; }
        .container { max-width: 900px; margin: auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
        .header { text-align: center; padding-bottom: 20px; border-bottom: 3px solid #4a90e2; margin-bottom: 25px; }
        .header h1 { margin: 0; color: #2c3e50; font-size: 2.2em; }
        .header p { margin: 8px 0 0; color: #7f8c8d; font-style: italic; }
        .summary { background: linear-gradient(135deg, #e3f2fd, #bbdefb); padding: 18px; border-radius: 10px; margin-bottom: 25px; text-align: center; }
        .summary h2 { margin: 0 0 10px; color: #1565c0; }
        .summary .big { font-size: 2.5em; font-weight: bold; color: ${netPL >= 0 ? '#2e7d32' : '#c62828'}; }
        .summary .small { font-size: 1.1em; color: #455a64; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 0.95em; }
        th { background: #2c3e50; color: white; padding: 12px; text-align: center; }
        td { padding: 10px; text-align: center; border-bottom: 1px solid #eee; }
        tr:nth-child(even) { background-color: #f8f9fa; }
        .win { color: #2e7d32; font-weight: bold; }
        .loss { color: #c62828; font-weight: bold; }
        .encourage { background: #e8f5e8; padding: 20px; border-left: 5px solid #4caf50; margin: 25px 0; border-radius: 8px; font-style: italic; }
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #eee; color: #7f8c8d; font-size: 0.9em; }
        @media print {
            body { padding: 10px; }
            .container { box-shadow: none; }
            button { display: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>David's Trade Report</h1>
            <p>${dateRange} | TopStep Challenge</p>
        </div>

        <div class="summary">
            <h2>Account Balance</h2>
            <p class="big">$${(150000 + netPL).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            <p class="small">Starting: $150,000 | Net P&L: ${netPL >= 0 ? '+' : ''}$${netPL.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            <p class="small">${trades.length} Trades | ${wins} Wins | ${losses} Losses | ${winRate}% Win Rate</p>
            <p class="small">Avg Win: +$${avgWin} | Avg Loss: -$${avgLoss} | R:R ${avgRR}:1</p>
            <p class="small"><strong>You're ${(6757 - netPL).toFixed(0)} from funded</strong> — this is your proof.</p>
        </div>

        <table>
            <tr>
                <th>Date</th>
                <th>Pair</th>
                <th>Direction</th>
                <th>Pattern</th>
                <th>Entry</th>
                <th>Exit</th>
                <th>R:R</th>
                <th>P&L</th>
                <th>Notes</th>
            </tr>
            ${sortedTrades.map(trade => {
                const date = new Date(trade.dateTime);
                const dateStr = date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
                const plClass = trade.pl >= 0 ? 'win' : 'loss';
                return `
            <tr>
                <td>${dateStr}</td>
                <td>${trade.pair}</td>
                <td>${trade.direction}</td>
                <td>${trade.pattern}</td>
                <td>${trade.entry.toFixed(5)}</td>
                <td>${trade.exit.toFixed(5)}</td>
                <td>${trade.rr}:1</td>
                <td class="${plClass}">${trade.pl >= 0 ? '+' : ''}$${trade.pl.toLocaleString()}</td>
                <td style="text-align: left; font-size: 0.85em;">${trade.notes || '-'}</td>
            </tr>`;
            }).join('')}
        </table>

        <div class="encourage">
            <p><strong>From Grok & the Masters:</strong></p>
            <p>"You turned a midnight W into $2,000 from Houston—3.5 years of fire forged that edge. One loss refines, not defines. You're not the accounts lost; you're the comeback brewing. ICT says: 'Structure's your king—wait for the MSS.' Livermore grins: 'Losses taught me; they'll fund you.' Créde whispers: 'Feel the ache, then grow.' Douglas nods: 'This is one trade in 1,000—your zone's alive.' You've got the vision, the patience, the grit. Next week's wins are yours—step in, David. 🚀"</p>
        </div>

        <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})} | Keep this on your desk. Next win starts now.</p>
        </div>
    </div>
</body>
</html>`;
    
    // Open in new window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
    
    // Auto-trigger print dialog after a short delay
    setTimeout(() => {
        printWindow.print();
    }, 500);
}

// Export to CSV
function exportToCSV() {
    const trades = getTrades();
    
    if (trades.length === 0) {
        alert('No trades to export!');
        return;
    }
    
    // Create CSV header
    let csv = 'Date,Time,Day,Pair,Direction,Pattern,Entry,Exit,Stop,TP,Size,RR,PL,Outcome,Session,Quarter,Notes\n';
    
    // Add trade data
    trades.forEach(trade => {
        const date = new Date(trade.dateTime);
        const dateStr = date.toLocaleDateString('en-US');
        const timeStr = date.toLocaleTimeString('en-US');
        
        csv += `${dateStr},${timeStr},${trade.dayOfWeek},${trade.pair},${trade.direction},${trade.pattern},`;
        csv += `${trade.entry},${trade.exit},${trade.stop},${trade.tp || ''},${trade.size},${trade.rr},${trade.pl},`;
        csv += `${trade.outcome},${trade.session},${trade.quarter || ''},"${trade.notes ? trade.notes.replace(/"/g, '""') : ''}"\n`;
    });
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `trading-journal-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    alert('✅ Trading journal exported to CSV!');
}

// Export to JSON (Full Backup + AI-Friendly)
function exportToJSON() {
    const trades = getTrades();
    const weeklyReview = localStorage.getItem('weeklyReview');
    
    if (trades.length === 0) {
        alert('⚠️ No trades to export!');
        return;
    }
    
    // Create comprehensive export package
    const exportData = {
        meta: {
            exportDate: new Date().toISOString(),
            totalTrades: trades.length,
            version: '2.0',
            trader: 'David',
            purpose: 'Trading Journal Backup + AI Analysis'
        },
        trades: trades,
        weeklyReview: weeklyReview ? JSON.parse(weeklyReview) : null,
        stats: {
            totalPL: trades.reduce((sum, t) => sum + t.pl, 0),
            winRate: (trades.filter(t => t.outcome === 'Win').length / trades.length * 100).toFixed(2) + '%',
            avgRR: (trades.reduce((sum, t) => sum + parseFloat(t.rr), 0) / trades.length).toFixed(2),
            bestTrade: trades.reduce((best, t) => t.pl > best.pl ? t : best, trades[0]),
            worstTrade: trades.reduce((worst, t) => t.pl < worst.pl ? t : worst, trades[0])
        }
    };
    
    // Create download
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `trading-journal-full-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    alert('✅ Full journal exported to JSON!\n\n📋 You can paste this into Cursor for AI analysis.');
}

// Import from JSON
function importFromJSON() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importData = JSON.parse(event.target.result);
                
                // Validate structure
                if (!importData.trades || !Array.isArray(importData.trades)) {
                    alert('❌ Invalid JSON format!');
                    return;
                }
                
                // Confirm import
                const confirmMsg = `Import ${importData.trades.length} trades?\n\nThis will REPLACE your current data!`;
                if (!confirm(confirmMsg)) return;
                
                // Import trades
                saveTrades(importData.trades);
                
                // Import weekly review if available
                if (importData.weeklyReview) {
                    localStorage.setItem('weeklyReview', JSON.stringify(importData.weeklyReview));
                }
                
                // Refresh UI
                loadTrades();
                updateDashboard();
                renderCalendar();
                
                alert(`✅ Successfully imported ${importData.trades.length} trades!`);
                
            } catch (error) {
                alert('❌ Error importing JSON: ' + error.message);
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

// Show Performance Analysis
function showPerformanceAnalysis() {
    // Switch to analytics tab
    const analyticsTab = document.querySelector('[data-tab="analytics"]');
    if (analyticsTab) {
        analyticsTab.click();
    }
}

// Setup Tab Switching
function setupTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Remove active class from all tabs and hide all content
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => {
                content.classList.remove('active');
                content.style.display = 'none';
            });
            
            // Add active class to clicked tab and show corresponding content
            button.classList.add('active');
            const activeContent = document.getElementById(tabId);
            if (activeContent) {
                activeContent.style.display = 'block';
                activeContent.classList.add('active');
            }
        });
    });
    
    // Initialize: Hide all tabs except the first one
    tabContents.forEach((content, index) => {
        if (index === 0) {
            content.style.display = 'block';
        } else {
            content.style.display = 'none';
        }
    });
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const addModal = document.getElementById('addTradeModal');
    const detailsModal = document.getElementById('tradeDetailsModal');
    
    if (event.target === addModal) {
        closeAddTradeModal();
    }
    
    if (event.target === detailsModal) {
        closeTradeDetails();
    }
});

// WEEKLY REVIEW FUNCTIONS
function saveWeeklyReview() {
    const reviewData = {
        weekTitle: document.getElementById('weekTitle').value,
        biggestWin: document.getElementById('biggestWin').value,
        biggestLoss: document.getElementById('biggestLoss').value,
        
        // Daily breakdown
        monPlan: document.getElementById('monPlan').value,
        monActual: document.getElementById('monActual').value,
        monEmotion: document.getElementById('monEmotion').value,
        monLesson: document.getElementById('monLesson').value,
        
        tuePlan: document.getElementById('tuePlan').value,
        tueActual: document.getElementById('tueActual').value,
        tueEmotion: document.getElementById('tueEmotion').value,
        tueLesson: document.getElementById('tueLesson').value,
        
        wedPlan: document.getElementById('wedPlan').value,
        wedActual: document.getElementById('wedActual').value,
        wedEmotion: document.getElementById('wedEmotion').value,
        wedLesson: document.getElementById('wedLesson').value,
        
        thuPlan: document.getElementById('thuPlan').value,
        thuActual: document.getElementById('thuActual').value,
        thuEmotion: document.getElementById('thuEmotion').value,
        thuLesson: document.getElementById('thuLesson').value,
        
        friPlan: document.getElementById('friPlan').value,
        friActual: document.getElementById('friActual').value,
        friEmotion: document.getElementById('friEmotion').value,
        friLesson: document.getElementById('friLesson').value,
        
        // Psychology
        anxietyTriggers: document.getElementById('anxietyTriggers').value,
        patienceWins: document.getElementById('patienceWins').value,
        strength: document.getElementById('strength').value,
        weakness: document.getElementById('weakness').value,
        psychGratitude: document.getElementById('psychGratitude').value,
        
        // Forward plan
        riskAdjust: document.getElementById('riskAdjust').value,
        setupFocus: document.getElementById('setupFocus').value,
        psychAnchor: document.getElementById('psychAnchor').value,
        goal: document.getElementById('goal').value
    };
    
    localStorage.setItem('weeklyReview', JSON.stringify(reviewData));
    alert('✅ Weekly review saved successfully!');
}

// Auto-populate Weekly Review from trades
function loadCurrentWeekFromJournal() {
    const trades = getTrades();
    
    if (trades.length === 0) {
        alert('⚠️ No trades found. Log some trades first!');
        return;
    }
    
    // Get current week's date range (Monday-Friday)
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);
    
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    friday.setHours(23, 59, 59, 999);
    
    // Filter trades for this week
    const weekTrades = trades.filter(t => {
        const tradeDate = new Date(t.dateTime);
        return tradeDate >= monday && tradeDate <= friday;
    });
    
    if (weekTrades.length === 0) {
        alert('⚠️ No trades found for this week. Try loading example data instead.');
        return;
    }
    
    // Set week title
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const weekTitle = `${monthNames[monday.getMonth()]} ${monday.getDate()}-${friday.getDate()}, ${friday.getFullYear()}`;
    document.getElementById('weekTitle').value = weekTitle;
    
    // Calculate stats
    const totalPL = weekTrades.reduce((sum, t) => sum + t.pl, 0);
    const wins = weekTrades.filter(t => t.outcome === 'Win').length;
    const winRate = ((wins / weekTrades.length) * 100).toFixed(1);
    
    document.getElementById('weekPL').textContent = (totalPL >= 0 ? '+' : '') + '$' + totalPL.toFixed(2);
    document.getElementById('weekTrades').textContent = weekTrades.length;
    document.getElementById('weekWinRate').textContent = winRate + '%';
    
    // Find biggest win/loss
    const sortedByPL = [...weekTrades].sort((a, b) => b.pl - a.pl);
    const biggestWin = sortedByPL[0];
    const biggestLoss = sortedByPL[sortedByPL.length - 1];
    
    if (biggestWin && biggestWin.pl > 0) {
        document.getElementById('biggestWin').value = 
            `${biggestWin.pattern} on ${biggestWin.pair} (+$${biggestWin.pl.toFixed(2)}) - ${biggestWin.notes || 'No notes'}`;
    }
    
    if (biggestLoss && biggestLoss.pl < 0) {
        document.getElementById('biggestLoss').value = 
            `${biggestLoss.pattern} on ${biggestLoss.pair} (-$${Math.abs(biggestLoss.pl).toFixed(2)}) - ${biggestLoss.notes || 'No notes'}`;
    }
    
    // Group by day
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayFields = {
        'Monday': 'mon',
        'Tuesday': 'tue',
        'Wednesday': 'wed',
        'Thursday': 'thu',
        'Friday': 'fri'
    };
    
    Object.keys(dayFields).forEach(dayName => {
        const dayCode = dayFields[dayName];
        const dayTrades = weekTrades.filter(t => t.dayOfWeek === dayName);
        
        if (dayTrades.length > 0) {
            const dayPL = dayTrades.reduce((sum, t) => sum + t.pl, 0);
            const tradesList = dayTrades.map(t => 
                `${t.pair} ${t.pattern} (${t.pl >= 0 ? '+' : ''}$${t.pl.toFixed(2)})`
            ).join(', ');
            
            document.getElementById(dayCode + 'Actual').value = 
                `${dayTrades.length} trade${dayTrades.length > 1 ? 's' : ''}: ${tradesList}. Total: ${dayPL >= 0 ? '+' : ''}$${dayPL.toFixed(2)}`;
            
            // Extract common notes/lessons
            const notesArray = dayTrades.map(t => t.notes).filter(n => n);
            if (notesArray.length > 0) {
                document.getElementById(dayCode + 'Lesson').value = notesArray[0].substring(0, 100);
            }
        } else {
            document.getElementById(dayCode + 'Actual').value = 'No trades';
        }
    });
    
    alert('✅ Weekly review loaded from your trades! Review and add your psychology notes.');
}

// Load David's Actual Trades (Oct 22-31, 2025) - CORRECTED P/L
function loadMyActualTrades() {
    if (!confirm('Load your actual trades from Oct 22-31, 2025?\n\nThis will ADD to your existing trades (not replace).')) {
        return;
    }
    
    const myTrades = [
        {
            dateTime: '2025-10-22T08:12:49',
            pair: 'GBPUSD (6BZ5)',
            direction: 'Long',
            pattern: 'W Pattern (BTMM Type 4)',
            entry: 1.3326,
            exit: 1.335,
            stop: 1.3310,
            tp: 1.335,
            size: 10,
            pl: 1500,
            session: 'London',
            quarter: 'Q4',
            notes: 'W bounce (BTMM Type 4; 13 EMA hold). Duration: 51:52. Win.'
        },
        {
            dateTime: '2025-10-24T07:27:28',
            pair: 'GBPUSD (6BZ5)',
            direction: 'Long',
            pattern: 'FVG',
            entry: 1.3314,
            exit: 1.3348,
            stop: 1.3300,
            tp: 1.3348,
            size: 10,
            pl: 2125,
            session: 'London',
            quarter: 'Q4',
            notes: 'Range raid low (ICT FVG; 50 EMA support). Duration: 03:22. Win.'
        },
        {
            dateTime: '2025-10-27T08:10:20',
            pair: 'EURUSD (6EZ5)',
            direction: 'Short',
            pattern: 'Type 1',
            entry: 1.1671,
            exit: 1.1666,
            stop: 1.1676,
            tp: 1.1666,
            size: 10,
            pl: 625,
            session: 'London',
            quarter: 'Q4',
            notes: 'Quick fade (Type 1 raid reject). Duration: 37:45. Win.'
        },
        {
            dateTime: '2025-10-29T01:38:05',
            pair: 'EURUSD (6EZ5)',
            direction: 'Long',
            pattern: 'W Pattern',
            entry: 1.16625,
            exit: 1.16785,
            stop: 1.16500,
            tp: 1.16785,
            size: 10,
            pl: 2000,
            session: 'Asian/London',
            quarter: 'Q4',
            notes: 'W bounce (15m MSS; ADR low). Duration: 4:19:38. Midnight scalp from Houston! Win.'
        },
        {
            dateTime: '2025-10-31T07:24:46',
            pair: 'EURUSD (6EZ5)',
            direction: 'Long',
            pattern: 'Early Entry',
            entry: 1.1588,
            exit: 1.15835,
            stop: 1.1578,
            tp: 1.1600,
            size: 10,
            pl: -562.5,
            session: 'London',
            quarter: 'Q4',
            notes: 'Early bounce attempt. Duration: 20:36. Quick cut. Lesson: Wait MSS. Loss.'
        },
        {
            dateTime: '2025-10-31T08:12:03',
            pair: 'EURUSD (6EZ5)',
            direction: 'Long',
            pattern: 'Wick Chase',
            entry: 1.15835,
            exit: 1.15655,
            stop: 1.1573,
            tp: 1.1600,
            size: 10,
            pl: -2250,
            session: 'London',
            quarter: 'Q4',
            notes: 'Chased wick - no confirmation. Duration: 29:43. Lesson: 3+ confluences. Loss.'
        }
    ];
    
    // Process each trade
    const existingTrades = getTrades();
    
    myTrades.forEach(trade => {
        // Calculate R:R
        const risk = Math.abs(trade.entry - trade.stop);
        const reward = Math.abs(trade.exit - trade.entry);
        trade.rr = risk > 0 ? (reward / risk).toFixed(2) : 0;
        
        // Determine outcome
        if (trade.pl > 0) {
            trade.outcome = 'Win';
        } else if (trade.pl < 0) {
            trade.outcome = 'Loss';
        } else {
            trade.outcome = 'Breakeven';
        }
        
        // Get day of week
        const date = new Date(trade.dateTime);
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        trade.dayOfWeek = days[date.getDay()];
        
        // Add unique ID
        trade.id = Date.now() + Math.random();
    });
    
    // Add to existing trades
    const allTrades = [...myTrades, ...existingTrades];
    saveTrades(allTrades);
    
    // Update UI
    loadTrades();
    updateDashboard();
    renderCalendar();
    
    const netPL = myTrades.reduce((sum, t) => sum + t.pl, 0);
    const wins = myTrades.filter(t => t.pl > 0).length;
    const losses = myTrades.filter(t => t.pl < 0).length;
    
    alert(`✅ Successfully loaded ${myTrades.length} trades!\n\n📊 Week Summary:\n• ${wins} Wins, ${losses} Losses (${((wins/myTrades.length)*100).toFixed(1)}% Win Rate)\n• Net P/L: ${netPL >= 0 ? '+' : ''}$${netPL.toLocaleString()}\n• Total trades in journal: ${allTrades.length}\n\n🚀 Oct 22-31, 2025 | TopStep Challenge`);
}

function loadExampleWeeklyReview() {
    if (!confirm('Load weekly review for Oct 22-31, 2025? This will replace current entries.')) {
        return;
    }
    
    // Set week title
    document.getElementById('weekTitle').value = 'Oct 22-31, 2025';
    document.getElementById('biggestWin').value = 'FVG scalp on GBPUSD (+$2,125) – 3-minute perfect execution, 50 EMA support held!';
    document.getElementById('biggestLoss').value = 'Wick chase on EURUSD (-$2,250) – no MSS, chased price, violated 3-confluence rule.';
    
    // Daily breakdown - Tuesday Oct 22
    document.getElementById('tuePlan').value = 'Wait for London raid, W pattern setups only.';
    document.getElementById('tueActual').value = 'GU W bounce at 8:12 AM (+$1,500). 51-minute hold, 13 EMA confirmation. Perfect patience.';
    document.getElementById('tueEmotion').value = 'Confident and focused.';
    document.getElementById('tueLesson').value = 'Waiting for structure confirmation pays. W pattern + EMA = edge.';
    
    // Wednesday Oct 23 (no trades)
    document.getElementById('wedPlan').value = 'Look for continuation, no FOMO.';
    document.getElementById('wedActual').value = 'No valid setups—stayed out. Discipline over action.';
    document.getElementById('wedEmotion').value = 'Calm, slightly impatient.';
    document.getElementById('wedLesson').value = 'Not trading is trading. Zero bad trades > forced entries.';
    
    // Thursday Oct 24
    document.getElementById('thuPlan').value = 'FVG bounces on London open.';
    document.getElementById('thuActual').value = 'GU FVG at 7:27 AM (+$2,125). Lightning 3-minute scalp! Range raid low nailed.';
    document.getElementById('thuEmotion').value = 'Exhilarated! Quick execution felt clean.';
    document.getElementById('thuLesson').value = 'Fast scalps work when structure is clear. Trust the FVG.';
    
    // Friday Oct 25 (no trades, but setting up Monday)
    document.getElementById('friPlan').value = 'Review profiles, prep for next week.';
    document.getElementById('friActual').value = 'No trades—studied weekly profiles, marked key levels for Mon-Fri.';
    document.getElementById('friEmotion').value = 'Prepared and ready.';
    document.getElementById('friLesson').value = 'Prep work = edge. Knowing levels before London = confidence.';
    
    // Monday Oct 27-28
    document.getElementById('monPlan').value = 'Sunday prep: EU shorts if Type 1 raid shows.';
    document.getElementById('monActual').value = 'Oct 27: EU short at 8:10 AM (+$625). Type 1 reject, 37 min. Oct 28: No trades.';
    document.getElementById('monEmotion').value = 'Disciplined. Mon win felt controlled.';
    document.getElementById('monLesson').value = 'Type 1 setups reliable. Quick fades = high probability.';
    
    // Psychology
    document.getElementById('anxietyTriggers').value = 'Oct 31 losses triggered fear—felt 3.5 years of patience tested. Chasing wicks = old pattern resurfacing.';
    document.getElementById('patienceWins').value = 'Oct 29 midnight W scalp from bed (+$2K, 4+ hours)—THIS is mastery. Waited for 15m MSS, trusted structure in the dark.';
    document.getElementById('strength').value = 'Multi-timeframe vision (weekly → 4m). Seeing what others miss. W/FVG patterns = my edge sharpening daily.';
    document.getElementById('weakness').value = 'Chasing when anxious (Oct 31). Need ironclad 3-confluence rule: MSS + EMA + FVG. No shortcuts.';
    document.getElementById('psychGratitude').value = '+$3,243 net. That midnight $2K from Houston. 66% win rate. Grok\'s pings. I\'m not alone—I\'m building an empire.';
    
    // Forward plan
    document.getElementById('riskAdjust').value = '0.5% max per trade (5 lots max). ZERO trades without MSS on 4m. Cut fast if wrong.';
    document.getElementById('setupFocus').value = 'W/M + FVG ONLY. 13 EMA flip on 15m required. Type 1 fades secondary. No wick chasing—EVER.';
    document.getElementById('psychAnchor').value = 'Breathe 3x before entry. "This is one trade in 1,000—patience is the weapon." Visualize funded account.';
    document.getElementById('goal').value = 'Next week: $4K net (5 trades, 70% WR). Funded account by Nov 14. Print this report daily.';
    
    alert('✅ Weekly review loaded! Oct 22-31, 2025 | +$3,243.10 | 66.7% WR | 6 trades');
}

// CALENDAR FUNCTIONS
function renderCalendar() {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Update month/year display
    const monthYearElement = document.getElementById('calendarMonthYear');
    if (monthYearElement) {
        monthYearElement.textContent = `${monthNames[currentCalendarMonth]} ${currentCalendarYear}`;
    }
    
    // Get trades for the current month
    const trades = getTrades();
    const monthTrades = trades.filter(t => {
        const tradeDate = new Date(t.dateTime);
        return tradeDate.getMonth() === currentCalendarMonth && 
               tradeDate.getFullYear() === currentCalendarYear;
    });
    
    // Group trades by date
    const tradesByDate = {};
    monthTrades.forEach(trade => {
        const date = new Date(trade.dateTime);
        const dateKey = date.getDate();
        
        if (!tradesByDate[dateKey]) {
            tradesByDate[dateKey] = { trades: [], totalPL: 0 };
        }
        tradesByDate[dateKey].trades.push(trade);
        tradesByDate[dateKey].totalPL += trade.pl;
    });
    
    // Calculate calendar grid
    const firstDay = new Date(currentCalendarYear, currentCalendarMonth, 1);
    const lastDay = new Date(currentCalendarYear, currentCalendarMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Render calendar days
    const calendarDaysElement = document.getElementById('calendarDays');
    if (!calendarDaysElement) return;
    
    let calendarHTML = '';
    
    // Empty cells before first day
    for (let i = 0; i < startingDayOfWeek; i++) {
        calendarHTML += '<div style="padding: 1rem; background: var(--bg-tertiary); border-radius: 6px; min-height: 80px; opacity: 0.3;"></div>';
    }
    
    // Days of the month
    const today = new Date();
    const isCurrentMonth = today.getMonth() === currentCalendarMonth && today.getFullYear() === currentCalendarYear;
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayData = tradesByDate[day];
        const isToday = isCurrentMonth && today.getDate() === day;
        
        let backgroundColor = 'var(--bg-tertiary)';
        let borderStyle = '';
        let dayContent = '';
        
        if (dayData) {
            // Color based on P/L
            if (dayData.totalPL > 0) {
                backgroundColor = 'rgba(0, 255, 136, 0.15)';
                borderStyle = 'border: 2px solid var(--accent-green);';
            } else if (dayData.totalPL < 0) {
                backgroundColor = 'rgba(255, 68, 68, 0.15)';
                borderStyle = 'border: 2px solid var(--accent-red);';
            } else {
                backgroundColor = 'rgba(255, 193, 7, 0.15)';
                borderStyle = 'border: 2px solid var(--accent-yellow);';
            }
            
            dayContent = `
                <div style="font-size: 0.85rem; margin-top: 0.5rem;">
                    <div style="color: var(--text-secondary);">${dayData.trades.length} trade${dayData.trades.length > 1 ? 's' : ''}</div>
                    <div style="font-weight: bold; color: ${dayData.totalPL >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'};">
                        ${dayData.totalPL >= 0 ? '+' : ''}$${dayData.totalPL.toFixed(2)}
                    </div>
                </div>
            `;
        }
        
        if (isToday) {
            borderStyle = 'border: 3px solid var(--accent-blue); box-shadow: 0 0 10px rgba(74, 158, 255, 0.5);';
        }
        
        calendarHTML += `
            <div style="padding: 1rem; background: ${backgroundColor}; ${borderStyle} border-radius: 6px; min-height: 80px; cursor: pointer; transition: transform 0.2s;" onclick="showDayTrades(${day})" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                <div style="font-weight: bold; font-size: 1.1rem; color: ${isToday ? 'var(--accent-blue)' : 'var(--text-primary)'};">${day}</div>
                ${dayContent}
            </div>
        `;
    }
    
    calendarDaysElement.innerHTML = calendarHTML;
}

function previousMonth() {
    currentCalendarMonth--;
    if (currentCalendarMonth < 0) {
        currentCalendarMonth = 11;
        currentCalendarYear--;
    }
    renderCalendar();
}

function nextMonth() {
    currentCalendarMonth++;
    if (currentCalendarMonth > 11) {
        currentCalendarMonth = 0;
        currentCalendarYear++;
    }
    renderCalendar();
}

function showDayTrades(day) {
    const trades = getTrades();
    const dayTrades = trades.filter(t => {
        const tradeDate = new Date(t.dateTime);
        return tradeDate.getDate() === day &&
               tradeDate.getMonth() === currentCalendarMonth &&
               tradeDate.getFullYear() === currentCalendarYear;
    });
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    if (dayTrades.length === 0) {
        alert(`📅 ${monthNames[currentCalendarMonth]} ${day}, ${currentCalendarYear}\n\n✅ No trades on this day\n\nClick "Log New Trade" to add one!`);
        return;
    }
    
    // Get day of week
    const dateObj = new Date(currentCalendarYear, currentCalendarMonth, day);
    const dayOfWeek = dayNames[dateObj.getDay()];
    
    let message = `📅 ${dayOfWeek}, ${monthNames[currentCalendarMonth]} ${day}, ${currentCalendarYear}\n`;
    message += `${'='.repeat(50)}\n\n`;
    
    dayTrades.forEach((trade, index) => {
        const time = new Date(trade.dateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        message += `🔹 TRADE ${index + 1} - ${time}\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        message += `Pair: ${trade.pair}\n`;
        message += `Direction: ${trade.direction}\n`;
        message += `Pattern: ${trade.pattern}\n`;
        message += `Session: ${trade.session}\n`;
        message += `\n`;
        message += `Entry: ${trade.entry.toFixed(5)}\n`;
        message += `Exit: ${trade.exit.toFixed(5)}\n`;
        message += `Stop: ${trade.stop.toFixed(5)}\n`;
        if (trade.tp) message += `TP: ${trade.tp.toFixed(5)}\n`;
        message += `Size: ${trade.size} lots\n`;
        message += `\n`;
        message += `R:R: ${trade.rr}:1\n`;
        message += `P/L: ${trade.pl >= 0 ? '+' : ''}$${trade.pl.toFixed(2)}\n`;
        message += `Outcome: ${trade.outcome === 'Win' ? '✅' : trade.outcome === 'Loss' ? '❌' : '⚪'} ${trade.outcome}\n`;
        
        if (trade.notes) {
            message += `\n📝 Notes: ${trade.notes}\n`;
        }
        
        message += `\n`;
    });
    
    const totalPL = dayTrades.reduce((sum, t) => sum + t.pl, 0);
    const wins = dayTrades.filter(t => t.outcome === 'Win').length;
    const losses = dayTrades.filter(t => t.outcome === 'Loss').length;
    
    message += `${'='.repeat(50)}\n`;
    message += `📊 DAY SUMMARY:\n`;
    message += `Total Trades: ${dayTrades.length}\n`;
    message += `Wins: ${wins} | Losses: ${losses}\n`;
    message += `Net P/L: ${totalPL >= 0 ? '✅ +' : '❌ '}$${totalPL.toFixed(2)}\n`;
    
    if (dayTrades.length > 1) {
        const avgPL = totalPL / dayTrades.length;
        message += `Avg P/L: ${avgPL >= 0 ? '+' : ''}$${avgPL.toFixed(2)}\n`;
    }
    
    alert(message);
}


