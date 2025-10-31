# 📍 Quarter Points Calibration Guide (Ilian Yotov)

## 🎯 Overview

**Version 2.1** of the D.X.C. indicator now includes **Ilian Yotov's Quarter Points** system, fully calibrated for different asset classes. Quarter Points are displayed **ONLY TO THE RIGHT** of current price when approaching key levels.

---

## 🔧 Key Features

### ✅ Smart Display Logic
- **Only shows levels TO THE RIGHT** (no clutter on historical chart)
- **Proximity-based:** Only displays levels within your specified PIP range
- **Dynamic:** Updates as price moves, showing next relevant levels
- **Clean:** No lines extending backwards through price action

### ✅ Asset-Class Calibration

The indicator **auto-detects** your asset type and adjusts:
- Quarter Point increments (.00, .25, .50, .75 for Forex)
- Large Quarter (LQ) targets (75% of ADR)
- Small Quarter (SQ) intraday targets (1/5 of LQ)
- Hesitation Zone (HZ) ranges (±1/2 SQ)

---

## 📊 Asset-Specific Settings

### **1. FOREX MAJOR** (EUR/USD, GBP/USD, USD/JPY)
- **ADR:** 80 PIPs
- **Quarter Point Increment:** 0.0025 (25 PIPs)
- **Large Quarter:** 60 PIPs
- **Small Quarter:** 12 PIPs
- **Hesitation Zone:** ±6 PIPs
- **Example Levels:** 1.0800, 1.0825, 1.0850, 1.0875, 1.0900

**Use Case:** Intraday scalping and swing trading on major pairs.

---

### **2. FOREX MINOR** (AUD/USD, NZD/USD, USD/CAD)
- **ADR:** 60 PIPs
- **Quarter Point Increment:** 0.0025 (25 PIPs)
- **Large Quarter:** 45 PIPs
- **Small Quarter:** 9 PIPs
- **Hesitation Zone:** ±4.5 PIPs
- **Example Levels:** 0.6500, 0.6525, 0.6550, 0.6575, 0.6600

**Use Case:** Lower volatility pairs, tighter stops.

---

### **3. FOREX EXOTIC** (USD/ZAR, USD/TRY, USD/MXN)
- **ADR:** 120 PIPs
- **Quarter Point Increment:** 0.0050 (50 PIPs)
- **Large Quarter:** 90 PIPs
- **Small Quarter:** 18 PIPs
- **Hesitation Zone:** ±9 PIPs
- **Example Levels:** 18.0000, 18.0050, 18.0100, 18.0150, 18.0200

**Use Case:** High volatility, wider quarter points to match price swings.

---

### **4. INDICES (US)** (SPX, NAS100, DJI, SPY, QQQ)
- **ADR:** 150 points
- **Quarter Point Increment:** 25 points
- **Large Quarter:** 112 points
- **Small Quarter:** 22 points
- **Hesitation Zone:** ±11 points
- **Example Levels:** 4500, 4525, 4550, 4575, 4600

**Use Case:** Index futures and ETF trading.

---

### **5. INDICES (EU/Asia)** (DAX, FTSE, CAC, Nikkei, HSI)
- **ADR:** 200 points
- **Quarter Point Increment:** 50 points
- **Large Quarter:** 150 points
- **Small Quarter:** 30 points
- **Hesitation Zone:** ±15 points
- **Example Levels:** 15000, 15050, 15100, 15150, 15200

**Use Case:** Higher volatility international indices.

---

### **6. COMMODITIES (Metals)** (Gold, Silver, Copper)
- **ADR:** 30 points
- **Quarter Point Increment:** $5.00
- **Large Quarter:** $22.50
- **Small Quarter:** $4.50
- **Hesitation Zone:** ±$2.25
- **Example Levels:** $1800, $1805, $1810, $1815, $1820

**Use Case:** Precious metals trading (Gold/Silver).

---

### **7. COMMODITIES (Energy)** (Crude Oil, WTI, Brent, Natural Gas)
- **ADR:** 3 points
- **Quarter Point Increment:** $0.50
- **Large Quarter:** $2.25
- **Small Quarter:** $0.45
- **Hesitation Zone:** ±$0.22
- **Example Levels:** $70.00, $70.50, $71.00, $71.50, $72.00

**Use Case:** Oil and energy futures.

---

### **8. FUTURES** (Generic)
- **ADR:** 100 points
- **Quarter Point Increment:** 10 points
- **Large Quarter:** 75 points
- **Small Quarter:** 15 points
- **Hesitation Zone:** ±7.5 points
- **Example Levels:** 5000, 5010, 5020, 5030, 5040

**Use Case:** General futures contracts.

---

### **9. CRYPTO** (BTC, ETH, Crypto pairs)
- **ADR:** 1000 points
- **Quarter Point Increment:** $100
- **Large Quarter:** $750
- **Small Quarter:** $150
- **Hesitation Zone:** ±$75
- **Example Levels:** $30,000, $30,100, $30,200, $30,300, $30,400

**Use Case:** High volatility crypto trading.

---

## 🎨 Visual Display

### **Quarter Point Lines**
- **Color:** Orange (adjustable)
- **Style:** Dashed (adjustable: Solid/Dotted/Dashed)
- **Width:** 2 (adjustable: 1-3)
- **Extend:** To the right only (no historical clutter)

### **Hesitation Zone Boxes**
- **Color:** Light orange shaded box (90% transparent)
- **Range:** ±HZ PIPs around each quarter point
- **Purpose:** Shows consolidation zones where price hesitates

