@echo off
echo ========================================
echo TESTING XP AWARD (+3 XP) FROM INSIDE PRONUNCIATION SERVICE
echo ========================================
echo.

echo [1] Executing request from INSIDE container (8086 -> 8080)...
echo Awarding 3 XP (simulating score between 60-69)...
echo.

docker exec wolftalk-pronunciation-service wget --post-data="" -qO- "http://host.docker.internal:8080/api/leaderboard/award-xp?email=duycuong9897@gmail.com&xp=3"

echo.
echo.
echo ========================================
echo DONE
echo ========================================
echo Check if "weeklyXp" increased by 3 compared to last time!
pause
