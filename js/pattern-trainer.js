// Pattern Trainer - Interactive Learning System
// Quiz mode, flashcards, progress tracking, achievements

// Question Bank
const questionBank = {
    easy: [
        {
            question: "What does 'M-Top' pattern indicate?",
            options: ["Bullish reversal", "Bearish reversal", "Continuation", "Consolidation"],
            correct: 1,
            explanation: "M-Top is a BEARISH reversal pattern that forms at highs. The 'M' shape shows rejection at resistance, signaling potential downside.",
            pattern: "M-Top"
        },
        {
            question: "What does 'W-Bottom' pattern indicate?",
            options: ["Bearish reversal", "Bullish reversal", "Downtrend", "Distribution"],
            correct: 1,
            explanation: "W-Bottom is a BULLISH reversal pattern that forms at lows. The 'W' shape shows support holding, signaling potential upside.",
            pattern: "W-Bottom"
        },
        {
            question: "What is Q3 in the quarterly cycle?",
            options: ["Accumulation", "Manipulation", "Distribution", "Reversal"],
            correct: 2,
            explanation: "Q3 is DISTRIBUTION phase - the BEST time to trade! This is when the main trend moves occur.",
            pattern: "Quarterly Theory"
        },
        {
            question: "Which day is best for trading in the weekly cycle?",
            options: ["Monday", "Tuesday", "Wednesday", "Thursday"],
            correct: 2,
            explanation: "WEDNESDAY (Day 3) is the distribution day - highest probability trading opportunities!",
            pattern: "Weekly Cycle"
        },
        {
            question: "What does Asian Range (AR) 00 represent?",
            options: ["Asian session midpoint", "Asian session high/low", "London open", "NY open"],
            correct: 1,
            explanation: "AR 00 is the HIGH and LOW of the Asian session (5PM-12AM EST). Critical levels for day trading.",
            pattern: "Asian Range"
        }
    ],
    medium: [
        {
            question: "What is Type 1 'Safety Trade'?",
            options: ["Pattern inside AR", "Pattern at AR boundary", "Pattern above AR high or below AR low", "Pattern at AR 50"],
            correct: 2,
            explanation: "Type 1 Safety Trade: M-Top forms ABOVE Asian High (bearish) or W-Bottom forms BELOW Asian Low (bullish). Called 'safety' because high/low is already established!",
            pattern: "Type 1"
        },
        {
            question: "When does the TRUE week open according to BTMM?",
            options: ["Sunday 5PM", "Monday 12AM", "Tuesday 12AM", "Monday 9AM"],
            correct: 2,
            explanation: "TRUE WEEK OPEN is Tuesday midnight (12AM EST). The REAL trading week begins here!",
            pattern: "BTMM"
        },
        {
            question: "What are the 3 Brinks Trade times?",
            options: ["9AM, 12PM, 3PM", "9:45PM, 3:45AM, 9:45AM", "8PM, 3AM, 9AM", "10PM, 4AM, 10AM"],
            correct: 1,
            explanation: "Brinks Times: 9:45PM (Asian), 3:45AM (London), 9:45AM (NY). Watch for second leg of M/W patterns!",
            pattern: "Brinks Trade"
        },
        {
            question: "What does PSR stand for?",
            options: ["Price Support Range", "Psychological Support/Resistance", "Previous Session Range", "Pivot Support Range"],
            correct: 1,
            explanation: "PSR = Psychological Support/Resistance. Formed by first 8 H1 candles of the week (Sunday 5PM - Monday 1AM).",
            pattern: "PSR"
        },
        {
            question: "What is the ID 50 trade setup?",
            options: ["Trade at 50 EMA", "Trade at AR 50", "Inside Day at 50% of range", "Trade at 50 pips"],
            correct: 2,
            explanation: "ID 50 = Inside Day at 50% of the range. Price consolidates mid-range before breakout.",
            pattern: "ID 50"
        }
    ],
    hard: [
        {
            question: "What is the M-A1-A2-W pattern structure?",
            options: ["4-day bullish structure", "3-day bearish structure", "2-day reversal", "5-day accumulation"],
            correct: 1,
            explanation: "M-A1-A2-W is Steve Mauro's OFFICIAL bearish 3-day structure: Monday/Tuesday make M-Top and accumulate (A1/A2), Wednesday reverses DOWN (W).",
            pattern: "M-A1-A2-W"
        },
        {
            question: "What is Type 3 trade setup?",
            options: ["Pattern above AR", "Pattern at AR 00", "Pattern at AR 50 or 50 EMA bounce", "Pattern below AR"],
            correct: 2,
            explanation: "Type 3: Asian 50 Bounce - Pattern forms at AR 50 (midpoint) or 50 EMA. Equilibrium reversals or continuations.",
            pattern: "Type 3"
        },
        {
            question: "What does 'Perfect Storm' mean in multi-timeframe alignment?",
            options: ["2 TFs align", "3 TFs align", "4 TFs align in Q3", "All TFs bullish"],
            correct: 2,
            explanation: "Perfect Storm = 4 timeframes ALL in Q3 distribution! Weekly Q3 + Daily Q3 + Session Q3 + 90-min Q3 = MAXIMUM conviction!",
            pattern: "Multi-TF"
        },
        {
            question: "What is the 915 Rule?",
            options: ["Trade at 9:15 AM", "9:15 AM direction sets day's tone", "Stop trading at 9:15", "9-15 pip moves"],
            correct: 1,
            explanation: "915 Rule: The direction established by 9:15 AM EST often determines the rest of the day's bias!",
            pattern: "915 Rule"
        },
        {
            question: "What defines a 'Half Batman' pattern?",
            options: ["Half of Batman pattern", "London accumulation into NY distribution", "Asian session only", "50% retracement"],
            correct: 1,
            explanation: "Half Batman: London session (3-9AM) accumulates, then NY session (9AM-12PM) distributes. Classic institutional trap!",
            pattern: "Half Batman"
        }
    ]
};

