# ========================================
# Trading Guide - File Watcher
# Automatically organizes new files as they appear
# ========================================

$projectRoot = $PSScriptRoot

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Trading Guide - File Watcher Active" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Watching for new files in: $projectRoot" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop..." -ForegroundColor Gray
Write-Host ""

# Import organization function
. (Join-Path $projectRoot "AUTO_ORGANIZE.ps1") -ErrorAction Stop

# File watcher configuration
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $projectRoot
$watcher.Filter = "*.*"
$watcher.IncludeSubdirectories = $false
$watcher.EnableRaisingEvents = $true

# Files to ignore
$ignoreFiles = @(
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

# Handle new file creation
$action = {
    $fileName = $Event.SourceEventArgs.Name
    $filePath = $Event.SourceEventArgs.FullPath
    
    # Skip ignored files
    if ($ignoreFiles -contains $fileName) {
        return
    }
    
    # Skip if it's a directory
    if ((Get-Item $filePath -ErrorAction SilentlyContinue) -is [System.IO.DirectoryInfo]) {
        return
    }
    
    # Wait a moment for file to be fully written
    Start-Sleep -Milliseconds 500
    
    $fileExtension = [System.IO.Path]::GetExtension($fileName)
    $destination = Get-FileDestination -fileName $fileName -fileExtension $fileExtension
    
    if ($destination) {
        $destPath = Join-Path $projectRoot $destination
        $destFile = Join-Path $destPath $fileName
        
        try {
            # Ensure destination folder exists
            if (-not (Test-Path $destPath)) {
                New-Item -ItemType Directory -Path $destPath -Force | Out-Null
            }
            
            # Move the file
            if (Test-Path $filePath) {
                Move-Item -Path $filePath -Destination $destFile -Force
                $timestamp = Get-Date -Format "HH:mm:ss"
                Write-Host "[$timestamp] [AUTO-MOVED] $fileName -> $destination" -ForegroundColor Green
            }
        }
        catch {
            $timestamp = Get-Date -Format "HH:mm:ss"
            Write-Host "[$timestamp] [ERROR] Failed to move $fileName`: $_" -ForegroundColor Red
        }
    }
    else {
        $timestamp = Get-Date -Format "HH:mm:ss"
        Write-Host "[$timestamp] [NEW FILE] $fileName (keeping in root - no rule)" -ForegroundColor Cyan
    }
}

# Register event handlers
$created = Register-ObjectEvent -InputObject $watcher -EventName Created -Action $action

try {
    # Keep script running
    while ($true) {
        Start-Sleep -Seconds 1
    }
}
finally {
    # Cleanup on exit
    Unregister-Event -SourceIdentifier $created.Name
    $watcher.Dispose()
    Write-Host ""
    Write-Host "File watcher stopped." -ForegroundColor Yellow
}