### **Labels**
- **Position:** To the right of current price
- **Content:** Price level (e.g., "1.0825")
- **Tooltip:** Shows LQ target distance

---

## 🔥 Three-Day Rule

### **What It Is:**
If price consolidates within a **Hesitation Zone** for **3+ days**, expect a **Large Quarter (LQ) breakout**.

### **Visual Alert:**
- **Label:** "🔥 3-DAY RULE (Xd)" appears above price
- **Color:** Red
- **Tooltip:** Shows days consolidated and expected breakout distance

### **Trading Strategy:**
1. **Wait for 3+ days** in Hesitation Zone
2. **Watch for breakout** (bullish or bearish)
3. **Target:** Large Quarter distance (e.g., 60 PIPs for EUR/USD)
4. **Stop:** Below/above Hesitation Zone

---

## 🔮 Confluence with Gann Timing

### **Enhanced Scoring (Now 9 Points Max):**
- **144-Day Reversal Zone:** 2 points
- **Time = Price Balance:** 2 points
- **Anniversary Date:** 1 point
- **Weekly Q3 (Wednesday):** 1 point
- **90-Day Q3 (Jul-Sep):** 1 point
- **At Quarter Point:** 1 point ← NEW
- **Three-Day Rule Active:** 2 points ← NEW

### **Example High-Confluence Setup:**
```
🔥 CONFLUENCE (7 points)
✅ 144-Day Reversal Zone (2 pts)
✅ Time=Price Balanced (2 pts)
✅ At Quarter Point (1 pt)
✅ Three-Day Rule Active (2 pts)
= MAXIMUM EDGE SETUP!
```

**Action:** This is your highest-probability trade setup. Tighten stops, increase position size (within risk limits).

---

## ⚙️ Settings Guide

### **Quarter Points Group:**
1. **Show Quarter Point Levels:** Toggle on/off
2. **Quarter Point Color:** Orange (default)
3. **Width:** 2 (default)
4. **Style:** Dashed (default)
5. **Show Hesitation Zones:** Toggle on/off
6. **Show Three-Day Rule Alerts:** Toggle on/off
7. **Levels to Show:** 3 (default) - Number of levels above/below price
8. **Proximity Range (PIPs):** 100 (default) - Only show levels within this range
9. **Asset Type:** Auto-Detect (default) - Or manually select

### **Recommended Settings:**
- **Intraday (1M-15M):** Levels = 3, Proximity = 50 PIPs
- **Swing (1H-4H):** Levels = 5, Proximity = 100 PIPs
- **Position (Daily+):** Levels = 8, Proximity = 200 PIPs

---

## 📈 Trading Examples

### **Example 1: EUR/USD Intraday**
- **Current Price:** 1.0837
- **Nearest QP Below:** 1.0825
- **Nearest QP Above:** 1.0850
- **Hesitation Zone:** 1.0844-1.0856 (±6 PIPs)
- **Strategy:** If price consolidates in HZ for 3+ days, expect 60-PIP LQ breakout

### **Example 2: SPX Futures**
- **Current Price:** 4512
- **Nearest QP Below:** 4500
- **Nearest QP Above:** 4525
- **Hesitation Zone:** 4514-4536 (±11 points)
- **Strategy:** Watch for rejection at 4525 QP, target 4400 (112-point LQ)

### **Example 3: Gold (XAU/USD)**
- **Current Price:** $1807
- **Nearest QP Below:** $1805
- **Nearest QP Above:** $1810
- **Hesitation Zone:** $1807.75-$1812.25 (±$2.25)
- **Strategy:** If 3-Day Rule triggers at $1810, expect $22.50 LQ move

---

## 🧪 Testing & Validation

### **Backtesting Tips:**
1. **Look for 3-Day Rule setups** historically
2. **Measure LQ breakout accuracy** (should be ~75% of ADR)
3. **Combine with Gann confluence** for highest win rate
4. **Test on your specific asset class** (calibration may need fine-tuning)

### **Live Trading Tips:**
1. **Start with major Forex pairs** (most reliable)
2. **Use 1H-4H timeframes** for best visibility
3. **Wait for 3-Day Rule confirmation** before entering
4. **Set alerts at Quarter Points** (TradingView alerts)

---

## 🎯 Key Takeaways

✅ **Quarter Points are now calibrated** for Forex, Indices, Commodities, Futures, Crypto  
✅ **Only display TO THE RIGHT** (no chart clutter)  
✅ **Three-Day Rule** = High-probability breakout signal  
✅ **Confluence scoring** now includes Quarter Points (max 9 points)  
✅ **Auto-detection** makes it plug-and-play  

---

## 📚 Further Reading

- **Ilian Yotov's "The Quarters Theory"** (original book)
- **QUARTERS_THEORY_COMPLETE_GUIDE.md** (in this repo)
- **GANN_TIMING_RESEARCH_ANALYSIS.md** (Gann + Quarters synergy)

---

## 🚀 Next Steps

1. **Load v2.1 indicator** on TradingView
2. **Select your asset type** (or use Auto-Detect)
3. **Adjust "Levels to Show"** and "Proximity Range" to your preference
4. **Watch for 3-Day Rule alerts** and Gann confluence
5. **Backtest on your favorite pairs** to validate

---

**Happy Trading! 📈🔥**

*Remember: Quarter Points + Gann Timing + PSR Zones = Triple Confluence = Maximum Edge*

