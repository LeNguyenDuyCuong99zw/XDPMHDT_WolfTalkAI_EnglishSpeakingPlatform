# Test Gemini 3 Flash Preview
Write-Host "=== Testing Gemini 3 Flash Preview ===" -ForegroundColor Cyan

$apiKey = "AIzaSyC53Otwcfc6RIv2wRz-NmOWikbXhNPM_LY"
$model = "gemini-3-flash-preview"

Write-Host "`n[Testing] $model..." -ForegroundColor Yellow

$prompt = "Correct this sentence: I goes to school yesterday"

$requestBody = @{
    contents = @(
        @{
            parts = @(
                @{
                    text = $prompt
                }
            )
        }
    )
} | ConvertTo-Json -Depth 10

$uri = "https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=$apiKey"

try {
    $response = Invoke-RestMethod -Uri $uri `
        -Method Post `
        -ContentType "application/json" `
        -Body $requestBody `
        -TimeoutSec 15

    Write-Host "`nSUCCESS! Model works!" -ForegroundColor Green
    
    $text = $response.candidates[0].content.parts[0].text
    Write-Host "`nGemini Response:" -ForegroundColor Cyan
    Write-Host $text -ForegroundColor White
    
    Write-Host "`n=== UPDATE CONFIG ===" -ForegroundColor Yellow
    Write-Host "gemini.model=$model" -ForegroundColor Green

} catch {
    Write-Host "`nFAILED!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "Status Code: $statusCode" -ForegroundColor Red
    }
}
