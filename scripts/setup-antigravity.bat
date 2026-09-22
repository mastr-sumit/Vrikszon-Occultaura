@echo off
setlocal EnableDelayedExpansion
title Antigravity IDE Config Setup
echo ========================================================
echo   Antigravity IDE - Global Config ^& MCP Installer
echo ========================================================
echo.

set "DEST_CONFIG=%USERPROFILE%\.gemini\config"
set "SRC_CONFIG=%~dp0antigravity-config"

echo Target Directory: %DEST_CONFIG%

if not exist "%DEST_CONFIG%" (
    echo Creating %DEST_CONFIG%...
    mkdir "%DEST_CONFIG%"
)

if not exist "%DEST_CONFIG%\plugins" (
    mkdir "%DEST_CONFIG%\plugins"
)

echo.
echo [1/3] Setting up mcp_config.json (StitchMCP)...
copy /Y "%SRC_CONFIG%\mcp_config.json" "%DEST_CONFIG%\mcp_config.json" >nul

echo.
set "STITCH_KEY="
set /p STITCH_KEY="Enter your Stitch X-Goog-Api-Key (or press Enter to configure later): "
if not "!STITCH_KEY!"=="" (
    powershell -Command "(Get-Content -Path '%DEST_CONFIG%\mcp_config.json') -replace 'YOUR_API_KEY_HERE', '!STITCH_KEY!' | Set-Content -Path '%DEST_CONFIG%\mcp_config.json'"
    echo Stitch API key applied successfully.
)

echo.
echo [2/3] Setting up config.json...
copy /Y "%SRC_CONFIG%\config.json" "%DEST_CONFIG%\config.json" >nul

echo.
echo [3/3] Setting up Ponytail plugin...
if not exist "%DEST_CONFIG%\plugins\ponytail" (
    mkdir "%DEST_CONFIG%\plugins\ponytail"
)
xcopy /E /I /Y "%SRC_CONFIG%\plugins\ponytail" "%DEST_CONFIG%\plugins\ponytail" >nul

echo.
echo ========================================================
echo   ANTIGRAVITY CONFIGURATION COMPLETE!
echo ========================================================
echo.
echo StitchMCP and custom plugins have been installed to your user profile.
echo Please restart or reload Antigravity IDE on this laptop.
echo.
pause
