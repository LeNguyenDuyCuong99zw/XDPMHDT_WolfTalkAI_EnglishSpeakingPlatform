# Quick test for Gemini API key
$apiKey = "AIzaSyC53Otwcfc6RIv2wRz-NmOWikbXhNPM_LY"
$model = "gemini-1.5-flash"

Write-Host "Testing Gemini API with key: $($apiKey.Substring(0,20))..." -ForegroundColor Cyan

$requestBody = @{
    contents = @(
        @{
            parts = @(
                @{
                    text = "Say hello"
                }
            )
        }
    )
} | ConvertTo-Json -Depth 10

$uri = "https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=$apiKey"

try {
    Write-Host "Calling Gemini API..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri $uri -Method Post -ContentType "application/json" -Body $requestBody -TimeoutSec 10
    
    Write-Host "`nSUCCESS!" -ForegroundColor Green
    $text = $response.candidates[0].content.parts[0].text
    Write-Host "Response: $text" -ForegroundColor White
    
} catch {
    Write-Host "`nFAILED!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "Status Code: $statusCode" -ForegroundColor Red
        
        # Try to read error details
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $errorBody = $reader.ReadToEnd()
            Write-Host "`nError Details:" -ForegroundColor Yellow
            Write-Host $errorBody -ForegroundColor Red
        } catch {}
    }
}
