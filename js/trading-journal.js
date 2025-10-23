// Trading Journal JavaScript
// Handles trade logging, analytics, and performance tracking

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadTrades();
    updateDashboard();
    setupTabSwitching();
    setDefaultDateTime();
});

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
    
    // Total Trades
    document.getElementById('totalTrades').textContent = trades.length;
    
    // Calculate stats
    const wins = trades.filter(t => t.outcome === 'Win').length;
    const losses = trades.filter(t => t.outcome === 'Loss').length;
    const winRate = trades.length > 0 ? ((wins / trades.length) * 100).toFixed(1) : 0;
    
    const avgRR = trades.length > 0 ? 
        (trades.reduce((sum, t) => sum + parseFloat(t.rr), 0) / trades.length).toFixed(2) : 0;
    
    const netPL = trades.reduce((sum, t) => sum + t.pl, 0).toFixed(2);
    
    // Update UI
    document.getElementById('winRate').textContent = winRate + '%';
    document.getElementById('winRate').style.color = winRate >= 60 ? 'var(--accent-green)' : 
                                                      winRate >= 50 ? 'var(--accent-yellow)' : 
                                                      'var(--accent-red)';
    
    document.getElementById('avgRR').textContent = avgRR + ':1';
    document.getElementById('netPL').textContent = (netPL >= 0 ? '+' : '') + '$' + netPL;
    document.getElementById('netPL').style.color = netPL >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';
    
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

// View Trade Details
function viewTradeDetails(tradeId) {
    const trades = getTrades();
    const trade = trades.find(t => t.id === tradeId);
    
    if (!trade) return;
    
    const date = new Date(trade.dateTime);
    const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    const details = `
📊 TRADE DETAILS

Date: ${formattedDate} at ${formattedTime} (${trade.dayOfWeek})
Pair: ${trade.pair}
Direction: ${trade.direction}
Pattern: ${trade.pattern}

Entry: ${trade.entry.toFixed(5)}
Exit: ${trade.exit.toFixed(5)}
Stop Loss: ${trade.stop.toFixed(5)}
${trade.tp ? `Take Profit: ${trade.tp.toFixed(5)}` : ''}

Position Size: ${trade.size} lots
Risk/Reward: ${trade.rr}:1
P/L: ${trade.pl >= 0 ? '+' : ''}$${trade.pl.toFixed(2)}
Outcome: ${trade.outcome}

Session: ${trade.session}
Quarter Context: ${trade.quarter || 'Not specified'}

Notes:
${trade.notes || 'No notes added'}
    `;
    
    alert(details);
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
            
            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            button.classList.add('active');
            const activeContent = document.getElementById(tabId);
            if (activeContent) {
                activeContent.style.display = 'block';
                activeContent.classList.add('active');
            }
        });
    });
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('addTradeModal');
    if (event.target === modal) {
        closeAddTradeModal();
    }
});


