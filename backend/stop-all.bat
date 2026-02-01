@echo off
echo Stopping WolfTalk Backend Services...
echo.

echo [1/2] Stopping Docker services...
docker compose down

echo.
echo [2/2] Spring Boot backend will stop when you close its window
echo.
echo ========================================
echo All Docker services stopped!
echo ========================================
echo.
pause
