@echo off
title VERDE - Iniciar

echo ==============================
echo          VERDE
echo ==============================
echo.
echo Iniciando servidor...
echo.

where node >nul 2>nul

if errorlevel 1 (
    echo ERRO: Node.js nao foi encontrado.
    echo Instale o Node.js e tente novamente.
    echo.
    pause
    exit /b 1
)

node verde.server.cjs

pause