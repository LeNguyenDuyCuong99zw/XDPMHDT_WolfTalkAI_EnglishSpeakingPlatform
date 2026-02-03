@echo off
echo ========================================
echo CHECKING MENTOR LEARNERS (DATABASE)
echo ========================================
echo.

echo Querying all ACTIVE subscriptions...
echo.

docker exec wolftalk-postgres psql -U wolftalk -d wolftalk_db -c "SELECT u.email, u.first_name, u.last_name, lp.package_code, us.subscription_status, us.mentor_hours_used, lp.mentor_hours_per_month FROM user_subscriptions us JOIN users u ON us.user_id = u.id JOIN learning_packages lp ON us.package_id = lp.id WHERE us.subscription_status = 'ACTIVE';"

echo.
echo ========================================
echo NOTE: Since we updated the backend, ALL these users should now appear on the Learners Page.
echo ========================================
pause