// Flashcard Data
const flashcardData = [
    { front: "M-Top Pattern", back: "Bearish reversal pattern forming at resistance. Two peaks with rejection = potential downside. Trade after second leg confirms." },
    { front: "W-Bottom Pattern", back: "Bullish reversal pattern forming at support. Two valleys with bounce = potential upside. Trade after second leg confirms." },
    { front: "Q1 - Accumulation", back: "First quarter: tight range, low volume, consolidation. OBSERVE ONLY - don't trade yet!" },
    { front: "Q2 - Manipulation", back: "Second quarter: Judas swing, stop hunts, fake moves. MARK LEVELS - prepare for Q3!" },
    { front: "Q3 - Distribution", back: "Third quarter: MAIN MOVE! Highest probability trades. THIS IS WHERE YOU TRADE! 🎯" },
    { front: "Q4 - Reversal/Continuation", back: "Fourth quarter: trend completes or continues into next cycle. Prepare for new Q1." },
    { front: "Type 1: Safety Trade", back: "M-Top ABOVE Asian High OR W-Bottom BELOW Asian Low. Called 'safety' because high/low already established!" },
    { front: "Type 2: Asian 00 Bounce", back: "Pattern forms AT Asian Range boundary (AR 00 = high or low). Bounces off the edge!" },
    { front: "Type 3: Asian 50 Bounce", back: "Pattern at AR 50 (midpoint) or 50 EMA. Equilibrium trades - reversals or continuations." },
    { front: "Type 4: Breakout Continuation", back: "Pattern BREAKS through Asian Range for continuation. Momentum trades after range breakout." },
    { front: "Asian Range (AR)", back: "5PM - 12AM EST range. AR 00 = high/low, AR 50 = midpoint. Foundation for day trading setups!" },
    { front: "Brinks Trade Times", back: "9:45 PM (Asian), 3:45 AM (London), 9:45 AM (NY). Watch for second leg of M/W patterns!" },
    { front: "PSR Zone", back: "First 8 H1 candles (Sunday 5PM - Monday 1AM). Weekly Psychological Support/Resistance reference." },
    { front: "True Week Open", back: "Tuesday midnight (12AM EST). The REAL trading week begins here, not Sunday!" },
    { front: "Wednesday = Day 3", back: "BEST trading day! Distribution phase of weekly cycle. Highest probability setups!" },
    { front: "M-A1-A2-W Structure", back: "Official BTMM bearish 3-day pattern: Monday M-Top → Tuesday A1/A2 accumulation → Wednesday W reversal DOWN" },
    { front: "W-V1-V2-M Structure", back: "Official BTMM bullish 3-day pattern: Monday W-Bottom → Tuesday V1/V2 accumulation → Wednesday M reversal UP" },
    { front: "Perfect Storm Setup", back: "4 timeframes ALL in Q3! Weekly + Daily + Session + 90-min Q3 alignment = MAXIMUM conviction!" },
    { front: "EMA System", back: "13 EMA (immediate), 50 EMA (mid-term), 200 EMA (long-term), 800 EMA, 3200 EMA. Dynamic S/R levels!" },
    { front: "915 Rule", back: "Direction by 9:15 AM EST often sets the day's tone. Key decision time!" }
];

