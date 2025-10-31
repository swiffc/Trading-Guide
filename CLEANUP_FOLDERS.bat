@echo off
REM ========================================
REM Trading Guide Folder Structure Cleanup
REM Automatically organizes files into proper locations
REM ========================================

echo ============================================
echo Trading Guide - Folder Structure Cleanup
echo ============================================
echo.

REM Create organized folder structure
echo Creating organized folder structure...

if not exist "docs\progress" mkdir "docs\progress"
if not exist "docs\setup" mkdir "docs\setup"
if not exist "docs\reference" mkdir "docs\reference"
if not exist "archive\old-docs" mkdir "archive\old-docs"
if not exist "scripts" mkdir "scripts"
if not exist "config" mkdir "config"

echo.
echo Moving files to appropriate locations...
echo.

REM ========================================
REM PROGRESS REPORTS - Move to docs/progress
REM ========================================
if exist "APP_ORGANIZATION_SCAN.md" move "APP_ORGANIZATION_SCAN.md" "docs\progress\"
if exist "APP_REORGANIZATION_COMPLETE.md" move "APP_REORGANIZATION_COMPLETE.md" "docs\progress\"
if exist "APP_SCAN_REPORT.md" move "APP_SCAN_REPORT.md" "docs\progress\"
if exist "BTMM_TAB_REORGANIZATION_COMPLETE.md" move "BTMM_TAB_REORGANIZATION_COMPLETE.md" "docs\progress\"
if exist "BTMM_TAB_STRUCTURE.md" move "BTMM_TAB_STRUCTURE.md" "docs\progress\"
if exist "CALIBRATION_VERIFICATION.md" move "CALIBRATION_VERIFICATION.md" "docs\progress\"
if exist "GITHUB_PUSH_SUCCESS.md" move "GITHUB_PUSH_SUCCESS.md" "docs\progress\"
if exist "GITHUB_SUCCESS.md" move "GITHUB_SUCCESS.md" "docs\progress\"
if exist "NAVIGATION_v3_COMPLETE.md" move "NAVIGATION_v3_COMPLETE.md" "docs\progress\"
if exist "PAGES_RESTORED.md" move "PAGES_RESTORED.md" "docs\progress\"
if exist "PHASE_1_COMPLETE.md" move "PHASE_1_COMPLETE.md" "docs\progress\"
if exist "PHASE_2_COMPLETE.md" move "PHASE_2_COMPLETE.md" "docs\progress\"
if exist "PROGRESS_TRACKING_FIXED.md" move "PROGRESS_TRACKING_FIXED.md" "docs\progress\"
if exist "PSYCHOLOGY_PAGE_FINAL_REBUILD.md" move "PSYCHOLOGY_PAGE_FINAL_REBUILD.md" "docs\progress\"
if exist "PSYCHOLOGY_PAGE_REDESIGN.md" move "PSYCHOLOGY_PAGE_REDESIGN.md" "docs\progress\"
if exist "PSYCHOLOGY_REBUILD_COMPLETE.md" move "PSYCHOLOGY_REBUILD_COMPLETE.md" "docs\progress\"
if exist "REORGANIZATION_SUCCESS.md" move "REORGANIZATION_SUCCESS.md" "docs\progress\"
if exist "SESSION_COMPLETE_OCT_23_2025.md" move "SESSION_COMPLETE_OCT_23_2025.md" "docs\progress\"
if exist "UPDATES_SUMMARY_OCT_23_2025.md" move "UPDATES_SUMMARY_OCT_23_2025.md" "docs\progress\"
if exist "ZOOM_CONTROLS_ADDED.md" move "ZOOM_CONTROLS_ADDED.md" "docs\progress\"
if exist "ZOOM_SYNC_COMPLETE.md" move "ZOOM_SYNC_COMPLETE.md" "docs\progress\"

REM ========================================
REM SETUP/INSTRUCTIONS - Move to docs/setup
REM ========================================
if exist "CLEAR_CACHE_AND_TEST_ZOOM.md" move "CLEAR_CACHE_AND_TEST_ZOOM.md" "docs\setup\"
if exist "FINAL_INSTRUCTIONS.md" move "FINAL_INSTRUCTIONS.md" "docs\setup\"
if exist "FOLDER_STRUCTURE_CLEANUP.md" move "FOLDER_STRUCTURE_CLEANUP.md" "docs\setup\"
if exist "GITHUB_PUSH_INSTRUCTIONS.md" move "GITHUB_PUSH_INSTRUCTIONS.md" "docs\setup\"
if exist "HOW_TO_NAVIGATE.md" move "HOW_TO_NAVIGATE.md" "docs\setup\"
if exist "THEME_UPDATE_INSTRUCTIONS.md" move "THEME_UPDATE_INSTRUCTIONS.md" "docs\setup\"
if exist "THEME_UPDATE_SUMMARY.md" move "THEME_UPDATE_SUMMARY.md" "docs\setup\"

