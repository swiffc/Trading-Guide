// Reusable UI Components
// Usage: import { StatsGrid, StepCard, etc. } from './components.js'

/**
 * Stats Card Component
 * @param {string} number - The stat number to display
 * @param {string} label - The label below the number
 * @param {string} color - Color variant (blue, green, yellow, red)
 */
export const StatsCard = ({ number, label, color }) => `
    <div class="card stat-card border-${color}">
        <div class="stat-number color-${color}">${number}</div>
        <div>${label}</div>
    </div>
`;

/**
 * Stats Grid Component
 * @param {Array} cards - Array of stat card objects [{number, label, color}]
 */
export const StatsGrid = (cards) => `
    <div class="stats-grid">
        ${cards.map(card => StatsCard(card)).join('')}
    </div>
`;

/**
 * Step Card for step-by-step instructions
 * @param {number} number - Step number
 * @param {string} title - Step title
 * @param {string} content - Step content (HTML string)
 */
export const StepCard = ({ number, title, content }) => `
    <div class="step">
        <div class="step-number">${number}</div>
        <div class="step-content">
            <h4>${title}</h4>
            ${content}
        </div>
    </div>
`;

/**
 * Example Box (green success style)
 * @param {string} title - Box title
 * @param {string} content - Box content (HTML string)
 */
export const ExampleBox = ({ title, content }) => `
    <div class="example-box">
        <h4>${title}</h4>
        ${content}
    </div>
`;

/**
 * Warning Box (red alert style)
 * @param {string} title - Box title
 * @param {string} content - Box content (HTML string)
 */
export const WarningBox = ({ title, content }) => `
    <div class="warning-box">
        <h4>${title}</h4>
        ${content}
    </div>
`;

/**
 * Info Box (blue info style)
 * @param {string} title - Box title
 * @param {string} content - Box content (HTML string)
 */
export const InfoBox = ({ title, content }) => `
    <div class="info-box">
        <h4>${title}</h4>
        ${content}
    </div>
`;

/**
 * Checklist Component
 * @param {string} title - Checklist title
 * @param {Array} items - Array of checklist item strings
 * @param {string} prefix - Prefix for checkbox IDs (default: 'check')
 */
export const Checklist = ({ title, items, prefix = 'check' }) => `
    <div class="checklist">
        <h4>${title}</h4>
        ${items.map((item, idx) => `
            <div class="checklist-item">
                <input type="checkbox" id="${prefix}-${idx}">
                <label for="${prefix}-${idx}">${item}</label>
            </div>
        `).join('')}
    </div>
`;

/**
 * Calculation Box Component
 * @param {string} formula - Formula title
 * @param {string} content - Calculation content (HTML string)
 */
export const CalculationBox = ({ formula, content }) => `
    <div class="calculation-box">
        <div class="formula">${formula}</div>
        ${content}
    </div>
`;

/**
 * Tab System Component
 * @param {Array} tabs - Array of tab objects [{id, icon, label, content}]
 * @param {number} defaultTab - Index of default active tab (default: 0)
 */
export const TabSystem = ({ tabs, defaultTab = 0 }) => {
    const tabButtons = tabs.map((tab, idx) => `
        <button class="tab-button ${idx === defaultTab ? 'active' : ''}" 
                onclick="openTab(event, '${tab.id}')">
            ${tab.icon ? tab.icon + ' ' : ''}${tab.label}
        </button>
    `).join('');
    
    const tabContents = tabs.map((tab, idx) => `
        <div id="${tab.id}" class="tab-content ${idx === defaultTab ? 'active' : ''} mt-3">
            ${tab.content}
        </div>
    `).join('');
    
    return `
        <div class="tabs mt-4">${tabButtons}</div>
        ${tabContents}
    `;
};

/**
 * Push Card Component (for Intraday Bias page)
 * @param {number} number - Push number (1, 2, or 3)
 * @param {string} title - Card title
 * @param {string} content - Card content (HTML string)
 */
export const PushCard = ({ number, title, content }) => {
    const pushClass = `push${number}`;
    return `
        <div class="push-card ${pushClass}">
            <div class="push-number">${number}</div>
            <h3>${title}</h3>
            ${content}
        </div>
    `;
};

/**
 * Pattern Flow Component
 * @param {Array} steps - Array of step objects [{label, description, badge}]
 */
export const PatternFlow = (steps) => {
    const flowHTML = steps.map((step, idx) => `
        ${idx > 0 ? '<div class="flow-arrow">→</div>' : ''}
        <div class="flow-step">
            <strong>${step.label}</strong>
            <p>${step.description}</p>
            ${step.badge ? `<span class="level-indicator">${step.badge}</span>` : ''}
        </div>
    `).join('');
    
    return `<div class="pattern-flow">${flowHTML}</div>`;
};

/**
 * Alert Component
 * @param {string} type - Alert type (success, warning, danger, info)
 * @param {string} content - Alert content (HTML string)
 */
export const Alert = ({ type, content }) => `
    <div class="alert alert-${type}">
        ${content}
    </div>
`;

/**
 * Badge Component
 * @param {string} text - Badge text
 * @param {string} color - Badge color (blue, green, yellow, red)
 */
export const Badge = ({ text, color }) => `
    <span class="badge badge-${color}">${text}</span>
`;

/**
 * Button Component
 * @param {string} text - Button text
 * @param {string} type - Button type (primary, success, warning, danger)
 * @param {string} onClick - onClick handler (optional)
 */
export const Button = ({ text, type = 'primary', onClick = '' }) => `
    <button class="btn btn-${type}" ${onClick ? `onclick="${onClick}"` : ''}>
        ${text}
    </button>
`;

/**
 * Card Component
 * @param {string} content - Card content (HTML string)
 * @param {string} borderColor - Border color (optional)
 */
export const Card = ({ content, borderColor = '' }) => `
    <div class="card ${borderColor ? `border-${borderColor}` : ''}">
        ${content}
    </div>
`;

// Helper function to safely render components
export const renderComponent = (componentHTML, targetId) => {
    const target = document.getElementById(targetId);
    if (target) {
        target.innerHTML = componentHTML;
    } else {
        console.error(`Target element #${targetId} not found`);
    }
};

// Export all components as default for easy import
export default {
    StatsCard,
    StatsGrid,
    StepCard,
    ExampleBox,
    WarningBox,
    InfoBox,
    Checklist,
    CalculationBox,
    TabSystem,
    PushCard,
    PatternFlow,
    Alert,
    Badge,
    Button,
    Card,
    renderComponent
};