// State Management
let currentDifficulty = 'easy';
let currentQuestionIndex = 0;
let currentQuestions = [];
let score = 0;
let streak = 0;
let quizActive = false;
let timerInterval = null;
let timeLeft = 30;

let currentFlashcardIndex = 0;
let flashcardFlipped = false;
let flashcardsShuffled = [...flashcardData];

// Stats from localStorage
function getStats() {
    const stats = localStorage.getItem('patternTrainerStats');
    return stats ? JSON.parse(stats) : {
        totalAnswered: 0,
        correctAnswers: 0,
        bestStreak: 0,
        patternAccuracy: {},
        lastPlayed: null
    };
}

function saveStats(stats) {
    localStorage.setItem('patternTrainerStats', JSON.stringify(stats));
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateDashboard();
    setupTabSwitching();
    setDifficulty('easy'); // Set default
    loadFlashcards();
});

// Update Dashboard
function updateDashboard() {
    const stats = getStats();
    
    document.getElementById('totalAnswered').textContent = stats.totalAnswered;
    
    const accuracy = stats.totalAnswered > 0 ? 
        Math.round((stats.correctAnswers / stats.totalAnswered) * 100) : 0;
    document.getElementById('accuracyRate').textContent = accuracy + '%';
    
    document.getElementById('currentStreak').textContent = streak;
    document.getElementById('bestStreak').textContent = stats.bestStreak;
    
    // Update stats tab
    updateStatsTab();
}

// Set Difficulty
function setDifficulty(level) {
    currentDifficulty = level;
    
    // Update button styles
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.style.background = 'var(--bg-tertiary)';
        btn.style.color = 'var(--text-primary)';
        btn.style.border = '1px solid var(--border-color)';
    });
    
    const activeBtn = document.getElementById('diff' + level.charAt(0).toUpperCase() + level.slice(1));
    activeBtn.style.background = 'var(--accent-green)';
    activeBtn.style.color = 'var(--bg-primary)';
    activeBtn.style.border = 'none';
}

// Start Quiz
function startQuiz() {
    quizActive = true;
    score = 0;
    streak = 0;
    currentQuestionIndex = 0;
    
    // Get questions for current difficulty
    currentQuestions = [...questionBank[currentDifficulty]];
    
    // Shuffle questions
    currentQuestions.sort(() => Math.random() - 0.5);
    
    // Hide start panel, show question
    document.getElementById('startPanel').style.display = 'none';
    document.getElementById('questionCard').style.display = 'block';
    document.getElementById('feedbackPanel').style.display = 'none';
    
    loadQuestion();
}

// Load Question
function loadQuestion() {
    if (currentQuestionIndex >= currentQuestions.length) {
        endQuiz();
        return;
    }
    
    const question = currentQuestions[currentQuestionIndex];
    
    document.getElementById('questionNumber').textContent = currentQuestionIndex + 1;
    document.getElementById('questionText').textContent = question.question;
    
    // Load options
    const optionsHTML = question.options.map((option, index) => `
        <button onclick="selectAnswer(${index})" class="answer-option" style="padding: 1rem; background: var(--bg-tertiary); border: 2px solid var(--border-color); border-radius: 8px; cursor: pointer; text-align: left; transition: all 0.2s; font-size: 0.95rem;">
            ${option}
        </button>
    `).join('');
    
    document.getElementById('answerOptions').innerHTML = optionsHTML;
    
    // Start timer
    timeLeft = 30;
    startTimer();
}

// Start Timer
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = `⏱️ ${timeLeft}s`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            selectAnswer(-1); // Time's up = wrong answer
        }
    }, 1000);
}

// Select Answer
function selectAnswer(selectedIndex) {
    if (!quizActive) return;
    
    clearInterval(timerInterval);
    quizActive = false; // Prevent multiple selections
    
    const question = currentQuestions[currentQuestionIndex];
    const isCorrect = selectedIndex === question.correct;
    
    // Update stats
    const stats = getStats();
    stats.totalAnswered++;
    
    if (isCorrect) {
        stats.correctAnswers++;
        streak++;
        if (streak > stats.bestStreak) {
            stats.bestStreak = streak;
        }
        
        // Track pattern-specific accuracy
        if (!stats.patternAccuracy[question.pattern]) {
            stats.patternAccuracy[question.pattern] = { correct: 0, total: 0 };
        }
        stats.patternAccuracy[question.pattern].correct++;
        stats.patternAccuracy[question.pattern].total++;
    } else {
        streak = 0;
        
        if (!stats.patternAccuracy[question.pattern]) {
            stats.patternAccuracy[question.pattern] = { correct: 0, total: 0 };
        }
        stats.patternAccuracy[question.pattern].total++;
    }
    
    stats.lastPlayed = new Date().toISOString();
    saveStats(stats);
    updateDashboard();
    
    // Show feedback
    showFeedback(isCorrect, question);
}