REM ========================================
REM REFERENCE DOCS - Move to docs/reference
REM ========================================
if exist "GANN_INTEGRATION_PLAN.md" move "GANN_INTEGRATION_PLAN.md" "docs\reference\"
if exist "GANN_TIMING_RESEARCH_ANALYSIS.md" move "GANN_TIMING_RESEARCH_ANALYSIS.md" "docs\reference\"
if exist "QUARTERLY_THEORY_FRAMEWORK.md" move "QUARTERLY_THEORY_FRAMEWORK.md" "docs\reference\"
if exist "QUARTERS_THEORY_COMPLETE_GUIDE.md" move "QUARTERS_THEORY_COMPLETE_GUIDE.md" "docs\reference\"
if exist "QUARTERS_THEORY_VS_TRADER_DAYE_COMPARISON.md" move "QUARTERS_THEORY_VS_TRADER_DAYE_COMPARISON.md" "docs\reference\"
if exist "QUARTER_POINTS_BY_ASSET_CLASS.md" move "QUARTER_POINTS_BY_ASSET_CLASS.md" "docs\reference\"
if exist "QUARTER_POINTS_CALIBRATION_GUIDE.md" move "QUARTER_POINTS_CALIBRATION_GUIDE.md" "docs\reference\"
if exist "QUARTER_POINT_CALCULATOR_GUIDE.md" move "QUARTER_POINT_CALCULATOR_GUIDE.md" "docs\reference\"
if exist "QUARTER_THEORY_TRADING_GUIDE.md" move "QUARTER_THEORY_TRADING_GUIDE.md" "docs\reference\"
if exist "TRADING_QUICK_REFERENCE.md" move "TRADING_QUICK_REFERENCE.md" "docs\reference\"

REM ========================================
REM SCRIPTS - Move to scripts folder
REM ========================================
if exist "extract_pdf.py" move "extract_pdf.py" "scripts\"
if exist "REORGANIZE_NOW.bat" move "REORGANIZE_NOW.bat" "scripts\"
if exist "TEST_ZOOM.bat" move "TEST_ZOOM.bat" "scripts\"
if exist "OPEN_APP.bat" move "OPEN_APP.bat" "scripts\"
if exist "OPEN_FRESH.bat" move "OPEN_FRESH.bat" "scripts\"
if exist "START_WITH_SERVER.bat" move "START_WITH_SERVER.bat" "scripts\"

REM ========================================
REM CONFIG FILES - Move to config folder
REM ========================================
if exist "vercel.json" move "vercel.json" "config\"
if exist "manifest.json" move "manifest.json" "config\"

REM ========================================
REM ARCHIVE OLD FILES
REM ========================================
if exist "COMMIT_MESSAGE.txt" move "COMMIT_MESSAGE.txt" "archive\old-docs\"
if exist "COMMIT_MSG.txt" move "COMMIT_MSG.txt" "archive\old-docs\"
if exist "test_all_links.html" move "test_all_links.html" "archive\old-docs\"
if exist "test_links.html" move "test_links.html" "archive\old-docs\"
if exist "TEST_ZOOM_SYNC.html" move "TEST_ZOOM_SYNC.html" "archive\old-docs\"

REM ========================================
REM PINE SCRIPTS - Create dedicated folder
REM ========================================
if not exist "pinescript" mkdir "pinescript"
if exist "DXC_FINAL_QuarterPoints_Gann.pine" move "DXC_FINAL_QuarterPoints_Gann.pine" "pinescript\"

REM ========================================
REM PDF RESOURCES - Create dedicated folder
REM ========================================
if not exist "resources" mkdir "resources"
if exist "The Quarters Theory The Revolutionary New Foreign Currencies Trading Method.pdf" move "The Quarters Theory The Revolutionary New Foreign Currencies Trading Method.pdf" "resources\"
if exist "The Quarters Theory The Revolutionary New Foreign Currencies Trading Method_extracted.txt" move "The Quarters Theory The Revolutionary New Foreign Currencies Trading Method_extracted.txt" "resources\"

echo.
echo ============================================
echo Cleanup Complete!
echo ============================================
echo.
echo New Folder Structure:
echo   /docs/progress      - Progress reports and completion logs
echo   /docs/setup         - Setup and instruction files
echo   /docs/reference     - Reference documentation
echo   /scripts            - Batch and Python scripts
echo   /config             - Configuration files
echo   /pinescript         - TradingView Pine Scripts
echo   /resources          - PDFs and extracted text
echo   /archive/old-docs   - Archived temporary files
echo.
echo Root directory now contains only:
echo   - index.html (main app)
echo   - README.md (project readme)
echo   - styles.css / print.css (styling)
echo   - service-worker.js (PWA)
echo   - .gitignore (git config)
echo   - /pages, /js, /docs, /archive (folders)
echo.

pause
