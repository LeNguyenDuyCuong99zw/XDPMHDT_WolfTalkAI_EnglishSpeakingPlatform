# Test multiple Gemini models to find working one
Write-Host "=== Testing Gemini Models ===" -ForegroundColor Cyan

$apiKey = "AIzaSyAe2UE5LeoPdD54kdmYCzbJYj5c1LSuV8M"
$models = @(
    "gemini-pro",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-1.0-pro"
)

$prompt = "Correct this sentence: 'I goes to school yesterday'"

foreach ($model in $models) {
    Write-Host "`n[Testing] $model..." -ForegroundColor Yellow
    
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
        generationConfig = @{
            temperature = 0.7
            maxOutputTokens = 500
        }
    } | ConvertTo-Json -Depth 10

    $uri = "https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=$apiKey"

    try {
        $response = Invoke-RestMethod -Uri $uri `
            -Method Post `
            -ContentType "application/json" `
            -Body $requestBody `
            -TimeoutSec 15

        Write-Host "SUCCESS! Model '$model' works!" -ForegroundColor Green
        
        $text = $response.candidates[0].content.parts[0].text
        Write-Host "Response: $($text.Substring(0, [Math]::Min(100, $text.Length)))..." -ForegroundColor White
        
        Write-Host "`n=== WINNER ===" -ForegroundColor Cyan
        Write-Host "Use this model: $model" -ForegroundColor Green
        break

    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "FAILED - Status: $statusCode" -ForegroundColor Red
    }
}
