@echo off
title Lumina AI
cd /d "%~dp0"

:: Sunucunun açık olup olmadığını kontrol et
powershell -Command "try { (Invoke-WebRequest -Uri 'http://localhost:3000/app/' -UseBasicParsing -TimeoutSec 1).StatusCode } catch { exit 1 }" >nul 2>&1
if %errorlevel% neq 0 (
    echo Lumina AI yerel sunucusu baslatiliyor...
    start /b node server.js >nul 2>&1
    timeout /t 1 /nobreak >nul
)

:: Pencereli masaüstü uygulaması modunda aç (Edge veya Chrome ile)
where msedge >nul 2>&1
if %errorlevel% equ 0 (
    start msedge --app="http://localhost:3000/app/"
    exit
)

where chrome >nul 2>&1
if %errorlevel% equ 0 (
    start chrome --app="http://localhost:3000/app/"
    exit
)

:: Varsayılan tarayıcıda aç
start http://localhost:3000/app/
exit
