@echo off
echo Installation des dependances...
call npm install
echo.
echo Lancement du serveur de developpement...
call npm run dev
pause
