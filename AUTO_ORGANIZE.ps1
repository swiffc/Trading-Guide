# ========================================
# Trading Guide - Automatic File Organizer
# Watches for new files and organizes them
# ========================================

$projectRoot = $PSScriptRoot

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Trading Guide - Auto File Organizer" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Create folder structure if it doesn't exist
function Initialize-FolderStructure {
    $folders = @(
        "docs\progress",
        "docs\setup",
        "docs\reference",
        "docs\features",
        "docs\implementation",
        "docs\fixes",
        "archive\old-docs",
        "scripts",
        "config",
        "pinescript",
        "resources"
    )
    
    foreach ($folder in $folders) {
        $path = Join-Path $projectRoot $folder
        if (-not (Test-Path $path)) {
            New-Item -ItemType Directory -Path $path -Force | Out-Null
            Write-Host "Created: $folder" -ForegroundColor Green
        }
    }
}

# File organization rules
function Get-FileDestination {
    param($fileName, $fileExtension)
    
    # Progress reports
    if ($fileName -match "COMPLETE|SUCCESS|FIXED|ADDED|SUMMARY|REPORT|SCAN") {
        return "docs\progress"
    }
    
    # Setup/Instructions
    if ($fileName -match "INSTRUCTIONS|SETUP|HOW_TO|GUIDE") {
        return "docs\setup"
    }
    
    # Reference docs
    if ($fileName -match "THEORY|FRAMEWORK|REFERENCE|CALIBRATION|CALCULATOR") {
        return "docs\reference"
    }
    
    # Features
    if ($fileName -match "FEATURE|ENHANCEMENT") {
        return "docs\features"
    }
    
    # Implementation
    if ($fileName -match "IMPLEMENTATION|INTEGRATION|PLAN") {
        return "docs\implementation"
    }
    
    # Fixes
    if ($fileName -match "FIX|BUG|PATCH") {
        return "docs\fixes"
    }
    
    # Scripts
    if ($fileExtension -eq ".bat" -or $fileExtension -eq ".ps1" -or $fileExtension -eq ".py") {
        return "scripts"
    }
    
    # Config files
    if ($fileExtension -eq ".json" -and $fileName -ne "package.json") {
        return "config"
    }
    
    # Pine scripts
    if ($fileExtension -eq ".pine") {
        return "pinescript"
    }
    
    # PDFs and text extracts
    if ($fileExtension -eq ".pdf" -or $fileName -match "_extracted\.txt$") {
        return "resources"
    }
    
    # Test files
    if ($fileName -match "^test_|_test\." -or $fileName -match "TEST") {
        return "archive\old-docs"
    }
    
    # Old/temp files
    if ($fileName -match "^temp_|_temp\.|OLD|BACKUP") {
        return "archive\old-docs"
    }
    
    return $null
}

# Organize existing files
function Invoke-FileOrganization {
    Write-Host ""
    Write-Host "Organizing files..." -ForegroundColor Yellow
    Write-Host ""
    
    $movedCount = 0
    $skippedCount = 0
    
    # Essential root files to keep
    $keepInRoot = @(
        "index.html",
        "README.md",
        "styles.css",
        "print.css",
        "service-worker.js",
        ".gitignore",
        "CLEANUP_FOLDERS.bat",
        "AUTO_ORGANIZE.ps1",
        "FILE_WATCH.ps1"
    )
    
    Get-ChildItem -Path $projectRoot -File | ForEach-Object {
        $file = $_
        $fileName = $file.Name
        $fileExtension = $file.Extension
        
        # Skip essential files
        if ($keepInRoot -contains $fileName) {
            $skippedCount++
            return
        }
        
        # Get destination
        $destination = Get-FileDestination -fileName $fileName -fileExtension $fileExtension
        
        if ($destination) {
            $destPath = Join-Path $projectRoot $destination
            $destFile = Join-Path $destPath $fileName
            
            # Check if file already exists in destination
            if (Test-Path $destFile) {
                Write-Host "  [SKIP] $fileName (already exists in $destination)" -ForegroundColor DarkGray
                $skippedCount++
            }
            else {
                try {
                    Move-Item -Path $file.FullName -Destination $destFile -Force
                    Write-Host "  [MOVED] $fileName -> $destination" -ForegroundColor Green
                    $movedCount++
                }
                catch {
                    Write-Host "  [ERROR] Failed to move $fileName`: $_" -ForegroundColor Red
                }
            }
        }
        else {
            Write-Host "  [KEEP] $fileName (no rule matches)" -ForegroundColor Cyan
            $skippedCount++
        }
    }
    
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host "Organization Complete!" -ForegroundColor Green
    Write-Host "  Files moved: $movedCount" -ForegroundColor Green
    Write-Host "  Files skipped: $skippedCount" -ForegroundColor Yellow
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host ""
}

# Main execution
try {
    Initialize-FolderStructure
    Invoke-FileOrganization
    
    Write-Host ""
    Write-Host "Folder Structure:" -ForegroundColor Cyan
    Write-Host "  /docs/progress      - Progress reports and completion logs" -ForegroundColor Gray
    Write-Host "  /docs/setup         - Setup and instruction files" -ForegroundColor Gray
    Write-Host "  /docs/reference     - Reference documentation" -ForegroundColor Gray
    Write-Host "  /docs/features      - Feature documentation" -ForegroundColor Gray
    Write-Host "  /docs/implementation- Implementation docs" -ForegroundColor Gray
    Write-Host "  /docs/fixes         - Bug fixes and patches" -ForegroundColor Gray
    Write-Host "  /scripts            - Batch and Python scripts" -ForegroundColor Gray
    Write-Host "  /config             - Configuration files" -ForegroundColor Gray
    Write-Host "  /pinescript         - TradingView Pine Scripts" -ForegroundColor Gray
    Write-Host "  /resources          - PDFs and extracted text" -ForegroundColor Gray
    Write-Host "  /archive/old-docs   - Archived temporary files" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "To enable automatic file watching, run: .\FILE_WATCH.ps1" -ForegroundColor Yellow
    Write-Host ""
}
catch {
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}
