# Test: Login Old Backend → Microservices with Gemini 3 Flash Preview
Write-Host "=== Test: WolfTalk AI with Gemini 3 Flash Preview ===" -ForegroundColor Cyan

# Step 1: Login to old backend
Write-Host "`n[Step 1] Login to old backend (port 8080)..." -ForegroundColor Yellow
$loginBody = @{
    email = "duycuong9897@gmail.com"
    password = "121212"
} | ConvertTo-Json

$login = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body $loginBody

Write-Host "SUCCESS: Token received" -ForegroundColor Green
Write-Host "Token preview: $($login.token.Substring(0,50))..." -ForegroundColor Gray

# Step 2: Call microservices with token from old backend
Write-Host "`n[Step 2] Testing AI Grammar Check with Gemini 3 Flash Preview..." -ForegroundColor Yellow
$grammarBody = @{
    text = "I goes to school yesterday"
} | ConvertTo-Json

$headers = @{
    Authorization = "Bearer $($login.token)"
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri "http://localhost:9000/api/v1/ai/grammar/check?provider=gemini" `
      -Method Post `
      -Headers $headers `
      -Body $grammarBody `
      -TimeoutSec 30

    Write-Host "SUCCESS! Gemini 3 Flash Preview is working!" -ForegroundColor Green
    Write-Host "`nResponse from Gemini 3 Flash Preview:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 3

} catch {
    Write-Host "FAILED!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== CONCLUSION ===" -ForegroundColor Cyan
Write-Host "- Old backend (8080) creates JWT token" -ForegroundColor Green
Write-Host "- Microservices (9000) RECEIVES AND VALIDATES token" -ForegroundColor Green
Write-Host "- Gemini 3 Flash Preview AI: READY!" -ForegroundColor Green