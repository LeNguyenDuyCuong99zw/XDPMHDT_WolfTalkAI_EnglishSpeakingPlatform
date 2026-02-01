# Test AI Grammar Check with JWT Token
Write-Host "=== Testing AI Grammar Check with JWT ===" -ForegroundColor Cyan

# Get fresh token
Write-Host "`nStep 1: Getting fresh JWT token..." -ForegroundColor Yellow
$loginUrl = "http://localhost:8080/api/auth/login"
$loginBody = @{
    email = "duycuong9897@gmail.com"
    password = "121212"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri $loginUrl -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "✓ Token received: $($token.Substring(0,50))..." -ForegroundColor Green
} catch {
    Write-Host "✗ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test AI Grammar Check via API Gateway
Write-Host "`nStep 2: Testing Grammar Check via API Gateway..." -ForegroundColor Yellow
$grammarUrl = "http://localhost:9000/api/v1/ai/grammar/check"
$grammarBody = @{
    text = "I goes to school yesterday and seen my friend"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "Request URL: $grammarUrl" -ForegroundColor Gray

try {
    $response = Invoke-RestMethod -Uri $grammarUrl -Method Post -Headers $headers -Body $grammarBody -TimeoutSec 30
    
    Write-Host "`n✓ SUCCESS! AI Grammar Check Working!" -ForegroundColor Green
    Write-Host "`nResponse:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 5
    
} catch {
    Write-Host "`n✗ FAILED!" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Red
    }
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Cyan