// Show Feedback
function showFeedback(isCorrect, question) {
    document.getElementById('questionCard').style.display = 'none';
    document.getElementById('feedbackPanel').style.display = 'block';
    
    const feedbackPanel = document.getElementById('feedbackPanel');
    
    if (isCorrect) {
        feedbackPanel.style.background = 'rgba(0, 255, 136, 0.1)';
        feedbackPanel.style.borderLeft = '4px solid var(--accent-green)';
        document.getElementById('feedbackTitle').innerHTML = '✅ Correct! 🎉';
        document.getElementById('feedbackTitle').style.color = 'var(--accent-green)';
    } else {
        feedbackPanel.style.background = 'rgba(255, 74, 74, 0.1)';
        feedbackPanel.style.borderLeft = '4px solid var(--accent-red)';
        document.getElementById('feedbackTitle').innerHTML = '❌ Incorrect';
        document.getElementById('feedbackTitle').style.color = 'var(--accent-red)';
    }
    
    document.getElementById('feedbackText').innerHTML = `
        <strong>Correct Answer:</strong> ${question.options[question.correct]}<br><br>
        <strong>Explanation:</strong> ${question.explanation}
    `;
}

// Next Question
function nextQuestion() {
    currentQuestionIndex++;
    quizActive = true;
    
    document.getElementById('feedbackPanel').style.display = 'none';
    document.getElementById('questionCard').style.display = 'block';
    
    loadQuestion();
}

// End Quiz
function endQuiz() {
    const stats = getStats();
    const accuracy = Math.round((score / currentQuestions.length) * 100);
    
    alert(`
🎓 Quiz Complete!

Questions: ${currentQuestions.length}
Correct: ${score}
Accuracy: ${accuracy}%
Current Streak: ${streak}
Best Streak: ${stats.bestStreak}

${accuracy >= 80 ? '🏆 Excellent work!' : accuracy >= 60 ? '👍 Good job!' : '📚 Keep practicing!'}
    `);
    
    // Reset
    document.getElementById('questionCard').style.display = 'none';
    document.getElementById('startPanel').style.display = 'block';
    quizActive = false;
}

// Reset Stats
function resetStats() {
    if (!confirm('⚠️ This will delete all your progress!\n\nAre you sure?')) return;
    
    localStorage.removeItem('patternTrainerStats');
    streak = 0;
    updateDashboard();
    alert('✅ Stats reset successfully!');
}

// Flashcards
function loadFlashcards() {
    currentFlashcardIndex = 0;
    flashcardFlipped = false;
    updateFlashcard();
}

function updateFlashcard() {
    const card = flashcardsShuffled[currentFlashcardIndex];
    const flashcardEl = document.getElementById('flashcard');
    
    flashcardEl.innerHTML = `
        <div style="font-size: 1.5rem; font-weight: bold; color: var(--accent-green); margin-bottom: 1rem;">
            ${card.front}
        </div>
        <div style="color: var(--text-tertiary); font-size: 0.9rem;">
            Click to reveal answer
        </div>
    `;
    
    flashcardEl.style.transform = 'rotateY(0deg)';
    flashcardFlipped = false;
    
    document.getElementById('flashcardNumber').textContent = currentFlashcardIndex + 1;
    document.getElementById('flashcardTotal').textContent = flashcardsShuffled.length;
}

function flipCard() {
    const card = flashcardsShuffled[currentFlashcardIndex];
    const flashcardEl = document.getElementById('flashcard');
    
    if (!flashcardFlipped) {
        flashcardEl.style.transform = 'rotateY(180deg)';
        setTimeout(() => {
            flashcardEl.innerHTML = `
                <div style="transform: rotateY(180deg); font-size: 1.1rem; line-height: 1.8; color: var(--text-primary);">
                    ${card.back}
                </div>
            `;
        }, 300);
        flashcardFlipped = true;
    } else {
        updateFlashcard();
    }
}

function nextFlashcard() {
    currentFlashcardIndex = (currentFlashcardIndex + 1) % flashcardsShuffled.length;
    updateFlashcard();
}

