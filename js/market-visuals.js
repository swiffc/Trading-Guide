// Visual Market Controller

function initTradingView(symbol, interval) {
    if (typeof TradingView === 'undefined') return;
    const containerId = 'tvContainer';
    document.getElementById(containerId).innerHTML = '';
    /* global TradingView */
    new TradingView.widget({
        symbol: symbol || 'FX:EURUSD',
        interval: interval || '15',
        container_id: containerId,
        width: '100%',
        height: 600,
        theme: 'dark',
        style: '1',
        locale: 'en',
        enable_publishing: false,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        autosize: true
    });
}

function normalizeSymbol(input) {
    const v = (input || '').trim().toUpperCase();
    if (v.includes(':')) return v; // Already qualified
    // Map common FX symbols to TradingView format
    const fx = ['EURUSD','GBPUSD','USDJPY','USDCAD','AUDUSD','NZDUSD','USDCHF','XAUUSD','XAGUSD'];
    if (fx.includes(v)) return 'FX:' + v;
    return v || 'FX:EURUSD';
}

function applyControls() {
    const symbolInput = document.getElementById('symbolInput');
    const timeframeSelect = document.getElementById('timeframeSelect');
    const sym = normalizeSymbol(symbolInput ? symbolInput.value : 'EURUSD');
    const tf = timeframeSelect ? timeframeSelect.value : '15';
    initTradingView(sym, tf);
}

document.addEventListener('DOMContentLoaded', function() {
    // Boot the widget
    applyControls();
    const btn = document.getElementById('applyBtn');
    if (btn) btn.addEventListener('click', applyControls);
});


