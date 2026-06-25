@echo off
title NEXVORA TECHNOLOGIES - Control Hub (Supabase)
color 0B

:: Ensure Node.js from E:\Programs\Node is in PATH
SET PATH=E:\Programs\Node;%PATH%

:menu
cls
echo ============================================================
echo   NEXVORA TECHNOLOGIES - PROJECT MANAGEMENT CONSOLE (SUPABASE)
echo ============================================================
echo   [1] Database Seeding (Info on how to seed)
echo   [2] Start Development Server (Frontend Vite Client)
echo   [3] Compile Production Build (Vite SPA Compilation)
echo   [4] Frontend Deployment Guide (Vercel/Netlify/etc.)
echo   [5] Exit
echo ============================================================
echo.

set /p choice="Enter your option [1-5]: "

if "%choice%"=="1" goto seed
if "%choice%"=="2" goto dev
if "%choice%"=="3" goto build
if "%choice%"=="4" goto deploy
if "%choice%"=="5" goto exit
goto menu

:seed
cls
echo ============================================================
echo   DATABASE SEEDING INSTRUCTIONS
echo ============================================================
echo   Database seeding has been migrated to a fully client-side seeder.
echo   To seed your Supabase database:
echo.
echo   1. Start the development server (Option 2)
echo   2. Log in with your admin credentials at /admin/login
echo   3. Go to the Admin Dashboard (/admin/dashboard)
echo   4. Click the "Seed Database" button in the top-right header
echo.
echo   This will populate Supabase PostgreSQL tables with categories,
20:   default apps, telemetry logs, and announcements automatically.
echo ============================================================
echo.
pause
goto menu

:dev
cls
echo Launching frontend development server...
echo.
echo [System] Starting Frontend Vite Server (Port 3000) in new window...
start "NEXVORA FRONTEND VITE" cmd /k "cd frontend && SET PATH=E:\Programs\Node;%%PATH%% && npm run dev"
echo.
echo Dev Server URL: http://localhost:3000
echo.
pause
goto menu

:build
cls
echo Compiling frontend production bundle...
cd frontend
call npm run build
cd ..
echo.
echo Compilation completed. Static files generated in frontend/dist.
pause
goto menu

:deploy
cls
echo ============================================================
echo   FRONTEND DEPLOYMENT GUIDE (Vite SPA + Supabase)
echo ============================================================
echo   Since Supabase is a Backend-as-a-Service, you can deploy your 
echo   compiled Vite React frontend (in frontend/dist) to any static
echo   hosting provider (e.g. Vercel, Netlify, Github Pages).
echo.
echo   Steps to deploy to Vercel:
echo     1. Install Vercel CLI: npm install -g vercel
echo     2. Run command inside the "frontend" directory: vercel
echo     3. Configure environment variables in the Vercel dashboard:
echo        - VITE_SUPABASE_URL
echo        - VITE_SUPABASE_ANON_KEY
echo     4. Set the build output directory to: dist
echo.
echo   Steps to deploy to Netlify:
echo     1. Install Netlify CLI: npm install -g netlify-cli
echo     2. Run command inside the "frontend" directory: netlify deploy
echo ============================================================
echo.
pause
goto menu

:exit
exit
