@echo off
echo ========================================
echo FOLDER REORGANIZATION SCRIPT
echo ========================================
echo.
echo Creating folder structure...
echo.

REM Create folders
mkdir docs 2>nul
mkdir docs\implementation 2>nul
mkdir docs\fixes 2>nul
mkdir docs\features 2>nul
mkdir archive 2>nul

echo Folders created!
echo.
echo Moving files...
echo.

REM === IMPLEMENTATION DOCS ===
echo [1/4] Moving implementation docs...
move /Y "3_PAGES_STRUCTURE.md" "docs\implementation\" 2>nul
move /Y "ALL_CYCLE_PAGES_SUMMARY.md" "docs\implementation\" 2>nul
move /Y "ALL_PAGES_COMPLETE.md" "docs\implementation\" 2>nul
move /Y "COMPLETE_ALIGNMENT_SUMMARY.md" "docs\implementation\" 2>nul
move /Y "COMPLETE_IMPLEMENTATION_STATUS.md" "docs\implementation\" 2>nul
move /Y "COMPLETE_SYSTEMATIC_IMPLEMENTATION.md" "docs\implementation\" 2>nul
move /Y "CREATING_CYCLE_PAGES.md" "docs\implementation\" 2>nul
move /Y "CREATING_PAGES_NOW.md" "docs\implementation\" 2>nul
move /Y "CYCLE_PAGES_IMPLEMENTATION.md" "docs\implementation\" 2>nul
move /Y "CYCLE_PAGES_STATUS.md" "docs\implementation\" 2>nul
move /Y "PAGES_BEING_CREATED.md" "docs\implementation\" 2>nul
move /Y "PAGE_REDESIGN_COMPLETE.md" "docs\implementation\" 2>nul
move /Y "TABBED_PAGES_STATUS.md" "docs\implementation\" 2>nul

REM === FIX DOCS ===
echo [2/4] Moving fix documentation...
move /Y "CRITICAL_FIXES_APPLIED.md" "docs\fixes\" 2>nul
move /Y "DAILY_PAGE_TIME_FIXED.md" "docs\fixes\" 2>nul
move /Y "EST_TIMEZONE_FIX_FINAL.md" "docs\fixes\" 2>nul
move /Y "FINAL_FIXES_COMPLETE.md" "docs\fixes\" 2>nul
move /Y "FINAL_NAVIGATION_CHECK.md" "docs\fixes\" 2>nul
move /Y "SCROLL_FIX_FINAL.md" "docs\fixes\" 2>nul
move /Y "SCROLL_PRESERVATION_FIX.md" "docs\fixes\" 2>nul
move /Y "TIME_FIX_COMPLETE.md" "docs\fixes\" 2>nul
move /Y "TIMING_AUDIT_COMPLETE.md" "docs\fixes\" 2>nul
move /Y "UPDATES_APPLIED.md" "docs\fixes\" 2>nul
move /Y "ZOOM_SCALE_AUDIT.md" "docs\fixes\" 2>nul

REM === FEATURE DOCS ===
echo [3/4] Moving feature documentation...
move /Y "CYCLE_OVERVIEW_ENHANCEMENT.md" "docs\features\" 2>nul
move /Y "ENHANCEMENTS_IMPLEMENTED.md" "docs\features\" 2>nul
move /Y "FRACTAL_IMPLEMENTATION_FINAL.md" "docs\features\" 2>nul
move /Y "FRACTAL_INTEGRATION_COMPLETE.md" "docs\features\" 2>nul
move /Y "LIVE_TRACKING_IMPLEMENTATION.md" "docs\features\" 2>nul
move /Y "STRATEGIC_CONSOLIDATION_COMPLETE.md" "docs\features\" 2>nul
move /Y "TRADING_PHASES_TIMELINE_ADDED.md" "docs\features\" 2>nul
move /Y "WEEKLY_ENHANCEMENT_PLAN.md" "docs\features\" 2>nul

REM === ARCHIVE OLD FILES ===
echo [4/4] Archiving old files...
move /Y "NAVIGATION_CONSISTENCY_REPORT.md" "archive\" 2>nul
move /Y "NAVIGATION_SYSTEM_COMPLETE.md" "archive\" 2>nul
move /Y "NAVIGATION_V2_COMPLETE.md" "archive\" 2>nul
move /Y "FINAL_STATUS.md" "archive\" 2>nul
move /Y "APP_AUDIT_REPORT.md" "archive\" 2>nul
move /Y "CYCLE_THEORY_STRUCTURE.md" "archive\" 2>nul
move /Y "CYCLE_TIMEFRAMES_DEFINED.md" "archive\" 2>nul
move /Y "HOMEPAGE_VISUAL_CONCEPT.md" "archive\" 2>nul
move /Y "NEXT_STEPS_ROADMAP.md" "archive\" 2>nul
move /Y "pages\daily-sessions-REDESIGNED.html" "archive\" 2>nul

REM === CLEANUP TEMP FILES ===
echo.
echo Removing temporary files...
del /Q "CLEANUP_FILES.bat" 2>nul
del /Q "FILES_TO_DELETE.txt" 2>nul
del /Q "CLEANUP_COMPLETE.md" 2>nul
del /Q "FINAL_CLEANUP_SUMMARY.md" 2>nul

echo.
echo ========================================
echo REORGANIZATION COMPLETE!
echo ========================================
echo.
echo NEW STRUCTURE:
echo   Root: 8 essential MD files
echo   docs\implementation\: 13 files
echo   docs\fixes\: 11 files
echo   docs\features\: 8 files
echo   archive\: 10 files
echo.
echo FILES KEPT IN ROOT:
echo   - README.md
echo   - HOW_TO_NAVIGATE.md
echo   - QUARTERLY_THEORY_FRAMEWORK.md
echo   - QUARTERS_THEORY_COMPLETE_GUIDE.md
echo   - QUARTERS_THEORY_VS_TRADER_DAYE_COMPARISON.md
echo   - QUARTER_POINTS_BY_ASSET_CLASS.md
echo   - FOLDER_STRUCTURE_CLEANUP.md
echo   - SESSION_COMPLETE_OCT_23_2025.md
echo.
echo Your Trading Guide folder is now clean and organized!
echo.
pause
