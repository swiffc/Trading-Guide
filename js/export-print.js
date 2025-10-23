// Export/Print Utility
// Universal export and print functionality for all pages

class ExportPrintUtility {
    constructor() {
        this.init();
    }
    
    init() {
        // Add export/print buttons to pages
        this.addExportButtons();
        
        // Add print styles
        this.addPrintStyles();
    }
    
    addExportButtons() {
        // Create floating export menu
        const exportMenu = document.createElement('div');
        exportMenu.id = 'exportMenu';
        exportMenu.style.cssText = `
            position: fixed;
            top: 210px;
            right: 20px;
            z-index: 9997;
            background: var(--bg-tertiary);
            border: 2px solid var(--border-color);
            border-radius: 12px;
            padding: 0.5rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            display: none;
            flex-direction: column;
            gap: 0.5rem;
        `;
        
        exportMenu.innerHTML = `
            <button onclick="exportUtility.exportAsPDF()" style="padding: 0.75rem 1rem; background: var(--accent-red); color: #fff; border: none; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-weight: bold; width: 100%;" title="Export as PDF">
                📄 PDF
            </button>
            <button onclick="exportUtility.printPage()" style="padding: 0.75rem 1rem; background: var(--accent-blue); color: var(--bg-primary); border: none; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-weight: bold; width: 100%;" title="Print Page">
                🖨️ Print
            </button>
            <button onclick="exportUtility.exportAsMarkdown()" style="padding: 0.75rem 1rem; background: var(--accent-yellow); color: var(--bg-primary); border: none; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-weight: bold; width: 100%;" title="Export as Markdown">
                📝 MD
            </button>
            <button onclick="exportUtility.copyToClipboard()" style="padding: 0.75rem 1rem; background: var(--accent-green); color: var(--bg-primary); border: none; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-weight: bold; width: 100%;" title="Copy to Clipboard">
                📋 Copy
            </button>
        `;
        
        document.body.appendChild(exportMenu);
        
        // Create toggle button
        const toggleButton = document.createElement('button');
        toggleButton.id = 'exportToggle';
        toggleButton.style.cssText = `
            position: fixed;
            top: 210px;
            right: 20px;
            z-index: 9998;
            background: var(--bg-tertiary);
            border: 2px solid var(--border-color);
            border-radius: 50%;
            width: 50px;
            height: 50px;
            cursor: pointer;
            font-size: 1.5rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        toggleButton.innerHTML = '📤';
        toggleButton.title = 'Export/Print Options';
        toggleButton.onclick = () => this.toggleExportMenu();
        
        document.body.appendChild(toggleButton);
    }
    
    toggleExportMenu() {
        const menu = document.getElementById('exportMenu');
        const button = document.getElementById('exportToggle');
        
        if (menu.style.display === 'none' || menu.style.display === '') {
            menu.style.display = 'flex';
            button.style.background = 'var(--accent-green)';
        } else {
            menu.style.display = 'none';
            button.style.background = 'var(--bg-tertiary)';
        }
    }
    
    exportAsPDF() {
        // Use browser's print to PDF functionality
        this.showNotification('📄 Opening print dialog...', 'info');
        this.showNotification('💡 Tip: Select "Save as PDF" in print dialog', 'info', 3000);
        setTimeout(() => window.print(), 500);
    }
    
    printPage() {
        this.showNotification('🖨️ Opening print dialog...', 'info');
        window.print();
    }
    
    exportAsMarkdown() {
        try {
            const content = this.getMainContent();
            const markdown = this.convertToMarkdown(content);
            const filename = this.getPageTitle() + '.md';
            
            this.downloadFile(markdown, filename, 'text/markdown');
            this.showNotification('✅ Markdown file downloaded!', 'success');
        } catch (error) {
            console.error('Markdown export error:', error);
            this.showNotification('❌ Export failed', 'error');
        }
    }
    
    copyToClipboard() {
        try {
            const content = this.getMainContent();
            const text = content.innerText;
            
            navigator.clipboard.writeText(text).then(() => {
                this.showNotification('✅ Copied to clipboard!', 'success');
            }).catch(() => {
                // Fallback method
                const textarea = document.createElement('textarea');
                textarea.value = text;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                this.showNotification('✅ Copied to clipboard!', 'success');
            });
        } catch (error) {
            console.error('Copy error:', error);
            this.showNotification('❌ Copy failed', 'error');
        }
    }
    
    getMainContent() {
        return document.querySelector('.content') || document.querySelector('main') || document.body;
    }
    
    getPageTitle() {
        return document.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    }
    
    convertToMarkdown(element) {
        let markdown = '# ' + document.title + '\n\n';
        
        // Get all headings and content
        const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const paragraphs = element.querySelectorAll('p');
        const lists = element.querySelectorAll('ul, ol');
        
        // Simple conversion
        headings.forEach(h => {
            const level = h.tagName.charAt(1);
            markdown += '\n' + '#'.repeat(level) + ' ' + h.innerText + '\n\n';
        });
        
        paragraphs.forEach(p => {
            if (p.innerText.trim()) {
                markdown += p.innerText + '\n\n';
            }
        });
        
        lists.forEach(list => {
            const items = list.querySelectorAll('li');
            items.forEach(item => {
                markdown += '- ' + item.innerText + '\n';
            });
            markdown += '\n';
        });
        
        return markdown;
    }
    
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }
    
    addPrintStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @media print {
                /* Hide non-essential elements */
                .header, .sidebar, .footer, 
                #themeToggle, #alertSettingsButton, #exportToggle, #exportMenu,
                .nav-menu, .search-box, .tab-button {
                    display: none !important;
                }
                
                /* Full width for content */
                .content, main {
                    width: 100% !important;
                    max-width: none !important;
                    margin: 0 !important;
                    padding: 1cm !important;
                }
                
                .main-container {
                    grid-template-columns: 1fr !important;
                }
                
                /* Print-friendly colors */
                body {
                    background: white !important;
                    color: black !important;
                }
                
                .card, .pattern-card {
                    border: 1px solid #ccc !important;
                    page-break-inside: avoid;
                    margin-bottom: 1cm;
                }
                
                h1, h2, h3, h4, h5, h6 {
                    color: black !important;
                    page-break-after: avoid;
                }
                
                /* Show all tab content when printing */
                .tab-content {
                    display: block !important;
                }
                
                /* Page breaks */
                .section {
                    page-break-after: always;
                }
                
                /* Remove backgrounds */
                * {
                    background: white !important;
                    box-shadow: none !important;
                }
                
                /* Keep tables readable */
                table {
                    border-collapse: collapse;
                    width: 100%;
                }
                
                th, td {
                    border: 1px solid #ccc !important;
                    padding: 0.5cm;
                    text-align: left;
                }
                
                /* Print URLs for links */
                a[href]:after {
                    content: " (" attr(href) ")";
                    font-size: 0.8em;
                    color: #666;
                }
                
                a[href^="#"]:after,
                a[href^="javascript:"]:after {
                    content: "";
                }
            }
            
            @page {
                margin: 2cm;
                size: A4;
            }
        `;
        document.head.appendChild(style);
    }
    
    showNotification(message, type = 'info', duration = 2000) {
        const colors = {
            success: 'var(--accent-green)',
            error: 'var(--accent-red)',
            warning: 'var(--accent-yellow)',
            info: 'var(--accent-blue)'
        };
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            font-weight: bold;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
}

// Initialize export utility
let exportUtility;
document.addEventListener('DOMContentLoaded', function() {
    exportUtility = new ExportPrintUtility();
    console.log('📤 Export/Print utility loaded');
});