function previousFlashcard() {
    currentFlashcardIndex = (currentFlashcardIndex - 1 + flashcardsShuffled.length) % flashcardsShuffled.length;
    updateFlashcard();
}

function shuffleFlashcards() {
    flashcardsShuffled.sort(() => Math.random() - 0.5);
    currentFlashcardIndex = 0;
    updateFlashcard();
    alert('🔀 Flashcards shuffled!');
}

// Update Stats Tab
function updateStatsTab() {
    const stats = getStats();
    
    // Overall stats
    const accuracy = stats.totalAnswered > 0 ? 
        Math.round((stats.correctAnswers / stats.totalAnswered) * 100) : 0;
    
    document.getElementById('overallStats').innerHTML = `
        <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border-color);">
            <span>Total Questions:</span>
            <strong>${stats.totalAnswered}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border-color);">
            <span>Correct Answers:</span>
            <strong style="color: var(--accent-green);">${stats.correctAnswers}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border-color);">
            <span>Accuracy:</span>
            <strong style="color: ${accuracy >= 70 ? 'var(--accent-green)' : 'var(--accent-yellow)'};">${accuracy}%</strong>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 0.5rem 0;">
            <span>Best Streak:</span>
            <strong style="color: var(--accent-blue);">${stats.bestStreak}</strong>
        </div>
    `;
    
    // Pattern-specific accuracy
    if (Object.keys(stats.patternAccuracy).length > 0) {
        const patternHTML = Object.entries(stats.patternAccuracy)
            .map(([pattern, data]) => {
                const acc = Math.round((data.correct / data.total) * 100);
                const color = acc >= 70 ? 'var(--accent-green)' : acc >= 50 ? 'var(--accent-yellow)' : 'var(--accent-red)';
                return `
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border-color);">
                        <span>${pattern}</span>
                        <strong style="color: ${color};">${acc}% (${data.correct}/${data.total})</strong>
                    </div>
                `;
            }).join('');
        
        document.getElementById('patternStats').innerHTML = patternHTML;
    }
    
    // Recent activity
    if (stats.lastPlayed) {
        const lastDate = new Date(stats.lastPlayed);
        const formattedDate = lastDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        
        document.getElementById('recentActivity').innerHTML = `
            <div style="padding: 0.5rem 0;">Last played: ${formattedDate}</div>
            <div style="padding: 0.5rem 0;">Total sessions: ${Math.ceil(stats.totalAnswered / 5)}</div>
        `;
    }
    
    // Achievements
    const achievements = [];
    if (stats.totalAnswered >= 10) achievements.push({ icon: '🎯', name: 'Getting Started', desc: '10 questions' });
    if (stats.totalAnswered >= 50) achievements.push({ icon: '📚', name: 'Student', desc: '50 questions' });
    if (stats.totalAnswered >= 100) achievements.push({ icon: '🎓', name: 'Scholar', desc: '100 questions' });
    if (stats.bestStreak >= 5) achievements.push({ icon: '🔥', name: 'Hot Streak', desc: '5 in a row' });
    if (stats.bestStreak >= 10) achievements.push({ icon: '⚡', name: 'Lightning', desc: '10 in a row' });
    if (accuracy >= 80) achievements.push({ icon: '🏆', name: 'Expert', desc: '80% accuracy' });
    if (accuracy >= 90) achievements.push({ icon: '👑', name: 'Master', desc: '90% accuracy' });
    
    if (achievements.length > 0) {
        document.getElementById('achievements').innerHTML = achievements.map(a => `
            <div style="padding: 1rem; background: var(--bg-tertiary); border-radius: 8px; text-align: center; min-width: 120px;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">${a.icon}</div>
                <div style="font-weight: bold; font-size: 0.9rem;">${a.name}</div>
                <div style="font-size: 0.8rem; color: var(--text-tertiary); margin-top: 0.25rem;">${a.desc}</div>
            </div>
        `).join('');
    } else {
        document.getElementById('achievements').innerHTML = '<div style="color: var(--text-tertiary);">Complete quizzes to unlock achievements!</div>';
    }
}

// Tab Switching
function setupTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Remove active class
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => {
                content.classList.remove('active');
                content.style.display = 'none';
            });
            
            // Add active class
            button.classList.add('active');
            const activeContent = document.getElementById(tabId);
            if (activeContent) {
                activeContent.style.display = 'block';
                activeContent.classList.add('active');
            }
            
            // Update stats when viewing stats tab
            if (tabId === 'stats') {
                updateStatsTab();
            }
        });
    });
}

console.log('🎓 Pattern Trainer loaded successfully!');



