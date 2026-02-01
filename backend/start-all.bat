@echo off
echo Starting WolfTalk Backend Services...
echo.

echo [1/3] Starting Docker services (PostgreSQL + PgAdmin)...
docker compose up -d
if %errorlevel% neq 0 (
    echo Failed to start Docker services!
    exit /b 1
)

echo.
echo [2/3] Waiting for PostgreSQL to be ready...
timeout /t 10 /nobreak > nul

echo.
echo [3/3] Starting Spring Boot backend...
start "WolfTalk Backend" cmd /k "mvn spring-boot:run"

echo.
echo ========================================
echo All services started successfully!
echo ========================================
echo.
echo Services:
echo - PostgreSQL: http://localhost:5433
echo - PgAdmin:    http://localhost:5050
echo - Backend:    http://localhost:8080
echo.
echo Press any key to exit...
pause > nul
